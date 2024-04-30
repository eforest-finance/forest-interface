import { Carousel, Col, Row } from 'antd';
import { useRecommendList } from 'pagesComponents/Detail/hooks/useRecommendList';
import useWindowWidth from 'hooks/useWindowWidth';
import { MouseEvent, useCallback, useMemo } from 'react';
import { INftInfo } from 'types/nftTypes';
import { useRouter } from 'next/navigation';

import styles from './style.module.css';

import useGetState from 'store/state/getState';
import useDetailGetState from 'store/state/detailGetState';
import { RECOMMEND_LIST_WIDTH_COLUMN } from 'constants/common';
import CollapseForPC from 'components/Collapse';
import Button from 'baseComponents/Button';
import { ItemsCard } from 'pagesComponents/ExploreItem/components/NFTList';

export default function RecommendList() {
  const windowWidth = useWindowWidth();
  const { infoState } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { isSmallScreen } = infoState;
  const { nftInfo } = detailInfo;

  const navigate = useRouter();
  const list: INftInfo[] | undefined = useRecommendList();
  const column = useMemo(
    () => (windowWidth < RECOMMEND_LIST_WIDTH_COLUMN && !isSmallScreen ? 3 : 4),
    [isSmallScreen, windowWidth],
  );

  const onViewCollection = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      navigate.push(`/explore-items/${nftInfo?.nftCollection?.id}`);
    },
    [navigate, nftInfo?.nftCollection?.id],
  );

  const cardClickHandler = useCallback(
    (item: INftInfo) => {
      document.querySelector('main')?.scrollTo(0, 0);
      navigate.push(`/detail/buy/${item?.id}/${item.chainId}`);
    },
    [navigate],
  );

  const renderList = useMemo(() => {
    // console.log('recommend', list);
    if (!nftInfo?.id) return [];
    const targetIndex = list?.findIndex((item) => {
      return item.id === nftInfo?.id;
    });
    if (!list) return [];
    const tempList = [...list];
    if (targetIndex !== undefined && targetIndex >= 0) {
      tempList?.splice(targetIndex, 1);
    } else if ((list?.length || 0) > column) {
      tempList?.splice(0, list.length - column);
    }
    // console.log('recommend1', tempList);
    tempList.length = list.length > column ? column : list.length;
    return tempList;
  }, [column, list, nftInfo]);

  const items = [
    {
      key: 'history',
      header: (
        <div className="!flex !justify-between text-textPrimary text-[18px] font-medium leading-[26px] p-[16px] lg:p-[24px] !pr-[56px]">
          <p className="font-medium flex items-center">More from this Collection</p>
          {!isSmallScreen ? (
            <Button type="primary" size="middle" onClick={onViewCollection}>
              View Collection
            </Button>
          ) : null}
        </div>
      ),
      children: (
        <div className="p-[24px] pt-[16px] border-0 border-t !border-solid border-[var(--bg-table-hover)]">
          <Row gutter={isSmallScreen ? 0 : [24, 24]}>
            {isSmallScreen ? (
              <Col span={24} className="overflow-hidden">
                <Carousel dots={{ className: styles.dot }}>
                  {renderList.map((item: INftInfo) => (
                    <ItemsCard
                      priceClassName={styles['bid_price__wrapper']}
                      key={item.id}
                      dataSource={item}
                      onClick={() => {
                        cardClickHandler(item);
                      }}
                    />
                  ))}
                </Carousel>
              </Col>
            ) : (
              renderList.map((item: INftInfo) => {
                return (
                  <Col key={item.id} span={24 / column} className="!min-w-0">
                    <ItemsCard
                      key={item.id}
                      priceClassName={styles['bid_price__wrapper']}
                      dataSource={item}
                      onClick={() => {
                        cardClickHandler(item);
                      }}
                    />
                  </Col>
                );
              })
            )}
            {isSmallScreen && (
              <Col span={24} className={styles['btn-wrap']}>
                <Button type="primary" size="large" className="!w-full" onClick={onViewCollection}>
                  View Collection
                </Button>
              </Col>
            )}
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className={`${styles['recommend-panel']} ${isSmallScreen && styles['mobile-recommend-panel']}`}>
      <CollapseForPC
        items={items}
        wrapClassName={`${styles['recommend-panel']} ${isSmallScreen && styles['mobile-recommend-panel']}`}
      />
    </div>
  );
}
