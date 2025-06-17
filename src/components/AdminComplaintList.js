import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AdminComplaintList.css';

const AdminComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [complaintsRes, statusesRes] = await Promise.all([
        axios.get('https://zaloba-backend.onrender.com/api/complaints'),
        axios.get('https://zaloba-backend.onrender.com/api/statuses'),
      ]);
      setComplaints(complaintsRes.data);
      setStatuses(statusesRes.data);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatusId) => {
    try {
      await axios.put(`https://zaloba-backend.onrender.com/api/complaints/${complaintId}/status`, {
        status_id: newStatusId,
      });
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
            ? {
                ...c,
                status_id: newStatusId,
                status_name: statuses.find((s) => s.id === newStatusId)?.name,
              }
            : c
        )
      );
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
    }
  };

  const exportToExcel = () => {
    const dataToExport = complaints
      .filter((c) => {
        const matchDate = selectedDate
          ? new Date(c.created_at).toDateString() === selectedDate.toDateString()
          : true;
        const matchCategory = categorySearch
          ? c.category.toLowerCase().includes(categorySearch.toLowerCase())
          : true;
        return matchDate && matchCategory;
      })
      .map((c) => ({
        Категория: c.category,
        Сообщение: c.message,
        Фото: c.photo_url
          ? `https://zaloba-backend.onrender.com/uploads/${c.photo_url}`
          : '',
        Статус: c.status_name,
        Дата: new Date(c.created_at).toLocaleString('ru-RU', {
          timeZone: 'Asia/Almaty',
        }),
      }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Жалобы');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'complaints.xlsx');
  };

  if (loading) {
    return <p className="loading">Загрузка...</p>;
  }

  return (
    <div className="admin-container">
      <h2>Панель управления жалобами и предложениями</h2>

      <div className="admin-controls">
        <label htmlFor="date-picker">Фильтр по дате:</label>
        <DatePicker
          id="date-picker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd.MM.yyyy"
          placeholderText="Выберите дату"
        />

        <label htmlFor="category-search">Поиск по категории:</label>
        <input
          id="category-search"
          type="text"
          placeholder="Введите категорию"
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
        />

        <button onClick={exportToExcel}>Экспорт в Excel</button>
      </div>

      <table className="complaint-table">
        <thead>
          <tr>
            <th>Категория</th>
            <th>Сообщение</th>
            <th>Фото</th>
            <th>Статус</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {complaints
            .filter((c) => {
              const matchDate = selectedDate
                ? new Date(c.created_at).toDateString() === selectedDate.toDateString(): true;
                const matchCategory = categorySearch
                  ? c.category.toLowerCase().includes(categorySearch.toLowerCase())
                  : true;
                return matchDate && matchCategory;
              })
              .map((c) => (
                <tr key={c.id}>
                  <td>{c.category}</td>
                  <td>{c.message}</td>
                  <td>
                    {c.photo_url ? (
                      <a
                        href={`https://zaloba-backend.onrender.com/${c.photo_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Открыть
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <select
                      value={c.status_id}
                      onChange={(e) => handleStatusChange(c.id, Number(e.target.value))}
                    >
                      {statuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {new Date(c.created_at).toLocaleString('ru-RU', {
                      timeZone: 'Asia/Almaty',
                    })}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AdminComplaintList;