import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err.response.data);
      }
    };
    fetchCourses();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="div" sx={{ mb: 4 }}>
        Available Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {course.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                  sx={{ mb: 2 }}
                >
                  {course.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/course/${course._id}`}
                >
                  View Course
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Courses;
