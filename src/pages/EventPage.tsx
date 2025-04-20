import { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Card,
  Button,
  Badge,
  ProgressBar,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import axios from 'axios';

export default function EventsPage() {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [feedback, setFeedback] = useState({ show: false, message: '', variant: '' });

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events/getEvents', {
        withCredentials: true,
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Fetch registered events
  const fetchRegisteredEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events/registered', {
        withCredentials: true,
      });
      setRegisteredEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching registered events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchRegisteredEvents();
  }, []);

  useEffect(() => {
    if (feedback.show) {
      const timer = setTimeout(() => {
        setFeedback({ ...feedback, show: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Handle registration
  const registerForEvent = async (eventId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/events/register',
        { eventId },
        { withCredentials: true }
      );

      setFeedback({
        show: true,
        message: 'Successfully registered for the event!',
        variant: 'success',
      });

      const updatedEvents = events.map((event) =>
        event._id === eventId ? { ...event, attendees: event.attendees + 1 } : event
      );
      setEvents(updatedEvents);
      fetchRegisteredEvents();
    } catch (error) {
      setFeedback({
        show: true,
        message: error.response
          ? error.response.data.message
          : 'Error registering for event',
        variant: 'danger',
      });
    }
  };

  const renderEventCards = (eventList) => (
    <Row>
      {eventList.length === 0 ? (
        <p className="text-muted">No events to display.</p>
      ) : (
        eventList.map((event, index) => (
          <Col md={6} lg={4} className="mb-4" key={event._id}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <Card.Title>{event.title}</Card.Title>
                  <Badge bg={index % 2 === 0 ? 'primary' : 'secondary'}>
                    {event.category}
                  </Badge>
                </div>
                <Card.Text>{event.description}</Card.Text>
                <div className="mb-2 text-muted d-flex align-items-center gap-2">
                  <Calendar size={16} />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="mb-2 text-muted d-flex align-items-center gap-2">
                  <Clock size={16} />
                  {event.time}
                </div>
                <div className="mb-2 text-muted d-flex align-items-center gap-2">
                  <MapPin size={16} />
                  {event.location}
                </div>
                <div className="mb-2 text-muted d-flex align-items-center gap-2">
                  <Users size={16} />
                  {event.attendees}/{event.capacity}
                </div>
                <ProgressBar
                  now={(event.attendees / event.capacity) * 100}
                  className="mb-3"
                />
                {selectedTab === 'upcoming' && (
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={() => registerForEvent(event._id)}
                  >
                    Register
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))
      )}
    </Row>
  );

  return (
    <Container className="my-4">
      {feedback.show && (
        <div className="mb-3">
          <div
            className={`alert alert-${feedback.variant} alert-dismissible fade show`}
            role="alert"
          >
            {feedback.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setFeedback({ ...feedback, show: false })}
            ></button>
          </div>
        </div>
      )}

      <h1 className="mb-2">Events</h1>
      <p className="text-muted mb-4">Browse and register for upcoming events</p>

      <div className="d-flex justify-content-between flex-wrap mb-4 gap-2">
        <div className="btn-group">
          <Button variant="outline-primary">All Events</Button>
          <Button variant="outline-primary">Workshops</Button>
          <Button variant="outline-primary">Hackathons</Button>
          <Button variant="outline-primary">Meetups</Button>
        </div>
        <Button variant="primary">Create Event</Button>
      </div>

      <Tabs activeKey={selectedTab} onSelect={(k) => setSelectedTab(k)} className="mb-3" fill>
        <Tab eventKey="upcoming" title="Upcoming">
          {renderEventCards(events)}
        </Tab>

        <Tab eventKey="registered" title="Registered">
          {renderEventCards(registeredEvents)}
        </Tab>

        <Tab eventKey="past" title="Past Events">
          <p className="text-muted">These are your past events (demo only).</p>
        </Tab>
      </Tabs>
    </Container>
  );
}
