import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReviewSection from "../components/Review";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // fetches course title and description from the back end
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get(`/courses/${courseId}`, {
          headers: { "x-auth-token": token },
        });
        setCourse(response.data);
      } catch (err) {
        setError("Error fetching course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // handle enrollment when the enroll button is clicked
  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/enrollments",
        { courseId },
        {
          headers: { "x-auth-token": token },
        }
      );
      alert("You have successfully enrolled in the course!");
    } catch (err) {
      alert("Error enrolling in the course.");
    }
  };

  // navigates to the contents page when the view content is clicked
  const handleViewContents = () => {
    navigate(`/courses/${courseId}/contents`);
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ mt: 4, px: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!course)
    return (
      <Box sx={{ mt: 4, px: 2 }}>
        <Alert severity="warning">Course details not found.</Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header user={user} />

      <Box sx={{ mt: 10, flexGrow: 1, paddingTop: "64px" }}>
        <Grid container spacing={2} sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h1" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="h5" paragraph>
                {course.description}
              </Typography>

              {user && user.user.role === "student" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEnroll}
                  sx={{ mb: 2, mr: 5 }}
                >
                  Enroll
                </Button>
              )}

              <Button
                variant="contained"
                color="secondary"
                onClick={handleViewContents}
                sx={{ mb: 2 }}
              >
                View Course Contents
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <ReviewSection courseId={courseId} />
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default CourseDetail;
