import React from 'react';
import { useMeasure } from 'react-use';
import { STATUS_BAR_HEIGHT } from '../../constants/theme';
import { Panels } from '../panels/panels';
import { StatusBar } from '../status-bar/status-bar';

export const Window = () => {
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  return (
    <div className="h-screen w-screen" ref={ref}>
      <div className="w-full" style={{ height: height - STATUS_BAR_HEIGHT }}>
        <Panels />
      </div>
      <div className="w-full" style={{ height: STATUS_BAR_HEIGHT }}>
        <StatusBar />
      </div>
    </div>
  );
};
