import { IonButton, IonCol, IonContent, IonInput, IonItem, IonLabel, IonPage, IonRouterLink, IonRow, IonIcon } from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { alertCircleOutline } from 'ionicons/icons';
import { useAuth, SignInForm } from '../context/AuthContext';
import { Redirect } from 'react-router-dom';

import './Sign.css';

const Signin: React.FC = () => {
  const { signin, isAuthenticated } = useAuth();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (formData: SignInForm) => {
    signin(formData);
    reset();
  };

  if (isAuthenticated) return <Redirect to='/location' />;

  return (
    <IonPage>
      <IonContent className='sign no-scroll'>
        <IonRow className='sign-container ion-padding ion-align-items-center'>
          <IonCol>
            <h1>Connect with your community!</h1>
            <p>Log in to continue</p>
            <form className='ion-padding' onSubmit={handleSubmit(onSubmit)}>
              <IonItem className='ion-margin-bottom'>
                <IonLabel className='sign-lable' position='floating'>
                  Email
                </IonLabel>
                <Controller
                  control={control}
                  name='email'
                  render={({ field: { onChange, onBlur, value, ref } }) => <IonInput type='email' onIonChange={onChange} value={value} />}
                  rules={{ required: true }}
                />
              </IonItem>
              {errors.email && isSubmitSuccessful === false && (
                <IonRow className='invalid-feedback ion-align-items-center ion-padding-bottom'>
                  <IonIcon icon={alertCircleOutline} />
                  <span>Email is required</span>
                </IonRow>
              )}
              <IonItem className='ion-margin-bottom'>
                <IonLabel className='sign-lable' position='floating'>
                  Password
                </IonLabel>
                <Controller
                  control={control}
                  name='password'
                  render={({ field: { onChange, value } }) => <IonInput type='password' onIonChange={onChange} value={value} />}
                  rules={{ required: true }}
                />
              </IonItem>
              {errors.password && isSubmitSuccessful === false && (
                <IonRow className='invalid-feedback ion-align-items-center ion-padding-bottom'>
                  <IonIcon icon={alertCircleOutline} />
                  <span>Password is required.</span>
                </IonRow>
              )}

              <div className='sign-btn'>
                <IonButton type='submit' expand='block' shape='round'>
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
