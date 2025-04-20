import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [semester, setSemester] = useState('');
  const [classValue, setClassValue] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        phone,
        password,
        gender,
        semester,
        class: classValue,
      },
    {
      
      withCredentials:true
    });
      navigate('/');
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-3">Signup</h3>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            className="form-control"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Semester</label>
          <input
            type="number"
            className="form-control"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            min="1"
            max="8"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Class</label>
          <select
            className="form-control"
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
            required
          >
            <option value="">Select Class</option>
            <option value="CSA">CSA</option>
            <option value="CSB">CSB</option>
            <option value="CSC">CSC</option>
            <option value="CSD">CSD</option>
            <option value="EC">EC</option>
            <option value="EI">EI</option>
            <option value="EE">EE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success w-100">Signup</button>
      </form>
      {msg && <div className="alert alert-danger mt-3">{msg}</div>}
      <p className="mt-3 text-center">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default SignupPage;
