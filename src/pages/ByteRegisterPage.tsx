import { useState, useEffect, FormEvent, JSX } from 'react';
import axios from '../axiosConfig';
import { Loader2, Globe, Server, Atom, BrainCircuit, CheckCircle, Info } from 'lucide-react';

interface DomainIcons {
  [key: string]: JSX.Element;
}

interface DomainLabels {
  [key: string]: string;
}

interface DomainDescriptions {
  [key: string]: string;
}

interface RegistrationResponse {
  registered: boolean;
  domain: string;
}

const domainIcons: DomainIcons = {
  webdev: <Globe className="text-primary" size={48} />,
  backend: <Server className="text-success" size={48} />,
  react: <Atom className="text-info" size={48} />,
  ml: <BrainCircuit className="text-warning" size={48} />,
};

const domainLabels: DomainLabels = {
  webdev: 'Web Development',
  backend: 'Backend Development',
  react: 'React Development',
  ml: 'Machine Learning',
};

const domainDescriptions: DomainDescriptions = {
  webdev: 'Learn HTML, CSS, JavaScript and build responsive websites from scratch.',
  backend: 'Master server-side technologies, APIs, and database management.',
  react: 'Create dynamic user interfaces with React.js and modern frontend tools.',
  ml: 'Explore data science, neural networks, and AI model development.',
};

const ByteRegistrationPage = () => {
  const [domain, setDomain] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingRegistration, setCheckingRegistration] = useState<boolean>(true);


  // Check if already registered when component loads
  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const res = await axios.get<RegistrationResponse>('/byte/my-registration', {
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

  const handleByteRegistration = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await axios.post('/byte/register-byte', { domain }, { withCredentials: true });

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
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center">
          <Loader2 className="spinner-border text-primary" size={48} />
          <p className="mt-3 text-muted">Checking registration status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow border-0 rounded-lg overflow-hidden">
            <div className="card-header text-center bg-primary text-white py-3">
              <h3 className="mb-0">BYTE Class Registration</h3>
              <p className="text-white-50 small mb-0">Enhance your skills with specialized training</p>
            </div>

            <div className="card-body p-4">
              {!success ? (
                <>
                  <div className="mb-4 text-center">
                    <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle p-3 mb-3">
                      <BrainCircuit size={32} className="text-primary" />
                    </div>
                    <h4>Choose Your Learning Path</h4>
                    <p className="text-muted">Select a domain that aligns with your interests and career goals</p>
                  </div>

                  <form onSubmit={handleByteRegistration}>
                    <div className="row mb-4">
                      {Object.keys(domainLabels).map((key) => (
                        <div className="col-md-6 mb-3" key={key}>
                          <div
                            className={`domain-card p-3 border rounded-lg ${domain === key ? 'border-primary' : ''}`}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: domain === key ? 'rgba(13, 110, 253, 0.05)' : 'white',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={() => setDomain(key)}
                        
                          >
                            <div className="d-flex align-items-center">
                              <div className="me-3">{domainIcons[key as keyof DomainIcons]}</div>
                              <div>
                                <div className="d-flex align-items-center">
                                  <h5 className="mb-0">{domainLabels[key as keyof DomainLabels]}</h5>
                                  {domain === key && <CheckCircle size={18} className="text-primary ms-2" />}
                                </div>
                                <p className="text-muted small mb-0 mt-1">
                                  {domainDescriptions[key as keyof DomainDescriptions]}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <input type="hidden" value={domain} required />

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading || !domain}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="spinner-border spinner-border-sm me-2" />
                            Processing...
                          </>
                        ) : (
                          <>Register for {domain ? domainLabels[domain as keyof DomainLabels] : 'Selected Domain'}</>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle p-4 mb-4">
                    {domainIcons[domain as keyof DomainIcons]}
                  </div>

                  <h3 className="text-success mb-3">Registration Successful!</h3>

                  <div className="mb-4">
                    <p className="mb-1">You are now registered for:</p>
                    <h4 className="text-primary">{domainLabels[domain as keyof DomainLabels]}</h4>
                  </div>

                  <div className="p-3 bg-light rounded mb-4">
                    <div className="d-flex align-items-center">
                      <Info size={24} className="text-muted me-3" />
                      <div className="text-start">
                        <h5 className="mb-1">What's Next?</h5>
                        <p className="text-muted mb-0">
                          Check your email for class schedule details and preparation materials.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-primary">View Class Details</button>
                  </div>
                </div>
              )}

              {msg && !success && (
                <div className="alert alert-danger d-flex align-items-center mt-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{msg}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ByteRegistrationPage;
