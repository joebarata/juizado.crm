
import React, { useState } from 'react';

interface IntelligenceModuleProps {
  clients: any[];
  lawyers: any[];
  onDelegate: (data: any) => void;
}

export const IntelligenceModule: React.FC<IntelligenceModuleProps> = ({ clients, lawyers, onDelegate }) => {
  const [publications, setPublications] = useState([
    { id: '1', cnj: '5001234-55.2024.8.26.0100', content: 'Ficam as partes intimadas para manifestação sobre o laudo pericial no prazo sucessivo de 15 dias.', court: 'TJSP - 2ª Vara Cível', date: '22/05/2024' },
    { id: '2', cnj: '0010422-10.2023.5.02.0001', content: 'Ciência da sentença homologatória de cálculos. Prazo para recurso ordinário.', court: 'TRT2 - 1ª Vara do Trabalho', date: '21/05/2024' }
  ]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'system' | 'manual'>('system');
  const [manualAdvName, setManualAdvName] = useState('');
  const [selectedAdvId, setSelectedAdvId] = useState('');
  
  const [selectedPub, setSelectedPub] = useState<any>(null);
  const [delegateForm, setDelegateForm] = useState({
    clientId: '',
    lawyerId: '',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  /**
   * Lógica de Integração com API ComunicaPJE
   * Baseado na estrutura de consumo de diários oficiais
   */
  const handleFetchPje = async () => {
    const target = searchMethod === 'system' 
      ? lawyers.find(l => l.id === selectedAdvId)?.name 
      : manualAdvName;

    if (!target) return alert('Informe o nome completo do advogado ou OAB para consulta.');

    setIsSearching(true);

    try {
      /**
       * Simulação de chamada de API Rest conforme requisitos de Engenharia Sênior
       * Em um ambiente real: fetch('https://comunica.pje.jus.br/api/v1/comunicacao/buscar?nomeAdvogado=' + target)
       */
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulando latência de rede

      // Mock de retorno de API baseado no padrão CNJ/PJE
      const mockApiResponse = [
        {
          id: Math.random().toString(36).substr(2, 9),
          cnj: `${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(10 + Math.random() * 89)}.2024.8.26.0000`,
          content: `PUBLICAÇÃO PARA ${target.toUpperCase()}: Intimação de despacho referente à especificação de provas. Prazo preclusivo.`,
          court: 'TJSP - 10ª Vara da Fazenda Pública',
          date: new Date().toLocaleDateString('pt-BR'),
          foundVia: target
        }
      ];

      setPublications(prev => [...mockApiResponse, ...prev]);
      setManualAdvName('');
    } catch (error) {
      console.error("Erro ao consumir API PJE:", error);
      alert("Falha na conexão com o servidor do Tribunal.");
    } finally {
      setIsSearching(false);
    }
  };

  const submitDelegation = () => {
    if (!delegateForm.clientId || !delegateForm.lawyerId) return alert('Selecione o Cliente e o Advogado responsável.');
    onDelegate({
      pub: selectedPub,
      ...delegateForm
    });
    setPublications(prev => prev.filter(p => p.id !== selectedPub.id));
    setSelectedPub(null);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white">Push de Intimações</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Integração em tempo real com o ComunicaPJE e Diários Oficiais.</p>
        </div>
      </header>

      {/* Seção de Busca/Sync - Motor de API */}
      <div className="soft-glass p-8 bg-blue-600/5 border-blue-500/20 shadow-inner">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 mb-1">
               <i className="fas fa-tower-broadcast text-blue-500 text-xs animate-pulse"></i>
               <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Motor de Busca Jurídica</label>
            </div>
            
            <div className="flex gap-2">
               <button 
                onClick={() => setSearchMethod('system')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${searchMethod === 'system' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-transparent text-slate-500 border-slate-200 dark:border-white/10'}`}>
                Advogado Cadastrado
               </button>
               <button 
                onClick={() => setSearchMethod('manual')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${searchMethod === 'manual' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-transparent text-slate-500 border-slate-200 dark:border-white/10'}`}>
                Busca Livre (Nome/OAB)
               </button>
            </div>
            
            {searchMethod === 'system' ? (
              <select 
                className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                value={selectedAdvId}
                onChange={(e) => setSelectedAdvId(e.target.value)}
              >
                <option value="" className="text-slate-900">Selecione o Advogado para consulta...</option>
                {lawyers.map(l => <option key={l.id} value={l.id} className="text-slate-900">{l.name} ({l.oab})</option>)}
              </select>
            ) : (
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text"
                  placeholder="Nome Completo ou nº OAB (ex: 123456/SP)"
                  className="w-full p-4 pl-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={manualAdvName}
                  onChange={(e) => setManualAdvName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleFetchPje()}
                />
              </div>
            )}
          </div>
          <button 
            disabled={isSearching}
            onClick={handleFetchPje}
            className="dynamic-btn h-[56px] px-12 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 min-w-[200px]"
          >
            {isSearching ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-cloud-arrow-down"></i>}
            <span className="text-xs uppercase tracking-widest">{isSearching ? 'Consultando...' : 'Buscar API'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultados Encontrados ({publications.length})</h3>
           <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-tighter">Status: Conectado</span>
        </div>
        
        {publications.length === 0 ? (
          <div className="soft-glass p-20 text-center border-dashed border-2">
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
               <i className="fas fa-magnifying-glass text-2xl"></i>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhuma intimação pendente de triagem.</p>
          </div>
        ) : (
          publications.map(pub => (
            <div key={pub.id} className="soft-glass p-8 border-l-4 border-blue-500 flex flex-col lg:flex-row gap-8 items-start hover:shadow-2xl hover:shadow-blue-500/5 transition-all animate-in slide-in-from-bottom-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-blue-500/10">{pub.court}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publicado em: {pub.date}</span>
                </div>
                <h3 className="text-xl font-black dark:text-white tracking-tight leading-none">{pub.cnj}</h3>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 dark:bg-white/5 rounded-full"></div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed pl-6 italic">
                    "{pub.content}"
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPub(pub)} 
                className="dynamic-btn px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 flex-shrink-0 shadow-xl"
              >
                <i className="fas fa-share-nodes"></i> Triagem & Fluxo
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal de Triagem - Corrigido para cores de texto */}
      {selectedPub && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="soft-glass w-full max-w-lg p-10 bg-white dark:bg-slate-900 shadow-2xl border-white/20">
            <h2 className="text-2xl font-black dark:text-white mb-2 uppercase tracking-tighter">Fluxo de Triagem</h2>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">Processo {selectedPub.cnj}</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Vincular Cliente da Pasta</label>
                <select 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10" 
                  value={delegateForm.clientId} 
                  onChange={e => setDelegateForm({...delegateForm, clientId: e.target.value})}
                >
                  <option value="" className="text-slate-900">Selecione o Cliente...</option>
                  {clients.map(c => <option key={c.id} value={c.id} className="text-slate-900">{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Advogado Responsável (Delegação)</label>
                <select 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10"
                  value={delegateForm.lawyerId} 
                  onChange={e => setDelegateForm({...delegateForm, lawyerId: e.target.value})}
                >
                  <option value="" className="text-slate-900">Selecione o Advogado...</option>
                  {lawyers.map(l => <option key={l.id} value={l.id} className="text-slate-900">{l.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Data Fatal Calculada</label>
                <input 
                  type="date" 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10"
                  value={delegateForm.deadline} 
                  onChange={e => setDelegateForm({...delegateForm, deadline: e.target.value})} 
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button onClick={() => setSelectedPub(null)} className="text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Abortar Operação</button>
                <button onClick={submitDelegation} className="dynamic-btn px-10 py-4 rounded-2xl text-[10px] uppercase tracking-widest">Confirmar Delegação</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
