import './Legal.css';
import FooterNav from '../../components/FooterNav';
import { Link } from 'react-router-dom';

function Terms() {
  return (
    <>
      <div className="legal-page">
        <h2>Terms of Service</h2>

        <p>By using the Tic Tac Toe game provided by <strong>Aditya Games</strong>, you agree to comply with the following terms:</p>

        <ul>
          <li>1. This game is intended for <strong>personal entertainment</strong> use only.</li>
          <li>2. You may <strong>not distribute, modify, reproduce, or resell</strong> any part of the game without prior written permission from the developer.</li>
          <li>3. All game content including code, design, themes, sound, and assets are <strong>intellectual property</strong> of Aditya Games.</li>
          <li>4. While we aim to provide a smooth experience, we are <strong>not responsible for any data loss, performance issues, or unexpected behavior</strong> caused by browser settings, device limitations, or system errors.</li>
          <li>5. Use of this game implies that you accept these terms. If you do not agree, please refrain from using the game.</li>
        </ul>

        <p>
          For support, feature requests, or bug reports, feel free to email us at{" "}
          <a href="mailto:mail.adityagames@gmail.com">mail.adityagames@gmail.com</a>.
        </p>

        <div className="return-home">
            <Link to="/" className="home-link">← Return to Home</Link>
          </div>
      </div>

      <FooterNav />
    </>
  );
}

export default Terms;
