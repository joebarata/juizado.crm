
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Sector
} from 'recharts';

const statusData = [
  { name: 'Em Instrução', value: 45, color: '#3b82f6' },
  { name: 'Sentenciado', value: 25, color: '#10b981' },
  { name: 'Acórdão', value: 15, color: '#f59e0b' },
  { name: 'Arquivado', value: 15, color: '#64748b' },
];

const productivityData = [
  { name: 'Cível', proc: 120, revenue: 180000 },
  { name: 'Trab.', proc: 85, revenue: 95000 },
  { name: 'Família', proc: 64, revenue: 72000 },
  { name: 'Emp.', proc: 42, revenue: 210000 },
];

const MetricCard = ({ title, value, sub, icon, trend }: any) => (
  <div className="soft-glass p-6 rounded-[24px] border-b-4 border-blue-500/20">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
        <i className={`fas ${icon}`}></i>
      </div>
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        {trend}
      </span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-black dark:text-white mt-1">{value}</h3>
    <p className="text-[10px] text-slate-500 font-bold mt-2 italic">{sub}</p>
  </div>
);

export const StrategicPlanning: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white">Planejamento Estratégico</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inteligência de dados para escalabilidade e gestão de projetos jurídicos.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest dark:text-white hover:bg-slate-200 transition-all">
             <i className="fas fa-filter mr-2"></i> Período: Anual
           </button>
           <button className="dynamic-btn px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest">
             <i className="fas fa-print mr-2"></i> Relatório Consolidado
           </button>
        </div>
      </header>

      {/* Visão Macro - KPIs de Saúde da Firma */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Market Share" value="14.2%" sub="Base vs. Concorrência" icon="fa-chart-pie" trend="+2.4%" />
        <MetricCard title="Processos Ativos" value="314" sub="Capacidade: 85%" icon="fa-gavel" trend="+12" />
        <MetricCard title="Churn Rate Clientes" value="1.8%" sub="Meta: Abaixo de 2%" icon="fa-user-minus" trend="-0.4%" />
        <MetricCard title="Ticket Médio" value="R$ 8.420" sub="Honorários/Contrato" icon="fa-hand-holding-dollar" trend="+R$ 1.2k" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Distribuição por Área (Mix de Produto Jurídico) */}
        <div className="lg:col-span-7 soft-glass p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Produtividade por Unidade de Negócio</h3>
              <p className="text-[10px] text-slate-500 font-bold">Relação Volume vs. Valor Agregado</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.05} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} width={80} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff'}}
                />
                <Bar dataKey="proc" name="Volume de Processos" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="revenue" name="Receita (em centenas)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Clients & Life Time Value (LTV) */}
        <div className="lg:col-span-5 soft-glass p-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Segmentação de Clientes (Top 5)</h3>
          <div className="space-y-5">
            {[
              { name: 'Tech Solutions Global', count: 18, value: '240k', score: 98 },
              { name: 'Banco Alfa S/A', count: 42, value: '180k', score: 92 },
              { name: 'Construtora Horizonte', count: 12, value: '115k', score: 85 },
              { name: 'Indústria Metalúrgica J', count: 9, value: '98k', score: 88 },
              { name: 'Varejo Nacional Ltda', count: 31, value: '75k', score: 79 },
            ].map((client, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                  #{i+1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold dark:text-white">{client.name}</span>
                    <span className="text-[10px] font-black text-emerald-500">R$ {client.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${client.score}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visão Micro - Funil de Conversão e Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="soft-glass p-8">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Eficiência de Conversão</h3>
           <div className="flex flex-col items-center justify-center h-48">
              <div className="text-4xl font-black text-blue-500 tracking-tighter">68%</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Leads para Contratos</p>
              <div className="w-full max-w-[200px] mt-6 space-y-2">
                 <div className="flex justify-between text-[9px] font-black text-slate-400"><span>Meta do Trimestre</span><span>80%</span></div>
                 <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '68%' }}></div>
                 </div>
              </div>
           </div>
        </div>

        <div className="soft-glass p-8">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Status da Carteira Ativa</h3>
           <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={statusData}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {statusData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip 
                   contentStyle={{borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px'}}
                 />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="soft-glass p-8 bg-blue-600/5 border-blue-500/20">
           <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6">Insight de Engenharia</h3>
           <div className="space-y-4">
              <div className="flex gap-4">
                 <i className="fas fa-lightbulb text-blue-500 mt-1"></i>
                 <p className="text-xs font-bold leading-relaxed dark:text-slate-300">
                   Identificamos um gargalo de 12 dias na etapa de "Cálculos Periciais". Sugerimos automação ou parceria externa.
                 </p>
              </div>
              <div className="flex gap-4">
                 <i className="fas fa-rocket text-emerald-500 mt-1"></i>
                 <p className="text-xs font-bold leading-relaxed dark:text-slate-300">
                   Área Cível teve ROI de 156% no último semestre. Recomendamos aumento de budget em ads para este nicho.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
