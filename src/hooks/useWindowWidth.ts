import { useWindowSize } from 'react-use';
import useDebounce from './useDebounce';

export default function useWindowWidth() {
  const { width } = useWindowSize();
  const value = useDebounce(width, 300);
  return value;
}
