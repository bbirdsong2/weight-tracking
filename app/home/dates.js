import dayjs from 'dayjs';

export const convertToString = (date) => {
  return date.format('YYYY-MM-DD');
};

export const convertToJs = (date) => {
  return dayjs(date);
};

export const getTodayString = () => {
  return convertToString(getNowJs());
};

export const getNowJs = () => {
  return dayjs();
};
