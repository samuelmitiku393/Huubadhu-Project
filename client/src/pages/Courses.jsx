import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CourseCreation = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  const [errorMessageOpen, setErrorMessageOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      const response = await axiosInstance.post(
        "/courses",
        {
          title,
          description,
        },
        {
          headers: {
            "x-auth-token": token, // Include token in headers
          },
        }
      );

      setTitle("");
      setDescription("");

      if (response.data && response.data._id) {
        setSuccessMessageOpen(true);
        navigate(`/courses/${response.data._id}`);
      } else {
        console.error("Course ID not found in response data");
        setErrorMessage("Course creation failed. Please try again.");
        setErrorMessageOpen(true);
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while creating the course."
      );
      setErrorMessageOpen(true);
    }
  };

  const handleSuccessMessageClose = () => {
    setSuccessMessageOpen(false);
  };

  const handleErrorMessageClose = () => {
    setErrorMessageOpen(false);
  };

  return (
    <>
      <Header />
      <Container
        component={Paper}
        elevation={6}
        sx={{ padding: 3, maxWidth: 600, marginTop: 20, marginBottom: 23 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", marginBottom: 3 }}
        >
          Create New Course
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Course Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Course Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                required
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ padding: "10px 20px", fontSize: "16px" }}
                >
                  Create Course
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Success Snackbar */}
        <Snackbar
          open={successMessageOpen}
          autoHideDuration={6000}
          onClose={handleSuccessMessageClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSuccessMessageClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Course created successfully!
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={errorMessageOpen}
          autoHideDuration={6000}
          onClose={handleErrorMessageClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleErrorMessageClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

export default CourseCreation;
