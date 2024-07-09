import { IActivitiesItem } from 'api/types';
import Table from 'baseComponents/Table';

interface IOffersOrListingTableProps {
  dataSource: IActivitiesItem[];
  columns: any;
  loading: boolean;
  stickeyOffsetHeight?: number;
  rowSelection?: {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IActivitiesItem[]) => {};
  };
}
export function OffersOrListingTable({ dataSource, loading, columns, rowSelection }: IOffersOrListingTableProps) {
  return (
    <Table
      className="mt-[16px]"
      size="middle"
      emptyText="No Data"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      scroll={{ x: 1280 }}
      rowSelection={rowSelection}
    />
  );
}
