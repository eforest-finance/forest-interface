import moment from 'moment';

export const timeFormat = (time: string | number) => {
  return `${moment(time).utc().format('DD MMMM YYYY')} at ${moment(time).utc().format('HH:mm')}`;
};
