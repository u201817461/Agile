import React from 'react';
import { Calculator } from './components/Calculator';
import { Layout } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight">VelocidadSim</h1>
          </div>
          <nav className="text-sm font-medium text-slate-300">
            Simulador de Física
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Cálculo de Velocidad</h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Herramienta interactiva para calcular la velocidad (<span className="font-mono bg-gray-200 px-1 rounded">v = d / t</span>) y visualizar el comportamiento de las variables cinemáticas fundamentales.
            </p>
          </div>

          <Calculator />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} VelocidadSim. Proyecto de Ingeniería Educativa.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;