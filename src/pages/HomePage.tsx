import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, Star, Award, TrendingUp } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees?: number;
  capacity?: number;
  tags?: string[];
  // Add other relevant fields
}

// Event category color mapping - matching the previous pages
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
const getCategoryColor = (category: string) => {
  return categoryColors[category as keyof typeof categoryColors] || categoryColors.Other;
};

// Get contrasting text color for a background
const getTextColor = (bgColor: string) => {
  // Simple check for light/dark background
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000000" : "#FFFFFF";
};

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/events/getEvents', {
          withCredentials: true,
        });
        const data: Event[] = res.data;

        // Find BYTE event
        const byteEvent = data.find(event => event.title === 'BYTE');
        
        // Set featured event
        if (byteEvent) {
          setFeaturedEvent(byteEvent);
        }

        // Sort remaining events
        const otherEvents = data.filter(event => event.title !== 'BYTE');
        
        // Sort events by date (assuming date is available)
        const sortedEvents = otherEvents.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setTimeout(() => {
          setEvents(sortedEvents);
          setIsLoading(false);
        }, 500); // Add small delay for animation
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    if (event.title === 'BYTE') {
      navigate('/byte-register');
    } else {
      // Navigate to events page with selected event
      navigate('/events', { state: { selectedEvent: event._id } });
    }
  };

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
      minHeight: "100vh"
    }}>
      {/* Hero Section with Featured (BYTE) Event */}
      {featuredEvent && (
        <div 
          className="py-5" 
          style={{ 
            background: "linear-gradient(45deg, #4F46E5, #7C3AED)",
            color: "white"
          }}
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div style={{ animation: "fadeInUp 0.6s ease-out" }}>
                  <h1 className="display-4 fw-bold mb-4" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}>
                    <Award className="me-2" size={42} />
                    Featured Event
                  </h1>
                  <div className="mb-3 d-inline-block px-3 py-1 rounded-pill" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <Star className="me-1" size={16} fill="white" />
                    <span>Don't miss out!</span>
                  </div>
                  <h2 className="display-5 fw-bold mb-3">{featuredEvent.title}</h2>
                  <p className="lead mb-4">{featuredEvent.description}</p>
                  
                  <div className="d-flex flex-wrap gap-4 mb-4">
                    {featuredEvent.date && (
                      <div className="d-flex align-items-center">
                        <Calendar size={20} className="me-2" />
                        <span>{new Date(featuredEvent.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {featuredEvent.time && (
                      <div className="d-flex align-items-center">
                        <Clock size={20} className="me-2" />
                        <span>{featuredEvent.time}</span>
                      </div>
                    )}
                    
                    {featuredEvent.location && (
                      <div className="d-flex align-items-center">
                        <MapPin size={20} className="me-2" />
                        <span>{featuredEvent.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="btn btn-light btn-lg px-4 d-inline-flex align-items-center gap-2"
                    onClick={() => handleEventClick(featuredEvent)}
                    style={{
                      transition: "transform 0.3s, box-shadow 0.3s",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <div 
                      style={{ 
                        position: "absolute", 
                        top: 0, 
                        left: "-100%", 
                        width: "200%", 
                        height: "100%", 
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        transition: "left 0.5s"
                      }}
                      className="shine-effect"
                    ></div>
                    Register Now
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
              <div className="col-lg-6 d-none d-lg-block">
                <div 
                  className="p-4 rounded-4 shadow-lg bg-white text-dark mx-auto" 
                  style={{ 
                    maxWidth: "500px", 
                    transform: "rotate(2deg)",
                    animation: "fadeInRight 0.6s ease-out"
                  }}
                >
                  <div 
                    className="card-img-top rounded-3 mb-3" 
                    style={{ 
                      height: "8px", 
                      backgroundColor: getCategoryColor(featuredEvent.category || "Other"),
                    }}
                  ></div>
                  <h3 className="fw-bold">{featuredEvent.title}</h3>
                  <div className="mb-2">
                    {featuredEvent.tags && featuredEvent.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="badge me-1 mb-1" 
                        style={{ 
                          backgroundColor: `${getCategoryColor(featuredEvent.category || "Other")}20`,
                          color: getCategoryColor(featuredEvent.category || "Other")
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="d-flex align-items-center mb-2">
                    <Calendar size={16} className="me-2 text-primary" />
                    <span>{new Date(featuredEvent.date || "").toLocaleDateString()}</span>
                  </div>
                  
                  {featuredEvent.capacity && featuredEvent.attendees && (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <Users size={16} className="me-2 text-primary" />
                        <span>{featuredEvent.attendees}/{featuredEvent.capacity}</span>
                      </div>
                      <div 
                        className="badge" 
                        style={{ 
                          backgroundColor: getCategoryColor(featuredEvent.category || "Other"),
                          color: getTextColor(getCategoryColor(featuredEvent.category || "Other"))
                        }}
                      >
                        {featuredEvent.category}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Events Section */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1" style={{ color: "#4F46E5" }}>
              <Calendar className="me-2" />
              Upcoming Events
            </h2>
            <p className="text-muted">Explore and register for our latest events</p>
          </div>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => navigate('/events')}
            style={{
              background: "linear-gradient(45deg, #4F46E5, #7C3AED)",
              border: "none",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            View All Events
            <ArrowRight size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" style={{ 
              width: "3rem", 
              height: "3rem",
              color: "#6366F1"
            }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem", color: "#6B7280" }}>
              <Calendar size={64} />
            </div>
            <h3 className="mt-3">No upcoming events</h3>
            <p className="text-muted">Check back soon for new events</p>
          </div>
        ) : (
          <div className="row g-4">
            {events.slice(0, 6).map((event, index) => {
              const categoryColor = getCategoryColor(event.category || "Other");
              const textColor = getTextColor(categoryColor);
              const delay = index * 0.1;
              
              return (
                <div 
                  key={event._id} 
                  className="col-md-6 col-lg-4"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${delay}s both`
                  }}
                >
                  <div 
                    className="card h-100 border-0 shadow-sm" 
                    onClick={() => handleEventClick(event)}
                    style={{ 
                      cursor: 'pointer',
                      transition: "transform 0.3s, box-shadow 0.3s",
                      borderRadius: "8px",
                      overflow: "hidden"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    <div 
                      className="card-img-top" 
                      style={{ 
                        height: "6px", 
                        backgroundColor: categoryColor
                      }}
                    ></div>
                    
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <h5 className="card-title fw-bold mb-0">{event.title}</h5>
                        <span 
                          className="badge" 
                          style={{ 
                            backgroundColor: categoryColor,
                            color: textColor
                          }}
                        >
                          {event.category}
                        </span>
                      </div>
                      
                      <p className="card-text text-muted mb-3" style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                      }}>
                        {event.description}
                      </p>
                      
                      <div className="d-flex flex-wrap gap-3">
                        {event.date && (
                          <div className="d-flex align-items-center text-muted small">
                            <Calendar size={14} className="me-1" style={{ color: categoryColor }} />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {event.time && (
                          <div className="d-flex align-items-center text-muted small">
                            <Clock size={14} className="me-1" style={{ color: categoryColor }} />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="card-footer bg-white border-0 pt-0">
                      <div className="d-flex justify-content-between align-items-center">
                        {event.location && (
                          <div className="d-flex align-items-center text-muted small">
                            <MapPin size={14} className="me-1" style={{ color: categoryColor }} />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        <div className="btn btn-sm" style={{ color: categoryColor }}>
                          View Details <ArrowRight size={14} className="ms-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Quick Links Section */}
        <div className="mt-5">
          <h3 className="mb-4 text-center" style={{ color: "#4F46E5" }}>Quick Links</h3>
          <div className="row g-4 justify-content-center">
            {[
              { title: "Workshops", icon: <Users size={32} />, color: categoryColors.Workshop },
              { title: "Conferences", icon: <Star size={32} />, color: categoryColors.Conference },
              { title: "Hackathons", icon: <TrendingUp size={32} />, color: categoryColors.Hackathon }
            ].map((item, index) => (
              <div key={index} className="col-md-4">
                <div 
                  className="card border-0 shadow-sm text-center p-4 h-100"
                  style={{ 
                    borderRadius: "12px",
                    transition: "transform 0.3s, box-shadow 0.3s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div 
                    className="mx-auto d-flex align-items-center justify-content-center mb-3" 
                    style={{ 
                      width: "64px", 
                      height: "64px", 
                      borderRadius: "50%", 
                      backgroundColor: `${item.color}20`,
                      color: item.color
                    }}
                  >
                    {item.icon}
                  </div>
                  <h5 className="fw-bold">{item.title}</h5>
                  <p className="text-muted mb-3">Explore our {item.title.toLowerCase()} and enhance your skills</p>
                  <button 
                    className="btn btn-sm" 
                    style={{ color: item.color }}
                    onClick={() => navigate('/events')}
                  >
                    Browse {item.title} <ArrowRight size={14} className="ms-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Banner */}
      <div 
        className="py-5 mt-5 text-center" 
        style={{ 
          background: "linear-gradient(45deg, #4F46E5, #7C3AED)",
          color: "white"
        }}
      >
        <div className="container">
          <h2 className="mb-3">Ready to join our next event?</h2>
          <p className="lead mb-4">Register now and be part of our vibrant community</p>
          <button 
            className="btn btn-light btn-lg px-4"
            onClick={() => navigate('/events')}
            style={{
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
          >
            View All Events
          </button>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px) rotate(2deg); }
          to { opacity: 1; transform: translateX(0) rotate(2deg); }
        }
        
        .btn:hover .shine-effect {
          left: 100%;
        }
      `}</style>
    </div>
  );
};

export default HomePage;