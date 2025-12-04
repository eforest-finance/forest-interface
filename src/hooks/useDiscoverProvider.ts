// import { IPortkeyProvider } from '@portkey/provider-types';
// import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { IPortkeyProvider, MethodsWallet } from '@portkey/provider-types';
import elliptic from 'elliptic';
import { useCallback } from 'react';
import { zeroFill } from 'utils/calculate';
import AElf from 'aelf-sdk';

const ec = new elliptic.ec('secp256k1');

export default function useDiscoverProvider() {
  const { walletInfo } = useConnectWallet();
  const discoverProvider = useCallback(async () => {
    const provider: IPortkeyProvider | null = walletInfo?.extraInfo?.provider;
    if (provider) {
      if (!provider?.isPortkey) {
        throw new Error('Discover provider found, but check isPortkey failed');
      }
      return provider;
    } else {
      return null;
    }
  }, [walletInfo?.extraInfo?.provider]);

  const getSignatureAndPublicKey = useCallback(
    async (data: string, hexData: string) => {
      const provider = await discoverProvider();
      if (!provider || !provider?.request) throw new Error('Discover not connected');
      const isSupportManagerSignature = (provider as any).methodCheck('wallet_getManagerSignature');
      const signature = await provider.request({
        method: isSupportManagerSignature ? 'wallet_getManagerSignature' : MethodsWallet.GET_WALLET_SIGNATURE,
        payload: isSupportManagerSignature ? { hexData } : { data },
      });
      if (!signature || signature.recoveryParam == null) return {};
      const signatureStr = [
        signature.r.toString(16, 64),
        signature.s.toString(16, 64),
        `0${signature.recoveryParam.toString()}`,
      ].join('');

      let publicKey;
      if (isSupportManagerSignature) {
        publicKey = ec.recoverPubKey(
          Buffer.from(AElf.utils.sha256(hexData), 'hex'),
          signature,
          signature.recoveryParam,
        );
      } else {
        publicKey = ec.recoverPubKey(Buffer.from(data.slice(0, 64), 'hex'), signature, signature.recoveryParam);
      }

      const pubKey = ec.keyFromPublic(publicKey).getPublic('hex');

      return { pubKey, signatureStr };
    },
    [discoverProvider],
  );

  return { discoverProvider, getSignatureAndPublicKey };
}
