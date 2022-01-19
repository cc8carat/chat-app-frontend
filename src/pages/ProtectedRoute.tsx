import { useAuth } from '../context/AuthContext';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface ProtectedRouteProps extends RouteProps {
  component: React.FC;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Route {...rest} render={() => <Component />} /> : <Redirect to='/signin' />;
};

export default ProtectedRoute;
