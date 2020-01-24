import i18next from 'i18next';
import spanish from './spanish';
import english from './english';

export default (lang: 'en' | 'es') => {
  i18next
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: lang, // 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources: {
      en: {
        translation: english,
      },
      es: {
        translation: spanish,
      },
    },
  })
  return i18next;
}