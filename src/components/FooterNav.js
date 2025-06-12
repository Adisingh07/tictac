import { useNavigate, useLocation } from 'react-router-dom';
import './FooterNav.css';
import SoundButton from "../components/SoundButton";

function FooterNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide footer on legal/about pages if needed
  const hideOnPaths = ["/about", "/privacy", "/terms"];
  if (hideOnPaths.includes(location.pathname)) return null;

  return (
    <div className="footer-nav">
      <SoundButton onClick={() => navigate('/settings')} title="Settings">
        <img src="/assets/icons/setting.png" alt="Settings" />
      </SoundButton>
      <SoundButton onClick={() => navigate('/')} title="Home">
        <img src="/assets/icons/homes.png" alt="Home" />
      </SoundButton>
      <SoundButton onClick={() => navigate('/shop')} title="Shop">
        <img src="/assets/icons/shops.png" alt="Shop" />
      </SoundButton>
    </div>
  );
}

export default FooterNav;
