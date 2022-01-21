import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useStorage } from '@capacitor-community/storage-react';
import axios from 'axios';
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

type ChatParams = {
  id: string;
  name: string;
};

const Chat: React.FC = () => {
  const [text, setText] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { id: roomId, name } = useParams<ChatParams>();
  const location = useLocation();
  const { get } = useStorage();
  const { sendMessage, joinRoom, newMessage, leaveRoom, userCount } = useSocket();
  const contentRef = useRef<HTMLIonContentElement | null>(null);

  useEffect(() => {
    joinRoom(roomId, name);
    const getAllMessages = async () => {
      try {
        const token = await get('token');
        if (token) {
          const { data } = await axios.get(`${process.env.REACT_APP_CHOK_API}/message/${roomId}`, {
            headers: { Authorization: token },
          });
          const newMessages = data.map(
            ({ user: { name, _id }, createdAt, text }: { user: { name: string; _id: string }; createdAt: string; text: string }) => {
              return { userName: name, userId: _id, message: text, createdAt: createdAt };
            }
          );
          setMessages(newMessages);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAllMessages();
  }, []);

  useEffect(() => {
    newMessage && setMessages((prev) => [...prev, newMessage]);
  }, [newMessage]);

  useEffect(() => {
    contentRef.current && contentRef.current.scrollToBottom(200);
  }, [messages]);

  useEffect(() => {
    location.pathname !== `/protected/chat/${name}/${roomId}` && leaveRoom(roomId);
    setMessages([]);
  }, [location]);

  const handleTextChange = (e: CustomEvent) => {
    setText(e.detail.value);
  };

  const handleMessageSubmit = () => {
    const sendMessageToDatabase = async () => {
      try {
        const token = await get('token');
        if (token) {
          await axios.post(
            `${process.env.REACT_APP_CHOK_API}/message/${roomId}`,
            { text },
            {
              headers: { Authorization: token },
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (text) {
      setMessages((prev) => [...prev, { userId: user.userId, userName: user.userName, message: text, createdAt: Date() }]);
      sendMessage({ userId: user.userId, userName: user.userName, message: text, createdAt: Date() }, roomId);
      setText('');
      sendMessageToDatabase();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='ion-text-center' color='primary'>
          <IonButtons slot='start'>
            <IonBackButton text='' defaultHref='/protected' />
          </IonButtons>
          <IonTitle className='chat-title'>
            ({userCount}){name}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollEvents={true} ref={contentRef}>
        <IonGrid>
          <IonRow className='ion-justify-content-center'>
            <div className='welcome-message'>You have checked in at {name}</div>
          </IonRow>
          {messages &&
            messages.map((message, index) => {
              return (
                <IonRow key={index}>
                  <IonCol
                    className={message.userName === user.userName ? 'message my-message' : 'message other-message'}
                    offset={message.userName === user.userName ? '3' : '0'}
                    size='9'
                  >
                    <div className='user-name'>{message.userName !== user.userName && message.userName}</div>
                    <div className='chat-bubble'>
                      <div className='chat-text'>{message.message}</div>
                      <div className='time  ion-text-right'>{formatDate(message.createdAt)}</div>
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
                <IonIcon icon={paperPlaneOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Chat;
