const getExpiryTime = (timestamp: number) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const now = new Date().getTime();
  const diffValue = timestamp - now;

  if (diffValue < 0) {
    return 'in 1 minute';
  }
  const monthCount = diffValue / month;
  const dayCount = diffValue / day;
  const hourCount = diffValue / hour;
  const minCount = diffValue / minute;

  if (monthCount >= 1) {
    return `in ${Math.floor(monthCount)} month`;
  } else if (dayCount >= 1) {
    return `in ${Math.floor(dayCount)} days`;
  } else if (hourCount >= 1) {
    return `in ${Math.floor(hourCount)} hours`;
  } else if (minCount >= 1) {
    return `in ${Math.floor(minCount)} minutes`;
  }
  return 'in 1 minute';
};

export default getExpiryTime;
