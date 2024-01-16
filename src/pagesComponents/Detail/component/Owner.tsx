import { useRouter } from 'next/navigation';
import useDetailGetState from 'store/state/detailGetState';
import useGetState from 'store/state/getState';
import { OmittedType, getOmittedStr } from 'utils';
import useJumpExplorer from 'hooks/useJumpExplorer';

export default function Owner({ className }: { className?: string }) {
  const { infoState } = useGetState();
  const { detailInfo } = useDetailGetState();
  const { isSmallScreen } = infoState;
  const { nftInfo } = detailInfo;
  const nav = useRouter();
  const jump = useJumpExplorer();

  const toPageAccount = () => {
    if (nftInfo?.owner?.name?.endsWith?.('_AELF')) {
      jump('AELF', `/address/${nftInfo?.owner?.name}`);
      return;
    }
    if (nftInfo?.owner?.address) {
      nav.push(`/account/${nftInfo.owner.address}`);
    }
  };

  return nftInfo?.ownerCount && nftInfo?.ownerCount > 1 ? (
    <div
      className={`text-textSecondary whitespace-pre-wrap truncate font-medium ${
        isSmallScreen ? 'text-sm mt-[8px]' : 'text-base'
      }`}>
      <span>Owners</span>
      <span className="ml-[8px]">{nftInfo?.ownerCount}</span>
    </div>
  ) : nftInfo?.owner?.name ? (
    <div className={`text-textSecondary whitespace-pre-wrap truncate font-medium text-base ${className}`}>
      Owned by
      <span className="ml-[8px] text-brandNormal cursor-pointer" onClick={toPageAccount}>
        {getOmittedStr(nftInfo?.owner?.name, OmittedType.ADDRESS) || ''}
      </span>
    </div>
  ) : null;
}
