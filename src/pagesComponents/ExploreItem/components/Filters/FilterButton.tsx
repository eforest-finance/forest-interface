import CollapsedIcon from 'assets/images/explore/collapsed.svg';
import style from './style.module.css';
import useResponsive from 'hooks/useResponsive';

interface IFilterButtonProps {
  onClick: () => void;
  badge: number | string;
  showBadge?: boolean;
}

export function FilterButton({ onClick, badge, showBadge }: IFilterButtonProps) {
  const { isLG } = useResponsive();

  return (
    <div className={style['filter-btn']} onClick={onClick}>
      <CollapsedIcon />
      {!isLG ? <span className={style['btn-text']}>Filters</span> : null}
      {showBadge ? (
        <span className=" absolute left-8 -top-2 px-1.5 bg-textPrimary text-textWhite text-xs font-medium rounded-3xl">
          {badge}
        </span>
      ) : null}
    </div>
  );
}
