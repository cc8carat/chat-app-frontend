import { useRef, useEffect, useState, useContext, createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../interfaces/types';
import { useAuth } from './AuthContext';

interface SocketContextProps {
  sendMessage: (message: Message, roomId: string) => void;
  joinRoom: (roomId: string, name: string) => void;
  newMessage: Message | null;
  leaveRoom: (roomId: string) => void;
  userCount: number;
  welcomeMessage: string | null;
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  receive: (message: any) => void;
  countUser: (userCount: any) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  connect: () => void;
  send: (message: any, roomId: string) => void;
  join: (roomId: string, callback: (userCount: number) => void) => void;
  message: (message: any) => void;
  leave: (roomId: string, callback: (userCount: number) => void) => void;
}

const SocketContext = createContext({} as SocketContextProps);
export const useSocket = () => useContext(SocketContext);

const SocketState: React.FC = ({ children }) => {
  const [newMessage, setNewmessage] = useState<Message | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const socketRef = useRef({} as Socket<ServerToClientEvents, ClientToServerEvents>);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      socketRef.current = io(`${process.env.REACT_APP_CHOK_SOCKET_SERVER}`);
      socketRef.current.on('connect', () => console.log(socketRef.current.id));
      socketRef.current.on('receive', (message) => {
        setNewmessage(message);
      });
      socketRef.current.on('countUser', (userCount) => {
        setUserCount(userCount);
      });
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [isAuthenticated]);

  const sendMessage = (message: Message, roomId: string) => {
    socketRef.current.emit('send', message, roomId);
  };

  const joinRoom = (roomId: string, name: string) => {
    socketRef.current.emit('join', roomId, (userCount) => {
      setUserCount(userCount);
      setWelcomeMessage(`You have checked in at ${name}`);
    });
  };

  const leaveRoom = (roomId: string) => {
    socketRef.current.emit(`leave`, roomId, (userCount) => setUserCount(userCount));
  };
  return (
    <SocketContext.Provider value={{ sendMessage, joinRoom, newMessage, leaveRoom, userCount, welcomeMessage }}>{children}</SocketContext.Provider>
  );
};

export default SocketState;
