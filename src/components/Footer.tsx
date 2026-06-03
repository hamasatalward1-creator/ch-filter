import { Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm font-medium">{t.footer.rights.replace('{year}', String(year))}</p>
        
        {/* Visitor Counter */}
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">{t.footer.visitors}</span>
          <span className="font-bold text-blue-700">1,204</span>
        </div>
      </div>
    </footer>
  );
}
