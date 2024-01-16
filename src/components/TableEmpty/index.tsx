import { Empty } from 'antd';
import { memo } from 'react';
import styles from './style.module.css';
import Button from 'baseComponents/Button';

export const enum emptyEnum {
  nft = 'nft',
  collection = 'collection',
}

const EMPTY_TYPE = {
  [emptyEnum.collection]: {
    text: 'collections',
    button_text: 'Collections',
  },
  [emptyEnum.nft]: {
    text: 'NFTs',
    button_text: 'items',
  },
};

function TableEmpty({
  searchText,
  type = emptyEnum.collection,
  clearFilter,
}: {
  searchText: string;
  type?: emptyEnum;
  clearFilter?: () => void;
}) {
  return (
    <div className={styles.empty__table}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{
          height: !searchText ? 80 : 0,
        }}
        description={
          <div className="text-[var(--table-sort-hover)] text-[16px] font-medium leading-[24px] mt-[8px]">
            {!searchText ? `No ${EMPTY_TYPE[type].text} yet` : `No ${EMPTY_TYPE[type].text} found`}
          </div>
        }>
        {searchText && (
          <Button size="ultra" type="primary" onClick={clearFilter}>
            Back to All {EMPTY_TYPE[type].button_text}
          </Button>
        )}
      </Empty>
    </div>
  );
}

export default memo(TableEmpty);
