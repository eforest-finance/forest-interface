import { memo, useCallback, useMemo } from 'react';
import { FilterKeyEnum, FilterType } from '../../constant';
import styles from './style.module.css';
import CloseBtn from 'assets/images/explore/tag-close.svg';
import { Ellipsis } from 'antd-mobile';
import clsx from 'clsx';
import { OmittedType, getOmittedStr } from 'utils';

function FilterTags({
  filterSelect,
  onchange,
  tagList,
  clearAll,
  clearSearchChange,
}: {
  isMobile?: boolean;
  SearchParam: string;
  tagList: TagItemType[];
  filterSelect: IFilterSelect;
  onchange?: (result: ItemsSelectSourceType) => void;
  clearSearchChange?: () => void;
  clearAll?: () => void;
  className?: string;
}) {
  const closeChange = useCallback(
    (tag: TagItemType) => {
      if (tag.type === 'search') {
        clearSearchChange && clearSearchChange();
      } else {
        const filter = filterSelect[tag.type as FilterKeyEnum];
        if (filter.type === FilterType.Checkbox) {
          const data = filter.data as SourceItemType[];
          const result = {
            [tag.type]: {
              ...filter,
              data: data.filter((item) => item.label !== tag.label),
            },
          };
          onchange && onchange(result);
        } else if (filter.type === FilterType.Range) {
          const result = {
            [tag.type]: {
              ...filter,
              data: [{ min: '', max: '' }],
            },
          };
          onchange && onchange(result);
        }
      }
    },
    [filterSelect, onchange, clearSearchChange],
  );
  const clearAllDom = useMemo(() => {
    return (
      <div className={styles.filter__button} onClick={clearAll}>
        Clear All
      </div>
    );
  }, [clearAll]);
  return tagList.length ? (
    <div className={clsx(styles['filter-tags'])}>
      <div className={styles['filter-tags-container']}>
        {tagList.map((tag) => {
          const prefix =
            tag.type.includes(FilterKeyEnum.Traits) || tag.type.includes(FilterKeyEnum.Generation)
              ? tag.type.replace(`${FilterKeyEnum.Traits}-`, '')
              : '';
          return (
            <div key={tag.label} className={styles['tag-item']}>
              {tag.type === 'search' ? (
                <div className="max-w-[152px]">
                  <Ellipsis
                    className={clsx(styles['tag-label'], 'break-words')}
                    direction="middle"
                    content={getOmittedStr(tag.label || tag.toString(), OmittedType.CUSTOM, {
                      prevLen: 7,
                      endLen: 6,
                      limitLen: 13,
                    })}
                  />
                </div>
              ) : (
                <span className={styles['tag-label']}>
                  {prefix ? `${prefix}:` : ''}
                  {tag.label}
                </span>
              )}
              <CloseBtn
                className={clsx(tag.disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
                onClick={() => {
                  if (tag.disabled) return;
                  closeChange(tag);
                }}
                width={16}
                height={16}
              />
            </div>
          );
        })}
        {tagList.length && clearAllDom}
      </div>
    </div>
  ) : (
    <div></div>
  );
}

export default memo(FilterTags);
