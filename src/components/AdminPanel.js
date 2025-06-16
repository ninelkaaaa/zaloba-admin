import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminComplaintList.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('complaints');

  return (
    <div className="admin-container">
      <h2>Панель администратора</h2>

      <div className="tab-buttons">
        <button onClick={() => setActiveTab('complaints')} className={activeTab === 'complaints' ? 'active' : ''}>
          Жалобы
        </button>
        <button onClick={() => setActiveTab('categories')} className={activeTab === 'categories' ? 'active' : ''}>
          Категории
        </button>
        <button onClick={() => setActiveTab('photos')} className={activeTab === 'photos' ? 'active' : ''}>
          Фото
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'complaints' && <ComplaintListTab />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'photos' && <PhotoViewer />}
      </div>
    </div>
  );
};

export default AdminPanel;