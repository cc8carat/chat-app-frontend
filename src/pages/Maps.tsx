import { useEffect, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonTabs,
  IonTab,
} from '@ionic/react';
import axios from 'axios';
import { useCurrentPosition, useWatchPosition, availableFeatures } from '@capacitor-community/geolocation-react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Map, Marker, Point, Overlay } from 'pigeon-maps';
import { useNearbyRooms } from '../utils/hooks';
import './Maps.css';

const Maps: React.FC = () => {
  const [myPosition, setMyPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>();
  const [selectedRoom, setSelectedRoom] = useState<any>();
  const rooms = useNearbyRooms(selectedPosition!);

  //Will add loader

  useEffect(() => {
    const getMyPosition = async () => {
      setIsLoading(true);
      const {
        coords: { longitude, latitude },
      } = await Geolocation.getCurrentPosition();
      setMyPosition([latitude, longitude]);
      setSelectedPosition([latitude, longitude]);
      setIsLoading(false);
    };
    getMyPosition();
  }, []);

  const handleMapClick = ({ latLng }: { latLng: [number, number] }) => {
    setSelectedPosition(latLng);
  };

  const handleMarkerClick = ({ anchor, payload }: { anchor: Point; payload: any }) => {
    const selectedRoom = rooms.find((room: any) => room.location.coordinates === anchor);
    setSelectedRoom(selectedRoom);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='ion-text-center'></IonToolbar>
      </IonHeader>
      <IonContent>
        {myPosition && (
          <Map onClick={handleMapClick} defaultCenter={myPosition} center={selectedPosition} defaultZoom={13} touchEvents={true} animate={true}>
            <Marker width={50} anchor={myPosition} color='#d7a2ff' />
            {rooms &&
              rooms.map((room: any) => {
                return <Marker onClick={handleMarkerClick} width={50} anchor={room.location.coordinates} key={room._id} />;
              })}
            {selectedPosition && <Marker width={50} anchor={selectedPosition} color='#ed8787' />}
            {selectedRoom && (
              <Overlay anchor={selectedRoom.location.coordinates} offset={[120, 79]}>
                <IonButton routerLink={`protected/chat/${selectedRoom.name}/${selectedRoom._id}`}>Check in at {selectedRoom.name}</IonButton>
              </Overlay>
            )}
          </Map>
        )}
      </IonContent>

      <IonFooter collapse='fade'>
        <IonToolbar>
          <IonTitle>Something here</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Maps;
