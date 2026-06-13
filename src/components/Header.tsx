import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenCustomizer: () => void;
}

export default function Header({ onOpenCustomizer }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass border-b border-white/10 py-4 px-6 md:px-12 bg-black/80 backdrop-blur-md'
            : 'py-6 px-6 md:px-12 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a
            href="#"
            className="text-2xl font-display font-medium tracking-tighter text-white hover:text-accent transition-colors"
          >
            AJIN
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wider">
            <button
              onClick={() => scrollToSection('profile')}
              className="text-gray-300 hover:text-accent transition-colors cursor-pointer"
            >
              PROFILE
            </button>
            <button
              onClick={() => scrollToSection('video')}
              className="text-gray-300 hover:text-accent transition-colors cursor-pointer"
            >
              VIDEO
            </button>
            <button
              onClick={() => scrollToSection('photo')}
              className="text-gray-300 hover:text-accent transition-colors cursor-pointer"
            >
              PHOTO
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-accent transition-colors cursor-pointer"
            >
              CONTACT
            </button>
            <button
              onClick={onOpenCustomizer}
              className="bg-accent/10 border border-accent/30 text-accent px-4 py-1.5 rounded-full text-xs hover:bg-accent hover:text-black font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1"
            >
              설정 <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={onOpenCustomizer}
              className="bg-accent/10 border border-accent/25 text-accent px-3 py-1 rounded-full text-xs hover:bg-accent hover:text-black transition-all font-semibold"
            >
              설정
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-accent transition-colors focus:outline-none p-1"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] bg-dark/95 border-b border-white/10 py-6 px-6 z-45 md:hidden flex flex-col gap-4 backdrop-blur-xl"
          >
            <button
              onClick={() => scrollToSection('profile')}
              className="text-left text-lg font-medium text-gray-200 py-2 hover:text-accent border-b border-white/5"
            >
              PROFILE
            </button>
            <button
              onClick={() => scrollToSection('video')}
              className="text-left text-lg font-medium text-gray-200 py-2 hover:text-accent border-b border-white/5"
            >
              VIDEO
            </button>
            <button
              onClick={() => scrollToSection('photo')}
              className="text-left text-lg font-medium text-gray-200 py-2 hover:text-accent border-b border-white/5"
            >
              PHOTO
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left text-lg font-medium text-gray-200 py-2 hover:text-accent"
            >
              CONTACT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
