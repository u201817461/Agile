import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { AlertCircle, ArrowRight, Activity, Clock, Ruler } from 'lucide-react';
import { CalculationResult, ChartDataPoint } from '../types';

export const Calculator: React.FC = () => {
  // State for inputs (kept as strings to handle empty states better)
  const [distanceStr, setDistanceStr] = useState<string>('100');
  const [timeStr, setTimeStr] = useState<string>('10');
  
  // State for the calculated result
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  // State for errors
  const [error, setError] = useState<string | null>(null);

  // Derived state for charts
  const [timeChartData, setTimeChartData] = useState<ChartDataPoint[]>([]);
  const [distChartData, setDistChartData] = useState<ChartDataPoint[]>([]);

  const calculate = useCallback(() => {
    setError(null);
    
    // Parse inputs
    const d = parseFloat(distanceStr);
    const t = parseFloat(timeStr);

    // Validation
    if (isNaN(d) || isNaN(t)) {
      setError("Por favor, ingrese valores numéricos válidos.");
      setResult(null);
      return;
    }

    if (d < 0) {
      setError("La distancia no puede ser negativa.");
      setResult(null);
      return;
    }

    if (t <= 0) {
      setError("El tiempo debe ser mayor a cero.");
      setResult(null);
      return;
    }

    const v = d / t;
    setResult({ distance: d, time: t, speed: v });

    // Generate Chart Data: Speed vs Time (Fixed Distance)
    // We want to show a range around the current time value
    const tData: ChartDataPoint[] = [];
    const minT = Math.max(1, t * 0.5); // 50% of current time
    const maxT = t * 2; // 200% of current time
    const stepT = (maxT - minT) / 20; // 20 points
    
    for (let i = 0; i <= 20; i++) {
      const currentT = minT + (stepT * i);
      tData.push({
        name: currentT.toFixed(1),
        value: Number((d / currentT).toFixed(2))
      });
    }
    setTimeChartData(tData);

    // Generate Chart Data: Speed vs Distance (Fixed Time)
    const dData: ChartDataPoint[] = [];
    const minD = 0;
    const maxD = d * 2 || 100; // Handle d=0 case
    const stepD = (maxD - minD) / 20;

    for (let i = 0; i <= 20; i++) {
      const currentD = minD + (stepD * i);
      dData.push({
        name: currentD.toFixed(1),
        value: Number((currentD / t).toFixed(2))
      });
    }
    setDistChartData(dData);

  }, [distanceStr, timeStr]);

  // Initial calculation on mount
  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount to show initial valid state

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Input Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Variables de Entrada
            </h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Distance Input */}
            <div className="space-y-2">
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-2"><Ruler className="w-4 h-4" /> Distancia (d)</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">metros (m)</span>
              </label>
              <input
                type="number"
                id="distance"
                value={distanceStr}
                onChange={(e) => {
                  setDistanceStr(e.target.value);
                  // Optional: Live Recalculate (remove if you want explicit button only)
                  // But standard modern UX prefers live or explicit. Let's keep explicit as requested ("Botón de cálculo")
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                placeholder="Ej. 100"
              />
              <input 
                 type="range" 
                 min="0" 
                 max="1000" 
                 value={Number(distanceStr) || 0} 
                 onChange={(e) => setDistanceStr(e.target.value)}
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Time Input */}
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Tiempo (t)</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">segundos (s)</span>
              </label>
              <input
                type="number"
                id="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                placeholder="Ej. 10"
              />
               <input 
                 type="range" 
                 min="1" 
                 max="120" 
                 value={Number(timeStr) || 1} 
                 onChange={(e) => setTimeStr(e.target.value)}
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error de Validación</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <button
              onClick={calculate}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Calcular Velocidad
            </button>
          </div>
        </div>

        {/* Formula Card */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-blue-900">
           <h4 className="font-semibold mb-2">Fórmula Utilizada</h4>
           <div className="flex items-center justify-center text-2xl font-mono bg-white rounded-lg p-4 shadow-sm border border-blue-200">
             v = <span className="mx-2 border-b-2 border-current px-1">d</span> / <span className="mx-2">t</span>
           </div>
           <p className="text-xs text-center mt-3 text-blue-700">
             La velocidad es directamente proporcional a la distancia e inversamente proporcional al tiempo.
           </p>
        </div>
      </div>

      {/* Results & Visualization Panel */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Main Result Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-1/3 -translate-y-1/3" />
          
          <div className="z-10">
            <h2 className="text-sm uppercase tracking-wide font-semibold text-gray-500 mb-1">Resultado Calculado</h2>
            <div className="text-5xl font-bold text-gray-900 tracking-tighter">
              {result ? result.speed.toFixed(2) : '--'}
              <span className="text-2xl text-gray-400 ml-2 font-normal">m/s</span>
            </div>
            {result && (
              <p className="text-gray-500 mt-2 text-sm">
                Equivalente a <span className="font-medium text-gray-900">{(result.speed * 3.6).toFixed(2)} km/h</span>
              </p>
            )}
          </div>

          {/* Visual Indicator */}
          {result && (
             <div className="hidden sm:flex items-center gap-4 z-10">
                <div className="text-right">
                    <div className="text-xs text-gray-400">Distancia</div>
                    <div className="font-medium">{result.distance} m</div>
                </div>
                <ArrowRight className="text-gray-300" />
                 <div className="text-right">
                    <div className="text-xs text-gray-400">Tiempo</div>
                    <div className="font-medium">{result.time} s</div>
                </div>
             </div>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart 1: V vs Time */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 text-sm">Impacto del Tiempo en la Velocidad</h4>
              <p className="text-xs text-gray-500">Manteniendo distancia constante de {result?.distance || 0}m</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeChartData}>
                  <defs>
                    <linearGradient id="colorSpeedT" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    label={{ value: 'Tiempo (s)', position: 'insideBottomRight', offset: -5, fontSize: 10 }} 
                    tick={{fontSize: 10}}
                  />
                  <YAxis 
                    label={{ value: 'Velocidad (m/s)', angle: -90, position: 'insideLeft', fontSize: 10 }} 
                    tick={{fontSize: 10}}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value} m/s`, 'Velocidad']}
                    labelFormatter={(label) => `Tiempo: ${label}s`}
                  />
                  <ReferenceLine x={result?.time.toFixed(1)} stroke="#ef4444" strokeDasharray="3 3" label={{position: 'top', value: 'Actual', fontSize: 10, fill: '#ef4444'}} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpeedT)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
             <p className="text-xs text-center text-gray-400 mt-2 italic">
               A mayor tiempo, menor velocidad (relación inversa).
             </p>
          </div>

          {/* Chart 2: V vs Distance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 text-sm">Impacto de la Distancia en la Velocidad</h4>
              <p className="text-xs text-gray-500">Manteniendo tiempo constante de {result?.time || 0}s</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={distChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    label={{ value: 'Distancia (m)', position: 'insideBottomRight', offset: -5, fontSize: 10 }} 
                    tick={{fontSize: 10}}
                  />
                  <YAxis 
                     tick={{fontSize: 10}}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value} m/s`, 'Velocidad']}
                    labelFormatter={(label) => `Distancia: ${label}m`}
                  />
                  <ReferenceLine x={result?.distance.toFixed(1)} stroke="#ef4444" strokeDasharray="3 3" label={{position: 'top', value: 'Actual', fontSize: 10, fill: '#ef4444'}} />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
             <p className="text-xs text-center text-gray-400 mt-2 italic">
               A mayor distancia, mayor velocidad (relación directa).
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};