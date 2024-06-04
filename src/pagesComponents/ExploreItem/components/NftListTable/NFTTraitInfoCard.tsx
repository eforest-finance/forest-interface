import { Typography } from 'antd';
import Table from 'baseComponents/Table';
import { ImageEnhance } from 'components/ImgLoading';
import { INftInfo, ITraitInfo } from 'types/nftTypes';
import { useRequest } from 'ahooks';
import { fetchNftTraitsInfo } from 'api/fetch';
import { formatTokenPrice } from 'utils/format';
import { getEmptyText } from 'baseComponents/Table';
import HonourLabel from 'baseComponents/HonourLabel';

const { Text } = Typography;

const renderPrice = (text?: string | number) => {
  const number = Number(text);
  if (number === -1 || isNaN(number) || text === undefined || text === '') return '--';
  return formatTokenPrice(text);
};

const renderItemPercent = ({ itemsCount, allItemsCount }: ITraitInfo) => {
  const num = itemsCount / allItemsCount;
  if (isNaN(num) || num < 0) {
    return '-';
  }
  const percentOfItemsCount = `${(num * 100).toFixed(2)}%`;

  return (
    <span className="flex">
      <span className=" text-textPrimary font-semibold">{percentOfItemsCount}</span>
      <span className=" ml-4 text-textSecondary">({itemsCount})</span>
    </span>
  );
};

export function NFTTraitInfoCard({ nftInfo }: { nftInfo: INftInfo }) {
  const { previewImage, tokenName, nftSymbol, describe } = nftInfo;

  const { data, loading } = useRequest(() => fetchNftTraitsInfo({ id: nftInfo.id }), {
    refreshDeps: [nftInfo.id],
    cacheKey: `_traitsInfo_${nftInfo.id}`,
    cacheTime: 10000,
  });

  return (
    <div className="flex" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col mr-6 gap-y-2">
        <ImageEnhance src={previewImage || ''} className="!w-[148px] !h-[148px] object-cover !rounded-md" />
        <Text
          className="mt-2 !text-textPrimary font-semibold text-base !w-[148px]"
          ellipsis={{
            tooltip: tokenName,
          }}>
          {tokenName}
        </Text>
        <Text
          className="font-medium !text-textSecondary !w-[148px]"
          ellipsis={{
            tooltip: nftSymbol,
          }}>
          {nftSymbol}
        </Text>
        {describe ? <HonourLabel text={describe} theme="white" /> : null}
      </div>
      <Table
        className="w-[500px]"
        loading={loading}
        dataSource={data?.traitInfos || []}
        size="small"
        pagination={false}
        locale={{
          emptyText: getEmptyText('This item has no traits.'),
        }}
        scroll={{
          y: 300,
        }}
        columns={[
          {
            title: 'Trait',
            dataIndex: 'trait',
            width: 125,
            render: (_, record) => {
              return (
                <div className="flex flex-col">
                  <Text
                    className="text-sm !text-textPrimary !w-[109px]"
                    ellipsis={{
                      tooltip: record.key,
                    }}>
                    {record.key}
                  </Text>
                  <Text
                    className=" font-semibold text-sm !text-textPrimary !w-[109px]"
                    ellipsis={{
                      tooltip: record.value,
                    }}>
                    {record.value}
                  </Text>
                </div>
              );
            },
          },
          {
            title: 'QTY',
            dataIndex: 'QTY',
            width: 110,
            render: (_, record) => {
              return renderItemPercent(record);
            },
          },
          {
            title: 'Floor Price',
            dataIndex: 'itemFloorPrice',
            width: 110,
            render: renderPrice,
          },
          {
            title: 'Last Sale',
            dataIndex: 'latestDealPrice',
            width: 110,
            render: renderPrice,
          },
        ]}
      />
    </div>
  );
}
