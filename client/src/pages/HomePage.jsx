import React, { useContext } from "react";
import Header from "../components/Header";
import ContactUs from "../components/ContactUs";
import CoursesLs from "../components/CoursesLs";
import Footer from "../components/Footer";
import Home from "../components/Home";
import ReviewCarousel from "../components/ReviewCarousel";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Pass user and logout props to Header */}
      <Header user={user} onLogout={logout} />
      <Home />
      <CoursesLs />
      <ReviewCarousel />
      <ContactUs />
      <Footer />
    </>
  );
};

export default HomePage;
