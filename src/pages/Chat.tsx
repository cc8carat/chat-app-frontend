import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { paperPlaneOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Message } from '../interfaces/types';
import formatDate from '../utils/formatDate';

import './Chat.css';

interface ServerToClientEvents {
  welcome: (message: string) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

type ChatParams = {
  id: string;
};

const Chat: React.FC = () => {
  const [text, setText] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { id: roomId } = useParams<ChatParams>();
  const location = useLocation();
  const { sendMessage, joinRoom, newMessage, leaveRoom } = useSocket();
  const contentRef = useRef<HTMLIonContentElement | null>(null);

  useEffect(() => {
    joinRoom(roomId, 'Home');
  }, []);

  useEffect(() => {
    newMessage && setMessages((prev) => [...prev, newMessage]);
  }, [newMessage]);

  useEffect(() => {
    contentRef.current && contentRef.current.scrollToBottom(200);
  }, [messages]);

  useEffect(() => {
    location.pathname !== `/protected/chat/${roomId}` && leaveRoom(roomId);
    setMessages([]);
  }, [location]);

  const handleTextChange = (e: CustomEvent) => {
    setText(e.detail.value);
  };

  const handleMessageSubmit = () => {
    if (text) {
      setMessages((prev) => [...prev, { userId: user.userId, userName: user.userName, message: text, createAt: Date() }]);
      sendMessage({ userId: user.userId, userName: user.userName, message: text, createAt: Date() }, roomId);
      setText('');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='ion-text-center' color='primary'>
          <IonButtons slot='start'>
            <IonBackButton text='' />
          </IonButtons>
          <IonTitle>location</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollEvents={true} ref={contentRef}>
        <IonGrid>
          {messages &&
            messages.map((message, index) => {
              return (
                <IonRow key={index} className='ion-margin'>
                  <IonCol
                    className={message.userName === user.userName ? 'message my-message' : 'message other-message'}
                    offset={message.userName === user.userName ? '3' : '0'}
                    size='9'
                  >
                    <div className='user-name'>{message.userName === user.userName ? 'You' : message.userName}</div>
                    <div className='chat-bubble'>
                      <div className='chat-text'>{message.message}</div>
                      <div className='time  ion-text-right'>{formatDate(message.createAt)}</div>
                    </div>
                  </IonCol>
                </IonRow>
              );
            })}
        </IonGrid>
      </IonContent>

      <IonFooter>
        <IonToolbar color='light'>
          <IonRow className='ion-align-items-center'>
            <IonCol size='10'>
              <IonTextarea className='message-textarea' maxlength={4000} autoGrow={true} rows={1} value={text} onIonChange={handleTextChange} />
            </IonCol>

            <IonCol size='2'>
              <IonButton className='message-btn' type='submit' expand='block' disabled={!text} shape='round' onClick={handleMessageSubmit}>
                <IonIcon icon={paperPlaneOutline} slot='icon-only' />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Chat;
