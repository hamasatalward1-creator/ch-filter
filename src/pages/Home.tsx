import { Search, AlertTriangle } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { categories } from '../data';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="flex flex-col items-center p-6 sm:p-10 space-y-12 mb-10 w-full flex-1">
      
      {/* Main Hero & Search */}
      <div className="flex flex-col items-center justify-center text-center space-y-8 w-full max-w-3xl pt-6 md:pt-10">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
            {t.home.heroTitle}
          </h1>
          <p className="text-xl sm:text-2xl text-blue-600 font-medium leading-relaxed">
            {t.home.heroSubtitle}
          </p>
        </div>

        {/* Search Box */}
        <div className="w-full">
          <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-2xl shadow-sm bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all overflow-hidden h-16 sm:h-20">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.home.searchPlaceholder}
              className="flex-1 px-5 md:px-6 h-full text-lg outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
            />
            <button type="submit" className="px-6 sm:px-10 bg-slate-900 text-white hover:bg-black transition-colors flex items-center justify-center h-full">
              <Search className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </form>
        </div>
      </div>

      {/* Categories Section */}
      <div className="w-full max-w-5xl space-y-6 pt-4">
        <div className="flex items-center justify-center gap-4 mb-4">
           <div className="h-px bg-gray-200 flex-1"></div>
           <h2 className="text-xl font-bold text-gray-800">{t.home.browseCategories}</h2>
           <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={cat.id === 'all' ? '/search' : `/search?category=${cat.id}`}
              className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 hover:-translate-y-1 transition-all gap-3 text-center group"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</div>
              <span className="font-semibold text-gray-700 text-sm md:text-base leading-tight group-hover:text-blue-700">{t.categories[cat.id]}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Car Mistakes Section */}
      <div className="w-full max-w-5xl space-y-8 pt-10">
        <div className="flex items-center justify-center gap-4 text-center">
           <div className="h-px bg-red-200 flex-1 hidden sm:block"></div>
           <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 flex items-center justify-center gap-3">
             <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
             {t.carMistakes?.title || "أخطاء تقلل عمر سيارتك"}
           </h2>
           <div className="h-px bg-red-200 flex-1 hidden sm:block"></div>
        </div>
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <p className="text-base sm:text-lg font-semibold text-gray-700">{t.carMistakes?.subtitle}</p>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed px-4">{t.carMistakes?.desc}</p>
        </div>

        {t.carMistakes?.items && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {t.carMistakes.items.map((item: { title: string; desc: string }, index: number) => (
              <div key={index} className="bg-red-50/50 border border-red-100 rounded-2xl p-6 shadow-sm hover:bg-red-50 hover:shadow-md hover:border-red-200 transition-all flex flex-col gap-3 group text-start rtl:text-right">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 text-red-600 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 mb-2 leading-tight">{item.title}</h3>
                    <p className="text-sm text-red-800/80 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
