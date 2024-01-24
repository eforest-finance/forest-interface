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

type MediaItemType = {
  id: number;
  link?: string;
  name?: string;
};

const { Footer } = Layout;

export default function BaseFooter() {
  const [theme] = useTheme();
  const { isSmallScreen } = useSelector(selectInfo);

  const pathname = usePathname();
  const [footerNav, setFooterNav] = useState<MediaItemType[]>();
  const hidden = useMemo(() => {
    const path = pathname?.split('/')?.[1];

    switch (path) {
      case 'explore-items':
      case 'account':
      case 'collections':
      case 'my-collections':
        return true;

      default:
        return false;
    }
  }, [pathname]);

  const showMargin = useMemo(() => {
    if (!isSmallScreen) return false;
    const path = pathname?.split('/')?.[1];
    return ['settings', 'sale-info', 'detail'].includes(path);
  }, [pathname, isSmallScreen]);

  const getFooterNav = useCallback(async () => {
    const communityList = await fetchFooterNavItems();
    if (!communityList?.length) return;
    setFooterNav(communityList);
  }, []);
  useEffect(() => {
    getFooterNav();
  }, [getFooterNav]);

  const ProjectLogo = theme === 'dark' ? <Logo /> : <LogoLight />;

  return (
    <Footer
      className={`${styles['footer-wrapper']} ${isSmallScreen && styles['mobile-footer-wrapper']} ${
        hidden && 'hidden'
      } ${showMargin ? 'mb-[80px]' : ''}`}>
      <div className={`${styles['footer-content']}`}>
        <div className={`${styles['footer-left']} flex flex-col justify-between`}>
          <div className="w-[138px] h-[28px]">{ProjectLogo}</div>
        </div>
        <ul className={`${styles['navigate-wrapper']} flex ml-auto`}>
          {footerNav?.length ? (
            <li className={styles['navigate-list-item']}>
              <h5>Join the community</h5>
              {footerNav?.length && (
                <ul className={styles['navigate-list-children']}>
                  {footerNav?.map((navItem) => (
                    <a
                      key={navItem.id}
                      href={navItem?.link ?? undefined}
                      target={isSmallScreen || !navItem.link ? '_self' : '_blank'}
                      rel="noreferrer">
                      <li className={styles['children-item']}>{navItem.name}</li>
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
              <h5>Legal</h5>
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
              <h5>Legal</h5>
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
