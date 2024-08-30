import { INftInfo } from 'types/nftTypes';

const isTokenIdReuse = (nftInfo: INftInfo) => {
  const symbolNumber = nftInfo?.nftSymbol && nftInfo.nftSymbol.split('-')[1];
  if (symbolNumber) {
    const totalSupply = nftInfo?.totalQuantity;
    const decimals = Number(nftInfo.decimals);
    let items = totalSupply;
    if (decimals > 0) {
      items = totalSupply / 10 ** Number(decimals);
    }
    return symbolNumber !== '0' && items > 1; // true is 1155; false is 721
  } else {
    console.error('Invalid symbol.');
  }
};

const isERC721 = (nftInfo: INftInfo) => {
  return !isTokenIdReuse(nftInfo);
};

export default isTokenIdReuse;

export { isERC721 };
