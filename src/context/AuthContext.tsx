import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { useCapStorage } from '../utils/hooks';

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
  isLoading: boolean;
  err: any;
}

const AuthContext = createContext({} as AuthContextProps);
export const useAuth = () => useContext(AuthContext);

const AuthState: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setAndStoreToken] = useCapStorage();
  const [user, setUser] = useState({ userId: '', userName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (token) {
      const autoSignin = async () => {
        setIsLoading(true);
        setErr('');
        try {
          const {
            data: { _id, name },
          } = await axios.get(`${process.env.REACT_APP_CHOK_API}/auth/me`, {
            headers: { Authorization: token },
          });
          setUser({ userId: _id, userName: name });
          setIsAuthenticated(true);
          setIsLoading(false);
        } catch (error: any) {
          const err = error.response?.data.error || error.message;
          setErr(err);
          setIsLoading(false);
        }
      };
      autoSignin();
    }
  }, [token]);

  const signup = async (formData: SignUpForm) => {
    setErr('');
    try {
      const {
        data: { token },
      } = await axios.post(`${process.env.REACT_APP_CHOK_API}/auth/signup`, formData);
      setAndStoreToken(token);
    } catch (error: any) {
      const err = error.response?.data.error || error.message;
      setErr(err);
    }
  };

  const signin = async (formData: SignInForm) => {
    setErr('');
    try {
      const {
        data: { token },
      } = await axios.post(`${process.env.REACT_APP_CHOK_API}/auth/signin`, formData);
      setAndStoreToken(token);
    } catch (error: any) {
      const err = error.response?.data.error || error.message;
      setErr(err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signup, signin, user, isLoading, err }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
