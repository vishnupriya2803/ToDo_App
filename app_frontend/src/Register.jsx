import axios from 'axios';
import { useState } from 'react';


const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/register', {
                fullName,
                email,
                password
            });
            setMsg(res.data.message || "Registration successful!");
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Registration failed");
        }
    }

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h1 className='text-xl font-semibold text-blue-700 mb-2'>Register</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                <label htmlFor="fullName" className="text-sm">Full Name:</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='Enter your full name' className="border rounded px-2 py-1" required />
                <label htmlFor="email" className="text-sm">Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' className="border rounded px-2 py-1" required />
                <label htmlFor="password" className="text-sm">Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' className="border rounded px-2 py-1" required />
                <button className='bg-blue-500 text-white rounded py-2 mt-2 hover:bg-blue-600'>Register</button>
            </form>
            {msg && <p className='mt-2 text-green-600 text-sm'>{msg}</p>}
            {error && <p className='mt-2 text-red-500 text-sm'>{error}</p>}
        </div>
    )
}

export default Register