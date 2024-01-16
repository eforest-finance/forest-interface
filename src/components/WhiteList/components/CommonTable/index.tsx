import { Table, TableProps } from 'antd';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import useGetState from 'store/state/getState';
export type CommonTableInstance = {
  onResetPage: () => void;
};

type CommonTablePropsType = any; // TODO

const CommonTable = forwardRef((props: TableProps<CommonTablePropsType>, ref) => {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [page, setPage] = useState(1);
  const onResetPage = useCallback(() => {
    setPage(1);
  }, []);

  const tableOnChange = (page: number, pageSize: number) => {
    setPage(page);
    if (props.pagination && props.pagination.onChange) {
      props.pagination.onChange(page, pageSize);
    }
  };

  useImperativeHandle(ref, () => ({
    onResetPage,
  }));
  return (
    <Table
      scroll={{ x: isSmallScreen ? undefined : 736, y: 320 }}
      {...props}
      className="forest-table"
      pagination={{
        showQuickJumper: false,
        showTitle: false,
        current: page,
        position: ['bottomCenter'],
        ...props.pagination,
        onChange: tableOnChange,
      }}
    />
  );
});
export default CommonTable;
