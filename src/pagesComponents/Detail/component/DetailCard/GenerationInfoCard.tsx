import CollapseForPC from 'components/Collapse';
import styles from './style.module.css';
import useDetailGetState from 'store/state/detailGetState';
import { useMemo } from 'react';
import { formatShowEmptyValue } from 'utils/format';

enum FilterKeyEnum {
  Description = 'Description',
  Details = 'Details',
  CreateTokenInformation = 'CreateTokenInformation',
  GenerationInfo = 'GenerationInfo',
}
export function GenerationInfoCard() {
  const { detailInfo } = useDetailGetState();
  const { nftTraitInfos } = detailInfo;

  const items = useMemo(() => {
    const arr = [];
    if (nftTraitInfos?.generation !== undefined && Number(nftTraitInfos?.generation) !== -1) {
      arr.push({
        key: FilterKeyEnum.GenerationInfo,
        header: <div className={styles.title}>Generation Information</div>,
        children: (
          <div className="p-[16px] pt-0 lg:p-[24px] lg:pt-0">
            <p className="flex justify-between">
              <span className="flex min-w-fit mr-[16px]">Generation</span>
              <span className="font-medium text-right break-all text-[var(--text10)]">
                {formatShowEmptyValue(nftTraitInfos?.generation)}
              </span>
            </p>
          </div>
        ),
      });
    }
    return arr;
  }, [nftTraitInfos?.generation]);

  if (!items.length) return null;

  return (
    <CollapseForPC
      defaultActiveKey={FilterKeyEnum.GenerationInfo}
      items={items}
      wrapClassName={styles['detail-card']}
    />
  );
}
