// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Event {
  _id: string;
  title: string;
  description: string;
  // Add other relevant fields
}
  
const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events/getEvents', {
          withCredentials: true,
        });
        const data: Event[] = res.data;

        // Sort events to place "BYTE" event first
        const sortedEvents = data.sort((a, b) => {
          if (a.title === 'BYTE') return -1;
          if (b.title === 'BYTE') return 1;
          return 0;
        });

        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: Event) => {
    if (event.title === 'BYTE') {
      navigate('/byte-register');
    } else {
      // Handle other events if needed
      console.log(`Clicked on event: ${event.title}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Upcoming Events</h2>
      <ul className="list-group">
        {events.map((event) => (
          <li
            key={event._id}
            className="list-group-item list-group-item-action"
            onClick={() => handleEventClick(event)}
            style={{ cursor: 'pointer' }}
          >
            <h5>{event.title}</h5>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
