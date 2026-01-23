import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';

interface DashboardProps {
  setActiveTab: (tab: any) => void;
}

const processStats = [
  { status: 'Ativos', qtd: 142, color: '#3b82f6' },
  { status: 'Suspensos', qtd: 24, color: '#f59e0b' },
  { status: 'Arquivados', qtd: 89, color: '#10b981' },
  { status: 'Urgentes', qtd: 12, color: '#ef4444' },
];

const MetricCard = ({ title, value, icon, color, trend, onClick }: any) => (
  <div 
    onClick={onClick}
    className="relative group bg-slate-900/40 border border-white/10 p-8 rounded-[32px] overflow-hidden cursor-pointer hover:bg-slate-900/60 transition-all duration-300"
  >
    <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{title}</p>
        <h2 className="text-4xl font-black text-white tracking-tighter">{value}</h2>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-black px-2 py-1 rounded bg-emerald-500/10 text-emerald-500">
            {trend}
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase">Projeção Mensal</span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl text-slate-400 group-hover:scale-110 transition-transform`}>
        <i className={`fas ${icon}`}></i>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">Dashboard Estratégico</h1>
          <p className="text-sm font-medium text-slate-400">Inteligência de dados para sua banca jurídica no juizado.com.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">SaaS Cloud Online</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Clientes" value="1.248" icon="fa-users" color="bg-blue-500" trend="+12%" onClick={() => setActiveTab('clients')} />
        <MetricCard title="Processos" value="314" icon="fa-balance-scale" color="bg-emerald-500" trend="+5.4%" onClick={() => setActiveTab('planning')} />
        <MetricCard title="Faturamento" value="R$ 84k" icon="fa-wallet" color="bg-amber-500" trend="+8%" onClick={() => setActiveTab('financial')} />
        <MetricCard title="Prazos Hoje" value="08" icon="fa-calendar-check" color="bg-rose-500" trend="0 pendente" onClick={() => setActiveTab('agenda')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-900/40 border border-white/10 p-10 rounded-[40px]">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10 text-center">Saúde da Carteira</h3>
           <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="qtd"
                  stroke="none"
                >
                  {processStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-blue-600 p-10 rounded-[40px] shadow-2xl shadow-blue-500/20 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6">
              <i className="fas fa-wand-magic-sparkles text-xl"></i>
            </div>
            <h3 className="text-xl font-black text-white mb-4">juizado.com AI Intelligence</h3>
            <p className="text-sm text-blue-100 font-medium leading-relaxed">
              Analise andamentos complexos e gere resumos automáticos para seus clientes em segundos usando a rede neural Gemini.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('ai')}
            className="w-full py-4 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all"
          >
            Acessar IA Assistente
          </button>
        </div>
      </div>
    </div>
  );
};