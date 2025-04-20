import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';

const ProfilePage = () => {
  const { userId } = useParams(); // dynamic from route
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/profile`,
            {
                withCredentials:true
            }
        );
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
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="text-center mt-5">
        <h4>User not found</h4>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white text-center">
              <h4>{user.name}</h4>
              <small>{user.email}</small>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-3">
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="img-fluid rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </Col>
                <Col md={8}>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <p><strong>Semester:</strong> {user.semester}</p>
                  <p><strong>Class:</strong> {user.class}</p>
                  {user.membershipId && (
                    <p><strong>Membership ID:</strong> {user.membershipId}</p>
                  )}
                  <p><strong>Role:</strong> 
                    <Badge bg="info" className="ms-2 text-capitalize">{user.role}</Badge>
                  </p>
                  <p><strong>Events Attended:</strong> {user.eventsAttended.length}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
