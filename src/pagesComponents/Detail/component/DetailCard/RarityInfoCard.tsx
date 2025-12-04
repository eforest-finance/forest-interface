import CollapseForPC from 'components/Collapse';
import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import { useMemo } from 'react';
import HonourLabel from 'baseComponents/HonourLabel';
import Tooltip from 'baseComponents/Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import useGetState from 'store/state/getState';

enum FilterKeyEnum {
  Rarity = 'Rarity',
}
export function RarityInfoCard() {
  const { detailInfo } = useDetailGetState();
  const { aelfInfo } = useGetState();

  const { nftInfo } = detailInfo;

  const items = useMemo(() => {
    const arr = [];
    if (nftInfo?.describe) {
      arr.push({
        key: FilterKeyEnum.Rarity,
        header: (
          <div className={clsx(styles.title, styles['help-svg'])}>
            Rarity Information{' '}
            <Tooltip
              overlayInnerStyle={{ borderRadius: '6px' }}
              title={
                <div className=" flex flex-col gap-y-1">
                  <span className=" text-textDisable text-xs">Rarity rank by Schrödinger.</span>
                  <a href={aelfInfo.officialWebsiteOfSchrodinger} target="_blank" rel="noreferrer">
                    <span className=" text-xs text-textWhite font-medium cursor-pointer hover:text-brandHover">
                      Learn more
                    </span>
                  </a>
                </div>
              }>
              <QuestionCircleOutlined className=" text-textSecondary ml-2" />
            </Tooltip>
          </div>
        ),
        children: (
          <div className="p-[16px] pt-0 lg:p-[24px] lg:pt-0">
            <p className="flex justify-between">
              <span className="flex min-w-fit mr-[16px]">Rarity</span>
              <HonourLabel text={nftInfo?.describe || ''} theme="white" />
            </p>
          </div>
        ),
      });
    }
    return arr;
  }, [nftInfo?.describe]);

  if (!items.length) return null;

  return <CollapseForPC defaultActiveKey={FilterKeyEnum.Rarity} items={items} wrapClassName={styles['detail-card']} />;
}
