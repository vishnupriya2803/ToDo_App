import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg('');
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/login', {
                email,
                password
            });
            localStorage.setItem("token", res.data.token)
            setMsg("User Login Successfully");
            setUser({ email });
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Login failed");
        }
    }

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <form onSubmit={handleLogin} className='flex flex-col gap-3'>
                <h1 className="text-xl font-semibold text-blue-700 mb-2">Login</h1>
                <label className="text-sm">Email:</label>
                <input type="email" className="border rounded px-2 py-1" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className="text-sm">Password:</label>
                <input type="password" className="border rounded px-2 py-1" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className='bg-blue-500 text-white rounded py-2 mt-2 hover:bg-blue-600'>Login</button>
            </form>
            {msg && <div className="mt-2 text-green-600 text-sm">{msg}</div>}
            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        </div>
    )
}

export default Login