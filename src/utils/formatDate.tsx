import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

const formatDate = (date: string) => {
  const day = dayjs(date);
  return day.calendar(null, {
    sameDay: 'HH:mm',
    lastDay: '[Yesterday] HH:mm',
    lastWeek: '[Last] dddd HH:mm',
    sameElse: 'DD MMM YYYY HH:mm',
  });
};

export default formatDate;
