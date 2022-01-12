import { useState, useEffect, useContext, createContext, FC } from 'react';
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
  signup: (formData: SignUpForm) => Promise<void>;
  signin: (formData: SignInForm) => Promise<void>;
}

const AuthContext = createContext({} as AuthContextProps);
export const useAuth = () => useContext(AuthContext);

const AuthState: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setAndStoreToken] = useCapStorage();

  const signup = async (formData: SignUpForm) => {
    try {
      const {
        data: { name, _id, token },
      } = await axios.post(`${process.env.REACT_APP_CHOK_API}/auth/signup`, formData);
      setAndStoreToken(token);
      console.log(name);
    } catch (error) {
      console.error(error);
    }
  };

  const signin = async (formData: SignInForm) => {
    try {
      const {
        data: { name, _id, token },
      } = await axios.post(`${process.env.REACT_APP_CHOK_API}/auth/signin`, formData);
      setAndStoreToken(token);
      console.log(name);
    } catch (error) {
      console.error(error);
    }
  };

  return <AuthContext.Provider value={{ isAuthenticated, signup, signin }}>{children}</AuthContext.Provider>;
};

export default AuthState;
