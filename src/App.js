import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminComplaintList from './components/AdminComplaintList';
import CategoryManager from './components/CategoryManager'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Жалобы</Link></li>
            <li><Link to="/categories">Категории</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<AdminComplaintList />} />
          <Route path="/categories" element={<CategoryManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;