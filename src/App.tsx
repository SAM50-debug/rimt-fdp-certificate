import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Verify from './pages/Verify';
import NotFound from './pages/NotFound';
import Preview from './pages/Preview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preview/:employeeCode" element={<Preview />} />
        <Route path="/verify/:serialNo" element={<Verify />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;