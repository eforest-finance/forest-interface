import { Divider, message } from 'antd';
import BaseToolTip from 'components/BaseToolTip';
import InputHint from 'components/InputHint';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDebounce, useTimeoutFn } from 'react-use';
import Price from '../Price';
import { checkNFTApprove, messageHTML } from 'utils/aelfUtils';
import { timesDecimals } from 'utils/calculate';
import useGetTags from './hooks/getTags';
import useDetailGetState from 'store/state/detailGetState';
import useGetState from 'store/state/getState';
import { PreviewInfoType, setPreviewInfo } from 'store/reducer/saleInfo/saleInfo';
import { store } from 'store/store';
import FormItem from 'components/FormItem';

import styles from './SetItems.module.css';
import { useTheme } from 'hooks/useTheme';
import isTokenIdReuse from 'utils/isTokenIdReuse';
import { ListWithFixedPrice } from 'contract/market';
import { SERVICE_FEE } from 'constants/common';
import { BatchDeListType, IContractError, IListedNFTInfo } from 'contract/type';
import { getForestContractAddress } from 'contract/forest';
import { SupportedELFChainId } from 'constants/chain';
import { getWhiteList } from 'components/WhiteList/hooks/whiteListView';
import { enableWhiteList as EnableWhitelist } from 'components/WhiteList/hooks/managersAction';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import Button from 'baseComponents/Button';
import Input from 'baseComponents/Input';
import getMaxNftQuantityOfSell from 'utils/getMaxNftQuantityOfSell';
import checkListValidity from 'pagesComponents/SetSale/utils/checkListValidity';
import InValidListMsgModal from './modals/InValidListMsgModal';
import getCurListDuration from 'pagesComponents/SetSale/utils/getCurListDuration';
import { TargetErrorType } from 'contract/formatErrorMsg';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import batchDeList from 'pagesComponents/SetSale/utils/batchDeList';

export type PriceType = {
  symbol?: string;
  amount?: string;
};
export type AddressType = string[];

export type RankItemType = {
  price?: PriceType;
  address?: AddressType;
};

export type RankType = Record<string, RankItemType>;

