'use client';
import { Col, Row, message } from 'antd';
import BuyCard from 'pagesComponents/Detail/component/BuyCard';
import DetailCard from 'pagesComponents/Detail/component/DetailCard';
import Listings from 'pagesComponents/Detail/component/Listings';
import PriceHistory from 'components/PriceHistory';
import RecommendList from 'components/RecommendList';
import { useCallback, useMemo, useState } from 'react';
import ExchangeModal, { ArtType } from './component/ExchangeModal';
import OfferModal from './component/OfferModal';

import styles from './style.module.css';
import Offers from './component/Offers';
import TransferModal from './component/TransferModal';
import CancelModal from './component/CancelModal';
import { useDetail } from './hooks/useDetail';
import useTokenData from 'hooks/useTokenData';
import SellCard from './component/SellCard';
import useNFTInfo from './hooks/useNFTInfo';
import Picture from './component/Picture/Picture';
import Creator from './component/Creator';
import Title from './component/Title';
import Owner from './component/Owner';
import Activity from './component/Activity';
import { useRouter, useParams } from 'next/navigation';
import ExchangeBtnPanel from './component/ExchangeBtnPanel';
import useDetailGetState from '../../store/state/detailGetState';
import useGetState from 'store/state/getState';
import { useAELFBalances } from './hooks/useAELFBalances';
import isTokenIdReuse from 'utils/isTokenIdReuse';
import { FormatListingType, FormatOffersType } from 'store/types/reducer';
import BidModal from './component/BidModal';
import BidCardAndList from './component/BidCard';
import useIntervalRequestForBid from './hooks/useIntervalRequestForBid';
import { IAuctionInfoResponse } from 'api/types';
import { PlaceBid } from 'contract/auction';
import { Approve, GetAllowance } from 'contract/multiToken';
import { timesDecimals } from 'utils/calculate';
import BigNumber from 'bignumber.js';
import BuyNowModal from './component/BuyNowModal';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

