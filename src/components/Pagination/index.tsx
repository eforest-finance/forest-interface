import type { PaginationProps } from 'antd';
import styles from './styles.module.css';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import clsx from 'clsx';
import RightArrow from 'assets/images/right-arrow-thin.svg';
import LeftArrow from 'assets/images/left-arrow-thin.svg';
import DownArrow from 'assets/images/down-arrow-thin.svg';
import useResponsive from 'hooks/useResponsive';
import Button from 'baseComponents/Button';
import { Select } from 'baseComponents/Select';
function JumpButton({
  disabled,
  className,
  svgComponent,
  onChange,
}: {
  disabled: boolean;
  className: string;
  svgComponent: ReactNode;
  onChange: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <Button
      type="primary"
      ghost
      disabled={disabled}
      className={className}
      onClick={onChange}
      icon={svgComponent}></Button>
  );
}

export type Options = {
  value: number;
  label: number;
};

export interface IEpPaginationProps extends PaginationProps {
  current?: number;
  pageSize?: number;
  isMobile?: boolean;
  hideOnSinglePage?: boolean;
  defaultCurrent?: number;
  total: number;
  defaultPageSize?: number;
  showSizeChanger?: boolean;
  pageChange?: (page: number, pageSize?: number) => void;
  pageSizeChange?: (page: number, pageSize: number) => void;
  options?: Options[];
}

export default function EpPagination({
  current,
  pageSize = 10,
  defaultCurrent = 1,
  defaultPageSize = 10,
  total,
  showSizeChanger = true,
  pageChange,
  hideOnSinglePage,
  pageSizeChange,
  onChange,
  options = [
    { value: 10, label: 10 },
    { value: 20, label: 20 },
    { value: 50, label: 50 },
  ],
}: IEpPaginationProps) {
  const { isLG: isMobile } = useResponsive();
  const [pageNum, setPageNum] = useState<number>(defaultCurrent);
  const [pageSizeValue, setPageSizeValue] = useState<number>(defaultPageSize);
  useEffect(() => {
    current && setPageNum(current as number);
  }, [current]);
  useEffect(() => {
    pageSize && setPageSizeValue(pageSize);
  }, [pageSize]);

  const totalPage = useMemo(() => {
    return Math.floor((total + pageSizeValue - 1) / pageSizeValue) || 1;
  }, [total, pageSizeValue]);

  const isFirstPage = useMemo(() => {
    return pageNum === 1;
  }, [pageNum]);

  const isLastPage = useMemo(() => {
    return pageNum >= totalPage;
  }, [pageNum, totalPage]);

  const prevChange = () => {
    const page = pageNum === 1 ? pageNum : pageNum - 1;
    setPageNum(page);
    pageChange && pageChange(page);
    onChange && onChange(page, pageSize);
  };

  const { run: runPrevChange } = useDebounceFn(prevChange, { wait: 300 });

  const nextChange = () => {
    const page = pageNum === totalPage ? totalPage : pageNum + 1;
    setPageNum(page);
    pageChange && pageChange(page);
    onChange && onChange(page, pageSize);
  };
  const { run: runNextChange } = useDebounceFn(nextChange, { wait: 300 });

  const jumpFirst = () => {
    setPageNum(1);
    pageChange && pageChange(1, pageSize);
    onChange && onChange(1, pageSize);
  };

  const { run: debounceJumpFirst } = useDebounceFn(jumpFirst, { wait: 300 });

  const jumpLast = () => {
    setPageNum(totalPage);
    pageChange && pageChange(totalPage, pageSize);
    onChange && onChange(totalPage, pageSize);
  };
  const { run: debounceJumpLast } = useDebounceFn(jumpLast, { wait: 300 });

  const sizeChange = (value: number) => {
    setPageNum(1);
    // pageChange && pageChange(1, pageSize);
    setPageSizeValue(value);
    pageSizeChange && pageSizeChange(1, value);
    onChange && onChange(1, value);
  };

  return hideOnSinglePage && total <= 10 ? (
    <div></div>
  ) : (
    <div className={clsx(styles.pagination, isMobile && styles.paginationMobile)}>
      <div className={styles.epPaginationLeft}>
        {showSizeChanger && (
          <>
            <span className="inline-block text-[12px] leading-[18px] text-[var(--text-item)]">Show：</span>
            <Select
              size="default"
              className={styles['custom-select-record']}
              defaultValue={pageSizeValue}
              suffixIcon={<DownArrow className={styles.rightArrow} />}
              popupClassName={styles.pagesize__select}
              options={options}
              dropdownMatchSelectWidth={64}
              onChange={sizeChange}
            />
            <span className="inline-block text-[12px] leading-[18px] text-[var(--text-item)]">Records</span>
          </>
        )}
      </div>
      <div className={styles.pagination__right}>
        <div className={styles.pagination__first}>
          <Button
            disabled={isFirstPage}
            type="primary"
            ghost
            className={styles['first-button']}
            onClick={debounceJumpFirst}>
            First
          </Button>
        </div>
        <div className={clsx(styles.pagination__prev, 'w-[32px]')}>
          <JumpButton
            disabled={isFirstPage}
            onChange={runPrevChange}
            className={styles.prev}
            svgComponent={<LeftArrow />}
          />
        </div>
        <div className={styles.pagination__page}>
          <div className="text-[12px] leading-[20px]">{`Page ${current || pageNum} of ${totalPage}`}</div>
        </div>
        <div className={styles.pagination__next}>
          <JumpButton
            disabled={isLastPage}
            onChange={runNextChange}
            className={styles.next}
            svgComponent={<RightArrow />}
          />
        </div>
        <div className={styles.pagination__last}>
          <Button
            disabled={isLastPage}
            type="primary"
            ghost
            className={styles['last-button']}
            onClick={debounceJumpLast}>
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
