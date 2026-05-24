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
import { AdminPage } from './pages/AdminPage';
import { DisordersPage } from './pages/DisordersPage';
import { DisorderDetailPage } from './pages/DisorderDetailPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

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
              
              {/* Rotas de Catálogo (Podem ser públicas para atrair SEO ou protegidas) */}
              <Route path="/molecules" element={<MoleculeIndexPage />} />
              <Route path="/disorders" element={<DisordersPage />} />
              <Route path="/disorders/:id" element={<DisorderDetailPage />} />
              <Route path="/enzymes" element={<EnzymesPage />} />
              <Route path="/receptors" element={<ReceptorsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/glossary" element={<GlossaryPage />} />

              {/* Rotas Protegidas (Core Value do SaaS) */}
              <Route path="/navigator" element={
                <ProtectedRoute>
                  <NavigatorPage />
                </ProtectedRoute>
              } />
              <Route path="/atlas" element={
                <ProtectedRoute>
                  <AtlasViewPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
