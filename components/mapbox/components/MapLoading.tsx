import React, { memo } from 'react';
import { IonSpinner } from '@ionic/react';

const MapLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full bg-black bg-opacity-30">
      <IonSpinner name="crescent" color="primary" />
    </div>
  );
};

export default memo(MapLoading);