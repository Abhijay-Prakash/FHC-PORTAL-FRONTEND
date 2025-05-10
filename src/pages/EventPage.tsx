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
import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import axios from '../axiosConfig';

// Event category color mapping - matching the admin panel
const categoryColors = {
  Workshop: "#6366F1", // Indigo
  Webinar: "#EC4899", // Pink
  Conference: "#8B5CF6", // Purple
  Meetup: "#14B8A6", // Teal
  Seminar: "#F59E0B", // Amber
  Training: "#10B981", // Emerald
  Hackathon: "#EF4444", // Red
  Other: "#6B7280", // Gray
};

// Get color based on category
const getCategoryColor = (category) => {
  return categoryColors[category] || categoryColors.Other;
};

// Get contrasting text color for a background
const getTextColor = (bgColor) => {
  // Simple check for light/dark background
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000000" : "#FFFFFF";
};

export default function EventsPage() {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [feedback, setFeedback] = useState({ show: false, message: '', variant: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  // Fetch all events
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/events/getEvents', {
        withCredentials: true,
      });

      // Add a small delay for animation effect
      setTimeout(() => {
        setEvents(response.data);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching events:', error);
      setIsLoading(false);
    }
  };

  // Fetch registered events
  const fetchRegisteredEvents = async () => {
    try {
      const response = await axios.get('/events/registered', {
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

    // Mock favorite events (would normally come from an API)
    const mockFavorites = ['123', '456']; // Example IDs
    setFavoriteEvents(mockFavorites);
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
        '/events/register',
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

  // Toggle favorite status
  const toggleFavorite = (eventId) => {
    if (favoriteEvents.includes(eventId)) {
      setFavoriteEvents(favoriteEvents.filter(id => id !== eventId));
    } else {
      setFavoriteEvents([...favoriteEvents, eventId]);
    }
  };

  // Filter events based on category and search term
  const filterEvents = (eventList) => {
    return eventList.filter(event => {
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  // Get unique categories from events
  const categories = ['All', ...Array.from(new Set(events.map(event => event.category)))];

  const renderEventCards = (eventList) => {
    const filteredEvents = filterEvents(eventList);

    return (
      <Row className="g-4">
        {isLoading ? (
          <Col xs={12} className="text-center py-5">
            <div className="spinner-border" role="status" style={{ 
              width: "3rem", 
              height: "3rem",
              color: "#6366F1"
            }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </Col>
        ) : filteredEvents.length === 0 ? (
          <Col xs={12} className="text-center py-5">
            <div style={{ fontSize: "4rem", color: "#6B7280" }}>
              <Calendar size={64} />
            </div>
            <h3 className="mt-3">No events found</h3>
            <p className="text-muted">Try adjusting your filters or search criteria</p>
          </Col>
        ) : (
          filteredEvents.map((event) => {
            const categoryColor = getCategoryColor(event.category);
            const textColor = getTextColor(categoryColor);
            const isFavorite = favoriteEvents.includes(event._id);
            const registrationPercentage = (event.attendees / event.capacity) * 100;
            const isAlmostFull = registrationPercentage >= 80;

            return (
              <Col md={6} lg={4} className="mb-2" key={event._id} style={{
                animation: "fadeIn 0.5s ease-in-out",
              }}>
                <Card
                  className="h-100 border-0 shadow"
                  style={{
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div
                    className="card-img-top"
                    style={{
                      height: "8px",
                      backgroundColor: categoryColor,
                    }}
                  ></div>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0">{event.title}</Card.Title>
                      <div>
                        <Button
                          variant="link"
                          className="p-0 me-2"
                          onClick={() => toggleFavorite(event._id)}
                          style={{ color: isFavorite ? '#F59E0B' : '#6B7280' }}
                        >
                          <Heart size={18} fill={isFavorite ? '#F59E0B' : 'none'} />
                        </Button>
                        <Badge
                          pill
                          style={{
                            backgroundColor: categoryColor,
                            color: textColor
                          }}
                        >
                          {event.category}
                        </Badge>
                      </div>
                    </div>

                    <Card.Text>{event.description}</Card.Text>

                    <div className="mb-2 d-flex align-items-center gap-2" style={{ color: "#6B7280" }}>
                      <Calendar size={16} style={{ color: categoryColor }} />
                      {new Date(event.date).toLocaleDateString()}
                    </div>

                    <div className="mb-2 d-flex align-items-center gap-2" style={{ color: "#6B7280" }}>
                      <Clock size={16} style={{ color: categoryColor }} />
                      {event.time}
                    </div>

                    <div className="mb-2 d-flex align-items-center gap-2" style={{ color: "#6B7280" }}>
                      <MapPin size={16} style={{ color: categoryColor }} />
                      {event.location}
                    </div>

                    <div className="mb-2 d-flex align-items-center gap-2" style={{ color: "#6B7280" }}>
                      <Users size={16} style={{ color: categoryColor }} />
                      {event.attendees} / {event.capacity}
                    </div>

                    {isAlmostFull && (
                      <div className="mb-2 text-warning">Hurry, only a few spots left!</div>
                    )}

                    <ProgressBar now={registrationPercentage} label={`${Math.round(registrationPercentage)}%`} />

                    {selectedTab === 'upcoming' && (
                      <Button
                        variant="primary"
                        className="mt-3 w-100"
                        onClick={() => registerForEvent(event._id)}
                        disabled={event.attendees >= event.capacity}
                      >
                        {event.attendees >= event.capacity ? 'Full' : 'Register'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    );
  };

  return (
    <Container>
      <h2 className="my-4">Upcoming Events</h2>

      <Tabs
        activeKey={selectedTab}
        onSelect={(tab) => setSelectedTab(tab)}
        id="events-tabs"
        className="mb-4"
      >
        <Tab eventKey="upcoming" title="Upcoming">
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search for events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <select
              className="form-select"
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {renderEventCards(events)}
        </Tab>
        <Tab eventKey="registered" title="Registered">
          {renderEventCards(registeredEvents)}
        </Tab>
      </Tabs>

      {feedback.show && (
        <div className={`alert alert-${feedback.variant} mt-4`} role="alert">
          {feedback.message}
        </div>
      )}
    </Container>
  );
}
