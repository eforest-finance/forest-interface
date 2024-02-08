import { IPortkeyProvider } from '@portkey/provider-types';
import { detectDiscoverProvider } from 'aelf-web-login';

export default function useDiscoverProvider() {
  const discoverProvider = async () => {
    const provider: IPortkeyProvider | null = await detectDiscoverProvider();
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
