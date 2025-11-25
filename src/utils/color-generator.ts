export const getOrderColor = (str: string | undefined | null) => {
  if (!str) return "#6366f1";

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // --- THE FIX ---
  // Multiply the hash by the Golden Angle (approx 137.508).
  // This ensures that even if the hash difference is only 1 (e.g. A001 vs A002),
  // the color hue will jump ~137 degrees, resulting in a completely different color.
  const hue = Math.abs((hash * 137.508) % 360);

  // Adjusted Saturation/Lightness for better contrast with white text
  return `hsl(${hue}, 75%, 45%)`;
};
