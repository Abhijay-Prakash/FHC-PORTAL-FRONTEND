import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ByteRegisterPage from './pages/ByteRegisterPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventPage';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <div className="d-flex">
      {/* Sidebar (always rendered) */}
      <Sidebar />

      {/* Main content area */}
      <div
        className="flex-grow-1 p-3 "
        style={{ marginLeft: '75px', width: '100%' }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/byte-register" element={<ByteRegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
      
        </Routes>
      </div>
    </div>
  );
}

export default App;
