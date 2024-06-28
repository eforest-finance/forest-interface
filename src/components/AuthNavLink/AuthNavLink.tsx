import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';
import useGetState from 'store/state/getState';

const AuthNavLink = ({ to, delay, ...props }: any & React.RefAttributes<HTMLAnchorElement>) => {
  const navigate = useRouter();
  const walletAddress = useRef('');
  const { walletInfo } = useGetState();
  const href = useRef(to);

  useEffect(() => {
    walletAddress.current = walletInfo.address;
  }, [walletInfo.address]);

  useEffect(() => {
    href.current = to;
  }, [to]);

  const { login, isLogin } = useCheckLoginAndToken();

  return (
    <Link
      href={!isLogin ? '' : href.current}
      scroll={false}
      onClick={(event) => {
        if (!isLogin) {
          event.preventDefault();
          login({
            callBack: () => {
              const timer = setInterval(() => {
                if (walletAddress.current) {
                  clearInterval(timer);
                  navigate.push(href.current);
                }
              }, 100);
            },
          });
        }
      }}
      {...props}>
      {props.children}
    </Link>
  );
};

export default AuthNavLink;
