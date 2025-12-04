import { checkUserName } from 'api/fetch';

export default function useUsernameCheck() {
  const check = async (username: string) => {
    const result = await checkUserName({ name: username });
    return result;
  };
  return check;
}
