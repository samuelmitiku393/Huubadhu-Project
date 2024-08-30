import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Snackbar,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const ReviewSection = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [expanded, setExpanded] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await API.get(`/reviews/${courseId}`);
        setReviews(response.data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Error fetching reviews.",
          severity: "error",
        });
      }
    };

    fetchReviews();
  }, [courseId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewData.rating || !reviewData.comment.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill out all fields.",
        severity: "warning",
      });
      return;
    }

    if (!user || !user.user || !user.user.id) {
      console.error("User is not logged in or user ID is missing:", user);
      setSnackbar({
        open: true,
        message: "User is not logged in or user ID is missing.",
        severity: "error",
      });
      return;
    }

    setSnackbar({
      open: true,
      message: "Submitting review...",
      severity: "info",
    });

    try {
      const response = await API.post(
        "/reviews",
        {
          courseId,
          userId: user.user.id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );

      setReviews((prevReviews) => [...prevReviews, response.data]);
      setReviewData({ rating: 0, comment: "" });
      setSnackbar({
        open: true,
        message: "Review submitted successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error submitting review.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ mt: 4 }}>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">Reviews</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%" }}>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card sx={{ mb: 2 }} key={review._id}>
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="h6" sx={{ flex: 1 }}>
                        {review.userId.username}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ textAlign: "right", flexBasis: "100%" }}
                      >
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Rating
                      value={review.rating}
                      readOnly
                      precision={0.5}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body1">{review.comment}</Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No reviews yet.
              </Typography>
            )}

            {user && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Submit a Review
                </Typography>
                <form onSubmit={handleReviewSubmit}>
                  <Rating
                    name="rating"
                    value={reviewData.rating}
                    onChange={(e, newValue) =>
                      setReviewData((prev) => ({
                        ...prev,
                        rating: newValue,
                      }))
                    }
                    precision={0.5}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Comment"
                    multiline
                    rows={4}
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Button type="submit" variant="contained" color="primary">
                    Submit Review
                  </Button>
                </form>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewSection;
