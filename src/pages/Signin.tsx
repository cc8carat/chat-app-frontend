import { IonButton, IonCol, IonContent, IonInput, IonItem, IonLabel, IonPage, IonRouterLink, IonRow } from '@ionic/react';

import './Sign.css';

const Signin: React.FC = () => {
  return (
    <IonPage>
      <IonContent className='sign no-scroll'>
        <IonRow className='sign-container ion-padding ion-align-items-center'>
          <IonCol>
            <h1>Connect with your community!</h1>
            <p>Log in to continue</p>
            <form className='sign-form ion-padding'>
              <IonItem className='form-input ion-margin-bottom'>
                <IonLabel className='sign-lable' position='floating'>
                  Email
                </IonLabel>
                <IonInput required={true} type='email'></IonInput>
              </IonItem>
              <IonItem className='form-input ion-margin-bottom'>
                <IonLabel className='sign-lable' position='floating'>
                  Password
                </IonLabel>
                <IonInput required={true} type='password'></IonInput>
              </IonItem>

              <div className='sign-btn'>
                <IonButton expand='block' shape='round'>
                  Sign in
                </IonButton>
                <p>
                  Don't have an account?
                  <IonRouterLink routerLink='/signup'>
                    <span className='sign-link'> Sign up</span>
                  </IonRouterLink>
                </p>
              </div>
            </form>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Signin;
