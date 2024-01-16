import { Button, Divider, Drawer, Menu, MenuProps } from 'antd';
import styles from './style.module.css';
import clsx from 'clsx';
import { useMemo } from 'react';
import CloseBtn from 'assets/images/explore/close.svg';
import ExpandIcon from 'assets/images/explore/item-arrow-up.svg';

function CollapseForPC(props: MenuProps) {
  return (
    <Menu
      {...props}
      expandIcon={
        <div>
          <ExpandIcon className={clsx(styles.menu__expand__icon)} />
        </div>
      }
      className={`${styles['items-side-menu']}`}
      selectable={false}
      mode="inline"
    />
  );
}

interface IDropMenu extends MenuProps {
  showDropMenu: boolean;
  onCloseHandler: () => void;
  clearAll: () => void;
  doneChange: () => void;
  afterOpenChange?: () => void;
  titleTxt?: string;
  wrapClassName?: string;
}

const CollapseForPhone = ({
  showDropMenu,
  items,
  onCloseHandler,
  doneChange,
  clearAll,
  titleTxt = 'Filter',
  ...params
}: IDropMenu) => {
  const clearAllDom = useMemo(() => {
    return (
      <>
        <Divider className="!m-0 !mt-0 border-box" />
        <div className={styles['clear-all']}>
          <Button className={clsx(styles['range-default-button'], 'flex-1 !h-[56px] rounded-lg')} onClick={clearAll}>
            Clear All
          </Button>
          <Button className="!h-[56px] flex-1 font-medium ml-[16px] rounded-lg" type="primary" onClick={doneChange}>
            Done
          </Button>
        </div>
      </>
    );
  }, [clearAll, doneChange]);
  return (
    <Drawer
      className={`${styles['elf-dropdown-phone-dark']} ${params.wrapClassName || ''}`}
      placement="top"
      maskClosable={false}
      title={
        <div className="flex items-center justify-between pr-[20px]">
          <span className="text-[24px] leading-[32px] font-medium text-[var(--text-item)]">{titleTxt}</span>
          <CloseBtn className={styles.close__button} onClick={onCloseHandler} />
        </div>
      }
      closeIcon={null}
      push={false}
      open={showDropMenu}
      height={'100%'}
      footer={clearAllDom}
      headerStyle={{ paddingLeft: 16, height: 64, paddingTop: 24, paddingBottom: 24, paddingRight: 0 }}
      bodyStyle={{ padding: 0 }}
      footerStyle={{ padding: 0, border: 'none' }}
      onClose={onCloseHandler}>
      <div className="px-[8px] pt-[16px]">
        <CollapseForPC items={items} {...params} />
      </div>
    </Drawer>
  );
};

export { CollapseForPC, CollapseForPhone };