export default function SetItems() {
  const [theme] = useTheme();
  const { infoState, walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { nftInfo } = detailInfo;
  const { isSmallScreen } = infoState;
  const { chainId } = useParams() as { chainId: Chain };
  const { tagInfo } = useGetTags({
    chainId: chainId,
    symbol: nftInfo?.nftSymbol,
    whitelistId: nftInfo?.whitelistId,
  });
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>();
  const { isLogin } = useCheckLoginAndToken();

  const nav = useRouter();

  const [price, setPrice] = useState<PreviewInfoType>();
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [listedNFTInfoList, setListedNFTInfoList] = useState<IListedNFTInfo[]>([]);
  const [loadingMaxQuantity, setLoadingMaxQuantity] = useState<boolean>(false);
  const [rank, setRank] = useState<RankType>({});
  const [enableWhiteList, setEnableWhiteList] = useState(false);
  const [inValidListModal, setInValidListModal] = useState<{
    visible: boolean;
    type: BatchDeListType;
    invalidList?: IListedNFTInfo[];
    showTryBtn?: boolean;
  }>({
    visible: false,
    type: BatchDeListType.GREATER_THAN,
    showTryBtn: false,
  });

  const getMaxNftQuantity = useCallback(async () => {
    if (nftInfo?.nftSymbol && walletInfo.address) {
      setLoadingMaxQuantity(true);
      const res = await getMaxNftQuantityOfSell(chainId, nftInfo, walletInfo.address);
      if (!res) {
        nav.back();
        return;
      }

      setMaxQuantity(isTokenIdReuse(nftInfo) ? res.max : 1);
      setListedNFTInfoList(res.listedNFTInfoList);
      setLoadingMaxQuantity(false);
    }
  }, [chainId, nftInfo, walletInfo.address]);

  const whiteList = async () => {
    const res = await getWhiteList({ chainId: nftInfo?.chainId, whitelistId: nftInfo?.whitelistId });
    setEnableWhiteList(!!res?.isAvailable);
  };

  const quantityHandler = useCallback((val: string) => {
    setQuantity(Number(val));
  }, []);

  const PriceSelectChange = useCallback((params: PreviewInfoType) => {
    setPrice(params);
  }, []);

  useDebounce(
    () => {
      store.dispatch(setPreviewInfo(price));
    },
    300,
    [price],
  );

  const listFail = (error?: IContractError) => {
    if (error) message.error(error.errorMessage?.message || DEFAULT_ERROR);
    setLoading(false);
  };

  const inValidListModalOnCancel = () => {
    setInValidListModal({
      visible: false,
      type: BatchDeListType.GREATER_THAN,
      showTryBtn: false,
    });
  };

  const listWithFixedPrice = async (amount: number) => {
    try {
      if (nftInfo!.whitelistId) {
        const whitelistRes = await getWhiteList({
          chainId,
          whitelistId: nftInfo!.whitelistId,
        });
        if (whitelistRes && !whitelistRes?.isAvailable && enableWhiteList) {
          const res = await EnableWhitelist(nftInfo!.whitelistId ?? '', chainId);
          if (res?.error) {
            setLoading(false);
            return message.error(res?.errorMessage?.message);
          } else {
            const { TransactionId } = res.result || res;
            messageHTML(TransactionId!, 'success', chainId);
          }
        }
      }

      const spender =
        chainId === SupportedELFChainId.MAIN_NET ? getForestContractAddress().main : getForestContractAddress().side;
      const approveRes = await checkNFTApprove({
        symbol: nftInfo!.nftSymbol,
        address: walletInfo?.address,
        spender,
        amount,
        chainId,
      });

      if (!approveRes) {
        listFail();
        return;
      }

      const duration = getCurListDuration();
      const result = await ListWithFixedPrice(
        {
          symbol: nftInfo!.nftSymbol,
          price: {
            symbol: price?.token?.symbol || '',
            amount: Number(timesDecimals(price?.price, price?.token?.decimals)),
          },
          quantity: timesDecimals(amount, nftInfo?.decimals || '0').toNumber(),
          duration,
          whitelists: enableWhiteList
            ? {
                whitelists: Object.keys(rank).map((key) => ({
                  priceTag: {
                    tagName: key,
                    price: { ...rank[key].price, amount: timesDecimals(rank[key].price?.amount, 8) },
                  },
                  addressList: { value: rank[key].address },
                })),
              }
            : null,
          isWhitelistAvailable: enableWhiteList,
        },
        {
          chain: chainId,
        },
      );
      if (result?.error || !result) {
        listFail(result || DEFAULT_ERROR);
        return;
      }

      setLoading(false);

      const { TransactionId } = result.result || result;
      messageHTML(TransactionId!, 'success', chainId);
      setTimeout(() => {
        nav.back();
      }, 1000);
    } catch (error) {
      const resError = error as IContractError;
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
      setLoading(false);
    }
  };

  const completeHandler = async (callback?: () => void) => {
    if (nftInfo && walletInfo.address) {
      try {
        const amount = !isTokenIdReuse(nftInfo) ? 1 : quantity;
        if (!amount) return;
        setLoading(true);
        const duration = getCurListDuration();
        if (!isTokenIdReuse(nftInfo)) {
          const { status, invalidList } = await checkListValidity(price!.price!, listedNFTInfoList, duration);
          if (status === BatchDeListType.GREATER_THAN) {
            listWithFixedPrice(amount);
          } else {
            setInValidListModal((info) => ({
              ...info,
              visible: true,
              type: status,
              invalidList,
            }));
            const res = await batchDeList(
              {
                symbol: nftInfo.nftSymbol,
                price: {
                  symbol: price?.token?.symbol || '',
                  amount: Number(timesDecimals(price?.price, price?.token?.decimals)),
                },
                batchDelistType: status,
              },
              chainId,
            );

            if (res) {
              inValidListModalOnCancel();
              listWithFixedPrice(amount);
            }
          }
        } else {
          listWithFixedPrice(amount);
        }
      } catch (error) {
        const resError = error as IContractError;
        if (resError.errorMessage?.message.includes(TargetErrorType.Error7)) {
          setInValidListModal((info) => ({
            ...info,
            showTryBtn: info.visible ? true : false,
          }));
        }
        listFail(resError);
      }

      callback && callback();
    }
  };

  const completeListingIsDisabled = () => {
    return (
      !walletInfo.address ||
      !price?.token ||
      !price?.price ||
      !maxQuantity ||
      Number(quantity) === 0 ||
      Number(price?.price) === 0
    );
  };

  useEffect(() => {
    getMaxNftQuantity();
    whiteList();

    if (nftInfo && !isTokenIdReuse(nftInfo)) {
      setQuantity(1);
    }
  }, [nftInfo?.nftSymbol, walletInfo.address, chainId]);

  useEffect(() => {
    setRank((v) => ({ ...tagInfo, ...v }));
  }, [tagInfo]);

  useTimeoutFn(() => {
    if (!isLogin) {
      nav.push('/');
    }
  }, 3000);

  return (
    <div className={`${styles['set-items-wrapper']} ${isSmallScreen && styles['set-items-wrapper-mobile']} flex-1`}>
      <div className="form mb-[40px]">
        {nftInfo && !isTokenIdReuse(nftInfo) ? (
          <FormItem title="Type">
            <div className="mt-[16px]">
              <span className={`${styles['fixed-price-wrapper']} rounded-[12px]`}>
                <span className={styles.prefix}>$</span>
                <br />
                <span className={styles['fixed-text']}>Fixed Price</span>
              </span>
            </div>
          </FormItem>
        ) : null}

        {nftInfo && isTokenIdReuse(nftInfo) && (
          <FormItem title="Quantity">
            <InputHint
              className="mt-[16px]"
              loading={loadingMaxQuantity}
              maxCount={maxQuantity}
              defaultValue={'0'}
              onChange={quantityHandler}
            />
          </FormItem>
        )}

        <FormItem
          title="Price"
          suffix={
            <BaseToolTip title="List price and listing schedule cannot be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates." />
          }>
          <Price className="mt-[16px]" onChange={PriceSelectChange} />
        </FormItem>
        <FormItem title="Duration">
          <Input
            value="6 months"
            disabled
            className={`!mt-[16px] !px-[16px] indent-[32px] bg-no-repeat bg-[16px_center] bg-[length:24px_24px] ${
              styles['duration-input']
            } ${
              theme === 'dark' ? `!bg-[url('/images/night/calendar.svg')]` : `!bg-[url('/images/light/calendar.svg')]`
            }`}
          />
        </FormItem>
        <Divider className={styles['list-item-divider']} />
        <FormItem title="Fees" suffix={<BaseToolTip title="Once sold, the following fees will be deducted." />}>
          <div className="mt-[16px]">
            <div className={`${styles['fee-list-item']} flex items-center justify-between`}>
              <span>Service Fee</span>
              <span>{SERVICE_FEE}</span>
            </div>
          </div>
        </FormItem>
      </div>

      <div className={styles['complete-set-button-wrapper']}>
        <Button
          type="primary"
          disabled={completeListingIsDisabled()}
          size="ultra"
          className="w-[314px]"
          loading={isLoading}
          onClick={() => completeHandler()}>
          Complete Listing
        </Button>
      </div>

      <InValidListMsgModal
        nftInfo={nftInfo}
        validType={inValidListModal.type}
        visible={inValidListModal.visible}
        invalidList={inValidListModal.invalidList}
        showTryBtn={inValidListModal.showTryBtn}
        onCancel={inValidListModalOnCancel}
        completeHandler={completeHandler}
      />
    </div>
  );
}
