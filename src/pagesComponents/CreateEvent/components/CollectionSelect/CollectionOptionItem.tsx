import clsx from 'clsx';
import styles from './style.module.css';
import ImgLoading from 'components/ImgLoading';
import { COLLECTION_DEFAULT_IMG } from 'constants/FileConfig';
import DefaultImg from 'assets/images/events/collection-default.svg';
import CreateBtn from 'assets/images/events/create-btn.svg';

interface IOptionItemProps {
  onClickHandler?: () => void;
  selected?: boolean;
  onChange?: (data: any) => void;
  detail: {
    collectionName: string;
    symbol: string;
    logoImage: string;
  };
}

interface IOptionItemCustomProps {
  onClickHandler?: () => void;
  ImageComp: React.ReactNode;
  description: string;
}

export function CollectionOptionItem({ detail, onClickHandler, selected }: IOptionItemProps) {
  return (
    <div
      className={clsx(styles['option-item-custom'], selected && styles['selected'])}
      onMouseDown={(event) => {
        event.preventDefault();
        onClickHandler && onClickHandler();
      }}>
      <div className={styles['info-card']}>
        <ImgLoading
          className="w-16 h-16 rounded-md overflow-hidden bg-fillHoverBg"
          nextImageProps={{ width: 64, height: 64 }}
          src={detail.logoImage || COLLECTION_DEFAULT_IMG}
        />
        <div className="flex flex-col ml-6">
          <span className="text-base font-semibold leading-5 text-textPrimary">{detail?.collectionName || ''}</span>
          <span className="text-sm font-medium mt-2 text-textSecondary">Symbol {detail?.symbol || ''}</span>
        </div>
      </div>
    </div>
  );
}

export function OptionItemCustom({ onClickHandler, ImageComp, description }: IOptionItemCustomProps) {
  return (
    <div
      className={clsx(styles['option-item-custom'])}
      onMouseDown={(event) => {
        event.preventDefault();
        onClickHandler && onClickHandler();
      }}>
      <div className={styles['info-card']}>
        {ImageComp}
        <div className="flex flex-col ml-6">
          <span className="text-base font-semibold leading-5 text-textPrimary">{description}</span>
        </div>
      </div>
    </div>
  );
}

export function OptionItemForCreate({ onClickHandler }: Pick<IOptionItemCustomProps, 'onClickHandler'>) {
  return (
    <OptionItemCustom onClickHandler={onClickHandler} ImageComp={<CreateBtn />} description="Create a new collection" />
  );
}

export function OptionItemForChoose({ onClickHandler }: Pick<IOptionItemCustomProps, 'onClickHandler'>) {
  return (
    <OptionItemCustom onClickHandler={onClickHandler} ImageComp={<DefaultImg />} description="Choose a collection" />
  );
}
