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
import { Calendar, Clock, MapPin, Users, Search, Filter, Star, Heart } from 'lucide-react';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:5000/api/events/getEvents', {
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
                      <div className="d-flex justify-content-between w-100 align-items-center">
                        <span>{event.attendees}/{event.capacity}</span>
                        {isAlmostFull && (
                          <Badge bg="warning" text="dark" pill className="ms-2">Almost Full</Badge>
                        )}
                      </div>
                    </div>
                    
                    <ProgressBar 
                      now={registrationPercentage} 
                      className="mb-3" 
                      variant={
                        registrationPercentage >= 80 ? "danger" :
                        registrationPercentage >= 50 ? "warning" : "success"
                      }
                      style={{ height: "8px" }}
                    />
                    
                    {selectedTab === 'upcoming' && (
                      <Button
                        style={{
                          backgroundColor: categoryColor,
                          borderColor: categoryColor,
                          color: textColor,
                          transition: "transform 0.2s, opacity 0.2s",
                          position: "relative",
                          overflow: "hidden"
                        }}
                        className="w-100 position-relative"
                        onClick={() => registerForEvent(event._id)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.opacity = "0.9";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                      >
                        <div 
                          style={{ 
                            position: "absolute", 
                            top: 0, 
                            left: "-100%", 
                            width: "200%", 
                            height: "100%", 
                            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                            transition: "left 0.5s"
                          }}
                          className="shine-effect"
                        ></div>
                        Register Now
                      </Button>
                    )}
                    
                    {selectedTab === 'registered' && (
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-secondary" 
                          className="w-50"
                        >
                          Cancel
                        </Button>
                        <Button 
                          style={{
                            backgroundColor: categoryColor,
                            borderColor: categoryColor,
                            color: textColor
                          }}
                          className="w-50"
                        >
                          View Details
                        </Button>
                      </div>
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
    <div style={{ 
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
      minHeight: "100vh",
      paddingTop: "2rem",
      paddingBottom: "2rem"
    }}>
      <Container>
        {feedback.show && (
          <div className="mb-4 animate__animated animate__fadeIn">
            <div
              className={`alert alert-${feedback.variant} alert-dismissible fade show shadow-sm`}
              role="alert"
              style={{ 
                borderLeft: `4px solid ${feedback.variant === 'success' ? '#10B981' : '#EF4444'}`,
                borderRadius: "4px",
                animation: "slideDown 0.3s ease-out"
              }}
            >
              <div className="d-flex align-items-center">
                {feedback.variant === 'success' ? (
                  <div className="me-2 text-success">✓</div>
                ) : (
                  <div className="me-2 text-danger">✕</div>
                )}
                {feedback.message}
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setFeedback({ ...feedback, show: false })}
              ></button>
            </div>
          </div>
        )}

        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold" style={{ 
            color: "#4F46E5",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)" 
          }}>
            <Calendar className="me-2" />
            Events Explorer
          </h1>
          <p className="lead text-muted">Browse and register for exciting upcoming events</p>
        </div>

        <div className="card border-0 shadow-sm mb-4 p-3">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  placeholder="Search events by title, description or location" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2 flex-wrap">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Filter size={18} />
                  </span>
                  <select 
                    className="form-select border-start-0"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <Button 
                  style={{
                    background: "linear-gradient(45deg, #4F46E5, #7C3AED)",
                    border: "none",
                  }}
                >
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs 
          activeKey={selectedTab} 
          onSelect={(k) => setSelectedTab(k)} 
          className="mb-4" 
          fill
          style={{
            borderBottom: "2px solid #f0f0f0"
          }}
        >
          <Tab 
            eventKey="upcoming" 
            title={
              <div className="d-flex align-items-center">
                <Calendar size={16} className="me-2" />
                <span>Upcoming</span>
              </div>
            }
          >
            {renderEventCards(events)}
          </Tab>

          <Tab 
            eventKey="registered" 
            title={
              <div className="d-flex align-items-center">
                <Star size={16} className="me-2" />
                <span>Registered</span>
              </div>
            }
          >
            {renderEventCards(registeredEvents)}
          </Tab>

          <Tab 
            eventKey="past" 
            title={
              <div className="d-flex align-items-center">
                <Clock size={16} className="me-2" />
                <span>Past Events</span>
              </div>
            }
          >
            <div className="text-center py-5">
              <div style={{ fontSize: "4rem", color: "#6B7280" }}>
                <Clock size={64} />
              </div>
              <h3 className="mt-3">Past Events</h3>
              <p className="text-muted">This is where your attended events will appear</p>
            </div>
          </Tab>
        </Tabs>
      </Container>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .btn:hover .shine-effect {
          left: 100%;
        }
        
        .badge {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}