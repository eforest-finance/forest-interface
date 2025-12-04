import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SignalR from './signalr';

export default function Socket() {
  // const [error, setError] = useState<any>(null);
  const [socket, setSocket] = useState<SignalR | null>(null);
  const pathName = usePathname();
  useEffect(() => {
    const signalR = new SignalR({ url: '/signalr-hubs/market' });
    // if (error !== false) {
    signalR
      .initAndStart()
      .then(() => {
        setSocket(signalR);
        // setError(false);
      })
      .catch(() => {
        setSocket(signalR);
        // setError(e);
      });
    // }
  }, [pathName]);

  return socket;
}
