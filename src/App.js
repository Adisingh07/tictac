import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import Shop from './pages/Shop/Shop';
import PvP from './pages/Play/PvP';
import PvPSetup from './pages/Play/PvPSetup';
import PvPEasy from './pages/Play/PvPEasy';
import PvPMedium from './pages/Play/PvPMedium';
import PvPHard from './pages/Play/PvPHard';
import PvAI from './pages/Play/PvAI';
import AiEasy from './pages/Play/AiEasy';
import AiHard from './pages/Play/AiHard';
import AiMedium from './pages/Play/AiMedium';
import MediumMode from './pages/Play/MediumMode';
import About from './pages/Legal/About';
import aiha from './pages/Play/aihardtest';
import Privacy from './pages/Legal/Privacy';
import Terms from './pages/Legal/Terms';
import AudioPlayer from './components/AudioPlayer';

import FooterNav from './components/FooterNav';

function App() {
  return (
    <Router>
      
      <Header />
      <AudioPlayer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/play/pvp" element={<PvP />} />
        <Route path="/play/pvp-setup" element={<PvPSetup />} />
        <Route path="/play/pvp/easy" element={<PvPEasy />} />
        <Route path="/play/pvp/medium" element={<PvPMedium />} />
        <Route path="/play/pvp/hard" element={<PvPHard />} />
        <Route path="/hard" element={<aiha />} />
        <Route path="/play/PvAI" element={<PvAI />} />
        <Route path="/ai-easy" element={<AiEasy />} />
        <Route path='/ai-medium' element={<AiMedium />} />
        <Route path="/ai-hard" element={<AiHard />} />
        <Route path="/play/medium" element={<MediumMode />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <FooterNav />
    </Router>
  );
}

export default App;
