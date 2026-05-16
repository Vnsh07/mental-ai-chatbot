export const MOOD_OPTIONS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "calm", label: "Calm", emoji: "😌" },
  { id: "stressed", label: "Stressed", emoji: "😰" },
  { id: "anxious", label: "Anxious", emoji: "😟" },
  { id: "sad", label: "Sad", emoji: "😢" },
];

export function getMoodMeta(moodId) {
  return MOOD_OPTIONS.find((m) => m.id === moodId) ?? null;
}
