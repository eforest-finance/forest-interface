import { formatTokenPrice, formatUSDPrice } from 'utils/format';
import useGetTransitionFee from './useGetTransitionFee';
import Loading from 'components/Loading';

interface ISummaryList {
  title?: string;
  content?: string[];
  loading?: boolean;
}

interface IProps {
  preSummaryListList?: ISummaryList[];
}

export default function Summary(props: IProps) {
  const { preSummaryListList } = props;
  const { loading: transitionFeeLoading, transactionFee } = useGetTransitionFee();

  const renderSummaryList = ({ title, content, loading }: ISummaryList) => {
    return (
      <div className="flex justify-between mt-[16px]">
        <span className="text-[16px] leading-[24px] font-normal text-textSecondary">{title}</span>
        <div className="flex flex-col items-end">
          {content?.map((item, index) => {
            if (loading) {
              return (
                <Loading key={index} className="!h-[24px] mt-[8px] first:mt-0 !pb-0" imgStyle="h-[24px] w-[24px]" />
              );
            } else {
              return (
                <span
                  key={index}
                  className="text-[16px] leading-[24px] font-normal text-textSecondary mt-[8px] first:mt-0">
                  {item}
                </span>
              );
            }
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
          `${formatTokenPrice(transactionFee?.transactionFee || 0)} ELF`,
          formatUSDPrice(transactionFee?.transactionFeeOfUsd || 0),
        ],
        loading: transitionFeeLoading,
      })}
    </>
  );
}
