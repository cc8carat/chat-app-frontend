import { useState, useEffect } from 'react';
import { useStorage } from '@capacitor-community/storage-react';
import axios from 'axios';

export const useCapStorage = (): [string | null, (newToken: any) => void] => {
  const { get, set } = useStorage();
  const [token, setToken] = useState<string | null>('');
  const getInitialToken = async () => {
    const initialToken = await get('token');
    if (initialToken) setToken(initialToken);
  };
  getInitialToken();
  const setAndStoreToken = (newToken: any) => {
    set('token', newToken);
    setToken(newToken);
  };
  return [token, setAndStoreToken];
};

export const useNearbyRooms = (coordinates: [number, number]): any => {
  const [rooms, setRooms] = useState<[number, number] | null>(null);

  useEffect(() => {
    const getNearByRooms = async () => {
      if (coordinates) {
        const params = {
          longitude: coordinates[0],
          latitude: coordinates[1],
        };
        const { data } = await axios.get(`${process.env.REACT_APP_CHOK_API}/room`, { params: params });
        setRooms(data);
      }
    };
    getNearByRooms();
  }, [coordinates]);

  return rooms;
};
