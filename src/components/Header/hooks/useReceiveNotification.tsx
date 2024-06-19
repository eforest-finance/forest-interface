import Socket from 'socket';
import { useEffect, useState } from 'react';

interface IReceiveMessageChange {
  hasChanged: boolean;
}

const useReceiveNotification = (address: string) => {
  const socket = Socket();
  console.log('socket--', socket);

  const [notifications, setNotifications] = useState<IReceiveMessageChange>();
  const fetchAndReceiveWs = () => {
    if (!socket) {
      return;
    }

    socket.registerHandler('ReceiveMessageChangeSignal', (data: IReceiveMessageChange) => {
      setNotifications(data);
      console.log('ReceiveMessageChangeSignal:', data);
    });

    socket.sendEvent('RequestMessageChangeSignal', address);
  };

  useEffect(() => {
    fetchAndReceiveWs();
  }, [address, socket]);

  return {
    notifications,
  };
};

export default useReceiveNotification;
