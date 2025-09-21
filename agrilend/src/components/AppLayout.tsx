import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout: React.FC = () => {
  // Debug: Vérifier que AppLayout se charge
  console.log('AppLayout component loaded successfully!');
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-10 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
