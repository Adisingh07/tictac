import './Legal.css';
import { Link } from 'react-router-dom';
import FooterNav from '../../components/FooterNav';

function About() {
  return (
    <>
      <div className="legal-page">
        <h2>About Us</h2>
        <div className="content">
          <p>
            Welcome to <strong>Tic Tac Toe</strong> — a modern take on the timeless classic. This game is designed to provide an enjoyable, strategic experience for players of all ages with an elegant blend of design, customization, and challenge.
          </p>
          <p>
            Built with multiple difficulty levels for AI, visually appealing <strong>board themes</strong>, customizable X/O styles, and immersive <strong>sound & vibration feedback</strong>, our goal is to make each round engaging and fun.
          </p>
          <p>
            You can enjoy solo play, challenge a friend in 2-player mode, or explore new features through our growing customization options — all while staying completely <strong>ad-free and offline</strong>.
          </p>
          <p>
            At <strong>Aditya Games</strong>, your privacy matters. We don’t track, upload, or store any personal data. All settings and scores are saved locally on your device.
            You can <Link to="/privacy">read our Privacy Policy here</Link>.
          </p>
          <p>
            Have a feature suggestion or found a bug? Feel free to email us at
            {' '}
            <a href="mailto:mail.adityagames@gmail.com" className="email-link">
              mail.adityagames@gmail.com
            </a>
            . We value your feedback!
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

export default About;
