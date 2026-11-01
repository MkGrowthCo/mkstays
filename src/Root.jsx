import React from 'react';
import { Composition } from 'remotion';
import { Reel, totalFrames, FPS } from './Reel.jsx';

const ejemplo = {
  serie: 'Reel 01',
  scenes: [
    { type: 'hook', text: ['Tu piso', 'turístico', '<r>pierde dinero</r>'], sub: 'Y casi nadie se da cuenta' },
    { type: 'point', title: 'El mismo precio todo el año', body: 'Un martes de noviembre no vale lo mismo que un sábado de agosto.', action: 'Sube los fines de semana y baja los días flojos' },
    { type: 'list', title: 'Revisa esto hoy', items: ['Precio por temporada', 'Estancia mínima', 'Descuento semanal'] },
    { type: 'cta', word: 'AUDITORÍA', text: 'y te digo qué cambiar en tu alojamiento' },
  ],
};

export const Root = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={totalFrames(ejemplo)}
    defaultProps={ejemplo}
    calculateMetadata={({ props }) => ({ durationInFrames: totalFrames(props) })}
  />
);
