import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Profile from "./pages/Profile";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AuthProvider } from "./context/AuthContext";
import CourseContent from "./components/CourseContent";
import AddContentForm from "./components/AddContent";
import CourseList from "./pages/CourseList";
const App = () => {
  return (
    // routes the whole website using react-router-dom to make it more faster by not using the server to route to the pages the user wants to navigate
    <AuthProvider>
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route
              path="/courses/:courseId/contents"
              element={<CourseContent />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/courses/:courseId/add-content"
              element={<AddContentForm />}
            />
            <Route path="/courses/course-fetch" element={<CourseList />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;
