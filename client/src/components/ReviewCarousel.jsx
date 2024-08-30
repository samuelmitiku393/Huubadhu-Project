import React from "react";
import Slider from "react-slick";
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const reviews = [
  {
    name: "John Doe",
    avatar: "https://via.placeholder.com/150",
    rating: 5,
    review: "This is an amazing service! I highly recommend it.",
  },
  {
    name: "Jane Smith",
    avatar: "https://via.placeholder.com/150",
    rating: 4,
    review: "Great experience overall, will definitely use it again.",
  },
  {
    name: "Alice Johnson",
    avatar: "https://via.placeholder.com/150",
    rating: 5,
    review: "Absolutely fantastic! Exceeded all my expectations.",
  },
];

const ReviewCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box
      sx={{
        // m: 30,
        p: 20,
        backgroundColor: "background.paper",
        width: "100%",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          marginBottom: 5,
        }}
      >
        Reviews
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "40px",
          paddingBottom: "40px",
          backgroundColor: "background.paper",
        }}
      >
        <Box sx={{ width: "80%" }}>
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <Card
                key={index}
                sx={{
                  maxWidth: 600,
                  margin: "0 auto",
                  padding: "20px",
                  //   boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  backgroundColor: "background.default",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <Avatar
                      src={review.avatar}
                      sx={{ marginRight: "15px", width: 56, height: 56 }}
                    />
                    <Typography variant="h6">{review.name}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <StarIcon key={i} sx={{ color: "#FFD700" }} />
                    ))}
                  </Box>
                  <Typography variant="body1" color="textPrimary">
                    {review.review}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Slider>
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewCarousel;
