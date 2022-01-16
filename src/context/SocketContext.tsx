import { useRef, useEffect, useState, useContext, createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../interfaces/types';
import { useAuth } from './AuthContext';

interface SocketContextProps {
  sendMessage: (message: Message, roomId: string) => void;
  joinRoom: (roomId: string, name: string) => void;
  newMessage: Message | null;
  leaveRoom: (roomId: string) => void;
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  receive: (message: any) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  connect: () => void;
  send: (message: any, roomId: string) => void;
  join: (roomId: string, callback: (message: string) => void) => void;
  message: (message: any) => void;
  leave: (roomId: string) => void;
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
  const [newMessage, setNewmessage] = useState<Message | null>(null);
  const socketRef = useRef({} as Socket<ServerToClientEvents, ClientToServerEvents>);
  const { user } = useAuth();

  useEffect(() => {
    socketRef.current = io(`${process.env.REACT_APP_CHOK_SOCKET_SERVER}`);
    socketRef.current.on('connect', () => console.log(socketRef.current.id));
    socketRef.current.on('receive', (message) => {
      setNewmessage(message);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (message: Message, roomId: string) => {
    socketRef.current.emit('send', message, roomId);
  };

  const joinRoom = (roomId: string, name: string) => {
    socketRef.current.emit('join', roomId, (message: string) => {
      console.log(`You have checked in at ${name}`);
    });
  };

  const leaveRoom = (roomId: string) => {
    socketRef.current.emit(`leave`, roomId);
  };
  return <SocketContext.Provider value={{ sendMessage, joinRoom, newMessage, leaveRoom }}>{children}</SocketContext.Provider>;
};

export default SocketState;
