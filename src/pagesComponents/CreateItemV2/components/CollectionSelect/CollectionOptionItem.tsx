import clsx from 'clsx';
import styles from './style.module.css';
import { ImageEnhance } from 'components/ImgLoading';
import CreateBtn from 'assets/images/events/create-btn.svg';
import CollectionIcon from 'assets/images/icons/Collection.svg';

interface IOptionItemProps {
  onClickHandler?: () => void;
  selected?: boolean;
  onChange?: (data: any) => void;
  detail: {
    tokenName: string;
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
        <ImageEnhance className="!w-16 !h-16 rounded-md overflow-hidden bg-fillHoverBg" src={detail.logoImage} />
        <div className="flex flex-col ml-4">
          <span className="text-base font-semibold leading-5 text-textPrimary">{detail?.tokenName || ''}</span>
          <span className="text-sm font-medium mt-2 text-textSecondary">{detail?.symbol || ''}</span>
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
    <OptionItemCustom
      onClickHandler={onClickHandler}
      ImageComp={
        <div className="flex items-center justify-center w-16 h-16 border border-solid border-lineBorder rounded-md">
          <CollectionIcon className="w-4 h-4 fill-textPrimary" />
        </div>
      }
      description="Choose a collection"
    />
  );
}
