// App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.css";
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import UserDashboard from './components/Dashboard';
import FacultyDashboard from './components/FacultyDashboard';
import FileComplaint from './components/FileComplaint';
import Profile from './components/Profile';
import AdminDashboard from "./components/AdminDashboard";
import About from './components/About';
// import AssignPage from "./pages/Assignpage";
import AssignPage from "./pages/AssignPage";
import ProtectedRoute from './components/ProtectedRoute';
import FacultyActionPage from "./pages/FacultyActionPage";
import  AdminAssignPage from "./pages/AdminAssignPage";
import Dashboard from "./pages/Analytics";
import PublicAnalytics from "./pages/PublicAnalytics";
import Chatbot from "./components/Chatbot";
import ScheduleMeeting from "./components/ScheduleMeeting";

function App() {
  return (
    <BrowserRouter>
     <Chatbot />
      <Routes>

        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path="/assign" element={<AssignPage />} />
        <Route path="/public-analytics" element={<PublicAnalytics />} />

        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path='/admin-dashboard'
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student / Staff */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'STAFF']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Faculty */}
        <Route
          path='/faculty-dashboard'
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Faculty Action */}
        <Route
          path="/faculty-action/:id"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyActionPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Assign */}
        <Route
          path="/admin-assign/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAssignPage />
            </ProtectedRoute>
          }
        />

        {/* Common */}
        <Route
          path='/file-complaint'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'STAFF', 'FACULTY']}>
              <FileComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'STAFF', 'FACULTY', 'ADMIN']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule-meeting"
          element={
           <ProtectedRoute allowedRoles={['ADMIN']}>
              <ScheduleMeeting />
            </ProtectedRoute>
          }
        />

      </Routes>     
    </BrowserRouter>
  );
}

export default App;