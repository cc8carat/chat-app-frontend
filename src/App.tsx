import { Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';

import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Signin from './pages/Signin';
import Map from './pages/Map';
import ProtectedRoute from './pages/ProtectedRoute';
import AuthState from './context/AuthContext';
import SocketState from './context/SocketContext';
import { useAuth } from './context/AuthContext';

setupIonicReact();

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <AuthState>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path='/signup' component={Signup}></Route>
            <Route exact path='/signin' component={Signin}></Route>
            <Route path='/protected' component={ProtectedRoute}></Route>
            <Route path='/map' component={Map}></Route>
            <Route path='/chat/:id'>
              <SocketState>
                <Chat />
              </SocketState>
            </Route>
            <Redirect exact from='/' to='/signin' />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthState>
  );
};

// const App: React.FC = () => (
//   <IonApp>
//     <IonReactRouter>
//       <IonTabs>
//         <IonRouterOutlet>
//           <Route exact path="/tab1">
//             <Tab1 />
//           </Route>
//           <Route exact path="/tab2">
//             <Tab2 />
//           </Route>
//           <Route path="/tab3">
//             <Tab3 />
//           </Route>
//           <Route exact path="/">
//             <Redirect to="/tab1" />
//           </Route>
//         </IonRouterOutlet>
//         <IonTabBar slot="bottom">
//           <IonTabButton tab="tab1" href="/tab1">
//             <IonIcon icon={triangle} />
//             <IonLabel>Tab 1</IonLabel>
//           </IonTabButton>
//           <IonTabButton tab="tab2" href="/tab2">
//             <IonIcon icon={ellipse} />
//             <IonLabel>Tab 2</IonLabel>
//           </IonTabButton>
//           <IonTabButton tab="tab3" href="/tab3">
//             <IonIcon icon={square} />
//             <IonLabel>Tab 3</IonLabel>
//           </IonTabButton>
//         </IonTabBar>
//       </IonTabs>
//     </IonReactRouter>
//   </IonApp>
// );

export default App;
