'use client';
import Button from 'baseComponents/Button';
import clsx from 'clsx';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';

const NotFound = () => {
  const { isSmallScreen } = useSelector(selectInfo);
  return (
    <div className={clsx(isSmallScreen ? 'not__found__mobile' : 'not__found__pc', 'flex items-center justify-center')}>
      <div className="flex gap-[48px] flex-col justify-center items-center">
        <div className="flex flex-col gap-[8px] text-center">
          <div className="text-[24px] leading-[34px] font-bold text-[var(--text-item)]">
            Oops! An unexpected error occurred.
          </div>
          <div className="text-[20px] leading-[30px] font-medium text-[var(--text-secondary)]">
            Please try again later.
          </div>
        </div>

        <Link href="/">
          <Button type="primary" size="large">
            Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
