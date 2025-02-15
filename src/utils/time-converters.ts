import moment from "moment-timezone";

export const convertUnixToDate = (unixTimestamp: number) => {
  return moment.unix(unixTimestamp).format("DD/MM/YYYY");
};

export const convertUnixToDateWithHours = (unixTimestamp: number) => {
  return moment.unix(unixTimestamp).format("DD/MM/YYYY HH:mm:ss");
};

export const convertDateToUnix = (dateString: string): number => {
  return moment(dateString, "DD/MM/YYYY").add(2, "hours").unix();
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
