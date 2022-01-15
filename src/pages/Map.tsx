import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';

import './Map.css';

const Map: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <IonRouterLink routerLink='/chat/1234'>
          <IonButton>Check in room1</IonButton>
        </IonRouterLink>
        <IonRouterLink routerLink='/chat/5678'>
          <IonButton>Check in room2</IonButton>
        </IonRouterLink>
      </IonContent>
    </IonPage>
  );
};

export default Map;
