import React from 'react';
import { JobBoard } from '../features/jobs/JobBoard.jsx';

export function App() {
  return <>
    <header><a className="brand" href="/">Conecta<span>Empleo</span></a><span className="badge">Proyecto en desarrollo</span></header>
    <main><p className="eyebrow">OPORTUNIDADES QUE CONECTAN</p><h1>Tu próximo paso<br />empieza aquí.</h1>
      <p className="intro">Un espacio para descubrir oportunidades laborales y conectar empresas con talento.</p>
      <JobBoard />
    </main>
    <footer>Conecta Empleo · Base inicial del proyecto</footer>
  </>;
}
