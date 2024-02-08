import { DropState, IDropQuotaResponse } from 'api/types';
import BigNumber from 'bignumber.js';
import { MintStateType } from '../component/DropsMint';

export const getMintState = (dropQuota: IDropQuotaResponse | null, mintPrice?: string) => {
  const limitBig = new BigNumber(dropQuota?.addressClaimLimit || 0);
  const amountBig = new BigNumber(dropQuota?.addressClaimAmount || 0);
  const claimAmountBig = new BigNumber(dropQuota?.claimAmount || 0);
  const totalAmountBig = new BigNumber(dropQuota?.totalAmount || 0);
  const mintPriceBig = new BigNumber(mintPrice || 0);
  switch (dropQuota?.state) {
    case DropState.Upcoming:
      return MintStateType.Upcoming;
    case DropState.Live:
      if (claimAmountBig.isEqualTo(totalAmountBig)) {
        return MintStateType.SoldOut;
      } else {
        if (amountBig.isEqualTo(limitBig)) {
          return MintStateType.Minted;
        } else {
          if (mintPriceBig.isEqualTo(0)) {
            return MintStateType.MintFree;
          } else {
            return MintStateType.Mint;
          }
        }
      }
    case DropState.End:
      return MintStateType.SoldOut;
    default:
      return MintStateType.SoldOut;
  }
};
