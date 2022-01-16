import { useAuth } from '../context/AuthContext';
import { Redirect, Route } from 'react-router-dom';
import Map from '../pages/Map';
import Chat from '../pages/Chat';
import { IonPage, IonRouterOutlet } from '@ionic/react';
import SocketState from '../context/SocketContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <SocketState>
      <IonPage>
        <IonRouterOutlet>
          <Route exact path='/protected' component={Map}></Route>
          <Route exact path='/protected/chat/:id' component={Chat}></Route>
        </IonRouterOutlet>
      </IonPage>
    </SocketState>
  ) : (
    <Redirect to='/signin' />
  );
};

export default ProtectedRoute;
