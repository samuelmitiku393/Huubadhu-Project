import React from "react";
import { Typography, Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        p: 2,
        textAlign: "center",
        mt: "auto",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2024 LMS, Inc. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
