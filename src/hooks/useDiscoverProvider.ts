import detectProvider from '@portkey/detect-provider';
import { IPortkeyProvider } from '@portkey/provider-types';
export default function useDiscoverProvider() {
  let detectProviderFunc = detectProvider;
  const discoverProvider = async () => {
    if (typeof detectProvider !== 'function') {
      const detectProviderModule = detectProvider as any;
      detectProviderFunc = detectProviderModule.default;
    }
    const provider: IPortkeyProvider | null = await detectProviderFunc();
    if (provider) {
      if (!provider.isPortkey) {
        throw new Error('Discover provider found, but check isPortkey failed');
      }
      return provider;
    } else {
      return null;
    }
  };
  return { discoverProvider };
}
