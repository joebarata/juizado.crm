
import React, { useState } from 'react';

interface DocumentTemplate {
  id: string;
  titulo: string;
  categoria: string;
  conteudo: string;
  criado_em: string;
}

export const DocumentTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    {
      id: '1',
      titulo: 'Contrato de Honorários Padrão',
      categoria: 'Contratos',
      conteudo: 'Pelo presente instrumento particular, de um lado {{nome_cliente}}, inscrito no CPF sob nº {{cpf_cliente}}...',
      criado_em: '2024-05-20'
    },
    {
      id: '2',
      titulo: 'Procuração Ad Judicia',
      categoria: 'Peças',
      conteudo: 'OUTORGANTE: {{nome_cliente}}, brasileiro, estado civil {{estado_civil}}, residente e domiciliado em {{cidade}}...',
      criado_em: '2024-05-18'
    },
    {
      id: '3',
      titulo: 'Petição Inicial - Divórcio',
      categoria: 'Família',
      conteudo: 'EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA DE FAMÍLIA DA COMARCA DE {{cidade}}...',
      criado_em: '2024-05-15'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<DocumentTemplate> | null>(null);

  const handleOpenModal = (template?: DocumentTemplate) => {
    setEditingTemplate(template || { titulo: '', categoria: '', conteudo: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Em um app real, aqui dispararíamos um toast de sucesso
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white leading-tight">Biblioteca de Documentos</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Padronização de peças, contratos e automação inteligente.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="dynamic-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest"
        >
          <i className="fas fa-plus mr-2"></i> Novo Modelo
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(doc => (
          <div key={doc.id} className="soft-glass p-6 flex flex-col h-full group hover:border-blue-500/30 transition-all">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20">
                  {doc.categoria}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(doc)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-white/10">
                    <i className="fas fa-edit text-xs"></i>
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white/10">
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold dark:text-white mb-3 line-clamp-1">{doc.titulo}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed mb-6 italic">
                {doc.conteudo.replace(/{{|}}/g, '')}
              </p>
            </div>
            
            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase">Criado em: {doc.criado_em}</span>
              <button 
                onClick={() => copyToClipboard(doc.conteudo)}
                className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 hover:text-blue-500 transition-all flex items-center gap-2"
              >
                <i className="far fa-copy"></i> Copiar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholders Insight */}
      <div className="soft-glass p-6 bg-blue-600/5 border-blue-500/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <i className="fas fa-magic"></i>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest dark:text-white">Dica de Automação LexFlow</h4>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
              Use chaves duplas para autopreenchimento: <code className="text-blue-500 font-bold">{"{{nome_cliente}}"}</code>, <code className="text-blue-500 font-bold">{"{{cpf_cliente}}"}</code> ou <code className="text-blue-500 font-bold">{"{{valor_causa}}"}</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="soft-glass w-full max-w-3xl border-white/20 dark:border-white/5 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-white/10">
              <h2 className="text-lg font-black dark:text-white uppercase tracking-tighter">
                {editingTemplate?.id ? 'Editar Modelo de Documento' : 'Novo Modelo Jurídico'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Título do Documento</label>
                  <input 
                    type="text" 
                    value={editingTemplate?.titulo}
                    className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 outline-none"
                    placeholder="Ex: Contestação Geral"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
                  <input 
                    type="text" 
                    value={editingTemplate?.categoria}
                    className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 outline-none"
                    placeholder="Ex: Peças Cíveis"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Conteúdo da Peça (Template)</label>
                <textarea 
                  className="w-full h-80 bg-slate-100 dark:bg-white/5 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-blue-500/30 outline-none font-mono leading-relaxed custom-scrollbar"
                  value={editingTemplate?.conteudo}
                  placeholder="Escreva ou cole seu modelo aqui..."
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3 bg-white/5">
              <button onClick={closeModal} className="px-6 py-3 rounded-xl text-xs font-black uppercase text-slate-500 hover:text-blue-500 transition-colors">Cancelar</button>
              <button className="dynamic-btn px-10 py-3 rounded-xl text-xs uppercase tracking-widest shadow-xl">Salvar na Biblioteca</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
