'use client';
import Button from 'baseComponents/Button';
import { Suspense, lazy } from 'react';
import useGetState from 'store/state/getState';
import { useRouter } from 'next/navigation';
import Bg from 'assets/images/v2/free_mint_bg.jpeg';

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

  return <div className={`bg-[url(${Bg.src})]`}></div>;
}
