export function validateEmail(email) {
  const t = email.trim();
  if (!t) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return "Enter a valid email";
  return "";
}

export function validatePassword(password, { maxLength = 128 } = {}) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Use at least 8 characters";
  if (password.length > maxLength) return "Password is too long";
  return "";
}
