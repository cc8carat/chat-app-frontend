import { IonButton, IonCol, IonContent, IonInput, IonItem, IonLabel, IonPage, IonRouterLink, IonRow, IonIcon } from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { alertCircleOutline } from 'ionicons/icons';

import './Sign.css';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (formData: SignUpForm) => {
    console.log(formData);
  };

  return (
    <IonPage>
      <IonContent className='sign no-scroll'>
        <IonRow className='sign-container ion-padding ion-align-items-center'>
          <IonCol>
            <h1>Connect with your community!</h1>
            <p>Create an account</p>
            <form className='ion-padding' onSubmit={handleSubmit(onSubmit)}>
              <IonItem className='ion-margin-bottom'>
                <IonLabel className='sign-lable' position='floating'>
                  Name
                </IonLabel>
                <Controller
                  control={control}
                  name='name'
                  render={({ field: { onChange, onBlur, value, ref } }) => <IonInput type='text' onIonChange={onChange} />}
                  rules={{ required: true }}
                />
              </IonItem>
              {errors.name && (
                <IonRow className='invalid-feedback ion-align-items-center ion-padding-bottom'>
                  <IonIcon icon={alertCircleOutline} />
                  <span>Name is required</span>
                </IonRow>
              )}

              <IonItem className='ion-margin-bottom'>
                <IonLabel className='sign-lable' position='floating'>
                  Email
                </IonLabel>
                <Controller
                  control={control}
                  name='email'
                  render={({ field: { onChange, onBlur, value, ref } }) => <IonInput type='email' onIonChange={onChange} />}
                  rules={{ required: true }}
                />
              </IonItem>
              {errors.email && (
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
                  render={({ field: { onChange, onBlur, value, ref } }) => <IonInput type='password' onIonChange={onChange} />}
                  rules={{ required: true }}
                />
              </IonItem>
              {errors.password && (
                <IonRow className='invalid-feedback ion-align-items-center ion-padding-bottom'>
                  <IonIcon icon={alertCircleOutline} />
                  <span>Password is required</span>
                </IonRow>
              )}

              <div className='sign-btn'>
                <IonButton type='submit' expand='block' shape='round'>
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
