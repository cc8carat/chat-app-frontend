import { useAuth } from '../context/AuthContext';
import { IonPage, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Map from './Map';
import Chat from './Chat';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <IonPage>
      <IonRouterOutlet>
        <Route exact path='/protected' component={Map}></Route>
        <Route exact path='/protected/chat' component={Chat}></Route>
      </IonRouterOutlet>
    </IonPage>
  ) : (
    <Redirect to='/signin' />
  );
};

export default ProtectedRoute;
