'use client';
import Button from 'baseComponents/Button';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import useGetState from 'store/state/getState';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import H5Bg from 'assets/images/v2/free_mint_bg.jpeg';
import PcBg from 'assets/images/stabilityWorldAi/pcBg.png';
import { End, NotStart, Created } from './components/Result';
import Activity from './components/Activity';
import { fetchCreatePlatformNFTInfo } from 'api/fetch';

const h5Bg = {
  backgroundImage: `url(${H5Bg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

const pcBg = {
  backgroundImage: `url(${PcBg.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
};

export default function Detail() {
  const { infoState, aelfInfo, walletInfo } = useGetState();
  const { stabilityStart, stabilityEnd } = aelfInfo;
  const { isSmallScreen } = infoState;
  const [isActivity, setIsActivity] = useState(false);
  const navigate = useRouter();
  const { address } = walletInfo;
  const [isDone, setIsDone] = useState(false);
  const [collectionId, setCollectionId] = useState<string>('');

  const getCount = async () => {
    if (address) {
      try {
        const { isDone, collectionId } = await fetchCreatePlatformNFTInfo({ address });
        setIsDone(isDone);
        setCollectionId(collectionId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderResultCmp = useCallback(() => {
    const now = Date.now();
    if (now < stabilityStart) {
      return <NotStart />;
    }

    if (now > stabilityEnd) {
      return <End collectionId={collectionId} />;
    }
    return null;
  }, [stabilityStart, stabilityEnd]);

  useEffect(() => {
    getCount();
  }, [address]);

  useEffect(() => {
    const now = Date.now();
    const isInAnActivity = now > stabilityStart && now < stabilityEnd;
    setIsActivity(isInAnActivity);
  }, [stabilityEnd, stabilityStart]);

  // if (!isSmallScreen) {
  //   return (
  //     <div className="min-h-[1024px] flex w-full h-full flex-col items-center justify-center">
  //       <h1 className="text-[40px] font-semibold text-textPrimary">Please access via a mobile device</h1>
  //       <div className="mt-[16px] text-textSecondary text-[16px]">Please try again later.</div>
  //       <Button
  //         className="mt-[48px] w-[144px] h-[48px] text-[16px] font-medium"
  //         type="primary"
  //         onClick={() => {
  //           navigate.push('/');
  //         }}>
  //         Back Home
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full min-h-screen relative" style={isSmallScreen ? h5Bg : pcBg}>
      <div className="max-w-[672px] m-auto">
        {!isDone ? (
          <>
            <div className="w-full h-full">{!isActivity ? <>{renderResultCmp()}</> : <Activity />}</div>
          </>
        ) : (
          <Created collectionId={collectionId} />
        )}
      </div>
    </div>
  );
}
