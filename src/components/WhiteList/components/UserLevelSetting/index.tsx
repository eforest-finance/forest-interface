/* eslint-disable no-inline-styles/no-inline-styles */

import { Button, Col, message, Row, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo, useRef, useState } from 'react';
import CommonModal from '../CommonModal';
import CommonTable, { CommonTableInstance } from '../CommonTable';
import { useEffectOnce } from 'react-use';
import AddUserLevel from '../AddUserLevel';
import RangeInput from '../RangeInput';

import { PlusOutlined } from '@ant-design/icons';
import Logo from 'components/Logo';
import ELF from 'assets/images/ELF.png';
import { messageHTML } from 'utils/aelfUtils';
import BigNumber from 'bignumber.js';
import useDetailGetState from 'store/state/detailGetState';
import { MODAL_ACTION_TYPE, StrategyType } from 'store/reducer/saleInfo/type';
import useGetState from 'store/state/getState';

import { store } from 'store/store';
import { updateViewTheWhiteList } from 'store/reducer/saleInfo/whiteListInfo';
import { RemoveTagInfo } from 'contract/whiteList';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import { fetchUserLevelList } from 'components/WhiteList/hooks/fetchUserLevelList';
import { IPaginationPage, IRangInputState, IToolItemInstance } from 'store/types/reducer';
import { IWhiteListTagsItem } from 'api/types';
import { getfFormatPrice } from 'utils';
import { DEFAULT_ERROR } from 'constants/errorMessage';

