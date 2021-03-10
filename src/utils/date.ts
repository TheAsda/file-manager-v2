import { Dayjs } from 'dayjs';

const fullFormat = 'DD/MM/YYYY hh:mm:ss';

export const formatDate = (date: Dayjs) => {
  return date.format(fullFormat);
};
