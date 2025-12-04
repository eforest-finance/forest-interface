import { useSelector, dispatch } from 'store/store';
import { setTheme } from 'store/reducer/info';

export const useTheme = (): [string, (theme: string) => void] => {
  const { theme: storeTheme } = useSelector((store) => store.info);
  const theme = storeTheme || 'light';
  const changeTheme = (theme: string) => {
    dispatch(setTheme(theme));
  };
  return [theme, changeTheme];
};
