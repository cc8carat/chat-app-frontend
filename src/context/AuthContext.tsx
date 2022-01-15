import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { Storage } from '@capacitor/storage';
import useCapStorage from '../utils/hooks';

export type SignUpForm = {
  name: string;
  email: string;
  password: string;
};

export type SignInForm = {
  email: string;
  password: string;
};

interface AuthContextProps {
  isAuthenticated: boolean;
  user: { userId: string; userName: string };
  signup: (formData: SignUpForm) => Promise<void>;
  signin: (formData: SignInForm) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextProps);
export const useAuth = () => useContext(AuthContext);

const AuthState: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setAndStoreToken] = useCapStorage();
  const [user, setUser] = useState({ userId: '', userName: '' });

  useEffect(() => {
    if (token) {
      const autoSignin = async () => {
        try {
          const {
            data: { _id, name },
          } = await axios.get(`${process.env.REACT_APP_CHOK_API}/auth/me`, {
            headers: { Authorization: token },
          });
          setUser({ userId: _id, userName: name });
          setIsAuthenticated(true);
        } catch (error) {
          console.error(error);
        }
      };
      autoSignin();
    }
  }, [token]);

  const signup = async (formData: SignUpForm) => {
    try {
      const {
        data: { token },
      } = await axios.post(`${process.env.REACT_APP_CHOK_API}/auth/signup`, formData);
      setAndStoreToken(token);
    } catch (error) {
      console.error(error);
    }
  };

  const signin = async (formData: SignInForm) => {
    try {
      const {
        data: { token },
      } = await axios.post(`${process.env.REACT_APP_CHOK_API}/auth/signin`, formData);
      setAndStoreToken(token);
    } catch (error) {
      console.error(error);
    }
  };

  return <AuthContext.Provider value={{ isAuthenticated, signup, signin, user }}>{children}</AuthContext.Provider>;
};

export default AuthState;
