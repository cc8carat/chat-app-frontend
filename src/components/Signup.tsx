import { IonButton, IonCard, IonCol, IonContent, IonGrid, IonItem, IonPage, IonRow } from '@ionic/react';
import cover from '../pictures/cover.jpg';

import './Signup.css';

const Signup: React.FC = () => {
  return (
    <IonPage>
      <IonContent className='no-scroll'>
        <div className='container ion-padding'>
          <IonCard className='img-card-container'>
            <img src={cover} alt='cover picture' />
          </IonCard>
          <div className='text-container'>
            <p className='ion-text-center'>Connect with your community!</p>
            <div className='ion-padding'>
              <IonButton expand='block' shape='round'>
                Sign Up
              </IonButton>
            </div>
            <div className='ion-padding'>
              <IonButton expand='block' shape='round'>
                Sign In
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