export default function UserLevelSetting() {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const { whiteListInfo: whiteListInfoStore, modalAction } = useDetailGetState();
  const { userLevelList, chainId, whitelistInfo } = whiteListInfoStore;
  const RangeInputRef = useRef<IToolItemInstance<IRangInputState>>();
  const tableRef = useRef<CommonTableInstance>();
  const [search, setSearch] = useState<IRangInputState>();
  const [loadingIndex, setLoadingIndex] = useState<string>();
  const [pageState, setPage] = useState<IPaginationPage>({
    pageSize: MAX_RESULT_COUNT_10,
    page: 1,
  });

  const [addShow, setAddShow] = useState<boolean>();

  const getList = useCallback(
    (data: IRangInputState | undefined, page: number, pageSize: number) => {
      setTableLoading(true);
      fetchUserLevelList(
        {
          chainId,
          projectId: whitelistInfo?.projectId,
          whitelistHash: whitelistInfo?.whitelistHash,
          priceMin: data?.min,
          priceMax: data?.max,
        },
        (page - 1) * pageSize,
        pageSize,
        () => setTableLoading(false),
      );
    },
    [chainId, whitelistInfo],
  );

  const actionHandler = useCallback(
    async (record: IWhiteListTagsItem) => {
      setLoadingIndex(record?.tagHash ?? '');
      const res = await RemoveTagInfo({
        whitelistId: whitelistInfo?.whitelistHash ?? '',
        projectId: whitelistInfo?.projectId ?? '',
        tagId: record?.tagHash ?? '',
      });
      setLoadingIndex(undefined);
      if (res?.error) return message.error(res.errorMessage?.message || DEFAULT_ERROR);
      if (res?.TransactionId) {
        messageHTML(res?.TransactionId, 'success', chainId);
      }
      getList(search, 1, pageState.pageSize);
      setPage((v) => ({ page: 1, pageSize: v.pageSize }));
    },
    [chainId, getList, pageState.pageSize, search, whitelistInfo?.projectId, whitelistInfo?.whitelistHash],
  );

  const columns: ColumnsType<IWhiteListTagsItem> = useMemo(() => {
    const arr = [];
    if (whitelistInfo?.strategyType !== StrategyType.Basic) {
      arr.push({
        title: 'Rank',
        dataIndex: 'name',
        width: isSmallScreen ? 93 : 280,
        render(rank: string) {
          return <p className="text-[var(--color-primary)] text-[16px] font-semibold">{rank}</p>;
        },
      });
    }
    if (whitelistInfo?.strategyType === StrategyType.Price) {
      arr.push({
        title: 'Price',
        dataIndex: 'price',
        width: isSmallScreen ? 138 : 296,
        render: (_: number, record: IWhiteListTagsItem) => {
          const priceTagInfoPrice = record?.priceTagInfo?.symbol
            ? getfFormatPrice(record?.priceTagInfo?.price || 0).toFixed()
            : '--';
          const priceTagInfoSymbol = record?.priceTagInfo?.symbol?.toUpperCase() ?? '--';
          return (
            <div className="flex items-center gap-[4px]">
              <Logo src={ELF} className="w-[32px] h-[32px]" />
              <span className="text-[16px] font-semibold text-[var(--color-primary)]">{priceTagInfoPrice}</span>
              <span className="text-[16px] font-semibold text-[var(--color-secondary)]">{priceTagInfoSymbol}</span>
            </div>
          );
        },
      });
    }

    return [
      ...arr,
      {
        title: 'Action',
        dataIndex: 'action',
        align: 'right',
        width: isSmallScreen ? 112 : 160,
        render: (_, record: IWhiteListTagsItem) => {
          return (
            <Button
              loading={loadingIndex === record?.tagHash}
              type="link"
              disabled={(!!loadingIndex && loadingIndex !== record?.tagHash) || (record?.addressCount ?? 0) > 0}
              onClick={() => actionHandler(record)}>
              Delete
            </Button>
          );
        },
      },
    ];
  }, [actionHandler, isSmallScreen, loadingIndex, whitelistInfo?.strategyType]);

  useEffectOnce(() => {
    getList(undefined, 1, pageState.pageSize);
  });

  const addTagHandler = useCallback(() => {
    setAddShow((v) => v || !v);
  }, []);

  const addSuccess = useCallback(() => {
    setAddShow(false);
    getList(search, 1, pageState.pageSize);
  }, [getList, pageState.pageSize, search]);

  const [searchDis, setSearchDis] = useState<boolean>(true);

  const onReturn = () => {
    store.dispatch(
      updateViewTheWhiteList({
        type: MODAL_ACTION_TYPE.HIDE,
        modalState: {},
      }),
    );

    modalAction.modalState?.leftCallBack?.();
  };

  const onValueChange = (value?: IRangInputState) => {
    const { min, max } = value ?? {};
    setSearchDis(!min || !max || new BigNumber(max ?? 0).lt(min ?? 0));
  };

  const onSearchClick = () => {
    tableRef?.current?.onResetPage();
    const searchVal = RangeInputRef?.current?.getState();
    setSearch(searchVal);
    setPage((page) => ({ page: 1, pageSize: page.pageSize }));
    getList(searchVal, 1, pageState.pageSize);
  };

  return (
    <CommonModal
      closable={false}
      footer={isSmallScreen ? <Button onClick={onReturn}>Return</Button> : null}
      {...modalAction.modalState}
      title={modalAction.modalState?.title ?? 'Whitelist rank setting'}
      leftCallBack={onReturn}>
      <Row
        gutter={[0, isSmallScreen ? 16 : 24]}
        justify="space-between"
        align="middle"
        className="user-level-setting-tool">
        <Col className="user-level-setting-title text-[18px] font-medium">Price range</Col>
        <Col className="user-level-setting-action">
          <div className={`${isSmallScreen ? 'flex-col gap-[24px]' : 'flex gap-[16px]'}`}>
            <RangeInput ref={RangeInputRef} onValueChange={onValueChange} />
            <Button
              type="primary"
              className={isSmallScreen ? 'mt-[12px]' : ''}
              disabled={searchDis}
              onClick={onSearchClick}>
              Search
            </Button>
          </div>
        </Col>
        <Col span={24}>
          <Space className="add-tag-btn text-[var(--brand-light)] cursor-pointer" onClick={addTagHandler}>
            <PlusOutlined className="text-[var(--brand-light)]" />
            Add Rank
          </Space>
        </Col>
      </Row>
      <CommonTable
        ref={tableRef}
        loading={tableLoading}
        pagination={{
          showQuickJumper: false,
          showSizeChanger: true,
          defaultPageSize: MAX_RESULT_COUNT_10,
          total: userLevelList?.totalCount ?? 0,
          onChange: (page, pageSize) => {
            setPage({
              page: page,
              pageSize: pageSize,
            });
            getList(search, page, pageSize);
          },
        }}
        columns={columns}
        dataSource={userLevelList?.items || []}
        rowKey="tagHash"
      />
      {addShow && (
        <AddUserLevel
          policyType={whitelistInfo?.strategyType ?? StrategyType.Basic}
          customizeAddTagFormItem={modalAction.modalState?.customizeAddTagFormItem}
          whitelistId={whitelistInfo?.whitelistHash ?? undefined}
          projectId={whitelistInfo?.projectId ?? undefined}
          chainId={chainId}
          onBack={addSuccess}
        />
      )}
    </CommonModal>
  );
}
