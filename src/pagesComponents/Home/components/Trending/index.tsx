import CollectionTable from 'pagesComponents/Collections/components/CollectionsTable';
import { useCallback } from 'react';
import { Button } from 'antd5/';
import { useRouter } from 'next/navigation';

export default () => {
  const keys = ['index', 'tokenName', 'volumeTotal', 'volumeTotalChange', 'floorPrice', 'floorChange'];
  const navigate = useRouter();

  const Title = useCallback(() => {
    return (
      <div className="flex justify-between items-center w-full">
        <h1 className="text-[24px] font-semibold leading-[32px] text-textPrimary">Trending </h1>
        <Button
          className="w-[95px] h-[40px] !rounded-[8px] border-0 !text-textPrimary !font-medium  hover:!bg-fillHoverBg !bg-fillCardBg"
          onClick={() => {
            navigate.push('/collections');
          }}>
          View All
        </Button>
      </div>
    );
  }, []);

  return (
    <CollectionTable
      className="!p-0"
      pageSize={5}
      title={<Title />}
      showPagination={false}
      showSearchBar={false}
      columnKeys={keys}
    />
  );
};
