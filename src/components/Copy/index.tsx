import { useCopyToClipboard } from 'react-use';
import React from 'react';
import CopyIcon from 'assets/images/copy.svg';
import { message } from 'antd';
export default function Copy({
  toCopy,
  children,
  className,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [, setCopied] = useCopyToClipboard();
  return (
    <span
      onClick={() => {
        setCopied(toCopy);
        message.success('Copied');
      }}
      className={className}>
      {/* {isCopied.value ? (
        'Copied'
      ) : ( */}
      <>
        <span className="flex w-[1em] h-[1em]">
          <CopyIcon />
        </span>
        {children}
      </>
      {/* )} */}
    </span>
  );
}
