import React from "react";
import { Box } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import XIcon from "@mui/icons-material/X";

function SocialIcons() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 5,
        padding: 2,
      }}
    >
      <Tooltip title="Facebook">
        <IconButton
          sx={{
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker on hover
            },
          }}
          onClick={() => window.open("https://facebook.com", "_blank")}
        >
          <FacebookIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Instagram">
        <IconButton
          sx={{
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker on hover
            },
          }}
          onClick={() => window.open("https://instagram.com", "_blank")}
        >
          <InstagramIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Twitter">
        <IconButton
          sx={{
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker on hover
            },
          }}
          onClick={() => window.open("https://x.com", "_blank")}
        >
          <XIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Telegram">
        <IconButton
          sx={{
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker on hover
            },
          }}
          onClick={() => window.open("https://telegram.org", "_blank")}
        >
          <TelegramIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default SocialIcons;
