import { useEffect, useState } from 'react';
import { IonContent, IonPage, IonToolbar, IonFooter, IonSearchbar, IonLoading, IonToast } from '@ionic/react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useStorage } from '@capacitor-community/storage-react';
import { Geolocation } from '@capacitor/geolocation';
import { Map, Marker, Point, Overlay } from 'pigeon-maps';
import { maptiler } from 'pigeon-maps/providers';
import { useNearbyRooms } from '../utils/hooks';
import MapOverlay from '../components/MapOverlay';
import { useSocket } from '../context/SocketContext';

import './Maps.css';

const maptilerProvider = maptiler(`${process.env.REACT_APP_MAPTILER_KEY}`, 'streets');

const Maps: React.FC = () => {
  const [myPosition, setMyPosition] = useState<[number, number] | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>();
  const [selectedRoom, setSelectedRoom] = useState<any>();
  const [searchText, setSearchText] = useState<string | null>(null);
  const [overlayType, setOverlayType] = useState<'room' | 'selectedPosition'>('room');
  const [currentRoom, setCurrentRoom] = useState<any>();
  const [showOverlay, setShowOverlay] = useState(true);
  const [error, setError] = useState<string>();
  const { userCount } = useSocket();
  const rooms = useNearbyRooms(selectedPosition!);
  const { get } = useStorage();

  useEffect(() => {
    const getMyPosition = async () => {
      setIsMapLoading(true);
      const {
        coords: { longitude, latitude },
      } = await Geolocation.getCurrentPosition();
      setMyPosition([latitude, longitude]);
      setSelectedPosition([latitude, longitude]);
      setIsMapLoading(false);
    };
    getMyPosition();
  }, []);

  const handleMapClick = ({ latLng }: { latLng: [number, number] }) => {
    setShowOverlay(false);
    setSelectedPosition(latLng);
  };

  const handleRoomMarkerClick = ({ anchor, payload }: { anchor: Point; payload: any }) => {
    setShowOverlay(true);
    const selectedRoom = rooms.find((room: any) => room.location.coordinates[1] === anchor[0] && room.location.coordinates[0] === anchor[1]);
    setSelectedRoom(selectedRoom);
    setOverlayType('room');
  };

  const handleSelectedPositionMarkerClick = () => {
    setShowOverlay(true);
    setOverlayType('selectedPosition');
  };

  const handleSearchSubmit = (event: any) => {
    event.preventDefault();
    const getSearchLocation = async () => {
      try {
        const {
          data: { results },
        } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?`, {
          params: { address: searchText, key: `${process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY}` },
        });
        setSelectedPosition([results[0].geometry.location.lat, results[0].geometry.location.lng]);
      } catch (error: any) {
        console.error(error);
        setError('Please search again');
      }
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
      } catch (error: any) {
        const err = error.response?.data.error || error.message;
        setError(err);
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
        <IonLoading cssClass='loader' isOpen={isMapLoading} message={'Please wait...'}></IonLoading>

        {myPosition && (
          <Map
            provider={maptilerProvider}
            dprs={[1, 2]}
            onClick={handleMapClick}
            defaultCenter={myPosition}
            center={selectedPosition}
            defaultZoom={13}
            touchEvents={true}
            animate={true}
          >
            {selectedPosition && selectedPosition !== myPosition && (
              <Marker width={50} anchor={selectedPosition} color='#ed8787' onClick={handleSelectedPositionMarkerClick} />
            )}
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
            <Marker width={50} anchor={myPosition} color='#d7a2ff' />
            {showOverlay === true && selectedRoom && overlayType === 'room' && (
              <Overlay anchor={[selectedRoom.location.coordinates[1], selectedRoom.location.coordinates[0]]} offset={[72, 16]}>
                <MapOverlay selectedRoom={selectedRoom} userCount={userCount} overlayType={overlayType} searchText={searchText} />
              </Overlay>
            )}
            {showOverlay === true && selectedPosition && overlayType === 'selectedPosition' && (
              <Overlay anchor={selectedPosition} offset={[90, 16]}>
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
        {error && <IonToast isOpen={true} message={error} duration={1200} />}
      </IonContent>

      <IonFooter collapse='fade'>
        <IonToolbar></IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Maps;
