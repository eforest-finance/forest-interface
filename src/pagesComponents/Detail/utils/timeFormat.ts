import moment from 'moment';

export const timeFormat = (time: string | number) => {
  return `${moment(time).format('DD MMMM YYYY')} at ${moment(time).format('HH:mm')}`;
};
