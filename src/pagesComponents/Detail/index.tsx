'use client';
import { Suspense, lazy } from 'react';
import useGetState from 'store/state/getState';

const DetailMobile = lazy(() => import('./views/DetailMobile'));
const DetailPc = lazy(() => import('./views/DetailPc'));

export default function Detail() {
  const { infoState } = useGetState();
  const { isSmallScreen } = infoState;

  return <Suspense>{isSmallScreen ? <DetailMobile /> : <DetailPc />}</Suspense>;
}
