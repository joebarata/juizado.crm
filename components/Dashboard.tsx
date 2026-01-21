
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
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

const QuickAction = ({ icon, label, onClick }: { icon: string, label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl soft-glass border border-transparent hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
  >
    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:scale-110 transition-all">
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
      {label}
    </span>
  </button>
);

const MetricCard = ({ title, value, icon, color, trend, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`soft-glass p-8 rounded-[32px] border-l-4 ${color} relative group overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
  >
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-4xl font-black dark:text-white tracking-tighter">{value}</h2>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
            {trend}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">vs. mês anterior</span>
        </div>
      </div>
      <div className={`w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-2xl opacity-50 group-hover:opacity-100 transition-opacity`}>
        <i className={`fas ${icon} ${color.replace('border-', 'text-')}`}></i>
      </div>
    </div>
    {/* Decorativo de fundo */}
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 blur-2xl ${color.replace('border-', 'bg-')}`}></div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-10 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white leading-tight">Dashboard Gerencial</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Visão 360º da operação, saúde financeira e performance jurídica.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sistema Operacional</span>
          </div>
        </div>
      </header>

      {/* Grid de Métricas Principais - Conectadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Clientes" value="1.248" icon="fa-users" color="border-blue-500" trend="+12%" onClick={() => setActiveTab('clients')} />
        <MetricCard title="Processos Ativos" value="314" icon="fa-gavel" color="border-emerald-500" trend="+5.4%" onClick={() => setActiveTab('planning')} />
        <MetricCard title="Leads (Kanban)" value="42" icon="fa-funnel-dollar" color="border-amber-500" trend="+8" onClick={() => setActiveTab('kanban')} />
        <MetricCard title="Agenda Hoje" value="08" icon="fa-calendar-check" color="border-rose-500" trend="0 pendente" onClick={() => setActiveTab('agenda')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panorama Processual */}
        <div className="lg:col-span-8 soft-glass p-10 flex flex-col cursor-pointer" onClick={() => setActiveTab('planning')}>
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Panorama Processual</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Distribuição por Status Real-Time</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="qtd"
                  stroke="none"
                >
                  {processStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 'bold'}}
                  itemStyle={{color: '#fff'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ações Rápidas - Conectadas */}
        <div className="lg:col-span-4 space-y-8">
          <div className="soft-glass p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 text-center">Acesso Rápido</h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickAction icon="fa-user-plus" label="Novo Cliente" onClick={() => setActiveTab('clients')} />
              <QuickAction icon="fa-bolt-lightning" label="Push Intimações" onClick={() => setActiveTab('intelligence')} />
              <QuickAction icon="fa-columns" label="Kanban" onClick={() => setActiveTab('kanban')} />
              <QuickAction icon="fa-calendar-alt" label="Agenda" onClick={() => setActiveTab('agenda')} />
            </div>
          </div>

          <div className="soft-glass p-8 bg-blue-600 shadow-xl shadow-blue-600/20 border-none cursor-pointer" onClick={() => setActiveTab('ai')}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <i className="fas fa-wand-magic-sparkles"></i>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">IA LexFlow</h4>
            </div>
            <p className="text-xs font-bold text-blue-100 leading-relaxed mb-6">
              Simplifique andamentos e gere relatórios automáticos com inteligência artificial.
            </p>
            <button className="w-full py-3 bg-white rounded-xl text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">
              Acessar Assistente
            </button>
          </div>
        </div>
      </div>

      {/* Feed de Atividades Recentes - Conectadas */}
      <div className="soft-glass p-8">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Atividades Críticas da Banca</h3>
           <span className="text-[10px] font-black text-blue-500 cursor-pointer hover:underline" onClick={() => setActiveTab('library')}>Ver Acervo</span>
        </div>
        <div className="space-y-6">
          {[
            { user: 'Dr. Ricardo', action: 'peticionou em', target: 'Proc. 500123-22', time: '12 min atrás', icon: 'fa-file-signature', color: 'text-blue-500', tab: 'documents' },
            { user: 'Sistema IA', action: 'identificou prazo para', target: 'Contestação Alfa S/A', time: '45 min atrás', icon: 'fa-robot', color: 'text-purple-500', tab: 'intelligence' },
            { user: 'Financeiro', action: 'confirmou pagamento de', target: 'Honorários Sucumbenciais', time: '2 horas atrás', icon: 'fa-check-circle', color: 'text-emerald-500', tab: 'financial' },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => setActiveTab(item.tab as any)}
              className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold dark:text-white">
                  <span className="text-blue-500">{item.user}</span> {item.action} <span className="underline decoration-blue-500/30">{item.target}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{item.time}</p>
              </div>
              <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