export default function Detail() {
  const { id, chainId } = useParams() as {
    type: string;
    id: string;
    chainId: Chain;
  };
  const { login, isLogin } = useCheckLoginAndToken();
  const { isCanBeBid, run, isFetching } = useDetail();

  const elfRate = useTokenData();
  const { infoState, aelfInfo, walletInfo } = useGetState();
  const { detailInfo } = useDetailGetState();

  const { nftInfo, pageRefreshCount, listings } = detailInfo;
  const { isSmallScreen } = infoState;
  const navigator = useRouter();
  const intervalDataForBid = useIntervalRequestForBid(isCanBeBid, nftInfo?.nftSymbol, () => {
    run();
    getNFTNumber(nftInfo?.nftSymbol);
  });

  const [exchangeModalVisible, setExchangeModalVisible] = useState(false);
  const [buyNowModalVisible, setBuyNowModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [art, setArt] = useState<ArtType>();
  const [exchangeType, setExchangeType] = useState<string>();
  const [cancelType, setCancelType] = useState<string>();
  const [cancelData, setCancelData] = useState<FormatOffersType | FormatListingType>();
  const [placeBidBtnLoading, setPlaceBidBtnLoading] = useState(false);

  const {
    result: [nftBalance, nftQuantity],
    loading: loadingBalanceAndQuantity,
    getNFTNumber,
  } = useNFTInfo(nftInfo?.nftSymbol, nftInfo?.chainId);

  const {
    balance: { balance: currentChainBalance },
    run: runBalance,
  } = useAELFBalances({ symbol: 'ELF', chain: nftInfo?.chainId });
  const additionalAble = useMemo(() => nftInfo && isTokenIdReuse(nftInfo), [nftInfo]);

  const listingPriceFromList = useMemo(() => {
    return listings?.[0]?.price || 0;
  }, [listings]);

  const handleBuyNow = useCallback(() => {
    if (nftInfo) setBuyNowModalVisible(true);
  }, [nftInfo]);

  const handleListingBuy = useCallback(
    (record: FormatListingType) => {
      console.log('handleListingBuy', nftInfo, record);
      if (nftInfo && record?.purchaseToken) {
        const convertPrice = record?.price * (record?.purchaseToken?.symbol === 'ELF' ? elfRate : 1);
        setArt({
          id: nftInfo.nftTokenId,
          symbol: nftInfo.nftSymbol,
          name: nftInfo.tokenName || '',
          collection: nftInfo.nftCollection?.tokenName,
          token: { symbol: record?.purchaseToken?.symbol },
          decimals: record?.decimals,
          price: record?.price,
          quantity: record?.quantity,
          convertPrice,
          address: record.ownerAddress,
        });
        setExchangeType('');
        setExchangeModalVisible(true);
      }
    },
    [elfRate, nftInfo, listings],
  );

  const handleDeal = useCallback(
    (record: FormatOffersType) => {
      if (nftInfo) {
        const convertPrice = record?.price * (record?.token?.symbol === 'ELF' ? elfRate : 1);
        setArt({
          id: nftInfo?.nftTokenId,
          name: nftInfo?.tokenName || '',
          token: { symbol: record?.token.symbol },
          symbol: nftInfo!.nftSymbol,
          collection: nftInfo.nftCollection?.tokenName,
          decimals: record?.decimals,
          price: record?.price,
          quantity: record?.quantity,
          convertPrice,
          address: record?.from?.address || '',
        });
        setExchangeType('sell');
        setExchangeModalVisible(true);
      }
    },
    [nftInfo, elfRate],
  );

  const onCancel = (data: FormatOffersType | FormatListingType, type: string) => {
    setCancelModalVisible(true);
    setCancelType(type);
    setCancelData(data);
  };

  const PretreatedPriceHistory = useMemo(() => <PriceHistory />, []);

  const PretreatedListings = useMemo(
    () => (
      <Listings
        nftBalance={nftBalance}
        nftQuantity={nftQuantity}
        myBalance={currentChainBalance}
        rate={elfRate}
        onClickBuy={handleListingBuy}
        onClickCancel={(data: FormatListingType) => onCancel(data, 'listing')}
      />
    ),
    [chainId, currentChainBalance, elfRate, handleListingBuy, navigator, nftBalance, nftQuantity, id, pageRefreshCount],
  );

  const PretreatedOffers = useMemo(
    () => (
      <Offers
        nftBalance={nftBalance}
        onDeal={handleDeal}
        onCancel={(data: FormatOffersType) => onCancel(data, 'offer')}
        rate={elfRate}
      />
    ),
    [elfRate, handleDeal, nftBalance, pageRefreshCount],
  );

  const PretreatedBuyCard = useMemo(
    () => (
      <BuyCard
        className="mdTW:mt-[40px]"
        disabled={!listingPriceFromList || (isLogin ? nftQuantity < nftBalance : false)}
        myBalance={currentChainBalance}
        onBuyNow={() => {
          isLogin ? handleBuyNow(listings?.[0]) : login();
        }}
        onMakeOffer={() => (isLogin ? setOfferModalVisible(true) : login())}
        rate={elfRate}
      />
    ),
    [listingPriceFromList, isLogin, nftQuantity, nftBalance, currentChainBalance, elfRate],
  );

  const PretreatedSellCard = useMemo(
    () => (
      <SellCard
        loading={loadingBalanceAndQuantity}
        nftBalance={nftBalance}
        quantity={nftQuantity}
        onTransfer={() => setTransferModalVisible(true)}
      />
    ),
    [nftBalance, nftQuantity, loadingBalanceAndQuantity],
  );

  const PretreatedExchangePanel = useCallback(() => {
    return nftInfo && !isTokenIdReuse(nftInfo) && nftBalance ? (
      <div className="mb-[32px]">
        <ExchangeBtnPanel nftBalance={nftBalance} onClickTransfer={() => setTransferModalVisible(true)} />
      </div>
    ) : (
      PretreatedBuyCard
    );
  }, [PretreatedBuyCard, nftBalance, nftInfo]);

  const placeBidHandler = useCallback(
    async (totalPrice: number) => {
      try {
        setPlaceBidBtnLoading(true);
        console.log('walletInfo.address', walletInfo.address);
        const allowance = await GetAllowance({
          symbol: 'ELF',
          owner: walletInfo.address,
          spender: aelfInfo?.auctionSideAddress,
        });

        if (allowance.error) {
          message.error(allowance.errorMessage?.message || allowance.error.toString());
          return;
        }

        const bigA = timesDecimals(totalPrice, 8);

        const allowanceBN = new BigNumber(allowance?.allowance || 0);

        if (allowanceBN.lt(bigA)) {
          const approveRes = await Approve({
            spender: aelfInfo?.auctionSideAddress,
            symbol: 'ELF',
            amount: timesDecimals(totalPrice, 8).toNumber(),
            // amount: timesDecimals(10000, 8).toString(),
          });
          console.log('token approve finish', approveRes);
        }

        await PlaceBid({
          auctionId: intervalDataForBid?.auctionInfo?.id || '',
          amount: timesDecimals(totalPrice, 8).toNumber(),
        });
        runBalance();
        message.success('success');
      } catch (e: any) {
        let msg = e?.errorMessage?.message;
        if (/Insufficient balance of ELF/.test(e.errorMessage?.message)) {
          msg = 'Insufficient funds';
        }
        console.log('PlaceBid finish error', e);
        message.error(msg);
      } finally {
        setPlaceBidBtnLoading(false);
        setBidModalVisible(false);
      }
    },
    [aelfInfo?.auctionSideAddress, intervalDataForBid?.auctionInfo?.id, walletInfo.address],
  );

  const DetailModals = useMemo(() => {
    return (
      <>
        <ExchangeModal
          exchangeType={exchangeType}
          art={art as ArtType}
          visible={exchangeModalVisible}
          nftBalance={nftBalance}
          onClose={() => {
            runBalance();
            setExchangeModalVisible(false);
          }}
        />
        <OfferModal
          visible={offerModalVisible}
          rate={elfRate}
          balance={currentChainBalance}
          maxCount={nftQuantity - nftBalance}
          maxCountLoading={loadingBalanceAndQuantity}
          onClose={() => setOfferModalVisible(false)}
        />
        <TransferModal
          visible={transferModalVisible}
          quantity={nftBalance}
          onClose={() => setTransferModalVisible(false)}
        />
        <CancelModal
          visible={cancelModalVisible}
          type={cancelType}
          data={cancelData}
          onClose={() => setCancelModalVisible(false)}
        />
        <BidModal
          auctionInfo={intervalDataForBid?.auctionInfo as IAuctionInfoResponse}
          visible={bidModalVisible}
          onClose={() => setBidModalVisible(false)}
          nftInfo={nftInfo}
          myBalance={currentChainBalance}
          placeBidHandler={placeBidHandler}
          placeBidBtnLoading={placeBidBtnLoading}
        />
        <BuyNowModal
          visible={buyNowModalVisible}
          nftBalance={nftBalance}
          elfRate={elfRate}
          onClose={() => {
            runBalance();
            setBuyNowModalVisible(false);
          }}
        />
      </>
    );
  }, [
    exchangeType,
    art,
    exchangeModalVisible,
    nftBalance,
    offerModalVisible,
    elfRate,
    currentChainBalance,
    nftQuantity,
    loadingBalanceAndQuantity,
    transferModalVisible,
    cancelModalVisible,
    cancelType,
    cancelData,
    intervalDataForBid?.auctionInfo,
    bidModalVisible,
    nftInfo,
    placeBidHandler,
    placeBidBtnLoading,
    buyNowModalVisible,
    runBalance,
  ]);

  const panelArray = useMemo(
    () => [PretreatedPriceHistory, PretreatedListings, PretreatedOffers],
    [PretreatedListings, PretreatedOffers, PretreatedPriceHistory],
  );

  return (
    <div className={`${styles.detail} ${isSmallScreen && styles['mobile-detail']}`}>
      {DetailModals}
      {isSmallScreen ? (
        <>
          <Creator />
          <Title className="mt-[8px]" />
          <Owner className="mt-[8px]" />
          <Picture />
          {intervalDataForBid?.isBidding ? (
            <div className="mt-[40px]">
              <BidCardAndList
                intervalDataForBid={intervalDataForBid}
                placeBid={() => (isLogin ? setBidModalVisible(true) : login())}
              />
            </div>
          ) : (
            <>
              <PretreatedExchangePanel />
              {additionalAble && PretreatedSellCard}
              {panelArray.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </>
          )}
          <DetailCard />
          <Activity />
          <RecommendList />
        </>
      ) : (
        <>
          <div className={styles['top-panel']}>
            <div className={styles['left-wrap']}>
              <Picture />
              <DetailCard />
            </div>
            <div className={styles['right-wrap']}>
              <Creator />
              <Title className={`${nftInfo?.nftCollection?.tokenName && 'mt-[12px]'} text-5xl`} />
              <Owner className="mt-[12px]" />
              {!isFetching && (
                <>
                  {intervalDataForBid?.isBidding ? (
                    <div className="mt-[40px]">
                      <BidCardAndList
                        intervalDataForBid={intervalDataForBid}
                        placeBid={() => (isLogin ? setBidModalVisible(true) : login())}
                      />
                    </div>
                  ) : (
                    <>
                      <PretreatedExchangePanel />
                      <Row className="flex items-center justify-center flex-1 max-w-[100%]" gutter={[0, 16]}>
                        {additionalAble && <Col span={24}>{PretreatedSellCard}</Col>}
                        {panelArray.map((item, index) => (
                          <Col key={index} span={24}>
                            {item}
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="mdTW:mt-[16px]">
            <Activity />
          </div>
          <div className="mdTW:mt-[16px]">
            <RecommendList />
          </div>
        </>
      )}
    </div>
  );
}
