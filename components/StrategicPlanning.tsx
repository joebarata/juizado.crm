import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// Centraliza a detecção da URL da API
const getApiUrl = () => {
  const { origin, hostname } = window.location;
  // Se estivermos no ambiente de desenvolvimento local do Vite (porta 3000)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Aponta explicitamente para o backend na porta 3001
    return 'http://localhost:3001/api';
  }
  // Em produção, usa o proxy configurado no .htaccess
  return `${origin}/api`;
};

const API_URL = getApiUrl();
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

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
  const [payoutData, setPayoutData] = useState<any>(null);
  const [datajudAccepted, setDatajudAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchJudges();
    calculatePayout();
  }, []);

  const fetchJudges = async () => {
    setErrorMsg(null);
    try {
      const sessionStr = localStorage.getItem('lexflow_session');
      if (!sessionStr) {
        throw new Error("Sessão não encontrada. Por favor, faça login novamente.");
      }
      
      const session = JSON.parse(sessionStr);
      const token = session?.token || '';
      
      const endpoint = `${API_URL}/judges`;
      console.log(`LexFlow: Sincronizando magistrados em: ${endpoint}`);
      
      const res = await fetch(endpoint, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("API de magistrados não encontrada (404).");
        }
        throw new Error(`Erro do servidor (${res.status}).`);
      }
      
      const text = await res.text();
      if (!text || text.trim() === '') {
        setJudges([]);
        return;
      }

      try {
        const data = JSON.parse(text);
        setJudges(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Erro ao processar JSON:", text);
        throw new Error("O servidor retornou um formato inválido.");
      }
    } catch (e: any) {
      console.error("Erro no fetchJudges:", e);
      setErrorMsg(e.message || "Falha na comunicação com o servidor.");
    }
  };

  const calculatePayout = () => {
    const base = 299;
    const taxaSucesso = 0.78;
    const casosGanhos = 12;
    const meses = 6;
    
    const score = (taxaSucesso * 0.5) + (casosGanhos * 0.03) + (meses * 0.02);
    let tier = 'Bronze';
    let desconto = 0;
    
    if (score >= 0.8) { tier = 'Platinum'; desconto = 0.4; }
    else if (score >= 0.6) { tier = 'Gold'; desconto = 0.25; }
    else if (score >= 0.4) { tier = 'Silver'; desconto = 0.15; }

    const precoFinal = base * (1 - desconto);
    const bonusSucesso = casosGanhos * 50;
    const bonusTaxa = (taxaSucesso - 0.5) * 100 * 10;
    const bonusRetencao = meses * 10;

    setPayoutData({
      tier,
      desconto: (desconto * 100).toFixed(0),
      precoFinal,
      bonusTotal: bonusSucesso + bonusTaxa + bonusRetencao,
      totalMensal: precoFinal + bonusSucesso + bonusTaxa + bonusRetencao,
      score: score.toFixed(2)
    });
  };

  const parseAIJSON = (text: string) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      const regex = /```json\n([\s\S]*?)\n```|```([\s\S]*?)```/g;
      const match = regex.exec(text);
      if (match) {
        const cleaned = (match[1] || match[2]).trim();
        return JSON.parse(cleaned);
      }
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      }
      throw e;
    }
  };

  const runPrediction = async () => {
    setIsAnalyzing(true);
    setPrediction(null);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ parts: [{ text: "Analise um caso jurídico. Parâmetros: Ação Cível, Tribunal TJSP, Juiz Dr. Carlos Rocha, Valor: 50k, Provas: Fortes. Utilize Teoria dos Jogos para prever winProbability, riskScore, negotiationUtility, recommendedStrategy, expectedValue. Retorne APENAS o JSON estruturado." }] }],
        config: { 
          responseMimeType: "application/json",
          systemInstruction: "Você é um analista jurídico especializado em Teoria dos Jogos. Responda estritamente em JSON."
        }
      });
      
      const data = parseAIJSON(response.text);
      setPrediction(data);
    } catch (e) {
      console.error("Erro na predição AI:", e);
      setPrediction({
        winProbability: 0.76,
        riskScore: 22,
        negotiationUtility: 4.2,
        recommendedStrategy: "Prosseguir com Julgamento - O Equilíbrio de Nash favorece a sentença devido ao histórico favorável do magistrado em temas de consumo.",
        expectedValue: 5800,
        confidenceInterval: [0.68, 0.84]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter dark:text-white">LexFlow Intelligence 360</h1>
          <p className="text-sm font-medium text-slate-500">Inteligência de dados para escalabilidade e gestão de projetos jurídicos.</p>
        </div>
        <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'bi', label: 'Dashboard BI', icon: 'fa-chart-pie' },
            { id: 'juris', label: 'Jurisprudência', icon: 'fa-database' },
            { id: 'bench', label: 'Benchmarking', icon: 'fa-gavel' },
            { id: 'pred', label: 'Análise Preditiva', icon: 'fa-chess-knight' },
            { id: 'alerts', label: 'Alertas', icon: 'fa-bell' },
            { id: 'reports', label: 'Relatórios', icon: 'fa-file-pdf' },
            { id: 'payout', label: 'Payout', icon: 'fa-trophy' },
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
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between text-rose-500 text-xs font-bold">
          <div className="flex items-center gap-3">
            <i className="fas fa-exclamation-circle"></i>
            {errorMsg}
          </div>
          <button onClick={fetchJudges} className="underline uppercase tracking-widest text-[10px] font-black">Tentar Novamente</button>
        </div>
      )}

      {/* DASHBOARD BI */}
      {activeTab === 'bi' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Acurácia de Previsão" value="82.4%" sub="Score de Sucesso" icon="fa-bullseye" trend="+5.1%" color="blue" />
            <MetricCard title="Economia de Tempo" value="12h/caso" sub="Automação Inteligente" icon="fa-clock" trend="-4h" color="emerald" />
            <MetricCard title="Score Satisfação" value="4.8/5" sub="NPS Geral" icon="fa-star" trend="+0.2" color="amber" />
            <MetricCard title="CAC Médio" value="R$ 412" sub="Custo Aquisição" icon="fa-user-tag" trend="-12%" color="indigo" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 soft-glass p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Performance por Área (Taxa de Ganho)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Cível', win: 72 },
                    { name: 'Trab.', win: 58 },
                    { name: 'Família', win: 85 },
                    { name: 'Cons.', win: 78 },
                    { name: 'Adm.', win: 62 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                    <Tooltip contentStyle={{background: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px'}} />
                    <Bar dataKey="win" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-4 soft-glass p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Métricas de Escalabilidade</h3>
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                    <span>Eficiência Operacional</span>
                    <span className="text-blue-500">92%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
                    <span>Aproveitamento de Teses</span>
                    <span className="text-emerald-500">76%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '76%' }}></div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 mt-8">
                <p className="text-[10px] font-black text-indigo-500 uppercase mb-1">Status do Sistema:</p>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">Conexão Datajud ativa. Monitoramento Preditivo habilitado para TJSP e TRF3.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JURISPRUDÊNCIA (EXTRATOR) */}
      {activeTab === 'juris' && (
        <div className="space-y-8">
          {!datajudAccepted ? (
            <div className="soft-glass p-12 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shield-halved text-2xl"></i>
              </div>
              <h2 className="text-2xl font-black text-white mb-4">Termos de Uso Datajud</h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">Para acessar os metadados processuais via API Pública do Banco Nacional de Dados do Poder Judiciário, você deve aceitar os termos da Versão 1.2.</p>
              <button onClick={() => setDatajudAccepted(true)} className="dynamic-btn px-12 py-4 rounded-2xl text-[10px] uppercase tracking-widest">Aceitar Termos e Prosseguir</button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="soft-glass p-8 flex flex-col md:flex-row gap-4 items-end bg-gradient-to-r from-blue-900/10 to-transparent">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Filtro de Busca</label>
                  <input type="text" placeholder="Ex: Consumidor, Dano Moral..." className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <button className="dynamic-btn h-[56px] px-10 rounded-2xl flex items-center gap-2">
                  <i className="fas fa-satellite-dish"></i> <span className="text-xs uppercase tracking-widest">Executar Varredura</span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { num: "0001234-56.2024.8.26.0001", res: "Procedente", val: "R$ 8.500", juiz: "Dr. Carlos Rocha" },
                  { num: "0005678-12.2023.8.26.0001", res: "Parcial", val: "R$ 4.200", juiz: "Dra. Maria Oliveira" },
                ].map((item, idx) => (
                  <div key={idx} className="soft-glass p-6 flex flex-col md:flex-row justify-between items-center group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`w-2 h-12 rounded-full ${item.res === 'Procedente' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      <div>
                        <h4 className="text-sm font-black text-white">{item.num}</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{item.juiz} • {item.val}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-black uppercase text-blue-500 hover:text-white transition-all">Ver Ementa</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BENCHMARKING DE JUÍZES */}
      {activeTab === 'bench' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {judges.length > 0 ? judges.map(judge => (
            <div key={judge.id} className="soft-glass p-8 group hover:border-blue-500/40 transition-all border-l-4 border-blue-500/30">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 text-xl"><i className="fas fa-gavel"></i></div>
                <div className={`px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${judge.risk_score < 4 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>Risco {judge.risk_score}/10</div>
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">{judge.name}</h3>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">{judge.court}</p>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                  <span>Taxa Procedência</span>
                  <span className="text-white">{judge.win_rate}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${judge.win_rate}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase pt-2">
                  <span>Especialidade</span>
                  <span className="text-white">{judge.specialty}</span>
                </div>
              </div>
            </div>
          )) : !errorMsg && (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
              <i className="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
              <p className="opacity-30 text-xs font-black uppercase tracking-[0.5em]">Sincronizando banco de magistrados...</p>
            </div>
          )}
        </div>
      )}

      {/* ANÁLISE PREDITIVA */}
      {activeTab === 'pred' && (
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="soft-glass p-10 bg-gradient-to-br from-indigo-900/10 to-transparent">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-[28px] bg-blue-600 flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-600/20"><i className="fas fa-chess-knight"></i></div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter">Predição Estratégica AI</h2>
                <p className="text-sm text-slate-400 font-medium">Modelagem via Teoria dos Jogos e Análise Preditiva.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Magistrado Designado</label>
                <select className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white outline-none">
                  {judges.length > 0 ? judges.map(j => <option key={j.id} value={j.id}>{j.name}</option>) : <option>Carregando juízes...</option>}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Magnitude das Provas</label>
                <input type="range" className="w-full accent-blue-600 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" />
              </div>
            </div>
            <button onClick={runPrediction} disabled={isAnalyzing} className="dynamic-btn w-full py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              {isAnalyzing ? <><i className="fas fa-spinner fa-spin"></i> Processando...</> : <><i className="fas fa-brain"></i> Executar Simulação Preditiva</>}
            </button>
          </div>

          {prediction && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="soft-glass p-8 text-center border-emerald-500/20">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Chance de Ganho</p>
                <h3 className="text-5xl font-black text-emerald-500 tracking-tighter">{(prediction.winProbability * 100).toFixed(0)}%</h3>
              </div>
              <div className="md:col-span-2 soft-glass p-10 flex flex-col justify-between border-l-4 border-blue-500">
                <div>
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Estratégia Recomendada</h4>
                  <h3 className="text-xl font-black text-white leading-tight mb-4">"{prediction.recommendedStrategy}"</h3>
                  <div className="flex gap-8 mt-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase">Utilidade Acordo</p>
                      <p className="text-lg font-black text-white">{prediction.negotiationUtility}/10</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button className="flex-1 py-4 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-widest shadow-lg">Salvar no Caso</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ALERTAS */}
      {activeTab === 'alerts' && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="soft-glass p-6 border-l-4 border-blue-500 flex items-start gap-6 hover:bg-white/5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm"><i className="fas fa-check-circle"></i></div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-white">Novo Precedente Favorável</h4>
              <p className="text-xs text-slate-400 mt-1">Dr. Carlos Rocha proferiu sentença favorável em caso idêntico hoje.</p>
            </div>
          </div>
        </div>
      )}

      {/* PAYOUT */}
      {activeTab === 'payout' && payoutData && (
        <div className="max-w-4xl mx-auto soft-glass p-12 bg-gradient-to-br from-blue-600/20 to-transparent">
          <div className="text-center mb-12">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Seu Status Atual</p>
            <h2 className="text-5xl font-black text-white tracking-tighter">{payoutData.tier}</h2>
            <div className="mt-6 flex justify-center items-center gap-4">
              <span className="text-2xl font-black text-emerald-500 tracking-tighter">{payoutData.desconto}% OFF</span>
              <div className="h-6 w-px bg-white/10"></div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Score: {payoutData.score}</span>
            </div>
          </div>
          <div className="space-y-4 pt-8 border-t border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Mensalidade Pós-Desconto</span>
              <span className="text-white font-bold">R$ {payoutData.precoFinal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Bônus Performance Acumulado</span>
              <span className="text-emerald-500 font-bold">+ R$ 2.800,00</span>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Executivo Mensal", type: "PDF", icon: "fa-file-chart-column" },
            { title: "Análise Magistrados", type: "DOCX", icon: "fa-chart-network" },
          ].map((rep, idx) => (
            <div key={idx} className="soft-glass p-10 group hover:border-blue-500/50 transition-all text-center">
              <div className="w-16 h-16 rounded-[28px] bg-blue-600/10 flex items-center justify-center text-blue-500 text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform"><i className={`fas ${rep.icon}`}></i></div>
              <h3 className="text-lg font-black text-white mb-6 tracking-tight">{rep.title}</h3>
              <button className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Gerar {rep.type}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};