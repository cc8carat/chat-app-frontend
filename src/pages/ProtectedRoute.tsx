import { useAuth } from '../context/AuthContext';
import { Redirect } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return <Redirect to={isAuthenticated ? '/map' : '/signin'} />;
};

export default ProtectedRoute;
