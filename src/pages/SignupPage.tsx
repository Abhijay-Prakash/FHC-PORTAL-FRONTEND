import { useState } from 'react';
import axios from '../axiosConfig';
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(''); // Clear any previous error messages
    
    try {
      await axios.post('/auth/register', {
        name,
        email,
        phone,
        password,
        gender,
        semester,
        class: classValue,
      }, {
        withCredentials: true
      });
      navigate('/');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 rounded-lg">
            <div className="card-header text-center bg-primary text-white py-3">
              <h3 className="mb-0">Create Account</h3>
              <p className="text-white-50 small mb-0">Join our community today</p>
            </div>
            
            <div className="card-body p-4">
              {msg && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{msg}</div>
                </div>
              )}
              
              <form onSubmit={handleSignup}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      placeholder="Your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-gender-ambiguous"></i>
                    </span>
                    <select
                      className="form-control"
                      id="gender"
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
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="semester" className="form-label">
                      Semester
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-calendar3"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        id="semester"
                        placeholder="1-8"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        min="1"
                        max="8"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="class" className="form-label">
                      Class
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-book"></i>
                      </span>
                      <select
                        className="form-control"
                        id="class"
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
                  </div>
                </div>
                
                <div className="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating account...
                      </>
                    ) : (
                      <>Sign up</>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="text-decoration-none">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;