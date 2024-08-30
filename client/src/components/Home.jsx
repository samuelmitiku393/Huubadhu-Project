import React, { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SocialIcons from "../components/SocialsIcons";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "white", // Background color set to white
        color: "black",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Content aligned to the left */}
        <Box
          sx={{
            flex: 1,
            textAlign: "left",
            pl: 15,
            pb: 10,
          }}
        >
          <Typography variant="h1" component="div" gutterBottom>
            Welcome to HUUBADHU
          </Typography>
          <Typography variant="h5" component="div" sx={{ mb: 4 }}>
            Start learning and grow your skills!
          </Typography>
          {!user ? (
            <>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/register"
                sx={{ mr: 2, py: 2, px: 4 }} // Increased size
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/login"
                sx={{ py: 2, px: 4 }} // Increased size
              >
                Log In
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/profile")}
              sx={{ py: 2, px: 4 }} // Increased size
            >
              Profile
            </Button>
          )}
        </Box>

        {/* Image on the right */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" }, // Hide on small screens, show on medium and up
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/images/Untitled.jpg" // Replace with your image path
            alt="Educational Graphic"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>

      {/* Social icons positioned at the bottom center */}
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <SocialIcons />
      </Box>
    </Box>
  );
}

export default Home;
