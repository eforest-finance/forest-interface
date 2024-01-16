import { List as AntdList } from 'antd';
import { ListItemMetaProps, ListItemProps } from 'antd/lib/list/Item';
import clsx from 'clsx';
import styles from './style.module.css';
import React, { ReactNode } from 'react';

export interface ListItemTypeProps extends ListItemProps {
  children?: ReactNode;
}

export function ListItemMeta(props: ListItemMetaProps) {
  const { children, className } = props;
  return (
    <AntdList.Item.Meta {...props} className={clsx(styles['forest-list-meta'], className)}>
      {children}
    </AntdList.Item.Meta>
  );
}

function ListItem(props: ListItemTypeProps) {
  const { children, className } = props;
  const ExtraCom =
    typeof props?.extra === 'string' ? (
      <div className="text-base text-textSecondary font-medium">{props?.extra}</div>
    ) : (
      props?.extra
    );

  return (
    <AntdList.Item {...props} className={clsx(styles['forest-list-item'], className)} extra={ExtraCom}>
      {children}
    </AntdList.Item>
  );
}

export default React.memo(ListItem);
