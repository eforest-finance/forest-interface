import { Spin } from 'antd';
import { ReactNode, memo } from 'react';
import styles from './style.module.css';
import LoadingL from 'assets/images/loadingL.png';
import Image from 'next/image';

interface ILoadingProps {
  children?: ReactNode;
  spinning: boolean;
  text?: string;
  wrapperClassName?: string;
  delay?: number;
}
function Loading(props: ILoadingProps) {
  const { spinning, children, text, wrapperClassName, delay = 0 } = props;
  return (
    <Spin
      spinning={spinning}
      delay={delay}
      indicator={<div />}
      wrapperClassName={`${wrapperClassName} ${styles['custom-loading']}`}
      tip={
        <div className="w-full flex justify-center">
          <div className="w-[240px] px-[32px] py-[20px] flex rounded-[6px] bg-black/[0.8] flex-col items-center justify-center">
            <Image
              src={LoadingL}
              alt="loading img"
              width={48}
              height={48}
              className="animate-loading w-[48px] h-[48px]"
            />
            <span className="inline-block mt-[24px] text-[16px] font-semibold text-white">
              {text ? text : 'Pending your signature as an approval'}
            </span>
          </div>
        </div>
      }>
      {children}
    </Spin>
  );
}

export default memo(Loading);
