import { Drawer } from 'antd';
import { useSelector, dispatch } from 'store/store';
import { setCollapsed } from 'store/reducer/layoutInfo';
import ItemsSider from '../ItemsSide/ItemsSide';
import styles from './index.module.css';
import Button from 'baseComponents/Button';

export default function FilterBtn({
  type = 'primary',
  position = 'bottom',
}: {
  type?: 'primary' | 'link' | 'text' | 'ghost' | 'default' | 'dashed' | undefined;
  position?: string;
}) {
  const {
    info: { isSmallScreen },
    layoutInfo: { isCollapsed },
  } = useSelector((store) => store);
  return (
    <>
      <Button
        type={type}
        className={`${styles['filter-btn']} ${position === 'top' ? styles['top'] : styles['bottom']}`}
        onClick={() => dispatch(setCollapsed(true))}>
        {position === 'top' ? 'filter' : 'Filter'}
      </Button>
      <Drawer
        className={`${styles['filter-btn-wrapper']} ${isSmallScreen ? styles['filter-btn-wrapper-mobile'] : ''}`}
        placement={'right'}
        closable={false}
        maskStyle={{ background: 'none' }}
        open={isCollapsed}>
        <ItemsSider />
      </Drawer>
    </>
  );
}
