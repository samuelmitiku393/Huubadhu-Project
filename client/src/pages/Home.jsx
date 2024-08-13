import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h3" component="div" gutterBottom>
        Welcome to the LMS
      </Typography>
      <Typography variant="h6" component="div" sx={{ mb: 4 }}>
        Start learning and grow your skills!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/register"
      >
        Get Started
      </Button>
    </Box>
  );
};

export default Home;
