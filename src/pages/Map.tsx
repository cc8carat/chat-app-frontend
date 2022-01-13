import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';
import './Map.css';

const Map: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <IonRouterLink routerLink='/protected/chat'>
          <IonButton>Check in</IonButton>
        </IonRouterLink>
      </IonContent>
    </IonPage>
  );
};

export default Map;
