'use client';
import Button from 'baseComponents/Button';
import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import useGetState from 'store/state/getState';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Bg from 'assets/images/v2/free_mint_bg.jpeg';
import { End, NotStart, Created } from './components/Result';
import Activity from './components/Activity';

export default function Detail() {
  const { infoState, aelfInfo } = useGetState();
  const { freeMintStart, freeMintEnd } = aelfInfo;
  const { isSmallScreen } = infoState;
  const [isActivity, setIsActivity] = useState(false);
  const navigate = useRouter();

  const renderResultCmp = useCallback(() => {
    const now = Date.now();
    if (now < freeMintStart) {
      return <NotStart />;
    }

    if (now > freeMintEnd) {
      return <End />;
    }
    return null;
  }, [freeMintStart, freeMintEnd]);

  useEffect(() => {
    const now = Date.now();
    const isInAnActivity = now > freeMintStart && now < freeMintEnd;
    setIsActivity(isInAnActivity);
  }, [freeMintEnd, freeMintStart]);

  if (!isSmallScreen) {
    return (
      <div className="min-h-[1024px] flex w-full h-full flex-col items-center justify-center">
        <h1 className="text-[40px] font-semibold text-textPrimary">Please access using a mobile device</h1>
        <div className="mt-[16px] text-textSecondary text-[16px]">Please try again later.</div>
        <Button
          className="mt-[48px] w-[144px] h-[48px] text-[16px] font-medium"
          type="primary"
          onClick={() => {
            navigate.push('/');
          }}>
          Back Home
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-62px)]">
      <Image className="z-0 absolute w-full h-full" src={Bg} alt="" />
      <div className="w-full h-full">{!isActivity ? <>{renderResultCmp()}</> : <Activity />}</div>
    </div>
  );
}