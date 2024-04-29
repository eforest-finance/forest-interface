import { INftCollectionInfo } from 'hooks/useIsMinter';
import styles from './styles.module.css';
import ElfIcon from 'assets/images/explore/elf';
import LinkIcon from 'assets/images/explore/link.svg';
import { OmittedType, addPrefixSuffix, getOmittedStr } from 'utils';
import useResponsive from 'hooks/useResponsive';
import { Ellipsis } from 'antd-mobile';
import DownIcon from 'assets/images/explore/more-down.svg';
import UpIcon from 'assets/images/explore/show-up.svg';
import useJumpExplorer from 'hooks/useJumpExplorer';
import { ImageEnhance } from 'components/ImgLoading';
import clsx from 'clsx';
import Copy from 'components/Copy';

function SeedImg({ collectionsInfo }: { collectionsInfo?: INftCollectionInfo }) {
  const { isLG } = useResponsive();
  return (
    <div className="mdl:w-[120px] mdl:h-[120px] w-[80Px] rounded-[12px] h-[80Px] mr-[32px]">
      <ImageEnhance
        className={clsx(isLG ? '!w-20 !h-20' : 'w-[120px] h-[120px]', '!rounded-lg')}
        src={collectionsInfo?.logoImage || ''}
      />
    </div>
  );
}

function SeedName({ collectionsInfo }: { collectionsInfo?: INftCollectionInfo }) {
  const jump = useJumpExplorer();
  return (
    <div className="seed__name">
      <div className="text-[24px] mb-[2px] mdl:mb-0 mdl:text-[40px] break-words leading-[32px] mdl:leading-[48px] font-semibold text-[var(--text-item)]">
        {collectionsInfo?.tokenName}
      </div>
      <div className="flex items-center">
        <span className="text-[14px] leading-[22px] text-[var(--address-text)]">Created by</span>
        <span
          className="text-[14px] cursor-pointer ml-[8px] leading-[22px] font-semibold text-[var(--brand-base)]"
          onClick={() => {
            jump(
              collectionsInfo?.chainId || '',
              `/address/${addPrefixSuffix(collectionsInfo?.creatorAddress || '', collectionsInfo?.chainId)}`,
            );
          }}>
          {addPrefixSuffix(
            getOmittedStr(collectionsInfo?.creatorAddress || '', OmittedType.CUSTOM, {
              prevLen: 4,
              endLen: 4,
              limitLen: 17,
            }),
            collectionsInfo?.chainId,
          )}
        </span>
        <Copy
          className="copy-svg pl-[4px]"
          toCopy={addPrefixSuffix(collectionsInfo?.creatorAddress || '', collectionsInfo?.chainId)}
        />
      </div>
    </div>
  );
}
function SeedLink({ collectionsInfo }: { collectionsInfo?: INftCollectionInfo }) {
  const jump = useJumpExplorer();
  return (
    <div className="flex items-center justify-center">
      <div className="flex cursor-pointer items-center w-[40px] h-[40px] justify-center">
        <ElfIcon
          onClick={() => {
            jump(collectionsInfo?.issueChainId || '', `/token/${collectionsInfo?.symbol}`);
          }}
        />
      </div>
      {collectionsInfo?.externalLink && (
        <div className="flex cursor-pointer items-center w-[40px] mdb:ml-[24px] ml-[16px] h-[40px] justify-center">
          <a
            href={collectionsInfo?.externalLink}
            className={styles.link__icon}
            target="_blank"
            rel="noopener noreferrer">
            <LinkIcon />
          </a>
        </div>
      )}
    </div>
  );
}

export default function CollectionsInfo({ collectionsInfo }: { collectionsInfo?: INftCollectionInfo }) {
  const { isLG } = useResponsive();
  return (
    <div className={styles.collection__info}>
      {isLG ? (
        <div>
          <div className="flex items-start justify-between">
            <SeedImg collectionsInfo={collectionsInfo} />
            <SeedLink collectionsInfo={collectionsInfo} />
          </div>
          <div className="mt-[16px]">
            <SeedName collectionsInfo={collectionsInfo} />
          </div>
        </div>
      ) : (
        <div className="header flex items-center justify-between">
          <div className="seed__info flex items-center">
            <SeedImg collectionsInfo={collectionsInfo} />
            <SeedName collectionsInfo={collectionsInfo} />
          </div>
          <SeedLink collectionsInfo={collectionsInfo} />
        </div>
      )}
      {collectionsInfo?.description && (
        <div className="inline-flex w-full description mt-[16px]">
          <Ellipsis
            rows={2}
            className="mdl:w-[75%] w-full whitespace-pre-wrap text-[14px] leading-[22px] text-[var(--address-text)]"
            direction="end"
            expandText={
              <span className="inline-flex items-center ml-[4px]">
                Show more <DownIcon />
              </span>
            }
            collapseText={
              <span className="inline-flex items-center ml-[4px]">
                Show less <UpIcon />
              </span>
            }
            content={collectionsInfo?.description}
          />
        </div>
      )}
    </div>
  );
}
