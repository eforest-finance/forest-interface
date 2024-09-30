import BigNumber from 'bignumber.js';

const NumberOfChange = ({ text }: { text: string | number }) => {
  const num = Number(text);
  if (isNaN(num) || num === 0) return null;

  const percentStr = BigNumber(num).abs().times(100).toFixed(2, BigNumber.ROUND_DOWN);
  const percent = Number(percentStr);

  if (percent === 0) {
    return <span className="text-[16px] mdl:text-[18px] font-semibold text-textSecondary">0.00%</span>;
  }

  const textClassName = num < 0 ? 'text-functionalDanger' : 'text-functionalSuccess';

  let showStr = '';

  if (percent > 10000) {
    showStr = '>10000%';
  } else {
    showStr = `${num < 0 ? '-' : '+'}${percentStr}%`;
  }

  return <span className={`${textClassName}  text-[14px] mdl:text-[14px] font-semibold`}>{showStr}</span>;
};

export default NumberOfChange;
