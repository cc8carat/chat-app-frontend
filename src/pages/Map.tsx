import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink, IonRouterOutlet } from '@ionic/react';
import './Map.css';

const Map: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <IonButton routerLink='protected/chat/1234'>Check in room1</IonButton>
        <IonButton routerLink='protected/chat/5678'>Check in room2</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Map;
