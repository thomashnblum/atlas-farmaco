/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { dataService } from './services/dataService';
import { Layout } from './components/Layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { MoleculeIndexPage } from './pages/MoleculeIndexPage';
import { NavigatorPage } from './pages/NavigatorPage';
import { ComparePage } from './pages/ComparePage';
import { GlossaryPage } from './pages/GlossaryPage';
import { EnzymesPage } from './pages/EnzymesPage';
import { ReceptorsPage } from './pages/ReceptorsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PricingPage } from './pages/PricingPage';
import { SourcesPage } from './pages/SourcesPage';
import { AdminPage } from './pages/AdminPage';
import { DisordersPage } from './pages/DisordersPage';
import { DisorderDetailPage } from './pages/DisorderDetailPage';
import { AuthProvider } from './context/AuthContext';
import { RequireSubscription } from './components/RequireSubscription';
import { AdminRoute } from './components/AdminRoute';

const AtlasViewPage = React.lazy(() => import('./pages/AtlasViewPage').then(module => ({ default: module.AtlasViewPage })));

export default function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    dataService.loadData().then(() => setIsDataLoaded(true));
  }, []);

  if (!isDataLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-zinc-500 font-mono text-sm min-h-screen bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></span>
          SINCRONIZANDO COM A NUVEM...
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
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
              {/* Rotas Públicas */}
              <Route path="/" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/sources" element={<SourcesPage />} />

              {/* Rotas de Catálogo (Públicas/Abertas) */}
              <Route path="/disorders" element={<DisordersPage />} />
              <Route path="/disorders/:id" element={<DisorderDetailPage />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/atlas" element={<AtlasViewPage />} />

              {/* Rotas Premium/Pagas (login + assinatura quando o paywall está ligado) */}
              <Route path="/molecules" element={
                <RequireSubscription>
                  <MoleculeIndexPage />
                </RequireSubscription>
              } />
              <Route path="/enzymes" element={
                <RequireSubscription>
                  <EnzymesPage />
                </RequireSubscription>
              } />
              <Route path="/receptors" element={
                <RequireSubscription>
                  <ReceptorsPage />
                </RequireSubscription>
              } />
              <Route path="/compare" element={
                <RequireSubscription>
                  <ComparePage />
                </RequireSubscription>
              } />
              <Route path="/navigator" element={
                <RequireSubscription>
                  <NavigatorPage />
                </RequireSubscription>
              } />

              {/* Painel do dono apenas */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
