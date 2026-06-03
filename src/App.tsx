import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import About from './pages/About';
import Contact from './pages/Contact';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang } = useLanguage();
  
  // Don't show back button on Home
  if (location.pathname === '/') return null;

  const isRTL = ['ar', 'ur'].includes(lang);

  return (
    <button 
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium mb-6 w-fit"
    >
      {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
      <span>{t.back}</span>
    </button>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col py-6 px-4 md:px-8">
        <BackButton />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}
