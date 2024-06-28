import { IActivitiesItem } from 'api/types';
import Table from 'baseComponents/Table';

interface IOffersOrListingTableProps {
  dataSource: IActivitiesItem[];
  columns: any;
  loading: boolean;
  stickeyOffsetHeight?: number;
}

export function OffersOrListingTable({ dataSource, loading, columns }: IOffersOrListingTableProps) {
  return (
    <Table
      size="middle"
      emptyText="No Data"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      scroll={{ x: 1280 }}
    />
  );
}
