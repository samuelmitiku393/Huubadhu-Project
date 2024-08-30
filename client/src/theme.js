import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#005b96", // A calm blue for primary actions, encouraging focus and trust.
      contrastText: "#ffffff", // White text for good contrast on primary buttons.
    },
    secondary: {
      main: "#ffcc00", // A vibrant yellow to draw attention to secondary actions without being overwhelming.
      contrastText: "#2F3645", // Dark text for readability on secondary buttons.
    },
    background: {
      default: "#f4f6f8", // A light gray background to reduce strain and keep the focus on the content.
      paper: "#ffffff", // White background for cards and forms, providing a clean and organized look.
    },
    text: {
      primary: "#2F3645", // Dark gray for primary text to ensure readability against light backgrounds.
      secondary: "#005b96", // Blue for secondary text to maintain a consistent theme.
    },
    action: {
      active: "#005b96", // Blue for active elements (e.g., icons) to match the primary color.
      hover: "#00457a", // Slightly darker blue on hover for a subtle effect.
      selected: "#002d5a", // Even darker blue when an element is selected, indicating active state.
    },
    error: {
      main: "#d32f2f", // Red for errors, signaling caution and attention.
    },
    warning: {
      main: "#ff9800", // Orange for warnings, standing out without being too aggressive.
    },
    info: {
      main: "#0288d1", // Light blue for informational alerts, easy on the eyes.
    },
    success: {
      main: "#388e3c", // Green for success messages, indicating positive feedback.
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", // Roboto is a clean, modern, and widely recognized font.
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#2F3645", // Dark gray to ensure headers stand out.
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#2F3645", // Consistent with h1 for visual hierarchy.
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      color: "#005b96", // Blue for subheaders, tying back to the primary color.
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#2F3645", // Primary text color for body text.
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#005b96", // Secondary text color for less important text.
    },
    button: {
      fontWeight: 600,
      textTransform: "uppercase", // Uppercase buttons for emphasis and accessibility.
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners for buttons and cards to create a friendly feel.
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Consistent rounded corners for buttons.
          textTransform: "none", // Avoid all-caps by default for better readability.
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "16px", // Ensure consistent padding inside paper elements.
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth.
        },
      },
    },
  },
});

export default theme;
