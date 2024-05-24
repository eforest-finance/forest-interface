import { Spin } from 'antd';
import { INftInfo } from 'types/nftTypes';
import useColumns from 'hooks/useColumns';
import ItemsCard from 'components/ItemsCard';
import { useRouter } from 'next/navigation';
import { BoxSizeEnum } from 'pagesComponents/ExploreItem/constant';

interface INFTListProps {
  collapsed: boolean;
  sizes: BoxSizeEnum;
  className?: string;
  dataSource: INftInfo[];
  hasSearch?: boolean;
  clearFilter?: () => void;
  loading: boolean;
}

export function NFTList({ sizes, collapsed, dataSource, loading }: INFTListProps) {
  const column = useColumns(collapsed, sizes);
  const navigate = useRouter();

  return (
    <Spin spinning={loading}>
      {!dataSource.length && !loading ? (
        <div className="flex justify-center items-center font-medium text-textSecondary text-base min-h-[280px]">
          No Items to Display.
        </div>
      ) : (
        <div
          className="grid w-full gap-2 mdl:gap-4 min-h-[280px]"
          style={{ gridTemplateColumns: `repeat(${column},minmax(0,1fr))` }}>
          {dataSource?.map((item: INftInfo) => (
            <ItemsCard
              hiddenActions={false}
              key={item?.id}
              dataSource={item}
              onClick={() => {
                navigate.push(`/detail/buy/${item?.id ?? ''}/${item?.chainId ?? ''}`);
              }}
            />
          ))}
        </div>
      )}
    </Spin>
  );
}
