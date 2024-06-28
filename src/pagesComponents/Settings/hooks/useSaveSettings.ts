import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { saveUserSettings } from 'api/fetch';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import useGetState from 'store/state/getState';

export default function useSaveSettings() {
  const navigator = useRouter();
  const { walletInfo } = useGetState();
  const save = async (parameter: any) => {
    await saveUserSettings(parameter)
      .then(() => {
        message.destroy();
        message.success('Success');
        setTimeout(() => {
          navigator.push(`/account/${walletInfo.address}#Created`);
        }, 1500);
      })
      .catch((e) => {
        message.destroy();
        message.error(e?.error || e?.message || e?.toString() || DEFAULT_ERROR);
        return;
      });
  };
  return save;
}
