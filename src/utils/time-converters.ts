import moment from "moment-timezone";

export const timesToRepresentativeString = (time: string) => {
  const convertTime = moment(time, "HH:mm:ss.SSS");
  return convertTime.format("HH:mm");
};
export const convertUnixToDate = (unixTimestamp: number) => {
  return moment.unix(unixTimestamp).format("DD/MM/YYYY");
};

export const convertUnixToDateWithHours = (unixTimestamp: number) => {
  return moment.unix(unixTimestamp).format("DD/MM/YYYY HH:mm:ss");
};

export const convertDateToUnix = (dateString: string): number => {
  return moment(dateString, "DD/MM/YYYY").add(2, "hours").unix();
};
export const unixToHoursWithTimezone = (date: string) => {
  return moment(parseInt(date)).utc().format("HH:mm");
};

//Adding days to date. Useful when looping through days of the week and you can add the index to the current date
export const addDaysToDate = (dateString: string, index: number): string => {
  return moment(dateString, "DD/MM/YYYY")
    .add(index, "days")
    .format("DD/MM/YYYY");
};

export const isSameDay = (date1: number, date2: number): boolean => {
  const momentDate1 = moment.unix(date1).startOf("day");
  const momentDate2 = moment(date2).startOf("day");

  return momentDate1.isSame(momentDate2, "day");
};

export const timeToMinutes = (timeStr: string): number => {
  if (typeof timeStr !== "string" || !timeStr.includes(":")) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export const formatMinutes = (totalMinutes: number): string => {
  if (totalMinutes < 0) totalMinutes = 0; // Safety check
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} h`);
  if (minutes > 0) parts.push(`${minutes} m`);
  if (parts.length === 0) return "0 m";

  return parts.join(" ");
};
