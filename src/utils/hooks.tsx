import { useState } from 'react';
import { useStorage } from '@capacitor-community/storage-react';

const useCapStorage = (): [string | null, (newToken: any) => void] => {
  const { get, set } = useStorage();
  const [token, setToken] = useState<string | null>('');
  const getInitialToken = async () => {
    const initialToken = await get('token');
    setToken(initialToken);
  };
  getInitialToken();
  const setAndStoreToken = (newToken: string) => {
    set('token', newToken);
    setToken(newToken);
  };
  return [token, setAndStoreToken];
};

export default useCapStorage;
