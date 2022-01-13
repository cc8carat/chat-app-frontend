import { useState, useRef } from 'react';
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

const Chat: React.FC = () => {
  const [text, setText] = useState<string>('');
  const { isAuthenticated } = useAuth();

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
  // moke user
  const currentUser = 'chloe';

  const scrollToBottom = () => {
    contentRef.current && contentRef.current.scrollToBottom(200);
  };

  const handleTextChange = (e: CustomEvent) => {
    setText(e.detail.value);
    setTimeout(() => scrollToBottom(), 1000);
  };

  const sendMessageHandler = () => {
    setMessages((prev) => [...prev, { user: currentUser, message: text, createAt: '12:07' }]);
  };

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
                  className={message.user === currentUser ? 'message my-message' : 'message other-message'}
                  offset={message.user === currentUser ? '3' : '0'}
                  size='9'
                >
                  <div>{message.user}</div>
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
              <IonButton className='message-btn' expand='block' disabled={isEmpty} shape='round' onClick={sendMessageHandler}>
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
