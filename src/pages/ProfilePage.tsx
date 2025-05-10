import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';

interface User {
  name: string;
  email: string;
  role: string;
  profilePic?: string;
  phone?: string;
  gender?: string;
  semester?: string;
  class?: string;
  membershipId?: string;
  eventsAttended?: string[];
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // dynamic from route
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get<User>(`/users/profile`, {
          withCredentials: true
        });
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <div className="py-5">
          <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: '3rem' }}></i>
          <h4 className="mt-3">User not found</h4>
          <p className="text-muted">The requested profile could not be found.</p>
        </div>
      </Container>
    );
  }

  const getInitials = (name: string): string => {
    return name.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow border-0 rounded-lg overflow-hidden">
            <div className="bg-primary text-white position-relative py-5">
              <div 
                className="position-absolute w-100 h-100" 
                style={{ 
                  top: 0, 
                  left: 0,
                  opacity: 0.2,
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                }}
              ></div>
            </div>
            
            <div className="position-relative" style={{ marginTop: '-75px' }}>
              <div className="text-center">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="img-fluid rounded-circle border border-5 border-white shadow"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle border border-5 border-white shadow d-flex justify-content-center align-items-center bg-secondary text-white mx-auto"
                    style={{ width: '150px', height: '150px', fontSize: '3rem' }}
                  >
                    {getInitials(user.name)}
                  </div>
                )}
                <h3 className="mt-3 mb-1">{user.name}</h3>
                <p className="text-muted">
                  <i className="bi bi-envelope me-2"></i>
                  {user.email}
                </p>
                <Badge bg="info" className="text-capitalize px-3 py-2 mb-3">
                  <i className="bi bi-person-badge me-1"></i>
                  {user.role}
                </Badge>
              </div>
              
              <Card.Body className="pt-0">
                <Row className="mt-4">
                  <Col lg={6}>
                    <div className="info-card mb-3 p-3 border rounded bg-light">
                      <h5 className="border-bottom pb-2 mb-3">Personal Information</h5>
                      <div className="mb-2 d-flex">
                        <div className="info-icon me-3">
                          <i className="bi bi-telephone text-primary"></i>
                        </div>
                        <div>
                          <div className="text-muted small">Phone</div>
                          <div>{user.phone || 'Not provided'}</div>
                        </div>
                      </div>
                      <div className="mb-2 d-flex">
                        <div className="info-icon me-3">
                          <i className="bi bi-gender-ambiguous text-primary"></i>
                        </div>
                        <div>
                          <div className="text-muted small">Gender</div>
                          <div className="text-capitalize">{user.gender || 'Not specified'}</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  
                  <Col lg={6}>
                    <div className="info-card mb-3 p-3 border rounded bg-light">
                      <h5 className="border-bottom pb-2 mb-3">Academic Details</h5>
                      <div className="mb-2 d-flex">
                        <div className="info-icon me-3">
                          <i className="bi bi-calendar3 text-primary"></i>
                        </div>
                        <div>
                          <div className="text-muted small">Semester</div>
                          <div>{user.semester || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="mb-2 d-flex">
                        <div className="info-icon me-3">
                          <i className="bi bi-book text-primary"></i>
                        </div>
                        <div>
                          <div className="text-muted small">Class</div>
                          <div>{user.class || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                
                {user.membershipId && (
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <div className="text-muted small">Membership ID</div>
                      <div>{user.membershipId}</div>
                    </div>
                  </div>
                )}

                {user.eventsAttended && user.eventsAttended.length > 0 && (
                  <div className="mb-3">
                    <h5>Events Attended</h5>
                    <ul className="list-unstyled">
                      {user.eventsAttended.map((event, index) => (
                        <li key={index}>{event}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card.Body>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
