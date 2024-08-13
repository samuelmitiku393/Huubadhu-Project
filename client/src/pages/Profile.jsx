import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await axios.get("/api/profile");
        setUser(userRes.data);

        const coursesRes = await axios.get("/api/enrolled-courses");
        setEnrolledCourses(coursesRes.data);
      } catch (err) {
        console.error("Error fetching profile:", err.response.data);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="div" sx={{ mb: 4 }}>
        {user.name}'s Profile
      </Typography>
      <Typography variant="body1" component="div" sx={{ mb: 4 }}>
        Email: {user.email}
      </Typography>
      <Typography variant="h5" component="div" sx={{ mb: 4 }}>
        Enrolled Courses
      </Typography>
      <Grid container spacing={3}>
        {enrolledCourses.map((course) => (
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Profile;
