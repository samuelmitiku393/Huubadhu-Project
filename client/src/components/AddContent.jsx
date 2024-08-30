import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import API from "../api/axios";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AddContentForm = () => {
  const { courseId } = useParams();
  const [type, setType] = useState("");
  const [contentURL, setContentURL] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/courses/${courseId}/content`,
        { type, contentURL, description },
        {
          headers: { "x-auth-token": token },
        }
      );
      setSuccess("Content added successfully!");
      setType("");
      setContentURL("");
      setDescription("");
    } catch (err) {
      console.error("Error adding content:", err);
      setError("Failed to add content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />

      <Box
        sx={{
          mt: 10,
          flexGrow: 1,
          paddingTop: "64px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            width: "100%",
            px: 3,
            py: 4,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Add Course Content
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Type"
              variant="outlined"
              fullWidth
              margin="normal"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
            <TextField
              label="Content URL"
              variant="outlined"
              fullWidth
              margin="normal"
              value={contentURL}
              onChange={(e) => setContentURL(e.target.value)}
              required
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Add Content"}
            </Button>
          </form>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default AddContentForm;
