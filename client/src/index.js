import React from "react";
import ReactDOM from "react-dom/client"; // Note the change here
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";

const rootElement = document.getElementById("root"); // Correctly get the DOM element
const root = ReactDOM.createRoot(rootElement); // Pass the DOM element to createRoot

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
