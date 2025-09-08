import axios from 'axios';
import { useState } from 'react';

const Input = ({ addTask }) => {
    const [task, setTask] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/submit", {
                text: task,
                completed: false
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            addTask(res.data);
            setTask("")
        } catch (error) {
            setError(error.response?.data?.error || error.message || "Error submitting form");
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input type="text" placeholder='Enter the task' className='border rounded px-2 py-1 flex-1' value={task} onChange={(e) => setTask(e.target.value)} />
                <button className="bg-blue-500 text-white rounded px-4 py-1 hover:bg-blue-600">Add Task</button>
            </form>
            {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
        </>
    )
}

export default Input