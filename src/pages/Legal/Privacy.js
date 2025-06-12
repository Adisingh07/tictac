import './Legal.css';
import { Link } from 'react-router-dom';
import FooterNav from '../../components/FooterNav';

function Privacy() {
  return (
    <>
      <div className="legal-page">
        <h2>Privacy Policy</h2>
        <div className="content">
          <p>
            At <strong>Aditya Games</strong>, your privacy is our priority. This Tic Tac Toe game has been designed to provide a secure and private gaming experience.
          </p>
          <ol>
            <li><strong>No Personal Data Collection:</strong> We do not collect, store, or transmit any personal information from our users.</li>
            <li><strong>Local Data Only:</strong> All your preferences, scores, and settings are saved locally in your browser's storage — never online.</li>
            <li><strong>No Internet Required:</strong> The game is fully functional offline and does not require an internet connection.
However, for the best offline experience, we recommend turning off background music and sound effects in the settings, as these media files may fail to load without internet access.</li>
            <li><strong>No Cookies or Tracking:</strong> We do not use cookies, third-party analytics, or any form of online tracking.</li>
            <li><strong>Data Deletion:</strong> If you clear your browser data or uninstall the app, all saved game data will be permanently erased from your device.</li>
          </ol>
          <p>
            This approach ensures a safe and distraction-free experience. Your trust is important to us.
          </p>

          <div className="return-home">
            <Link to="/" className="home-link">← Return to Home</Link>
          </div>
        </div>
      </div>

      <FooterNav />
    </>
  );
}

export default Privacy;
