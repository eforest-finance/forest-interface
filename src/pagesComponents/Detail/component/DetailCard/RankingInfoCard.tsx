import CollapseForPC from 'components/Collapse';
import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import { useMemo } from 'react';
import { thousandsNumber } from 'utils/unitConverter';

enum FilterKeyEnum {
  RankingInfo = 'RankingInfo',
}
export function RankingInfoCard() {
  const { detailInfo } = useDetailGetState();
  const { nftRankingInfos, nftTraitInfos } = detailInfo;

  const items = useMemo(() => {
    if (!nftRankingInfos?.rank?.rank || nftTraitInfos?.generation !== 9) return [];

    let showStr = `${thousandsNumber(nftRankingInfos?.rank.rank)}`;
    if (nftRankingInfos?.rank?.total) {
      showStr = `${showStr} / ${thousandsNumber(nftRankingInfos.rank.total)}`;
    }

    const arr = [];
    arr.push({
      key: FilterKeyEnum.RankingInfo,
      header: <div className={styles.title}>Ranking Information</div>,
      children: (
        <div className="p-[16px] pt-0 lg:p-[24px] lg:pt-0">
          <p className="flex justify-between">
            <span className="flex min-w-fit mr-[16px]">Rank</span>
            <span className="font-medium text-right break-all text-[var(--text10)]">{showStr}</span>
          </p>
        </div>
      ),
    });

    return arr;
  }, [nftRankingInfos?.rank]);

  if (!items.length) return null;

  return (
    <CollapseForPC defaultActiveKey={FilterKeyEnum.RankingInfo} items={items} wrapClassName={styles['detail-card']} />
  );
}
