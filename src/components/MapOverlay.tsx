import { IonButton, IonCard, IonCardSubtitle, IonRow, IonInput } from '@ionic/react';
import { useEffect, useState } from 'react';
import './MapOverlay.css';

const MapOverlay: React.FC<any> = ({ selectedRoom, overlayType, searchText, handleSelectePositionClick, currentRoom }) => {
  const [text, setText] = useState<string | null>();

  useEffect(() => {
    setText(searchText);
  }, [searchText]);

  return (
    <IonCard className='overlay-card'>
      {overlayType === 'room' && selectedRoom ? (
        <>
          <IonCardSubtitle className='room-name room-name-selected-room'>{selectedRoom.name}</IonCardSubtitle>

          <IonRow className='ion-align-items-center ion-justify-content-center'>
            <IonButton className='overlay-button' routerLink={`protected/chat/${selectedRoom.name}/${selectedRoom._id}`} size='small'>
              Check in
            </IonButton>
          </IonRow>
        </>
      ) : (
        <>
          <IonRow className='ion-justify-content-center'>
            <IonCardSubtitle className='room-name .ion-text-justify'>
              <IonInput
                className='new-room-name-input'
                onIonChange={(e) => setText(e.detail.value!)}
                value={text}
                placeholder={searchText ? searchText : 'Spot name'}
              ></IonInput>
            </IonCardSubtitle>
          </IonRow>
          <IonRow className='ion-justify-content-center'>
            <IonButton
              expand='block'
              className='overlay-button-create-room'
              onClick={() => handleSelectePositionClick(text)}
              size='small'
              disabled={!text}
            >
              Create room
            </IonButton>
          </IonRow>
        </>
      )}
    </IonCard>
  );
};

export default MapOverlay;
