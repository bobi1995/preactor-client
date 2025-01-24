import moment from "moment";
export const convertUnixToDate = (unixTimestamp: number) => {
  return moment.unix(unixTimestamp).format("DD/MM/YYYY");
};

export const convertDateToUnix = (dateString: string): number => {
  return moment(dateString, "DD/MM/YYYY").unix();
};

//Adding days to date. Useful when looping through days of the week and you can add the index to the current date
export const addDaysToDate = (dateString: string, index: number): string => {
  return moment(dateString, "DD/MM/YYYY")
    .add(index, "days")
    .format("DD/MM/YYYY");
};
