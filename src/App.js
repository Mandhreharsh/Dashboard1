// App.js
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Doctors from './pages/Doctors';
import Messages from './pages/Messages';
import Logout from './pages/Logout';
import Appointment from './pages/Appointment';
import PrescriptionPage from './pages/PrescriptionPage';
import PrescriptionHistoryPage from './pages/PrescriptionHistoryPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="flex flex-row">
     
     <Navbar />

      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/prescription" element={<PrescriptionPage />} />
            <Route path="/prescription-history" element={<PrescriptionHistoryPage />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
