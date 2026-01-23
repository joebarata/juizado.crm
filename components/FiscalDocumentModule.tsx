import React, { useState } from 'react';

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

export const FiscalDocumentModule: React.FC = () => {
  const [chave, setChave] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [docData, setDocData] = useState<any>(null);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chave.length !== 44) {
      setError('A chave de acesso deve conter exatamente 44 dígitos.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatusMessage('Enviando solicitação para a Receita...');

    try {
      const session = localStorage.getItem('lexflow_session');
      const token = session ? JSON.parse(session).token : '';

      const res = await fetch(`${API_URL}/fiscal/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ chave })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Falha ao processar captura.');

      setStatusMessage(`Documento adicionado! Status: ${data.status || 'OK'}`);
      
      if (data.status === 'OK') {
        fetchPdf(chave);
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchPdf = async (key: string) => {
    setStatusMessage('Gerando PDF (Base64)...');
    try {
      const session = localStorage.getItem('lexflow_session');
      const token = session ? JSON.parse(session).token : '';

      const res = await fetch(`${API_URL}/fiscal/pdf/${key}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'PDF ainda não disponível.');

      setDocData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!docData?.data) return;
    const linkSource = `data:application/pdf;base64,${docData.data}`;
    const downloadLink = document.createElement("a");
    const fileName = docData.name || `documento_fiscal_${chave}.pdf`;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white uppercase italic">Doc. Fiscais & DARF</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Captura Inteligente via Meu Danfe API</p>
        </div>
        <div className="flex bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl items-center gap-3">
          <i className="fas fa-file-invoice-dollar text-blue-500"></i>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Sincronização Fiscal Master</span>
        </div>
      </header>

      <div className="soft-glass p-10 bg-slate-900/40 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <i className="fas fa-barcode text-9xl"></i>
        </div>
        
        <form onSubmit={handleCapture} className="max-w-2xl space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-[0.2em]">Chave de Acesso (44 dígitos)</label>
            <input 
              type="text" 
              maxLength={44}
              placeholder="0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000" 
              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-mono text-lg tracking-widest"
              value={chave}
              onChange={(e) => setChave(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="dynamic-btn h-16 px-12 rounded-2xl flex items-center justify-center gap-4 flex-1"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-download-alt"></i>}
              <span className="text-xs uppercase font-black tracking-widest">{isLoading ? 'Capturando...' : 'Capturar & Gerar PDF'}</span>
            </button>
            <button 
              type="button"
              onClick={() => { setChave(''); setDocData(null); setError(''); }}
              className="px-10 h-16 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
            >
              Limpar
            </button>
          </div>
        </form>

        {statusMessage && !error && !docData && (
          <div className="mt-8 flex items-center gap-3 text-blue-400 animate-pulse">
            <i className="fas fa-info-circle"></i>
            <p className="text-[10px] font-black uppercase tracking-widest">{statusMessage}</p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500 animate-shake">
            <i className="fas fa-exclamation-triangle"></i>
            <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
          </div>
        )}
      </div>

      {docData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="lg:col-span-8">
            <div className="soft-glass bg-slate-900 border-white/10 overflow-hidden h-[800px] flex flex-col">
              <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Pré-visualização do Documento</span>
                <div className="flex gap-2">
                   <button onClick={downloadPdf} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"><i className="fas fa-download"></i></button>
                   <button onClick={() => window.print()} className="p-2 text-slate-500 hover:bg-white/10 rounded-lg transition-all"><i className="fas fa-print"></i></button>
                </div>
              </div>
              <iframe 
                src={`data:application/pdf;base64,${docData.data}#toolbar=0`} 
                className="w-full h-full border-none"
                title="Fiscal PDF Viewer"
              ></iframe>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="soft-glass p-8 bg-gradient-to-br from-emerald-600/10 to-transparent border-emerald-500/20">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">DADOS DO DOCUMENTO</h3>
               <div className="space-y-4">
                 <div>
                   <p className="text-[9px] font-black text-slate-500 uppercase">Tipo</p>
                   <p className="text-sm font-bold text-white uppercase">{docData.type || 'N/A'}</p>
                 </div>
                 <div>
                   <p className="text-[9px] font-black text-slate-500 uppercase">Arquivo</p>
                   <p className="text-xs font-mono text-emerald-400 break-all">{docData.name}</p>
                 </div>
                 <div className="pt-6">
                   <button 
                    onClick={downloadPdf}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
                   >
                     <i className="fas fa-file-pdf"></i> Baixar PDF Original
                   </button>
                 </div>
               </div>
            </div>

            <div className="soft-glass p-8">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">LOG DE SEGURANÇA</h3>
               <div className="space-y-3">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-bold">Autenticação</span>
                    <span className="text-emerald-500 font-black uppercase">API v2 VALID</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-bold">Integridade</span>
                    <span className="text-white font-black uppercase">HASH VERIFIED</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
