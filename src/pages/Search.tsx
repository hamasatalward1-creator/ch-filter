import { useSearchParams, Link } from 'react-router-dom';
import { categories } from '../data';
import { SearchIcon, Package, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../hooks/useProducts';

const ITEMS_PER_PAGE = 12;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const { t, lang } = useLanguage();
  const { products, isLoading } = useProducts();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    setQuery(initialQuery);
    setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on new search
  }, [initialQuery, categoryFilter]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (categoryFilter) params.category = categoryFilter;
    setSearchParams(params);
  };

  const { scoredResults, isSearching } = useMemo(() => {
    const isSearchActive = initialQuery !== '' || (categoryFilter !== '' && categoryFilter !== 'all');
    if (!isSearchActive) return { scoredResults: [], isSearching: isSearchActive };
    
    const query = initialQuery.trim().toLowerCase();
    const queryWords = query.split(/\s+/).filter(Boolean);

    const scoredProducts = products.map(part => {
      let score = 0;
      
      const localizedName = (part.name[lang] || part.name['en'] || part.name['ar'] || '').toLowerCase();
      const partNumber = part.partNumber.toLowerCase();
      const textToSearch = `${localizedName} ${partNumber}`;
      
      if (query) {
        queryWords.forEach(word => {
          if (textToSearch.includes(word)) score += 1;
        });

        // Exact match bonus
        if (textToSearch.includes(query)) score += 2;
      }
      
      if (categoryFilter && categoryFilter !== 'all') {
        if (part.categoryId !== categoryFilter) {
          score = -1; // Filter out completely
        } else if (!query) {
          score = 1; // If no query but category matches
        }
      }

      return { ...part, score };
    });

    const filtered = scoredProducts
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);

    return { scoredResults: filtered, isSearching: isSearchActive };
  }, [products, initialQuery, categoryFilter, lang]);

  const displayedResults = scoredResults.slice(0, visibleCount);
  const hasMore = visibleCount < scoredResults.length;

  const categoryName = categoryFilter && categoryFilter !== 'all' && ['tools', 'accessories', 'maintenance', 'emergency', 'organic'].includes(categoryFilter)
    ? t.categories[categoryFilter as keyof typeof t.categories]
    : t.search.allProducts;

  const isRTL = ['ar', 'ur'].includes(lang);

  return (
    <div className="w-full space-y-8">
      
      {/* Search Header Area */}
      <div className="flex flex-col md:flex-row gap-5 justify-between items-start md:items-end border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.search.title}</h1>
          <p className="text-gray-500 font-medium">
            {initialQuery ? t.search.resultsFor.replace('{query}', initialQuery) : categoryName}
          </p>
        </div>
        
        {/* Secondary Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded-xl p-1 shadow-sm bg-white w-full md:w-96 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.searchPlaceholder}
            className="flex-1 p-3 outline-none bg-transparent text-sm"
          />
          <button type="submit" className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            <SearchIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Results Area */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">
           <span className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></span>
           <span className="ml-3 font-medium text-lg">{t.search.loading}</span>
        </div>
      ) : !isSearching ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-10 md:p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-8">
          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-full inline-flex mb-2">
              <SearchIcon className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{t.search.title}</h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">{t.search.startSearchHint}</p>
          </div>
          
          <div className="w-full max-w-4xl pt-6 border-t border-gray-100">
             <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center justify-center gap-2">
               {t.search.exploreCategories} {isRTL ? <ArrowLeft className="w-5 h-5 rtl:block hidden" /> : <ArrowRight className="w-5 h-5 ltr:block hidden" />} 
             </h3>
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <Link 
                    key={cat.id} 
                    to={cat.id === 'all' ? '/search' : `/search?category=${cat.id}`}
                    className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white hover:border-blue-400 hover:shadow-md transition-all text-center sm:text-start rtl:sm:text-right group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="font-semibold text-gray-800 text-sm md:text-base">{t.categories[cat.id]}</span>
                  </Link>
                ))}
             </div>
          </div>
        </div>
      ) : displayedResults.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedResults.map((part) => (
              <div key={part.id} className="border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col bg-white hover:shadow-lg hover:border-blue-200 transition-all group relative overflow-hidden">
                <div className="flex-1 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 mb-5 border border-dashed border-gray-200 aspect-square p-4 text-center gap-3 group-hover:bg-blue-50 transition-colors">
                  {part.imageUrl ? (
                    <img src={part.imageUrl} alt={part.name[lang] || part.name['en'] || part.name['ar']} className="object-contain w-full h-full mix-blend-multiply" />
                  ) : (
                    <>
                      <Package className="w-10 h-10 text-gray-300 group-hover:text-blue-300 transition-colors" />
                      <span className="text-sm font-medium">{t.search.noImage}</span>
                    </>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-xs font-mono font-bold px-2.5 py-1 rounded-md mb-2 w-fit border border-gray-200" dir="ltr">
                    {part.partNumber}
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{part.name[lang] || part.name['en'] || part.name['ar']}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {part.description[lang] || part.description['en'] || part.description['ar']}
                  </p>
                </div>
                
                <a 
                  href={initialQuery ? `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(initialQuery)}` : `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(part.name['en'] || part.partNumber)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-slate-900 text-white text-center py-3 rounded-xl hover:bg-black font-bold transition-colors shadow-sm block text-sm"
                >
                  {t.search.buyNow}
                </a>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button 
                onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                className="bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 px-10 rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm flex items-center justify-center"
              >
                {t.search.loadMore}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl p-10 md:p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-8">
          <div className="space-y-4">
            <div className="bg-gray-100 p-5 rounded-full inline-flex mb-2">
              <SearchIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{t.search.noResults}</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">{t.search.noResultsDesc}</p>
          </div>
          
          {/* Suggestions if no results found */}
          {products.length > 0 && initialQuery && (
            <div className="w-full max-w-4xl pt-6 border-t border-gray-100">
               <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center justify-center gap-2">
                 {t.search.suggestionsText || 'Suggestions'}
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-start">
                  {products.slice(0, 6).map(part => (
                    <div key={part.id} className="border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col bg-white">
                      <div className="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-xs font-mono font-bold px-2 py-1 rounded-md mb-2 w-fit" dir="ltr">
                        {part.partNumber}
                      </div>
                      <h4 className="font-bold text-gray-900 line-clamp-1 mb-3">{part.name[lang] || part.name['en'] || part.name['ar']}</h4>
                      <a href={initialQuery ? `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(initialQuery)}` : `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(part.name['en'] || part.partNumber)}`} target="_blank" rel="noreferrer" className="w-full bg-slate-900 text-white text-center py-2 rounded-lg hover:bg-black font-bold transition-colors text-sm">
                        {t.search.buyNow}
                      </a>
                    </div>
                  ))}
               </div>
               
               {/* External search links */}
               <div className="pt-6 border-t border-gray-100">
                 <h4 className="text-base font-bold text-gray-500 mb-4">{t.search.searchExternal || 'Search Externally:'}</h4>
                 <div className="flex flex-wrap items-center justify-center gap-4">
                   <a target="_blank" rel="noreferrer" href={`https://www.amazon.com/s?k=${encodeURIComponent(initialQuery)}`} className="text-blue-600 font-bold hover:underline">
                     Amazon
                   </a>
                   <span className="text-gray-300">|</span>
                   <a target="_blank" rel="noreferrer" href={`https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(initialQuery)}`} className="text-blue-600 font-bold hover:underline">
                     AliExpress
                   </a>
                   <span className="text-gray-300">|</span>
                   <a target="_blank" rel="noreferrer" href={`https://www.google.com/search?q=${encodeURIComponent(initialQuery)}`} className="text-blue-600 font-bold hover:underline">
                     Google
                   </a>
                 </div>
               </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
