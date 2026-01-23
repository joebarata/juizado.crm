import React, { useState } from 'react';

interface Activity {
  code: string;
  text: string;
}

interface QSA {
  nome: string;
  qual: string;
}

interface CNPJData {
  status: string;
  nome: string;
  fantasia: string;
  cnpj: string;
  abertura: string;
  situacao: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  email: string;
  telefone: string;
  capital_social: string;
  atividade_principal: Activity[];
  atividades_secundarias: Activity[];
  qsa: QSA[];
  message?: string;
}

export const CNPJConsultation: React.FC = () => {
  const [cnpj, setCnpj] = useState('');
  const [data, setData] = useState<CNPJData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCNPJ = (val: string) => {
    return val.replace(/\D/g, '').substring(0, 14);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCnpj = formatCNPJ(cnpj);
    if (cleanCnpj.length !== 14) {
      setError('CNPJ deve conter 14 dígitos.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // Nota: ReceitaWS Free API pode ter restrições de CORS em chamadas diretas do browser.
      // Em um ambiente real, esta chamada passaria pelo backend LexFlow.
      // Usaremos um proxy para garantir o funcionamento na demonstração.
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://receitaws.com.br/v1/cnpj/${cleanCnpj}`)}`);
      
      if (!response.ok) {
        if (response.status === 429) throw new Error('Limite de consultas excedido (3 por minuto).');
        throw new Error('Falha ao conectar com o serviço da Receita.');
      }

      const wrapper = await response.json();
      const result: CNPJData = JSON.parse(wrapper.contents);

      if (result.status === 'ERROR') {
        throw new Error(result.message || 'CNPJ não encontrado ou inválido.');
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">Consulta CNPJ</h1>
          <p className="text-sm font-medium text-slate-500">Informações oficiais da Receita Federal em tempo real.</p>
        </div>
        <div className="flex bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl items-center gap-3">
          <i className="fas fa-info-circle text-amber-500"></i>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Limite: 3 Consultas / min</span>
        </div>
      </header>

      <div className="soft-glass p-8 bg-blue-600/5 border-blue-500/10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">CNPJ da Empresa (Apenas números)</label>
            <input 
              type="text" 
              placeholder="00.000.000/0000-00" 
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="dynamic-btn h-[56px] px-10 rounded-2xl flex items-center gap-3 min-w-[200px]"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
            <span className="text-xs uppercase tracking-widest">{isLoading ? 'Consultando...' : 'Buscar Dados'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-500 animate-shake">
          <i className="fas fa-exclamation-triangle text-xl"></i>
          <div>
            <p className="text-xs font-black uppercase tracking-widest">Erro na Consulta</p>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Informações Principais */}
          <div className="lg:col-span-8 space-y-8">
            <div className="soft-glass p-8 space-y-6">
              <div className="flex justify-between items-start border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter">{data.nome}</h2>
                  <p className="text-sm font-bold text-blue-500 uppercase tracking-widest">{data.fantasia || 'Sem nome fantasia'}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${data.situacao === 'ATIVA' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                  {data.situacao}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">CNPJ</p>
                  <p className="text-sm font-bold text-white">{data.cnpj}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Abertura</p>
                  <p className="text-sm font-bold text-white">{data.abertura}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Capital Social</p>
                  <p className="text-sm font-bold text-emerald-500">R$ {parseFloat(data.capital_social || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase border-b border-white/5 pb-2">Endereço Completo</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {data.logradouro}, {data.numero} {data.complemento && ` - ${data.complemento}`} <br />
                  {data.bairro} — {data.municipio}/{data.uf} <br />
                  CEP: {data.cep}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">E-mail</p>
                  <p className="text-sm font-bold text-white">{data.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Telefone</p>
                  <p className="text-sm font-bold text-white">{data.telefone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* CNAEs */}
            <div className="soft-glass p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <i className="fas fa-briefcase text-blue-500"></i> Atividades Econômicas
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black text-blue-500 uppercase mb-2">Atividade Principal</p>
                  {data.atividade_principal.map((act, i) => (
                    <div key={i} className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20">
                      <p className="text-xs font-bold text-white mb-1">{act.text}</p>
                      <p className="text-[9px] font-black text-slate-500">{act.code}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Atividades Secundárias</p>
                  <div className="space-y-2">
                    {data.atividades_secundarias.map((act, i) => (
                      <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[11px] font-medium text-slate-300 mb-1">{act.text}</p>
                        <p className="text-[8px] font-black text-slate-600">{act.code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QSA - Sócios */}
          <div className="lg:col-span-4 space-y-8">
            <div className="soft-glass p-8 h-full">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <i className="fas fa-users text-blue-500"></i> Quadro Societário (QSA)
              </h3>
              <div className="space-y-4">
                {data.qsa && data.qsa.length > 0 ? data.qsa.map((socio, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:bg-blue-600/10 hover:border-blue-500/20 transition-all">
                    <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">{socio.nome}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">{socio.qual}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-500 italic text-center py-10">Dados do QSA não disponíveis para esta empresa.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
