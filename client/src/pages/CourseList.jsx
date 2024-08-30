import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch token from localStorage
        const token = localStorage.getItem("token") || null;

        // Fetch courses with token in request headers
        const response = await axiosInstance.get("/courses/course-fetch", {
          headers: {
            "x-auth-token": token, // Include the token in the request headers
          },
        });

        setCourses(response.data.courses);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(
          err.response ? err.response.data.msg : "Error fetching courses"
        );
        console.error(err);
      }
    };

    fetchCourses();
  }, [user]); // Re-fetch courses if the user context changes

  if (loading) {
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
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (courses.length === 0) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="info">No courses available.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: 1 }}
                >
                  Instructor: {course.instructor}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: 1 }}
                >
                  Enrolled Students: {course.studentsEnrolled.length}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: "auto" }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    /* Handle Learn More */
                  }}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseList;
