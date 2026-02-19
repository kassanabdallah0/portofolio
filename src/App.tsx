import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import PortfolioPage from '@/sections/PortfolioPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PortfolioPage />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
