'use client';
import Button from 'baseComponents/Button';
import { Suspense, lazy, useCallback } from 'react';
import useGetState from 'store/state/getState';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Bg from 'assets/images/v2/free_mint_bg.jpeg';
import { End, NotStart, Created } from './components/Result';

export default function Detail() {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;
  const navigate = useRouter();

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

  //   const Result = useCallback(() => {
  //     const now = Date.now();
  //   }, []);

  return (
    <div className="w-full h-[calc(100vh-62px)]">
      <Image className="z-0 absolute w-full h-full" src={Bg} alt="" />
      <div className="w-full h-full">
        <Created />
      </div>
    </div>
  );
}
