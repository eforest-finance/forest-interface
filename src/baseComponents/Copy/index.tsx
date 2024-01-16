import { message } from 'antd';
import { ReactComponent as CopyIcon } from 'assets/images/copy.svg';
import { useCopyToClipboard } from 'react-use';
import clsx from 'clsx';
export default function Copy({ value, className }: { value: string; className?: string }) {
  const [, copyToClipboard] = useCopyToClipboard();
  const handleCopy = () => {
    try {
      copyToClipboard(value);
      message.success('Copied Successfully');
    } catch (e) {
      message.error('Copy failed, please copy by yourself.');
    }
  };
  return <CopyIcon className={clsx(className, 'cursor-pointer closeIcon')} onClick={handleCopy} />;
}
