import CollapsedIcon from 'assets/images/explore/collapsed.svg';
import style from './style.module.css';
import useResponsive from 'hooks/useResponsive';

interface IFilterButtonProps {
  onClick: () => void;
}

export function FilterButton({ onClick }: IFilterButtonProps) {
  const { isLG } = useResponsive();

  return (
    <div className={style['filter-btn']} onClick={onClick}>
      <CollapsedIcon />
      {!isLG ? <span className={style['btn-text']}>Filters</span> : null}
    </div>
  );
}
