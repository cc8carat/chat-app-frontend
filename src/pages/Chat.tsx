import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
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
} from '@ionic/react';
import { paperPlaneOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';

import './Chat.css';

interface ServerToClientEvents {
  noArg: () => void;
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

const Chat: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();

  const { user } = useAuth();

  useEffect(() => {
    setSocket(io('http://localhost:6001'));
  }, []);

  //mock data
  const isEmpty = false;

  //mock data
  const [messages, setMessages] = useState<{ user: string; message: string; createAt: string }[]>([
    { user: 'chloe', message: 'Hello there', createAt: '10:04' },
    {
      user: 'thomas',
      message: 'sdkhg;adgalsjg;sdfng;salg;sfdgjs; ns;dnga;ghas;kdhgksljdfbgkajbglashdfkjsbdaglbadgb;vfblaibdglasjbgashdf;agdajdgasg',
      createAt: '2020-12-02',
    },
    { user: 'noOne', message: '你好', createAt: '2020-12-09' },
  ]);

  const contentRef = useRef<HTMLIonContentElement | null>(null);

  const handleTextChange = (e: CustomEvent) => {
    setText(e.detail.value);
  };

  const handleMessageSubmit = () => {
    setMessages((prev) => [...prev, { user: user.userName, message: text, createAt: '12:07' }]);
    setText('');
  };

  useEffect(() => {
    contentRef.current && contentRef.current.scrollToBottom(200);
  }, [messages]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='ion-text-center' color='primary'>
          <IonTitle>location</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollEvents={true} ref={contentRef}>
        <IonGrid>
          {messages.map((message, index) => {
            return (
              <IonRow key={index} className='ion-margin'>
                <IonCol
                  className={message.user === user.userName ? 'message my-message' : 'message other-message'}
                  offset={message.user === user.userName ? '3' : '0'}
                  size='9'
                >
                  <div>{message.user === user.userName ? 'You' : message.user}</div>
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
