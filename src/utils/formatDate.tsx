import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

const formatDate = (date: string) => {
  const day = dayjs(date);
  return day.calendar(null, {
    sameDay: 'hh:mm',
    lastDay: '[Yesterday] hh:mm',
    lastWeek: '[Last] dddd hh:mm',
    sameElse: 'DD MMM YYYY hh:mm',
  });
};

export default formatDate;
