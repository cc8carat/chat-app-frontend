import { useRef, useEffect, useContext, createContext } from 'react';

import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  sendMessage: (message: string, room: string) => void;
  joinRoom: (room: string, name: string) => void;
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  connect: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const SocketContext = createContext({} as SocketContextProps);
export const useSocket = () => useContext(SocketContext);

const SocketState: React.FC = ({ children }) => {
  const socketRef = useRef<Socket>(io(`${process.env.REACT_APP_CHOK_SOCKET_SERVER}`));

  //const socketRef = useRef({} as Socket);

  //   useEffect(() => {
  //     socketRef.current = io(`${process.env.REACT_APP_CHOK_SOCKET_SERVER}`);
  //     socketRef.current.on('connect', () => console.log(socketRef?.current?.id));
  //     return () => {
  //       socketRef.current.disconnect();
  //     };
  //   }, []);

  useEffect(() => {
    socketRef.current.on('receive', (message) => {
      console.log(message);
    });
  });

  const sendMessage = (message: string, roomId: string) => {
    socketRef.current.emit('send', message, roomId);
  };

  const joinRoom = (roomId: string, name: string) => {
    socketRef.current.emit('join', roomId, (message: string) => {
      console.log(`You have checked in at ${name}`);
    });
  };

  //   const joinRoom = (roomId: string) => {
  //     socketRef.current.emit('join', roomId);
  //   };

  return <SocketContext.Provider value={{ sendMessage, joinRoom }}>{children}</SocketContext.Provider>;
};

export default SocketState;
