/* eslint-disable no-inline-styles/no-inline-styles */

import { Button, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import CommonModal from '../CommonModal';
import CommonTable, { CommonTableInstance } from '../CommonTable';
import EditUserInfo, { IEditUserInfoFormValue } from '../EditUserInfo';
import InfoTool, { FilterToolType } from '../InfoTool';
import Logo from 'components/Logo';
import ELF from 'assets/images/ELF.png';
import { messageHTML } from 'utils/aelfUtils';
import useDetailGetState from 'store/state/detailGetState';
import useGetState from 'store/state/getState';
import { fetchListFilter } from 'components/WhiteList/hooks/fetchWhiteList';
import { store } from 'store/store';
import { setWhiteListInfo, updateViewTheWhiteList } from 'store/reducer/saleInfo/whiteListInfo';
import { IFilterTool, MODAL_ACTION_TYPE, StrategyType } from 'store/reducer/saleInfo/type';
import { MAX_RESULT_COUNT_10 } from 'constants/common';
import { useManagerList } from 'components/WhiteList/hooks/useManagerList';
import { RemoveInfoFromWhitelist } from 'contract/whiteList';
import { updateWhitelistUserInfo } from 'components/WhiteList/hooks/managersAction';
import { OmittedType, addPrefixSuffix, getOmittedStr, getOriginalAddress, getfFormatPrice } from 'utils';
import { IPaginationPage, IToolItemInstance } from 'store/types/reducer';
import { IContractError } from 'contract/type';
import { IWhitelistExtraInfosItem } from 'api/types';
import { DEFAULT_ERROR } from 'constants/errorMessage';

export default function ViewTheWhiteList() {
  const { whiteListInfo: whiteListInfoStore, modalAction } = useDetailGetState();
  const { walletInfo, infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const { chainId, whitelistInfo, whitelistInfoList, initViewTool } = whiteListInfoStore;
  const [loading, setLoading] = useState<string>();
  const [editLoading, setEditLoading] = useState<boolean>();
  const [userModal, setUserModal] = useState<IWhitelistExtraInfosItem>();
  const tool = useRef<IToolItemInstance<IFilterTool>>();
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const tableRef = useRef<CommonTableInstance>();
  const [pageState, setPage] = useState<IPaginationPage>({
    pageSize: MAX_RESULT_COUNT_10,
    page: 1,
  });
  const getList = useCallback(
    async (params: { filterTool?: FilterToolType; page: number; pageSize: number; isUpdater: boolean }) => {
      if (!chainId || !walletInfo.address || !whitelistInfo?.projectId || !whitelistInfo?.whitelistHash) return;
      setTableLoading(true);
      fetchListFilter(
        'whitelistInfoList',
        {
          chainId,
          skipCount: (params.page - 1) * pageState.pageSize,
          maxResultCount: params.pageSize,
          projectId: whitelistInfo?.projectId,
          whitelistHash: whitelistInfo?.whitelistHash,
          tagHash: params.filterTool?.tag || 'ALL',
          searchAddress: params.filterTool?.search,
          currentAddress: walletInfo.address,
        },
        () => setTableLoading(false),
      );
    },
    [chainId, pageState.pageSize, walletInfo.address, whitelistInfo?.projectId, whitelistInfo?.whitelistHash],
  );

  const managerList = useManagerList({
    chainId,
    whitelistHash: whitelistInfo?.whitelistHash ?? '',
    projectId: whitelistInfo?.projectId ?? '',
  });

  const isManager = useMemo(
    () => managerList?.some((item) => item?.manager === walletInfo.address),
    [walletInfo.address, managerList],
  );
  const removeHandler = useCallback(
    async (record: IWhitelistExtraInfosItem) => {
      if (!whitelistInfo?.whitelistHash) return message.error('Whitelist not found');

      setLoading(`remove${record?.address}`);

      try {
        const res = await RemoveInfoFromWhitelist(
          {
            whitelistId: whitelistInfo?.whitelistHash,
            addressList: { value: [record?.address ?? ''] },
          },
          {
            chain: chainId,
          },
        );

        setLoading(undefined);

        if (res?.error) return message.error(res?.errorMessage?.message || DEFAULT_ERROR);
        if (res?.TransactionId) {
          messageHTML(res?.TransactionId, 'success', chainId);
        }
        getList({
          filterTool: initViewTool,
          page: 1,
          pageSize: pageState?.pageSize,
          isUpdater: true,
        });
      } catch (error) {
        const resError = error as IContractError;
        setLoading(undefined);
        return message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
      }
    },
    [chainId, getList, initViewTool, pageState?.pageSize, whitelistInfo?.whitelistHash],
  );

  const actionBtnWrapper = useCallback(
    (_: undefined, record: IWhitelistExtraInfosItem) => (
      <p className="flex justify-between action">
        <Button type="link" className="text-[16px] font-semibold" onClick={() => setUserModal(record)}>
          Edit
        </Button>
        <Button
          type="link"
          loading={`remove${record?.address}` === loading}
          className="text-[16px] font-semibold"
          onClick={() => removeHandler(record)}>
          Delete
        </Button>
      </p>
    ),
    [loading, removeHandler],
  );

  const getStateInfo = useCallback(
    (value: FilterToolType) => {
      setPage((page) => ({ page: 0, pageSize: page.pageSize }));
      getList({
        filterTool: value,
        page: 1,
        pageSize: pageState?.pageSize,
        isUpdater: true,
      });
    },
    [getList, pageState?.pageSize],
  );

  const columns: ColumnsType<IWhitelistExtraInfosItem> = useMemo(() => {
    const arr: ColumnsType<IWhitelistExtraInfosItem> = [
      {
        width: isSmallScreen ? (isManager ? 180 : 143) : isManager ? 214 : 184,
        title: 'Address',
        dataIndex: 'address',
        render: (address: string) => (
          <p className="text-[var(--color-primary)] text-[16px] font-semibold">
            {getOmittedStr(addPrefixSuffix(address), OmittedType.ADDRESS)}
          </p>
        ),
      },
    ];
    if (whitelistInfo?.strategyType === StrategyType.Price) {
      arr.unshift({
        width: isSmallScreen ? (isManager ? 144 : 128) : isManager ? 202 : 276,
        title: 'Price',
        dataIndex: 'price',
        render: (_: number, record: IWhitelistExtraInfosItem) => (
          <div className="flex items-center gap-[4px]">
            <Logo src={ELF} className="w-[32px] h-[32px]" />
            <span className="text-[16px] font-semibold text-[var(--color-primary)]">
              {record?.tagInfo?.priceTagInfo?.symbol
                ? getfFormatPrice(record?.tagInfo?.priceTagInfo?.price || 0).toFixed()
                : '--'}
            </span>
            <span className="text-[16px] font-semibold text-[var(--color-secondary)]">
              {record?.tagInfo?.priceTagInfo?.symbol?.toUpperCase() ?? '--'}
            </span>
          </div>
        ),
      });
    }
    if (whitelistInfo?.strategyType !== StrategyType.Basic) {
      arr.unshift({
        width: isSmallScreen ? 72 : isManager ? 160 : 276,
        title: 'Rank',
        dataIndex: 'tagName',
        render(_, record: IWhitelistExtraInfosItem) {
          return <p className="text-[var(--color-primary)] font-semibold text-[16px]">{record.tagInfo.name}</p>;
        },
      });
    }

    if (isManager) {
      arr.push({
        title: isSmallScreen ? '' : 'Action',
        dataIndex: 'action',
        className: 'action',
        fixed: 'right',
        width: isSmallScreen ? 128 : 160,
        render: actionBtnWrapper,
      });
    }
    return arr;
  }, [actionBtnWrapper, isManager, isSmallScreen, whitelistInfo?.strategyType]);

  const modalDestroy = useCallback(() => {
    setUserModal(undefined);
  }, []);

  const editOk = useCallback(() => {
    modalDestroy();
  }, [modalDestroy]);

  const onFinish = useCallback(async (values: IEditUserInfoFormValue) => {
    if (!whitelistInfo?.whitelistHash) return message.error('Whitelist not found');
    const { tagId, address } = values ?? {};
    setEditLoading(true);
    try {
      const res = await updateWhitelistUserInfo(
        {
          whitelistId: whitelistInfo?.whitelistHash ?? '',
          extraInfoList: {
            addressList: { value: [getOriginalAddress(address)] },
            ...(whitelistInfo?.strategyType === StrategyType.Price ? { id: tagId } : {}),
          },
        },
        whitelistInfo?.strategyType ?? StrategyType.Basic,
      );
      setEditLoading(false);

      if (res?.error) return message.error(res?.errorMessage?.message || DEFAULT_ERROR);
      if (res?.TransactionId) {
        messageHTML(res?.TransactionId, 'success', chainId);
      }
      editOk();
      getList({
        filterTool: tool.current?.getState(),
        page: 1,
        pageSize: pageState?.pageSize,
        isUpdater: true,
      });
    } catch (error) {
      const resError = error as IContractError;
      return message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
    }
  }, []);

  const onReturn = () => {
    store.dispatch(
      updateViewTheWhiteList({
        type: MODAL_ACTION_TYPE.HIDE,
        modalState: {},
      }),
    );
    modalAction?.modalState?.leftCallBack?.();
  };

  useEffectOnce(() => {
    getList({
      page: 1,
      pageSize: pageState.pageSize,
      isUpdater: false,
    });
  });

  useEffect(() => {
    return () => {
      store.dispatch(
        setWhiteListInfo({
          initViewTool: {
            tag: 'ALL',
            search: '',
          },
        }),
      );
    };
  }, []);

  return (
    <CommonModal
      closable={false}
      className="!h-full"
      footer={isSmallScreen ? <Button onClick={onReturn}>Return</Button> : null}
      {...modalAction}
      title={modalAction?.modalState?.title ?? 'Whitelist details'}
      leftCallBack={onReturn}>
      <InfoTool
        ref={tool}
        initState={initViewTool}
        onReset={() => {
          tableRef?.current?.onResetPage();
        }}
        getStateInfo={getStateInfo}
      />

      <CommonTable
        ref={tableRef}
        loading={tableLoading}
        pagination={{
          total: whitelistInfoList?.totalCount ?? 0,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPage({ page, pageSize });
            getList({
              filterTool: tool.current?.getState(),
              pageSize,
              page: page,
              isUpdater: false,
            });
          },
        }}
        rowKey={(record: IWhitelistExtraInfosItem) => record.address}
        columns={columns}
        dataSource={whitelistInfoList?.items ?? []}
      />
      {!!userModal && (
        <EditUserInfo
          strategyType={whitelistInfo?.strategyType}
          editInfo={userModal}
          loading={editLoading}
          onCancel={modalDestroy}
          onFinish={onFinish}
        />
      )}
    </CommonModal>
  );
}
