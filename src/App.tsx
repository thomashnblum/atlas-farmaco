/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { MoleculeIndexPage } from './pages/MoleculeIndexPage';
import { NavigatorPage } from './pages/NavigatorPage';
import { ComparePage } from './pages/ComparePage';

const AtlasViewPage = React.lazy(() => import('./pages/AtlasViewPage').then(module => ({ default: module.AtlasViewPage })));

export default function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center p-8 text-zinc-500 font-mono text-sm">
            <div className="flex flex-col items-center gap-4">
              <span className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></span>
              CARREGANDO ATLAS E COMPONENTES GRAFICOS...
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/molecules" element={<MoleculeIndexPage />} />
            <Route path="/navigator" element={<NavigatorPage />} />
            <Route path="/atlas" element={<AtlasViewPage />} />
            <Route path="/compare" element={<ComparePage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
