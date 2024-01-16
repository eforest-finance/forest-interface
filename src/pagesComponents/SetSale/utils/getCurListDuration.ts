import { SIX_MONTHS_DURATION } from 'constants/time';
import { IListDuration } from 'contract/type';
import moment from 'moment';

const getCurListDuration: (month?: number) => IListDuration = (month: number = SIX_MONTHS_DURATION) => {
  const duration = {
    startTime: {
      seconds: moment().unix(),
      nanos: 0,
    },
    publicTime: { seconds: moment().unix(), nanos: 0 },
    durationHours: moment.duration(month, 'M').asHours(),
  };

  return duration;
};

export default getCurListDuration;
