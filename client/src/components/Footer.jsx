import React from "react";
import { Typography, Box } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <Box
      sx={{
        // backgroundColor: "",
        p: 2,
        textAlign: "center",
        bgcolor: "background.paper",
        mb: 0,
        mt: 5,
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {currentYear} HUUBADHU, Inc. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
