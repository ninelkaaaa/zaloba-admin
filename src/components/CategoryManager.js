import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminComplaintList.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://zaloba-backend.onrender.com/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке категорий:', err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post('https://zaloba-backend.onrender.com/api/categories', {
        name: newCategory,
      });
      setMessage('Категория добавлена');
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      console.error('Ошибка при добавлении категории:', err);
      setMessage('Ошибка при добавлении категории');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://zaloba-backend.onrender.com/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Ошибка при удалении категории:', err);
    }
  };

  return (
    <div className="admin-categories">
      <h2>Управление категориями</h2>

      <div className="add-category-form">
        <input
          type="text"
          placeholder="Название новой категории"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Добавить</button>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat.id} className="category-item">
            <span>{cat.name}</span>
            <button onClick={() => handleDelete(cat.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;