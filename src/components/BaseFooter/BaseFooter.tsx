import { Layout } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './BaseFooter.module.css';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectInfo } from 'store/reducer/info';
import { useTheme } from '../../hooks/useTheme';
import { fetchFooterNavItems } from 'api/fetch';

import Logo from 'assets/images/night/forestLogo.svg';
import LogoLight from 'assets/images/light/forestLogo.svg';
import { hideFooterPage } from 'constants/common';
import Telegram from 'assets/images/v2/tg.svg';
import Twitter from 'assets/images/v2/twitter.svg';
import Discord from 'assets/images/v2/discord.svg';
import Medium from 'assets/images/v2/medium-mono.svg';

type MediaItemType = {
  id: number;
  link?: string;
  name?: string;
  icon?: any;
};

const { Footer } = Layout;

const FooterIconMap = {
  Telegram,
  Twitter,
  Discord,
  Medium,
};

export default function BaseFooter() {
  const [theme] = useTheme();
  const { isSmallScreen } = useSelector(selectInfo);
  const [marginBottom, setMarginBottom] = useState<string>('mb-[80px]');

  const pathname = usePathname();
  const [footerNav, setFooterNav] = useState<MediaItemType[]>();
  const hidden = useMemo(() => {
    const path = pathname?.split('/')?.[1];
    if (hideFooterPage.includes(path)) {
      return true;
    }
    return false;
  }, [pathname]);

  const showMargin = useMemo(() => {
    if (!isSmallScreen) return false;
    const path = pathname?.split('/')?.[1];
    if (['drops-detail'].includes(path)) {
      setMarginBottom('mb-[130px]');
    } else if (['detail'].includes(path)) {
      setMarginBottom('mb-0');
    } else {
      setMarginBottom('mb-[80px]');
    }
    return ['settings', 'sale-info', 'detail', 'drops-detail'].includes(path);
  }, [pathname, isSmallScreen]);

  const getFooterNav = useCallback(async () => {
    const communityList = await fetchFooterNavItems();
    if (!communityList?.length) return;
    setFooterNav(
      communityList.map((item) => {
        return {
          ...item,
          icon: FooterIconMap[item.name],
        };
      }),
    );
  }, []);
  useEffect(() => {
    getFooterNav();
  }, [getFooterNav]);

  const ProjectLogo = theme === 'dark' ? <Logo /> : <LogoLight />;

  console.log(footerNav);

  return (
    <Footer
      className={`${styles['footer-wrapper']} ${isSmallScreen && styles['mobile-footer-wrapper']} ${
        hidden && 'hidden'
      } ${showMargin ? marginBottom : ''}`}>
      <div className={`${styles['footer-content']}`}>
        <div className={`${styles['footer-left']} flex flex-col justify-between`}>
          <div className="w-[138px] h-[28px]">{ProjectLogo}</div>
        </div>
        <ul className={`${styles['navigate-wrapper']} flex ml-auto`}>
          {footerNav?.length ? (
            <li className={styles['navigate-list-item']}>
              <h5 className="text-[14px] font-medium t-textPrimary">Community and News</h5>
              {footerNav?.length && (
                <ul className={styles['navigate-list-children']}>
                  {footerNav?.map((navItem) => (
                    <a
                      key={navItem.id}
                      href={navItem?.link ?? undefined}
                      target={isSmallScreen || !navItem.link ? '_self' : '_blank'}
                      rel="noreferrer">
                      <div className="flex items-center mb-[8px] ">
                        <navItem.icon className="mr-[8px]" />
                        <li className={styles['children-item']}>{navItem.name}</li>
                      </div>
                    </a>
                  ))}
                </ul>
              )}
            </li>
          ) : null}
        </ul>
        {isSmallScreen ? (
          <ul className={`${styles['navigate-wrapper']} flex !border-t-0 !pt-[30px]`}>
            <li className={styles['navigate-list-item']}>
              <h5 className="text-[14px] font-medium text-textPrimary">Legal</h5>
              <ul className={styles['navigate-list-children']}>
                <a href="/term-service" target="_blank">
                  <li className={styles['children-item']}>Terms of Service</li>
                </a>
                <a href="/privacy-policy" target="_blank">
                  <li className={styles['children-item']}>Privacy Policy</li>
                </a>
              </ul>
            </li>
          </ul>
        ) : (
          <ul className={`${styles['navigate-wrapper']} flex ml-[100px]`}>
            <li className={styles['navigate-list-item']}>
              <h5 className="text-[14px] font-medium t-textPrimary">Legal</h5>
              <ul className={styles['navigate-list-children']}>
                <a href="/term-service" target="_blank">
                  <li className={styles['children-item']}>Terms of Service</li>
                </a>
                <a href="/privacy-policy" target="_blank">
                  <li className={styles['children-item']}>Privacy Policy</li>
                </a>
              </ul>
            </li>
          </ul>
        )}
      </div>
    </Footer>
  );
}
