
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Doctors from './pages/Doctors';
import AddAdmin from './pages/AddAdmin';
import AddDoctors from './pages/AddDoctors';
import Messages from './pages/Messages';
import Logout from './pages/Logout';
import Appointment from './pages/Appointment';


function App() {


  return (
    <div className='flex flex-row'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/appointment" element={<Appointment/>}/>
        <Route path="/doctors" element={<Doctors/>}/>
        <Route path="/addadmin" element={<AddAdmin/>}/>
        <Route path="/adddoctors" element={<AddDoctors/>}/>
        <Route path="/message" element={<Messages/>}/>
        <Route path="/logout" element={<Logout/>}/>
      </Routes>
    </div>
  );
}

export default App;


