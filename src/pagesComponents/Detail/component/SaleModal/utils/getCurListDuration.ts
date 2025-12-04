import { MIN_MINUTES_DURATION } from 'constants/time';
import { IListDuration } from 'contract/type';
import moment from 'moment';
import { IDurationData } from '../hooks/useDuration';

const getCurListDuration: (minutes?: number) => IListDuration = (minutes = MIN_MINUTES_DURATION) => {
  const duration = {
    startTime: {
      seconds: moment().unix(),
      nanos: 0,
    },
    publicTime: { seconds: moment().unix(), nanos: 0 },
    durationMinutes: minutes,
  };

  return duration;
};

export const getMinutesBySelectDuration = (duration: IDurationData) => {
  if (duration.type === 'date') {
    return moment(duration.value).diff(moment(), 'minutes');
  }
  if (duration.type === 'months') {
    return moment().add(Number(duration.value), 'months').diff(moment(), 'minutes');
  }
  return moment.duration({ [duration.type as string]: duration.value }).asMinutes();
};

export const getDurationParamsForListingContractByDuration = (duration: IDurationData) => {
  const minutes = getMinutesBySelectDuration(duration);
  return getCurListDuration(minutes);
};

export default getCurListDuration;
