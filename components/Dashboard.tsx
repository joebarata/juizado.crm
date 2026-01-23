
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].name}</p>
        <p className="text-xl font-black text-white">{payload[0].value} <span className="text-xs font-medium text-slate-500">processos</span></p>
      </div>
    );
  }
  return null;
};

const QuickAction = ({ icon, label, onClick }: { icon: string, label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
  >
    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:scale-110 transition-all">
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
      {label}
    </span>
  </button>
);

const MetricCard = ({ title, value, icon, color, trend, onClick, subtitle }: any) => (
  <div 
    onClick={onClick}
    className={`soft-glass p-8 rounded-[32px] border border-white/5 relative group overflow-hidden cursor-pointer hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] transition-all duration-500 hover:-translate-y-1`}
  >
    <div className="relative z-10 flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
           <div className={`w-1.5 h-1.5 rounded-full ${color.replace('border-', 'bg-')}`}></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        </div>
        <h2 className="text-4xl font-black dark:text-white tracking-tighter group-hover:text-blue-500 transition-colors">{value}</h2>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
            {trend}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">{subtitle || 'vs. mês anterior'}</span>
        </div>
      </div>
      <div className={`w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-2xl opacity-40 group-hover:opacity-100 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500`}>
        <i className={`fas ${icon}`}></i>
      </div>
    </div>
    
    {/* Action Indicator */}
    <div className="absolute right-8 bottom-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
       <i className="fas fa-arrow-right text-blue-500 text-xs"></i>
    </div>

    {/* Background Decorative Gradient */}
    <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700 ${color.replace('border-', 'bg-')}`}></div>
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
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sistema Operacional Online</span>
          </div>
        </div>
      </header>

      {/* Grid de Métricas - Agora Totalmente Clicáveis e Intuitivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Clientes" 
          value="1.248" 
          icon="fa-users" 
          color="border-blue-500" 
          trend="+12%" 
          onClick={() => setActiveTab('clients')}
        />
        <MetricCard 
          title="Saúde do Acervo" 
          value="314" 
          icon="fa-gavel" 
          color="border-emerald-500" 
          trend="+5.4%" 
          subtitle="Processos Ativos"
          onClick={() => setActiveTab('planning')}
        />
        <MetricCard 
          title="Pipeline Comercial" 
          value="42" 
          icon="fa-funnel-dollar" 
          color="border-amber-500" 
          trend="+8" 
          subtitle="Leads Ativos"
          onClick={() => setActiveTab('kanban')}
        />
        <MetricCard 
          title="Agenda do Dia" 
          value="08" 
          icon="fa-calendar-check" 
          color="border-rose-500" 
          trend="0 Pendente" 
          subtitle="Compromissos"
          onClick={() => setActiveTab('agenda')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panorama Processual - Com Recharts Otimizado */}
        <div className="lg:col-span-8 soft-glass p-10 flex flex-col hover:border-blue-500/20 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Panorama do Acervo</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Distribuição por Status Real-Time</p>
            </div>
            <button 
              onClick={() => setActiveTab('planning')}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 hover:text-white transition-colors"
            >
              Ver BI Completo <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
          
          <div className="flex-1 min-h-[350px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={10}
                  dataKey="qtd"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {processStats.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  content={({ payload }: any) => (
                    <div className="flex justify-center gap-6 mt-8">
                      {payload.map((entry: any, index: number) => (
                        <div key={`legend-${index}`} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Content for Pie Chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-4xl font-black text-white leading-none">267</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Geral</span>
            </div>
          </div>
        </div>

        {/* Ações Rápidas & AI Intelligence */}
        <div className="lg:col-span-4 space-y-8">
          <div className="soft-glass p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 text-center">Gestão Rápida</h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickAction icon="fa-user-plus" label="Novo Cliente" onClick={() => setActiveTab('clients')} />
              <QuickAction icon="fa-bolt-lightning" label="Varredura PJE" onClick={() => setActiveTab('intelligence')} />
              <QuickAction icon="fa-columns" label="Kanban" onClick={() => setActiveTab('kanban')} />
              <QuickAction icon="fa-calendar-alt" label="Agenda" onClick={() => setActiveTab('agenda')} />
            </div>
          </div>

          <div 
            className="soft-glass p-8 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-600/20 border-none cursor-pointer group hover:scale-[1.03] transition-all duration-500" 
            onClick={() => setActiveTab('ai')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                <i className="fas fa-wand-magic-sparkles group-hover:rotate-12 transition-transform"></i>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Inteligência LexFlow</h4>
            </div>
            <p className="text-xs font-bold text-blue-100 leading-relaxed mb-6">
              Otimize andamentos jurídicos e triagem de documentos com o motor Gemini 3 Pro.
            </p>
            <button className="w-full py-3 bg-white rounded-xl text-blue-600 text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              Iniciar Assistente <i className="fas fa-chevron-right text-[8px]"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Atividades Recentes com Link Direto */}
      <div className="soft-glass p-8 border-white/5">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Monitoramento Crítico</h3>
           <span className="text-[10px] font-black text-blue-500 cursor-pointer hover:underline" onClick={() => setActiveTab('library')}>Histórico Completo</span>
        </div>
        <div className="space-y-4">
          {[
            { user: 'Dr. Ricardo', action: 'protocolou petição em', target: 'Proc. 500123-22', time: '12 min atrás', icon: 'fa-file-signature', color: 'text-blue-500', tab: 'documents' },
            { user: 'LexFlow AI', action: 'detectou novo prazo em', target: 'Agravo de Instrumento #88', time: '45 min atrás', icon: 'fa-robot', color: 'text-purple-500', tab: 'intelligence' },
            { user: 'Financeiro', action: 'liquidou honorários de', target: 'Sucumbência Banco Alfa', time: '2 horas atrás', icon: 'fa-check-circle', color: 'text-emerald-500', tab: 'financial' },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => setActiveTab(item.tab as any)}
              className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold dark:text-white">
                  <span className="text-blue-500 font-black">{item.user}</span> {item.action} <span className="underline decoration-blue-500/20 font-black">{item.target}</span>
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{item.time}</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <i className="fas fa-arrow-right text-[10px] text-blue-500"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
