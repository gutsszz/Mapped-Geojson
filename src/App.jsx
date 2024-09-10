import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import MapboxApp from './MapboxApp'; // New component containing Sidebar + Mapbox
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/mapbox" element={<MapboxApp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
