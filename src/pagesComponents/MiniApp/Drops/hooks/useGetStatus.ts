import moment from 'moment';

const useStatus = (props: any) => {
  // 0、no start
  // 1、show start time
  // 2、ongoing
  // 3、ended

  if (!props?.leftReward) {
    return 3;
  } else {
    if (props?.treeActivityStatus) {
      return 0;
    } else {
      if (moment(props?.beginDateTime).valueOf() > new Date().getTime()) {
        return 1;
      } else {
        return 2;
      }
    }
  }
};

const useShowStartTime = (props: any) => {
  const startTime = moment(props?.beginDateTime).valueOf();
  const currentTime = new Date().getTime();

  const diffTime = startTime - currentTime;

  const currentSec = moment.duration(diffTime);

  return { days: currentSec.days(), hours: currentSec.hours(), minutes: currentSec.minutes() };
};

export { useStatus, useShowStartTime };
