import BigNumber from 'bignumber.js';
import { GetBalance, GetTokenInfo } from 'contract/multiToken';
import { IGetBalanceParams, IGetTokenInfoParams } from 'contract/type';
import { setNftNumber } from 'store/reducer/detail/detailInfo';
import { store } from 'store/store';

export const getBalance = async ({ owner, symbol }: IGetBalanceParams, chainId: Chain) => {
  try {
    if (!owner || !symbol) return;
    const res = await GetBalance({ owner, symbol }, { chain: chainId });
    return res.balance;
  } catch (error) {
    return 0;
  }
};

export const getTokenInfo = async ({ symbol }: IGetTokenInfoParams, chainId: Chain) => {
  try {
    if (!symbol) return;
    const res = await GetTokenInfo({ symbol }, { chain: chainId });
    return {
      supply: res.supply, // Quantity issued
      totalSupply: res.totalSupply, // Quantity created
      decimals: res.decimals, //decimals
    };
  } catch (error) {
    return {
      supply: 0,
      totalSupply: 0,
    };
  }
};

const changeNftNumber = <T>(params: T) => {
  store.dispatch(setNftNumber(params));
};

export const getNFTNumber = async ({
  owner,
  nftSymbol,
  chainId,
}: {
  owner: string;
  nftSymbol?: string;
  chainId: Chain;
}) => {
  if (!owner) return;

  try {
    changeNftNumber({
      loading: true,
    });
    if (nftSymbol) {
      const res = await Promise.all([
        getBalance({ owner, symbol: 'ELF' }, chainId),
        getBalance({ owner, symbol: nftSymbol }, chainId),
        getTokenInfo({ symbol: nftSymbol }, chainId),
      ]);

      const nftDecimals = Number(res[2]?.decimals || 0);
      const nftQuantity = Math.floor(
        BigNumber(res[2]?.supply || 0)
          .dividedBy(10 ** nftDecimals)
          .toNumber(),
      );
      const nftTotalSupply = Math.floor(
        BigNumber(res[2]?.totalSupply || 0)
          .dividedBy(10 ** nftDecimals)
          .toNumber(),
      );

      const nftBalance = Math.floor(
        BigNumber(res[1] || 0)
          .dividedBy(10 ** nftDecimals)
          .toNumber(),
      );

      changeNftNumber({
        nftBalance,
        tokenBalance: res[0],
        nftQuantity,
        nftTotalSupply,
        nftDecimals,
        loading: false,
      });
    } else {
      const res = await getBalance({ owner, symbol: 'ELF' }, chainId);
      changeNftNumber({
        tokenBalance: res,
        loading: false,
      });
    }
  } catch (error) {
    changeNftNumber({
      loading: false,
    });
  }
};
