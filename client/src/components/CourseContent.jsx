import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseContents = useCallback(async () => {
    try {
      console.log("Fetching contents for courseId:", courseId); // Debugging

      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to login or handle no token case
        navigate("/login");
        return;
      }

      const url = `/courses/${courseId}/contents`; // Construct the URL
      console.log("Request URL:", url); // Debugging

      const response = await API.get(url, {
        headers: { "x-auth-token": token },
      });

      console.log("Response data:", response.data); // Debugging
      setContents(response.data);
    } catch (err) {
      console.error(
        "Error fetching course contents:",
        err.response?.data || err.message
      );
      setError(
        `Error fetching course contents: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [courseId, navigate]);

  useEffect(() => {
    fetchCourseContents();
  }, [fetchCourseContents]);

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

  if (!contents || contents.length === 0)
    return (
      <Box sx={{ mt: 4, px: 2 }}>
        <Alert severity="warning">
          No content available for this course.
          <Typography
            variant="body2"
            component="a"
            href="/courses"
            sx={{ textDecoration: "none", color: "primary.main" }}
          >
            Back to Courses
          </Typography>
        </Alert>
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
      <Header />

      <Box sx={{ mt: 10, flexGrow: 1, paddingTop: "64px" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
          <Typography variant="h6" gutterBottom>
            Course Contents
          </Typography>
          <Grid container spacing={2}>
            {contents.map((content) => (
              <Grid item xs={12} sm={6} md={4} key={content._id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{content.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {content.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default CourseContent;
