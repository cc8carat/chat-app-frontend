import { IonButton, IonCol, IonContent, IonInput, IonItem, IonLabel, IonPage, IonRouterLink, IonRow } from '@ionic/react';

import './Sign.css';

const Signup: React.FC = () => {
  return (
    <IonPage>
      <IonContent className='sign no-scroll'>
        <IonRow className='sign-container ion-padding ion-align-items-center'>
          <IonCol>
            <h1>Connect with your community!</h1>
            <p>Create an account</p>
            <form className='ion-padding'>
              <IonItem className='ion-margin-bottom'>
                <IonLabel className='sign-lable' position='floating'>
                  Name
                </IonLabel>
                <IonInput required={true} type='text'></IonInput>
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonLabel className='sign-lable' position='floating'>
                  Email
                </IonLabel>
                <IonInput required={true} type='email'></IonInput>
              </IonItem>
              <IonItem className='ion-margin-bottom'>
                <IonLabel className='sign-lable' position='floating'>
                  Password
                </IonLabel>
                <IonInput required={true} type='password'></IonInput>
              </IonItem>

              <div className='sign-btn'>
                <IonButton expand='block' shape='round'>
                  Sign up
                </IonButton>
                <p>
                  Already have an account?
                  <IonRouterLink routerLink='/signin'>
                    <span className='sign-link'> Sign in</span>
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

export default Signup;
