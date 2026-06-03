import { useState, FormEvent } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formType, setFormType] = useState('contact');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const msgInput = document.getElementById('message') as HTMLTextAreaElement;
    
    const typeLabel = formType;
    const subject = encodeURIComponent(`Contact - ${typeLabel}`);
    const body = encodeURIComponent(`Name: ${nameInput?.value || 'N/A'}\n\nMessage:\n${msgInput?.value || ''}`);
    
    window.location.href = `mailto:Admin@ch-filter.live?subject=${subject}&body=${body}`;
    
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      if (nameInput) nameInput.value = '';
      if (msgInput) msgInput.value = '';
      setTimeout(() => setSubmitted(false), 5000);
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 flex-1">
      <div className="text-center space-y-3 mt-4">
        <h1 className="text-3xl font-bold text-gray-900">{t.contact.title}</h1>
        <p className="text-gray-500 font-medium text-lg">{t.contact.subtitle}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center font-bold text-lg animate-in fade-in zoom-in duration-300">
             {t.contact.successMsg}
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label htmlFor="type" className="block font-medium text-gray-700 mb-2">{t.contact.msgType}</label>
              <select 
                id="type"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50 cursor-pointer font-medium"
              >
                <option value="contact"> {t.contact.typeContact}</option>
                <option value="cooperation"> {t.contact.typeCooperation}</option>
                <option value="complaints"> {t.contact.typeComplaints}</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block font-medium text-gray-700 mb-2">{t.contact.nameLabel}</label>
              <input 
                type="text" 
                id="name" 
                className="w-full border border-gray-300 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50" 
                placeholder={t.contact.namePlaceholder} 
                required={formType !== 'complaints'}
                disabled={isLoading}
              />
              {formType === 'complaints' && <p className="text-xs text-gray-500 mt-1">{t.contact.optionalComplaint}</p>}
            </div>
            
            <div>
              <label htmlFor="message" className="block font-medium text-gray-700 mb-2">
                {formType === 'cooperation' ? t.contact.msgLabelCoop : t.contact.msgLabel}
              </label>
              <textarea 
                id="message" 
                rows={5} 
                className="w-full border border-gray-300 rounded-xl p-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50 resize-y" 
                placeholder={t.contact.msgPlaceholder} 
                required
                disabled={isLoading}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-sm text-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : null}
              {t.contact.sendBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
