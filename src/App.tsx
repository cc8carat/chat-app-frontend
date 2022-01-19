import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import ProtectedRoute from './pages/ProtectedRoute';
import AuthState from './context/AuthContext';

setupIonicReact();

const App: React.FC = () => {
  return (
    <AuthState>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path='/signup' component={Signup}></Route>
            <Route path='/signin' component={Signin}></Route>
            <Route path='/protected' component={ProtectedRoute}></Route>
            <Redirect exact from='/' to='/signin' />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthState>
  );
};

export default App;
