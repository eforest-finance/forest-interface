/* eslint-disable no-inline-styles/no-inline-styles */

import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import CommonTable, { CommonTableInstance } from '../CommonTable';

import InfoTool, { FilterToolType } from '../InfoTool';
import { Button, message } from 'antd';
import { useEffectOnce } from 'react-use';
import { DeleteFilled } from '@ant-design/icons';
import Logo from 'components/Logo';
import ELF from 'assets/images/ELF.png';
import { messageHTML } from 'utils/aelfUtils';
import { fetchListFilter } from 'components/WhiteList/hooks/fetchWhiteList';
import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { removeFromWhiteList } from 'components/WhiteList/hooks/managersAction';
import { StrategyType } from 'store/reducer/saleInfo/type';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import { OmittedType, addPrefixSuffix, getOmittedStr, getfFormatPrice } from 'utils';
import { IPaginationPage, IToolItemInstance } from 'store/types/reducer';
import { IWhitelistExtraInfosItem } from 'api/types';
import { IContractError } from 'contract/type';
import { DEFAULT_ERROR } from 'constants/errorMessage';

function RemoveTable() {
  const { infoState, walletInfo } = useGetState();
  const { isSmallScreen } = infoState;
  const tableRef = useRef<CommonTableInstance>();
  const tool = useRef<IToolItemInstance<FilterToolType>>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageState, setPage] = useState<IPaginationPage>({
    pageSize: MAX_RESULT_COUNT_10,
    page: 1,
  });
  const { whiteListInfo: whiteListInfoStore } = useDetailGetState();
  const { projectWhiteList, whitelistInfo, chainId, initRemoveTool, whitelistId } = whiteListInfoStore;

  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const getList = useCallback(
    async (params: { filterTool?: FilterToolType; page: number; pageSize: number; isUpdater: boolean }) => {
      if (!chainId || !whitelistInfo?.whitelistHash || !whitelistInfo?.projectId || !walletInfo?.address) return;
      setTableLoading(true);
      fetchListFilter(
        'projectWhiteList',
        {
          chainId,
          projectId: whitelistInfo?.projectId,
          whitelistHash: whitelistInfo?.whitelistHash,
          tagHash: params.filterTool?.tag || 'ALL',
          currentAddress: walletInfo.address,
          searchAddress: params.filterTool?.search,
          skipCount: (params.page - 1) * pageState.pageSize,
          maxResultCount: params.pageSize,
        },
        () => setTableLoading(false),
      );
    },
    [chainId, whitelistInfo?.whitelistHash, whitelistInfo?.projectId, walletInfo.address, pageState.pageSize],
  );

  const removeHandler = useCallback(async () => {
    if (!whitelistId) return;
    setLoading(true);

    try {
      const res = await removeFromWhiteList(
        {
          whitelistId,
          extraInfoList: {
            addressList: {
              value: selectedRowKeys as string[],
            },
          },
        },
        chainId,
      );
      setLoading(false);

      if (res?.error) return message.error(res?.errorMessage?.message || DEFAULT_ERROR);
      if (res?.TransactionId) {
        messageHTML(res?.TransactionId, 'success', chainId);
      }
      setSelectedRowKeys([]);
      setPage((value: IPaginationPage) => ({ page: 1, pageSize: value.pageSize }));
      getList({
        filterTool: initRemoveTool,
        page: 1,
        pageSize: pageState?.pageSize,
        isUpdater: true,
      });
    } catch (error) {
      setLoading(false);
      const resError = error as IContractError;
      message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
    }
  }, [chainId, getList, initRemoveTool, pageState?.pageSize, selectedRowKeys, whitelistId]);
  const [loading, setLoading] = useState(false);

  const onSelectChange = useCallback((newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection: TableRowSelection<IWhitelistExtraInfosItem> = useMemo(
    () => ({
      columnWidth: 80,
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
      type: 'checkbox',
      fixed: true,
    }),
    [onSelectChange, selectedRowKeys],
  );

  const columns: ColumnsType<IWhitelistExtraInfosItem> = useMemo(() => {
    const arr = [];
    if (whitelistInfo?.strategyType !== StrategyType.Basic) {
      arr.push({
        title: 'Rank',
        dataIndex: 'tagName',
        width: isSmallScreen ? 80 : 180,
        render: (_: string, record: IWhitelistExtraInfosItem) => (
          <p className="text-[16px] font-semibold">{record.tagInfo.name}</p>
        ),
      });
    }
    if (whitelistInfo?.strategyType === StrategyType.Price) {
      arr.push({
        title: 'Price',
        dataIndex: 'price',
        width: isSmallScreen ? 144 : 240,
        render: (_: number, record: IWhitelistExtraInfosItem) => {
          const priceTagInfo = record?.tagInfo?.priceTagInfo?.symbol
            ? getfFormatPrice(record?.tagInfo?.priceTagInfo?.price || 0).toFixed()
            : '--';
          const priceTagInfoSymbol = record?.tagInfo?.priceTagInfo?.symbol?.toUpperCase() ?? '--';
          return (
            <p className="flex items-center gap-[4px]">
              <Logo src={ELF} className="w-[32px] h-[32px]" />
              <span className="text-[16px] font-semibold text-[var(--color-primary)]">{priceTagInfo}</span>
              <span className="text-[16px] font-semibold text-[var(--color-secondary)]">{priceTagInfoSymbol}</span>
            </p>
          );
        },
      });
    }
    return [
      ...arr,
      {
        title: 'Address',
        dataIndex: 'address',
        width: isSmallScreen ? 180 : 212,
        render: (address: string) => (
          <p className="text-[var(--color-primary)] text-[16px] font-semibold">
            {getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS)}
          </p>
        ),
      },
    ];
  }, [isSmallScreen, whitelistInfo?.strategyType]);

  useEffectOnce(() => {
    getList({
      page: 1,
      pageSize: pageState.pageSize,
      isUpdater: false,
    });
  });

  const getStateInfo = useCallback(
    (value: FilterToolType) => {
      setPage((value: IPaginationPage) => ({ page: 1, pageSize: value.pageSize }));
      getList({
        filterTool: value,
        page: 1,
        pageSize: pageState?.pageSize,
        isUpdater: true,
      });
    },
    [getList, pageState?.pageSize],
  );

  const removeBtn = useMemo(
    () => (
      <Button
        type="link"
        disabled={!(selectedRowKeys.length > 0 && whitelistId && chainId)}
        className="remove-action flex mt-[-8px] mx-0 mb-[32px]"
        loading={loading}
        onClick={removeHandler}>
        <div className=" flex items-center justify-center gap-[8px]">
          <DeleteFilled className="text-[24px]" />
          <span className="text-[16px] font-semibold">Delete</span>
        </div>
      </Button>
    ),
    [selectedRowKeys.length, whitelistId, chainId, loading, removeHandler],
  );

  return (
    <div className="remove-whitelist-table-wrapper w-full h-full overflow-hidden flex flex-col">
      {whitelistInfo?.strategyType !== StrategyType.Basic && (
        <InfoTool
          ref={tool}
          initState={initRemoveTool}
          onReset={() => {
            setSelectedRowKeys([]);
            tableRef?.current?.onResetPage();
          }}
          getStateInfo={getStateInfo}
        />
      )}
      {removeBtn}
      <CommonTable
        ref={tableRef}
        loading={tableLoading}
        pagination={{
          total: projectWhiteList?.totalCount ?? 0,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPage({ page, pageSize });
            getList({
              filterTool: tool.current?.getState(),
              page: page,
              pageSize: pageSize,
              isUpdater: false,
            });
          },
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={projectWhiteList?.items || []}
        rowKey="address"
      />
    </div>
  );
}

export default React.memo(RemoveTable);
