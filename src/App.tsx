import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Pricing from './pages/Pricing';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import CourseEditor from './pages/CourseEditor';
import AddLessonPage from './pages/AddLessonPage';
import LessonDetail from './pages/LessonDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course/:id" element={<CourseDetail />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="about" element={<About />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/courses/:courseId" element={<CourseEditor />} />
          <Route path="admin/modules/:moduleId/add-lesson" element={<AddLessonPage />} />
          <Route path="lesson/:id" element={<LessonDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
