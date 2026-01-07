import { IOrderAttribute } from "../graphql/interfaces";

// Define your specific colors here
const ATTRIBUTE_COLOR_MAP: Record<string, string> = {
  Red: "#ef4444", // A nice solid Red
  Blue: "#3b82f6", // A nice solid Blue
  Yellow: "#eab308", // A dark Yellow/Gold (better for white text contrast)
  Green: "#22c55e", // A nice solid Green
  Purple: "#a855f7", // A nice solid Purple
};

export const getOrderColor = (
  str: string | undefined | null,
  attributes?: IOrderAttribute[]
) => {
  // 1. PRIORITY CHECK: Look for specific color attributes first
  if (attributes && attributes.length > 0) {
    for (const attr of attributes) {
      // Check parameter value (e.g. dropdown selection) or direct value (text)
      const valueToCheck = attr.attributeParam?.attributeValue || attr.value;

      if (valueToCheck && ATTRIBUTE_COLOR_MAP[valueToCheck]) {
        return ATTRIBUTE_COLOR_MAP[valueToCheck];
      }
    }
  }

  // 2. FALLBACK: Generate hash-based color if no specific color attribute is found
  if (!str) return "#6366f1";

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs((hash * 137.508) % 360);
  return `hsl(${hue}, 75%, 45%)`;
};
