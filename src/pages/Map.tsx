import { useEffect, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink, IonRouterOutlet } from '@ionic/react';
import { useCurrentPosition, useWatchPosition, availableFeatures } from '@capacitor-community/geolocation-react';
import { Geolocation, Position } from '@capacitor/geolocation';

import './Map.css';

const Map: React.FC = () => {
  const [myPosition, setMyPosition] = useState<number[]>([]);
  const { currentPosition, getPosition } = useCurrentPosition();

  useEffect(() => {
    const getMyPosition = async () => {
      const {
        coords: { latitude, longitude },
      } = await Geolocation.getCurrentPosition();
      setMyPosition([latitude, longitude]);
    };
    getMyPosition();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='ion-text-center'>
          <IonButton routerLink='protected/chat/61e05bd28ad123254be859d4'>Check in room1</IonButton>
          <IonButton routerLink='protected/chat/5678'>Check in room2</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <div className='map-container'></div>
      </IonContent>
    </IonPage>
  );
};

export default Map;
