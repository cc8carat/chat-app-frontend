import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const [text, setText] = useState<string>('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [messages, setMessages] = useState<{ userId: string; userName: string; message: string; createAt: string }[]>([]);
  const [newMessage, setNewMessages] = useState('');
  const isEmpty = false;

  const { user } = useAuth();
  const { sendMessage, joinRoom } = useSocket();

  const { id: roomId } = useParams<ChatParams>();

  const contentRef = useRef<HTMLIonContentElement | null>(null);

  const handleTextChange = (e: CustomEvent) => {
    setText(e.detail.value);
  };

  const handleMessageSubmit = () => {
    setMessages((prev) => [...prev, { userId: user.userId, userName: user.userName, message: text, createAt: '12:07' }]);
    sendMessage(text, roomId);

    setText('');
  };

  useEffect(() => {
    joinRoom(roomId, 'Home');
  }, []);

  useEffect(() => {
    contentRef.current && contentRef.current.scrollToBottom(200);
  }, [messages]);

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
          {messages.map((message, index) => {
            return (
              <IonRow key={index} className='ion-margin'>
                <IonCol
                  className={message.userName === user.userName ? 'message my-message' : 'message other-message'}
                  offset={message.userName === user.userName ? '3' : '0'}
                  size='9'
                >
                  <div>{message.userName === user.userName ? 'You' : message.userName}</div>
                  <div>{message.message}</div>
                  <div className='time  ion-text-right'>{message.createAt}</div>
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
              <IonButton className='message-btn' type='submit' expand='block' disabled={isEmpty} shape='round' onClick={handleMessageSubmit}>
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
