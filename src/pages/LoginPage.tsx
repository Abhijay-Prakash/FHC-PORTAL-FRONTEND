import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(''); // Clear any previous error messages

    try {
      await axios.post('http://localhost:5000/api/auth/login', { email, password },
        {
          withCredentials: true
        }
      );

      // No need to save token since it's set in cookies by the backend
      navigate('/byte-register'); // Redirect to the homepage after successful login
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-3">Login</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {msg && <div className="alert alert-danger mt-3">{msg}</div>}

      <p className="mt-3 text-center">
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default LoginPage;
