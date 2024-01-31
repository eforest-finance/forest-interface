import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import useGetTransitionFee from './useGetTransitionFee';

interface ISummaryList {
  title?: string;
  content?: string[];
}

interface IProps {
  preSummaryListList?: ISummaryList[];
}

export default function Summary(props: IProps) {
  const { preSummaryListList } = props;
  const transitionFee = useGetTransitionFee();

  const renderSummaryList = ({ title, content }: ISummaryList) => {
    return (
      <div className="flex justify-between mt-[16px]">
        <span className="text-[16px] leading-[24px] font-normal text-textSecondary">{title}</span>
        <div className="flex flex-col items-end">
          {content?.map((item, index) => {
            return (
              <span
                key={index}
                className="text-[16px] leading-[24px] font-normal text-textSecondary mt-[8px] first:mt-0">
                {item}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <h3 className="text-[18px] leading-[26px] font-medium text-textPrimary">Preview</h3>
      {preSummaryListList?.map((item) => {
        return renderSummaryList({ ...item });
      })}
      {renderSummaryList({
        title: 'Estimated Transaction Fee',
        content: [
          `${formatTokenPrice(transitionFee?.transactionFee || 0)} ELF`,
          formatUSDPrice(transitionFee?.transactionFeeOfUsd || 0),
        ],
      })}
    </>
  );
}
