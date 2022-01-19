import { IonButton, IonCard, IonContent, IonCardSubtitle, IonNote, IonInput } from '@ionic/react';
import { useState } from 'react';

const MapOverlay: React.FC<any> = ({ selectedRoom, userCount, overlayType, searchText, handleSelectePositionClick, currentRoom }) => {
  const [text, setText] = useState<string | null>(null);

  const handleOnChange = () => {};
  return (
    <IonCard color='light'>
      <IonCardSubtitle>{overlayType === 'room' ? selectedRoom.name : searchText}</IonCardSubtitle>
      <IonNote>{userCount}</IonNote>

      {overlayType === 'room' ? (
        <IonButton routerLink={`protected/chat/${selectedRoom.name}/${selectedRoom._id}`} size='small'>
          Check in
        </IonButton>
      ) : (
        <IonButton onClick={() => handleSelectePositionClick(text)}>Create room</IonButton>
      )}
      {overlayType === 'selectedPosition' && <IonInput onIonChange={(e) => setText(e.detail.value!)} value={text}></IonInput>}
    </IonCard>
  );
};

export default MapOverlay;
