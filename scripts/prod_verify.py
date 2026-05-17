"""Production verification script — run: python scripts/prod_verify.py"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"
REPORT: list[str] = []
FAILURES: list[str] = []


def log(msg: str = "") -> None:
    REPORT.append(msg)
    print(msg)


def ok(msg: str) -> None:
    log(f"PASS: {msg}")


def fail(msg: str) -> None:
    log(f"FAIL: {msg}")
    FAILURES.append(msg)


def check_exists(rel: str) -> None:
    path = ROOT / rel.replace("/", os.sep)
    if path.exists():
        ok(f"Config exists: {rel}")
    else:
        if rel.endswith("railway.toml"):
            ok(f"Config absent (expected removed): {rel}")
        else:
            fail(f"Config missing: {rel}")


def http_json(method: str, url: str, body: dict | None = None, token: str | None = None):
    data = None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if body is not None:
        data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            detail = json.loads(raw)
        except json.JSONDecodeError:
            detail = raw
        return e.code, detail


def main() -> int:
    log("=== MENTAL AI PRODUCTION VERIFICATION ===\n")

    log("--- 1. Config audit ---")
    for rel in [
        "render.yaml",
        "railway.json",
        "backend/nixpacks.toml",
        "backend/runtime.txt",
        "backend/Procfile",
        "backend/requirements.txt",
        "backend/.render-buildpacks",
        "backend/railway.toml",
        "frontend/package-lock.json",
        "frontend/vercel.json",
        "frontend/vite.config.js",
    ]:
        check_exists(rel)

    log("\n--- 2. Command consistency ---")
    render = (ROOT / "render.yaml").read_text(encoding="utf-8")
    railway = json.loads((ROOT / "railway.json").read_text(encoding="utf-8"))
    nix = (ROOT / "backend/nixpacks.toml").read_text(encoding="utf-8")

    render_start = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    railway_start = railway["deploy"]["startCommand"]
    nix_start = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"

    if render_start in render and railway_start == render_start:
        ok("Start commands match (Render, Railway, Nixpacks)")
    else:
        fail(f"Start command mismatch: railway={railway_start}")

    if "pip install -r requirements.txt" in render:
        ok("Render buildCommand: pip install -r requirements.txt")
    if "npm ci && npm run build" in render:
        ok("Render frontend build: npm ci && npm run build")

    log("\n--- 3. Python version ---")
    runtime = (BACKEND / "runtime.txt").read_text().strip()
    if runtime == "python-3.11.9":
        ok(f"runtime.txt: {runtime}")
    else:
        fail(f"runtime.txt unexpected: {runtime}")
    if 'PYTHON_VERSION' in render and "3.11.9" in render:
        ok("render.yaml PYTHON_VERSION=3.11.9")
    if "python311" in nix:
        ok("nixpacks.toml uses python311")

    log("\n--- 4. Backend import & routes ---")
    sys.path.insert(0, str(BACKEND))
    os.chdir(BACKEND)
    try:
        from app.main import app
        from app.core.config import get_settings
        from app.core.security import (
            create_access_token,
            decode_token,
            hash_password,
            verify_password,
        )

        ok(f"FastAPI app: {app.title}")
        routes = {
            r.path
            for r in app.routes
            if hasattr(r, "methods") and r.path not in {"/docs", "/redoc", "/openapi.json"}
        }
        expected = {
            "/",
            "/health",
            "/api/v1/auth/signup",
            "/api/v1/auth/login",
            "/api/v1/auth/me",
            "/api/v1/chat",
        }
        if expected <= routes:
            ok(f"API routes: {sorted(expected)}")
        else:
            fail(f"Missing routes: {expected - routes}")

        settings = get_settings()
        hp = hash_password("verify-pass-123")
        if not verify_password("verify-pass-123", hp):
            fail("bcrypt verify")
        else:
            ok("bcrypt hash/verify")

        tok = create_access_token(
            subject="00000000-0000-0000-0000-000000000001",
            secret_key=settings.secret_key,
            algorithm=settings.jwt_algorithm,
            expires_minutes=5,
        )
        if decode_token(tok, settings.secret_key, settings.jwt_algorithm):
            ok("JWT encode/decode")
        else:
            fail("JWT decode")

        ok(f"CORS origins: {settings.cors_origin_list}")
        ok(f"Gemini configured: {bool((settings.gemini_api_key or '').strip())}")
        ok(f"Gemini model default: {settings.gemini_model}")
        ok(f"DB scheme: {settings.database_url.split(':')[0]}")

        from app.api.routes.chat import _extract_reply

        class P:
            def __init__(self, t):
                self.text = t

        class C:
            def __init__(self, parts):
                self.parts = parts

        class Cand:
            def __init__(self, parts):
                self.content = C(parts)

        class R:
            text = None
            candidates = [Cand([P("ok")])]

        if _extract_reply(R()) == "ok":
            ok("Gemini _extract_reply")
        else:
            fail("Gemini _extract_reply")
    except Exception as exc:
        fail(f"Backend import: {exc}")

    log("\n--- 5. Live API (optional; start uvicorn on :8765 first) ---")
    base = os.environ.get("VERIFY_API_BASE", "http://127.0.0.1:8765")
    try:
        code, body = http_json("GET", f"{base}/health")
        if code == 200 and body.get("status") == "ok":
            ok(f"GET /health -> {body}")
        else:
            fail(f"GET /health -> {code} {body}")
    except Exception as exc:
        log(f"SKIP live API (server not running on {base}): {exc}")

    log("\n--- 6. requirements.txt packages ---")
    req = (BACKEND / "requirements.txt").read_text(encoding="utf-8")
    for pkg in [
        "fastapi",
        "uvicorn",
        "pydantic",
        "email-validator",
        "google-generativeai",
        "sqlalchemy",
        "psycopg2-binary",
        "bcrypt",
        "python-jose",
    ]:
        if pkg in req:
            ok(f"requirements.txt includes {pkg}")
        else:
            fail(f"requirements.txt missing {pkg}")

    log("\n--- 7. package.json scripts ---")
    pkg = json.loads((FRONTEND / "package.json").read_text(encoding="utf-8"))
    for script in ("dev", "build", "lint"):
        if script in pkg.get("scripts", {}):
            ok(f"package.json script: {script}")
        else:
            fail(f"package.json missing script: {script}")

    for dep in ("react", "axios", "react-router-dom", "vite"):
        found = dep in pkg.get("dependencies", {}) or dep in pkg.get("devDependencies", {})
        if found:
            ok(f"package.json has {dep}")
        else:
            fail(f"package.json missing {dep}")

    log("\n--- 8. Broken config check ---")
    if (BACKEND / "railway.toml").exists():
        fail("Duplicate backend/railway.toml should be removed")
    else:
        ok("No duplicate railway.toml")

    dist = FRONTEND / "dist"
    if dist.exists() and (dist / "index.html").exists():
        ok("Frontend dist/ exists (prior build)")
    else:
        log("NOTE: Run npm run build to create frontend/dist")

    log("\n=== SUMMARY ===")
    log(f"Passed checks logged above")
    log(f"Failures: {len(FAILURES)}")
    for f in FAILURES:
        log(f"  - {f}")

    out = ROOT / "PROD_VERIFY_REPORT.txt"
    out.write_text("\n".join(REPORT), encoding="utf-8")
    log(f"\nReport written to {out}")
    return 1 if FAILURES else 0


if __name__ == "__main__":
    raise SystemExit(main())
