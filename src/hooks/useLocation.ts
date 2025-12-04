import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// example path: /#error=unauthorized_client&error_code=401error_description=Something+went+wrong

export function useLocation() {
  const [hash, setHash] = useState('');
  const [pathName, setPathName] = useState('');
  const { asPath } = useRouter();
  useEffect(() => {
    const path = (asPath as string).split('#')[0];
    const hash = (asPath as string).split('#')[1]; // error=unauthorized_client&error_code=401error_description=Something+went+wrong
    setHash(hash);
    setPathName(path);
    // const parsedHash = new URLSearchParams(hash);
    // const errorHash = parsedHash.get("error_description"); // Something went wrong
  }, []);

  return { hash, pathName };
}
