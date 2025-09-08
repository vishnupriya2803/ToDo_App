import axios from 'axios';
import { useEffect, useState } from 'react';
import Input from './Input';
import Output from './Output';

const Manger = () => {
    const [task, setTask] = useState([]);
    const [error, setError] = useState('');

    const fetch = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get('http://localhost:5000/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTask(Array.isArray(res.data) ? res.data : []);
            setError('');
        } catch (error) {
            setError("Error fetching tasks: " + (error.response?.data?.error || error.message));
            setTask([]);
        }
    }
    useEffect(() => {
        fetch();
    }, [])

    const onAddTask = (task) => {
        if (!task || !task.text || !task.text.trim()) return;
        setTask((prev) => [...prev, task])
    }

    const handleToggle = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(
                `http://localhost:5000/tasks/${id}/toggle`, {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTask((prev) =>
                prev.map((task) => (task._id === id ? res.data : task))
            )
        } catch (error) {
            setError('Error toggling task: ' + (error.response?.data?.error || error.message));
        }
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTask((prev) => prev.filter((task) => task._id !== id));
        } catch (error) {
            setError("Error deleting task: " + (error.response?.data?.error || error.message));
        }
    }
    return (
        <div className="bg-white p-6 rounded shadow-md">
            <Input addTask={onAddTask} />
            {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
            <Output tasks={task} onToggle={handleToggle} onDelete={handleDelete} />
        </div>
    )
}

export default Manger