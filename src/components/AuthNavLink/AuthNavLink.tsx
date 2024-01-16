import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCheckLoginAndToken } from 'hooks/useWalletSync';

const AuthNavLink = ({ to, ...props }: any & React.RefAttributes<HTMLAnchorElement>) => {
  const navigate = useRouter();

  const { login, isLogin } = useCheckLoginAndToken();
  return (
    <Link
      href={!isLogin ? '' : to}
      scroll={false}
      onClick={(event) => {
        if (!isLogin) {
          event.preventDefault();
          login({
            callBack: () => {
              navigate.push(to);
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
