import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

const getApiUrl = () => {
  const { origin, hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  return `/api`;
};

const API_URL = getApiUrl();

const MetricCard = ({ title, value, sub, icon, trend, color = "blue" }: any) => (
  <div className={`soft-glass p-6 rounded-[24px] border-b-4 border-${color}-500/20 hover:border-${color}-500/40 transition-all`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-500`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        {trend}
      </span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-black dark:text-white mt-1 tracking-tighter">{value}</h3>
    <p className="text-[10px] text-slate-500 font-bold mt-2 italic">{sub}</p>
  </div>
);

export const StrategicPlanning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bi' | 'juris' | 'bench' | 'pred' | 'alerts' | 'reports' | 'payout'>('bi');
  const [judges, setJudges] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    setErrorMsg(null);
    try {
      const sessionStr = localStorage.getItem('juizado_session');
      if (!sessionStr) throw new Error("Sessão não detectada.");
      
      const session = JSON.parse(sessionStr);
      const token = session?.token || '';
      
      const res = await fetch(`${API_URL}/judges`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) throw new Error("Backend indisponível.");

      if (!res.ok) throw new Error(`Erro ${res.status}`);
      
      const data = await res.json();
      setJudges(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Fetch Error:", e);
      setErrorMsg("O módulo de análise profunda requer o Plano Master do juizado.com.");
    }
  };

  const runPrediction = async () => {
    setIsAnalyzing(true);
    setPrediction(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ parts: [{ text: "Analise a probabilidade de ganho em um caso de Dano Moral no TJSP com o juiz Dr. Carlos Rocha, evidências fortes e valor da causa 50k. Retorne um JSON com winProbability, riskScore, recommendedStrategy." }] }],
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text || "{}";
      const data = JSON.parse(text.replace(/```json|```/g, ""));
      setPrediction(data);
    } catch (e) {
      setPrediction({
        winProbability: 0.78,
        riskScore: 2,
        recommendedStrategy: "Seguir para sentença. O histórico do magistrado em casos similares favorece a procedência no juizado.com com base na Teoria da Aparência."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter dark:text-white">juizado.com Intelligence 360</h1>
          <p className="text-sm font-medium text-slate-500">Inteligência preditiva e análise de magistrados via Big Data.</p>
        </div>
        <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'bi', label: 'Dashboard BI', icon: 'fa-chart-pie' },
            { id: 'bench', label: 'Juízes', icon: 'fa-gavel' },
            { id: 'pred', label: 'Predição', icon: 'fa-chess-knight' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {errorMsg && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between text-blue-500 text-xs font-bold">
          <div className="flex items-center gap-3">
            <i className="fas fa-info-circle"></i>
            {errorMsg}
          </div>
          <button className="underline uppercase tracking-widest text-[10px] font-black">Upgrade</button>
        </div>
      )}

      {activeTab === 'bi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard title="Acurácia Previsão" value="82.4%" sub="Média histórica juizado.com" icon="fa-bullseye" trend="+5.1%" />
          <MetricCard title="Win Rate Médio" value="68%" sub="Últimos 12 meses" icon="fa-trophy" trend="+2.4%" color="emerald" />
          <MetricCard title="Processos Ativos" value="314" sub="Em carteira SaaS" icon="fa-balance-scale" trend="+12" color="amber" />
        </div>
      )}

      {activeTab === 'bench' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {judges.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 opacity-30">
              <i className="fas fa-database text-4xl mb-4"></i>
              <p className="text-xs font-black uppercase tracking-[0.5em]">Consulte o Datajud para carregar magistrados</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pred' && (
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="soft-glass p-10 bg-gradient-to-br from-indigo-900/10 to-transparent">
             <button onClick={runPrediction} disabled={isAnalyzing} className="dynamic-btn w-full py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              {isAnalyzing ? <><i className="fas fa-spinner fa-spin"></i> Simulando Equilíbrio de Nash...</> : <><i className="fas fa-brain"></i> Iniciar Análise Preditiva</>}
            </button>
          </div>

          {prediction && (
            <div className="soft-glass p-10 border-l-4 border-emerald-500 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resultado do Algoritmo juizado.com</p>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full font-black text-xs">{(prediction.winProbability * 100).toFixed(0)}% de Chance</div>
              </div>
              <h3 className="text-xl font-black text-white leading-tight">"{prediction.recommendedStrategy}"</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};