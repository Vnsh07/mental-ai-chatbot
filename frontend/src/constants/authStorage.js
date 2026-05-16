export const AUTH_STORAGE = {
  ACCESS_TOKEN: "mental-ai-access-token",
};

/** @param {string} userId */
export function chatStorageKey(userId) {
  return `mental-ai-chat-v2-${userId}`;
}

/** @param {string} userId */
export function moodsStorageKey(userId) {
  return `mental-ai-moods-v1-${userId}`;
}
