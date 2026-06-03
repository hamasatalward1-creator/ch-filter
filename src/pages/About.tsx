import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      
      <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">{t.about.title}</h1>
      
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 min-h-[250px] flex items-center justify-center text-center">
        <p className="text-gray-500 text-lg leading-relaxed font-medium">
          {t.about.content}
        </p>
      </div>

    </div>
  );
}
