import { useEffect, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFooter, IonSearchbar } from '@ionic/react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useStorage } from '@capacitor-community/storage-react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Map, Marker, Point, Overlay } from 'pigeon-maps';
import { useNearbyRooms } from '../utils/hooks';
import MapOverlay from '../components/MapOverlay';
import { useSocket } from '../context/SocketContext';

import './Maps.css';

const Maps: React.FC = () => {
  const [myPosition, setMyPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>();
  const [selectedRoom, setSelectedRoom] = useState<any>();
  const [searchText, setSearchText] = useState<string | null>(null);
  const [overlayType, setOverlayType] = useState<'room' | 'selectedPosition'>('room');
  const [currentRoom, setCurrentRoom] = useState<any>();
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const { userCount } = useSocket();
  const rooms = useNearbyRooms(selectedPosition!);
  const { get } = useStorage();

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

  const handleRoomMarkerClick = ({ anchor, payload }: { anchor: Point; payload: any }) => {
    const selectedRoom = rooms.find((room: any) => room.location.coordinates[1] === anchor[0] && room.location.coordinates[0] === anchor[1]);
    setSelectedRoom(selectedRoom);
    setOverlayType('room');
  };

  const handleSelectedPositionMarkerClick = () => {
    setOverlayType('selectedPosition');
  };

  const handleSearchSubmit = (event: any) => {
    event.preventDefault();
    const getSearchLocation = async () => {
      const {
        data: { results },
      } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?`, {
        params: { address: searchText, key: `${process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY}` },
      });
      setSelectedPosition([results[0].geometry.location.lat, results[0].geometry.location.lng]);
    };
    getSearchLocation();
  };

  const handleSelectePositionClick = (name: any) => {
    const createRoom = async () => {
      try {
        const token = await get('token');
        if (token) {
          const { data } = await axios.post(
            `${process.env.REACT_APP_CHOK_API}/room`,
            { name: name, location: { coordinates: [selectedPosition![1], selectedPosition![0]] } },
            {
              headers: { Authorization: token },
            }
          );
          setCurrentRoom(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    createRoom();
  };

  if (currentRoom) return <Redirect to={`protected/chat/${currentRoom?.name}/${currentRoom?._id}`} />;

  return (
    <IonPage>
      <IonContent>
        <form onSubmit={handleSearchSubmit} className='search-bar'>
          <IonSearchbar
            color='light'
            placeholder='Search location'
            value={searchText}
            animated={true}
            inputmode='text'
            showCancelButton='focus'
            enterkeyhint='search'
            onIonChange={(e) => setSearchText(e.detail.value!)}
          />
        </form>

        {myPosition && (
          <Map onClick={handleMapClick} defaultCenter={myPosition} center={selectedPosition} defaultZoom={13} touchEvents={true} animate={true}>
            <Marker width={50} anchor={myPosition} color='#d7a2ff' />
            {rooms &&
              rooms.map((room: any) => {
                return (
                  <Marker
                    onClick={handleRoomMarkerClick}
                    width={50}
                    anchor={[room.location.coordinates[1], room.location.coordinates[0]]}
                    key={room._id}
                  />
                );
              })}
            {selectedPosition && <Marker width={50} anchor={selectedPosition} color='#ed8787' onClick={handleSelectedPositionMarkerClick} />}
            {selectedRoom && overlayType === 'room' && (
              <Overlay anchor={[selectedRoom.location.coordinates[1], selectedRoom.location.coordinates[0]]} offset={[120, 100]}>
                <MapOverlay selectedRoom={selectedRoom} userCount={userCount} overlayType={overlayType} searchText={searchText} />
              </Overlay>
            )}
            {selectedPosition && overlayType === 'selectedPosition' && (
              <Overlay anchor={selectedPosition} offset={[95, 153]}>
                <MapOverlay
                  selectedRoom={selectedRoom}
                  userCount={userCount}
                  overlayType={overlayType}
                  searchText={searchText}
                  handleSelectePositionClick={handleSelectePositionClick}
                  currentRoom={currentRoom}
                />
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
