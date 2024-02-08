'use client';
import { Suspense, lazy } from 'react';
import useGetState from 'store/state/getState';

const DropsDetailMobile = lazy(() => import('./views/DropsDetailMobile'));
const DropsDetailPc = lazy(() => import('./views/DropsDetailPc'));

export default function Detail() {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return <Suspense>{isSmallScreen ? <DropsDetailMobile /> : <DropsDetailPc />}</Suspense>;
}
