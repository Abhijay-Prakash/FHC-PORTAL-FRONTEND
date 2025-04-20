import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Globe, Server, Atom, BrainCircuit } from 'lucide-react';

const domainIcons: Record<string, JSX.Element> = {
  webdev: <Globe className="text-primary" size={32} />,
  backend: <Server className="text-success" size={32} />,
  react: <Atom className="text-info" size={32} />,
  ml: <BrainCircuit className="text-warning" size={32} />,
};

const domainLabels: Record<string, string> = {
  webdev: 'Web Development',
  backend: 'Backend Development',
  react: 'React Development',
  ml: 'Machine Learning',
};

const ByteRegistrationPage = () => {
  const [domain, setDomain] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  // 👇 Check if already registered when component loads
  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/byte/my-registration', {
          withCredentials: true,
        });

        if (res.data.registered) {
          setSuccess(true);
          setDomain(res.data.domain);
        }
      } catch (err) {
        console.error('Registration check failed');
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, []);

  const handleByteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/byte/register-byte',
        { domain },
        { withCredentials: true }
      );

      setSuccess(true);
      setMsg(res.data.message);
    } catch (err: any) {
      setSuccess(false);
      setMsg(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (checkingRegistration) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loader2 className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card p-5 shadow-lg text-center" style={{ maxWidth: 500, width: '100%' }}>
        {!success ? (
          <>
            <h3 className="mb-4">📚 Register for BYTE Class</h3>
            <form onSubmit={handleByteRegistration}>
              <div className="mb-3 text-start">
                <label className="form-label">Select a Domain</label>
                <select
                  className="form-select"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                >
                  <option value="">Choose a domain</option>
                  <option value="webdev">🌐 Web Development</option>
                  <option value="backend">🧩 Backend Development</option>
                  <option value="react">⚛️ React Development</option>
                  <option value="ml">🤖 Machine Learning</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? <Loader2 className="spinner-border spinner-border-sm me-2" /> : '🚀 Register'}
              </button>
            </form>
            {msg && (
              <div className={`alert mt-4 ${success ? 'alert-success' : 'alert-danger'}`}>
                {msg}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-3">{domainIcons[domain]}</div>
            <h4 className="mb-2 text-success">You have successfully registered!</h4>
            <p className="mb-0">
              Registered Domain: <strong>{domainLabels[domain]}</strong>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ByteRegistrationPage;
