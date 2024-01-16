'use client';
import clsx from 'clsx';
import Image from 'next/image';
import './index.less';
import loading from './itemsLoading.png';

interface LoadingProps {
  className?: string;
}
export default function Loading({ className }: LoadingProps) {
  return (
    <div className={clsx('flex-center', 'items-loading', className)}>
      <Image src={loading} alt="loading more" />
    </div>
  );
}
