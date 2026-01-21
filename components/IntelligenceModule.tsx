
import React, { useState, useEffect } from 'react';

interface IntimacaoItem {
  id: string;
  numero_processo: string;
  data_disponibilizacao: string;
  siglaTribunal: string;
  link?: string;
  meio_comunicacao?: string;
  nome_advogado?: string;
  texto_comunicacao?: string;
  sigilo?: boolean;
}

interface IntelligenceModuleProps {
  clients: any[];
  lawyers: any[];
  onDelegate: (data: any) => void;
}

export const IntelligenceModule: React.FC<IntelligenceModuleProps> = ({ clients, lawyers, onDelegate }) => {
  const [publications, setPublications] = useState<IntimacaoItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'name' | 'oab'>('oab');
  const [manualAdvName, setManualAdvName] = useState('');
  const [oabNumber, setOabNumber] = useState('');
  const [oabUf, setOabUf] = useState('SP');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [selectedPub, setSelectedPub] = useState<any>(null);
  const [delegateForm, setDelegateForm] = useState({
    clientId: '',
    lawyerId: '',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const fetchComunicaPje = async (page = 1) => {
    setIsSearching(true);
    setCurrentPage(page);

    try {
      const dataFim = new Date();
      const dataInicio = new Date();
      dataInicio.setDate(dataFim.getDate() - 7);

      const strInicio = formatDate(dataInicio);
      const strFim = formatDate(dataFim);

      let url = `https://comunicaapi.pje.jus.br/api/v1/comunicacao?dataDisponibilizacaoInicio=${strInicio}&dataDisponibilizacaoFim=${strFim}&itensPorPagina=10&pagina=${page}`;
      
      if (searchMethod === 'name') {
        if (!manualAdvName) return alert('Informe o nome do advogado.');
        url += `&nomeAdvogado=${encodeURIComponent(manualAdvName)}`;
      } else {
        if (!oabNumber) return alert('Informe o número da OAB.');
        url += `&numeroOab=${oabNumber}&ufOab=${oabUf}`;
      }
      
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      
      const items = (data.items || []).map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(36).substr(2, 9),
        numero_processo: item.numero_processo || 'N/A',
        data_disponibilizacao: item.data_disponibilizacao || 'Sem data',
        siglaTribunal: item.siglaTribunal || 'Tribunal Omitido',
        link: item.link,
        texto_comunicacao: item.texto_comunicacao || "Teor indisponível ou em processamento no tribunal.",
        nome_advogado: item.nome_advogado,
        sigilo: item.sigilo
      }));

      setPublications(items);
      setTotalItems(data.totalItens || 0);

    } catch (error) {
      console.error("Erro na API PJE:", error);
      alert("Falha na varredura PJE. Verifique os dados da OAB/Nome e tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const submitDelegation = () => {
    if (!delegateForm.clientId || !delegateForm.lawyerId) return alert('Selecione o Cliente e o Advogado responsável.');
    onDelegate({
      pub: {
        id: selectedPub.id,
        cnj: selectedPub.numero_processo,
        content: selectedPub.texto_comunicacao,
        court: selectedPub.siglaTribunal
      },
      ...delegateForm
    });
    setPublications(prev => prev.filter(p => p.id !== selectedPub.id));
    setSelectedPub(null);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white">Plus Intimações API</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Varredura oficial (últimos 07 dias) via <span className="text-blue-500 font-bold">ComunicaPJE</span>
        </p>
      </header>

      <div className="soft-glass p-8 bg-blue-600/5 border-blue-500/20">
        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
             <button 
              onClick={() => setSearchMethod('oab')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${searchMethod === 'oab' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-slate-500 border-slate-200 dark:border-white/10'}`}>
              Busca por OAB/UF
             </button>
             <button 
              onClick={() => setSearchMethod('name')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${searchMethod === 'name' ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-slate-500 border-slate-200 dark:border-white/10'}`}>
              Busca por Nome
             </button>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-4">
            {searchMethod === 'oab' ? (
              <>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Número OAB</label>
                  <input 
                    type="text"
                    placeholder="Ex: 123456"
                    className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={oabNumber}
                    onChange={(e) => setOabNumber(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-32 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">UF</label>
                  <select 
                    className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm dark:text-white outline-none"
                    value={oabUf}
                    onChange={(e) => setOabUf(e.target.value)}
                  >
                    {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome Completo do Advogado</label>
                <input 
                  type="text"
                  placeholder="Digite o nome sem abreviações..."
                  className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm dark:text-white outline-none"
                  value={manualAdvName}
                  onChange={(e) => setManualAdvName(e.target.value)}
                />
              </div>
            )}
            
            <button 
              disabled={isSearching}
              onClick={() => fetchComunicaPje(1)}
              className="dynamic-btn h-[56px] px-12 rounded-2xl flex items-center justify-center gap-3 min-w-[220px]"
            >
              {isSearching ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-satellite-dish"></i>}
              <span className="text-xs uppercase tracking-widest">{isSearching ? 'Sincronizando...' : 'Varrer 07 Dias'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             {totalItems > 0 ? `${totalItems} Intimações detectadas` : 'Aguardando parâmetros de busca'}
           </h3>
           <div className="flex items-center gap-4">
              {totalItems > 10 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => fetchComunicaPje(currentPage - 1)} disabled={currentPage === 1 || isSearching} className="p-2 text-slate-400 disabled:opacity-30"><i className="fas fa-chevron-left"></i></button>
                  <span className="text-[10px] font-black text-slate-500">{currentPage} / {Math.ceil(totalItems/10)}</span>
                  <button onClick={() => fetchComunicaPje(currentPage + 1)} disabled={publications.length < 10 || isSearching} className="p-2 text-slate-400 disabled:opacity-30"><i className="fas fa-chevron-right"></i></button>
                </div>
              )}
           </div>
        </div>
        
        {publications.length === 0 ? (
          <div className="soft-glass p-20 text-center border-dashed border-2 flex flex-col items-center">
            <i className="fas fa-radar text-4xl text-slate-200 mb-4"></i>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhuma publicação carregada para este filtro.</p>
          </div>
        ) : (
          publications.map(pub => (
            <div key={pub.id} className="soft-glass p-8 border-l-4 border-blue-500 flex flex-col lg:flex-row gap-8 items-start hover:bg-white/50 dark:hover:bg-white/5 transition-all">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-black bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-blue-500/10">
                    {pub.siglaTribunal}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Disponibilizado em: {new Date(pub.data_disponibilizacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <h3 className="text-xl font-black dark:text-white tracking-tight">{pub.numero_processo}</h3>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 dark:bg-white/5 rounded-full"></div>
                  <p className="text-xs font-medium leading-relaxed pl-6 text-slate-600 dark:text-slate-400 line-clamp-5">
                    {pub.texto_comunicacao}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                {pub.link && (
                  <a href={pub.link} target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-2xl bg-white/50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 text-center border border-slate-100 dark:border-white/10">
                    <i className="fas fa-external-link-alt mr-2"></i> PJE Oficial
                  </a>
                )}
                <button 
                  onClick={() => setSelectedPub(pub)} 
                  className="dynamic-btn px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
                >
                  <i className="fas fa-tasks"></i> Triagem
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPub && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
          <div className="soft-glass w-full max-w-lg p-10 bg-white dark:bg-slate-900 shadow-2xl border-white/20">
            <h2 className="text-2xl font-black dark:text-white mb-2 uppercase tracking-tighter">Triagem PJE</h2>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8">{selectedPub.numero_processo}</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Cliente</label>
                <select 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm dark:text-white outline-none" 
                  value={delegateForm.clientId} 
                  onChange={e => setDelegateForm({...delegateForm, clientId: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Responsável</label>
                <select 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm dark:text-white outline-none"
                  value={delegateForm.lawyerId} 
                  onChange={e => setDelegateForm({...delegateForm, lawyerId: e.target.value})}
                >
                  <option value="">Selecione...</option>
                  {lawyers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Prazo Final</label>
                <input 
                  type="date" 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm dark:text-white outline-none"
                  value={delegateForm.deadline} 
                  onChange={e => setDelegateForm({...delegateForm, deadline: e.target.value})} 
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button onClick={() => setSelectedPub(null)} className="text-[10px] font-black uppercase text-slate-500 hover:text-white">Cancelar</button>
                <button onClick={submitDelegation} className="dynamic-btn px-10 py-4 rounded-2xl text-[10px] uppercase tracking-widest">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
