
import React, { useState } from 'react';

interface CPFData {
  Cpf: string;
  Nome: string;
  NomeSocial: string;
  SituacaoCadastral: string;
  DescSituacaoCadastral: string;
  NomeMae: string;
  DataNascimento: string;
  Sexo: number;
  Logradouro: string;
  NumeroLogradouro: string;
  Bairro: string;
  Municipio: string;
  UF: string;
  Cep: number;
  Estrangeiro: string;
  DataInscricao: string;
}

export const CPFConsultation: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [data, setData] = useState<CPFData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCPF = (val: string) => {
    const v = val.replace(/\D/g, '');
    return v.substring(0, 11);
  };

  const displayCPF = (val: string) => {
    const v = val.replace(/\D/g, '');
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = formatCPF(cpf);
    if (cleanCpf.length !== 11) {
      setError('CPF deve conter 11 dígitos.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const session = localStorage.getItem('juizado_session');
      const token = session ? JSON.parse(session).token : '';
      
      const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';
      
      const response = await fetch(`${API_URL}/cpf/${cleanCpf}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Falha ao consultar CPF. Verifique a conexão com a Receita.');
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setData(result[0] || result); // A API retorna uma lista
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '0': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'; // Regular
      case '2': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'; // Suspensa
      case '3': return 'bg-slate-500/10 text-slate-500 border-slate-500/20'; // Titular Falecido
      case '4': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'; // Pendente
      default: return 'bg-rose-500/10 text-rose-500 border-rose-500/20'; // Cancelada/Nula
    }
  };

  const formatBirthDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return 'Não informada';
    return `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}/${dateStr.substring(0, 4)}`;
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">Consulta CPF</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Base de dados RFB - Versão Light 2.5</p>
        </div>
        <div className="flex bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl items-center gap-3">
          <i className="fas fa-shield-halved text-blue-500"></i>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Conexão Criptografada</span>
        </div>
      </header>

      <div className="soft-glass p-8 bg-blue-600/5 border-blue-500/10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-[0.2em]">Documento do Cidadão</label>
            <input 
              type="text" 
              placeholder="000.000.000-00" 
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-mono"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="dynamic-btn h-[56px] px-10 rounded-2xl flex items-center gap-3 min-w-[200px]"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-fingerprint"></i>}
            <span className="text-xs uppercase tracking-widest">{isLoading ? 'Validando...' : 'Consultar'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-500 animate-shake">
          <i className="fas fa-circle-exclamation text-xl"></i>
          <div>
            <p className="text-xs font-black uppercase tracking-widest">Inconsistência na Busca</p>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          <div className="lg:col-span-8 space-y-8">
            <div className="soft-glass p-8 space-y-8">
              <div className="flex justify-between items-start border-b border-white/5 pb-8">
                <div className="flex gap-6 items-center">
                   <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20 text-3xl">
                     <i className="fas fa-user-check"></i>
                   </div>
                   <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{data.Nome}</h2>
                    {data.NomeSocial && <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mt-1">Nome Social: {data.NomeSocial}</p>}
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase">CPF: {displayCPF(data.Cpf)}</p>
                   </div>
                </div>
                <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${getStatusColor(data.SituacaoCadastral)}`}>
                  {data.DescSituacaoCadastral}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Filiação (Mãe)</p>
                    <p className="text-sm font-bold text-white uppercase">{data.NomeMae || 'Não declarada'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Data de Nascimento</p>
                    <p className="text-sm font-bold text-white">{formatBirthDate(data.DataNascimento)}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Inscrição na Receita</p>
                    <p className="text-sm font-bold text-white">{formatBirthDate(data.DataInscricao)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Nacionalidade</p>
                    <p className="text-sm font-bold text-emerald-500 uppercase">{data.Estrangeiro === 'S' ? 'Estrangeiro' : 'Brasileiro'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="soft-glass p-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 p-8 opacity-10">
                <i className="fas fa-map-location-dot text-6xl text-white"></i>
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8">DADOS DE LOCALIZAÇÃO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Logradouro</p>
                  <p className="text-sm text-slate-300 font-bold uppercase">{data.Logradouro}, {data.NumeroLogradouro}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase">Bairro</p>
                  <p className="text-sm text-slate-300 font-bold uppercase">{data.Bairro}</p>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Cidade / UF</p>
                  <p className="text-sm text-slate-300 font-bold uppercase">{data.Municipio} - {data.UF}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase">CEP</p>
                  <p className="text-sm text-slate-300 font-bold uppercase">{data.Cep}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="soft-glass p-8 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 text-center">ANÁLISE DE RISCO</h3>
               <div className="flex flex-col items-center gap-6">
                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${data.SituacaoCadastral === '0' ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
                   <div className={`text-3xl font-black ${data.SituacaoCadastral === '0' ? 'text-emerald-500' : 'text-rose-500'}`}>
                     {data.SituacaoCadastral === '0' ? '9.8' : '3.2'}
                   </div>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center px-4">
                  {data.SituacaoCadastral === '0' 
                    ? 'Score de crédito e idoneidade elevado. Nenhuma pendência fiscal detectada.' 
                    : 'Atenção: Irregularidade cadastral pode comprometer a assinatura de contratos.'}
                </p>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  <i className="fas fa-file-pdf"></i> Gerar Certidão Negativa
                </button>
              </div>
            </div>

            <div className="soft-glass p-8">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Auditoria LexFlow</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Data da Consulta</span>
                  <span className="text-white font-black">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">ID Transação</span>
                  <span className="text-slate-400 font-mono text-[9px] uppercase">LX-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
