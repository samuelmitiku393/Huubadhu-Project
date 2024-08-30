import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios"; // Use your axiosInstance

const Header = ({ onLogout }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate(); // Add useNavigate hook for programmatic navigation
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const isOnDashboard = location.pathname === "/dashboard";
  const isOnLoginPage = location.pathname === "/login";
  const isOnRegisterPage = location.pathname === "/register";
  const isOnHomePage = location.pathname === "/";
  const isOnProfilePage = location.pathname === "/profile";

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query) {
      const fetchSuggestions = async () => {
        try {
          const response = await axiosInstance.get(`/search?query=${query}`);
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching suggestions", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Handle suggestion click
  const handleSuggestionClick = (courseId) => {
    navigate(`/courses/${courseId}`);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        zIndex: 2,
        top: 0,
        width: "100%",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontSize: "30px", flexGrow: 1, color: "black" }}
        >
          <Button
            variant="text"
            sx={{ color: "black" }}
            component={Link}
            to="/"
          >
            HUUBADHU
          </Button>
        </Typography>
        {isOnHomePage && (
          <div
            style={{ position: "relative", marginRight: "20px", flexGrow: 1 }}
          >
            <TextField
              variant="outlined"
              placeholder="Search Courses"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "50px",
                  width: "100%",
                },
              }}
              sx={{ width: "100%" }}
            />
            {suggestions.length > 0 && (
              <Paper
                style={{
                  position: "absolute",
                  top: "50px",
                  left: 0,
                  right: 0,
                  zIndex: 3,
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "10px",
                }}
              >
                <List>
                  {suggestions.map((course) => (
                    <ListItem
                      button
                      key={course._id}
                      onClick={() => handleSuggestionClick(course._id)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <ListItemText primary={course.title} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </div>
        )}
        <Button sx={{ color: "black" }} component={Link} to="/">
          Home
        </Button>
        {user ? (
          <>
            {!isOnDashboard &&
              !isOnLoginPage &&
              !isOnRegisterPage &&
              !isOnProfilePage && (
                <Button sx={{ color: "black" }} component={Link} to="/profile">
                  Profile
                </Button>
              )}
            <Button sx={{ color: "black" }} onClick={onLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            {!isOnLoginPage && (
              <Button sx={{ color: "black" }} component={Link} to="/login">
                Login
              </Button>
            )}
            {!isOnRegisterPage && (
              <Button sx={{ color: "black" }} component={Link} to="/register">
                Register
              </Button>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
