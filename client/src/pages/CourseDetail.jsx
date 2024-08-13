import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course details:", err.response.data);
      }
    };
    fetchCourse();
  }, [id]);

  if (!course) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="div" sx={{ mb: 2 }}>
        {course.title}
      </Typography>
      <Typography variant="body1" component="div" sx={{ mb: 4 }}>
        {course.description}
      </Typography>
      <Button variant="contained" color="primary">
        Enroll Now
      </Button>
    </Box>
  );
};

export default CourseDetail;
