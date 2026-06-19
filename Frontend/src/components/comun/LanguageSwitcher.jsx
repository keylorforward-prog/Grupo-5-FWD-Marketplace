import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      className="language-switcher-btn de-link-button"
      type="button"
      onClick={toggleLanguage}
      aria-label="Cambiar idioma / Change language"
      title={i18n.language === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
    >
      <Globe size={20} />
      <span className="language-switcher-text">
        {i18n.language === 'es' ? 'ES' : 'EN'}
      </span>
    </button>
  );
}
