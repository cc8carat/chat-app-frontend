import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Maps from './pages/Maps';
import Chat from './pages/Chat';
import ProtectedRoute from './pages/ProtectedRoute';
import AuthState from './context/AuthContext';
import SocketState from './context/SocketContext';

setupIonicReact();

const App: React.FC = () => {
  return (
    <AuthState>
      <IonApp>
        <SocketState>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path='/signup' component={Signup}></Route>
              <Route path='/signin' component={Signin}></Route>
              <ProtectedRoute exact path='/protected' component={Maps} />
              <ProtectedRoute exact path='/protected/chat/:name/:id' component={Chat} />
              <Redirect exact from='/' to='/signin' />
            </IonRouterOutlet>
          </IonReactRouter>
        </SocketState>
      </IonApp>
    </AuthState>
  );
};

export default App;
