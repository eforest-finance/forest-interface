import React, { ReactNode } from 'react';
import TwitterX from 'assets/images/icons/twitterX.svg';
import Telegram from 'assets/images/icons/telegram.svg';
import Discord from 'assets/images/icons/discord.svg';
import Internet from 'assets/images/icons/internet.svg';
import clsx from 'clsx';
import styles from './index.module.css';
import useDropDetailGetState from 'store/state/dropDetailGetState';
import { SocialMediaType } from 'api/types';
import Link from 'next/link';
import SkeletonImage from 'baseComponents/SkeletonImage';

interface IProps {
  className?: string;
}

function DetailCard(props: IProps) {
  const { className } = props;

  const { dropDetailInfo } = useDropDetailGetState();

  const socialMedia: Record<SocialMediaType, ReactNode> = {
    [SocialMediaType.tweet]: (
      <div className={styles['detail-card-svg-twitter']}>
        <TwitterX className="w-[21px] h-[21px]" />
      </div>
    ),
    [SocialMediaType.telegram]: (
      <div className={styles['detail-card-svg-telegram']}>
        <Telegram className="w-[21px] h-[21px]" />
      </div>
    ),
    [SocialMediaType.discord]: (
      <div className={styles['detail-card-svg-discord']}>
        <Discord className="w-[24px] h-[24px]" />
      </div>
    ),
    [SocialMediaType.web]: (
      <div className={styles['detail-card-svg-internet']}>
        <Internet className="w-[24px] h-[24px]" />
      </div>
    ),
  };

  return (
    <div
      className={clsx(
        'w-full h-full border-0 border-solid mdTW:border-r border-lineDividers pr-0 mdTW:pr-[61.5px]',
        className,
      )}>
      <h1 className="text-xl mdTW:text-2xl text-textPrimary font-semibold">About</h1>
      <p className="text-base text-textSecondary font-medium mt-[16px] break-all">{dropDetailInfo?.introduction}</p>
      {dropDetailInfo?.logoUrl ? (
        <SkeletonImage
          className={'w-full aspect-square h-auto object-cover rounded-lg mt-[16px] mdTW:mt-[32px] overflow-hidden'}
          img={dropDetailInfo.logoUrl}
        />
      ) : null}

      {dropDetailInfo?.socialMedia?.length ? (
        <div className="py-[16px] mt-0 mdTW:mt-[16px] flex items-center justify-between">
          <span className="text-base text-textSecondary font-medium">More Information</span>
          <div className={styles['detail-card-svg']}>
            {dropDetailInfo?.socialMedia.map((item, index) => {
              return (
                <Link className={styles['detail-card-share']} target="_blank" key={index} href={item.link}>
                  {socialMedia[item.type]}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(DetailCard);
