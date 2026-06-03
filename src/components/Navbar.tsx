import { Link, useLocation } from 'react-router-dom';
import { Wrench, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const isActive = (path: string) => 
    location.pathname === path ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600";

  return (
    <nav className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-10 w-full shadow-sm">
      
      <div className="flex justify-between w-full md:w-auto items-center">
        {/* Placeholder Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-800">
          <div className="bg-gray-100 p-2 rounded-md">
            <Wrench className="w-6 h-6 text-blue-600" />
          </div>
          <span className="tracking-wide">FilterNexa</span>
        </Link>

        {/* Mobile Language Switcher */}
        <div className="flex items-center gap-2 md:hidden bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200 shadow-sm">
          <Globe className="w-4 h-4 text-gray-500" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as any)} 
            className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer border-none"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="ur">اردو</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm sm:text-base transition-colors font-medium">
        <Link to="/" className={isActive('/')}>{t.navbar.home}</Link>
        <Link to="/search" className={isActive('/search')}>{t.navbar.products}</Link>
        <Link to="/about" className={isActive('/about')}>{t.navbar.about}</Link>
        <Link to="/contact" className={isActive('/contact')}>{t.navbar.contact}</Link>
      </div>

      {/* Desktop Language Switcher */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
        <Globe className="w-4 h-4 text-gray-500" />
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value as any)} 
          className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer border-none"
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="ur">اردو</option>
          <option value="hi">हिन्दी</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>

    </nav>
  );
}
