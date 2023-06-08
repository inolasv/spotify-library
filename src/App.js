import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { accessToken, logout } from './spotify';
import { GlobalStyle } from './styles';
import './styles/main.css';
import { MainPage, Login, About, Library } from './pages'
import spotifyLogo from './images/Spotify_Logo_RGB_Black.png'


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])
  
  return null;
}


function App() {

  const [token, setToken] = useState(null)

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <div className="App container">
      <GlobalStyle />
      <header className="App-header">
        {
          // if you dont have a token then provide log in link, if you do then show that they are logged in
          !token ? (
            <Login />
          ) : (
            <Router>
              <ScrollToTop />
              <Routes>
                <Route path="library" element={<Library />} />
                <Route path="about" element={<About />} />
                <Route path="/" element={<MainPage />} />
              </Routes>
            </Router>
          )
        }
      </header>
        <div className="footer">
            <img className="logo footer-item" src={spotifyLogo} alt="spotify logo"/>
            <a href="/about"><button className="b-utton footer-item">About</button> </a>
            {token && <button className="b-utton footer-item" onClick={logout}> Log Out </button>}
         </div>
    </div>
  );
}

export default App;
