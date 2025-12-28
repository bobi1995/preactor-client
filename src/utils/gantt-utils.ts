import { differenceInMinutes, parseISO } from "date-fns";

/**
 * Calculates the visual style for an order bar including the setup time segment.
 * * @param startTimeStr - ISO string of start time
 * @param endTimeStr - ISO string of end time
 * @param setupTimeMinutes - Setup time in minutes (default 0)
 * @param baseColor - The generated color for the order
 * @returns CSSProperties object containing the background style
 */
export const getOrderBackgroundStyle = (
  startTimeStr: string,
  endTimeStr: string,
  setupTimeMinutes: number = 0,
  baseColor: string
) => {
  if (!startTimeStr || !endTimeStr) return { backgroundColor: baseColor };

  const start = parseISO(startTimeStr);
  const end = parseISO(endTimeStr);
  const totalDurationMinutes = differenceInMinutes(end, start);

  // If no setup time or invalid duration, return solid color
  if (setupTimeMinutes <= 0 || totalDurationMinutes <= 0) {
    return { backgroundColor: baseColor };
  }

  // Calculate percentage (capped at 100% just in case)
  let setupPercentage = (setupTimeMinutes / totalDurationMinutes) * 100;
  setupPercentage = Math.min(setupPercentage, 100);

  // Create a hard-stop gradient: Gray up to X%, Base Color from X%
  // Using Tailwind's gray-400 (#9ca3af) for setup
  const setupColor = "#9ca3af";

  return {
    background: `linear-gradient(to right, ${setupColor} ${setupPercentage}%, ${baseColor} ${setupPercentage}%)`,
  };
};

/**
 * Formats minutes into a readable string (e.g., "1h 30m")
 */
export const formatDuration = (minutes: number) => {
  if (!minutes) return "0m";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

/**
 * Parses an ISO string as Local Time by stripping the 'Z' (UTC marker).
 * This fixes issues where the server sends UTC but we want to display it as Factory Local Time.
 */
export const parseAsLocal = (
  dateString: string | undefined | null
): Date | null => {
  if (!dateString) return null;
  // Remove the 'Z' so the browser parses it as local time, not UTC
  const localString = dateString.replace("Z", "");
  return parseISO(localString);
};
