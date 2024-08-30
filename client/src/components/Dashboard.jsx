import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Dashboard = () => {
  // useState variables and setters
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [itemId, setItemId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // fetches the dashboard content
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/dashboard", {
          headers: {
            "x-auth-token": token,
          },
        });

        console.log("Dashboard Response:", response.data);

        setCourses(response.data.courses);
        setUsers(response.data.users || []);
        setContacts(response.data.contacts || []);
        setUserData(response.data.user);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    console.log("User Data:", userData);
  }, [userData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // handles delete course button click
  const handleDeleteCourse = async () => {
    try {
      await API.delete(`/courses/${itemId}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setCourses(courses.filter((course) => course._id !== itemId));
      setOpenDialog(false);
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course");
    }
  };
  // handle delete user button click
  const handleDeleteUser = async () => {
    try {
      await API.delete(`/users/${itemId}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setUsers(users.filter((user) => user._id !== itemId));
      setOpenDialog(false);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  const openConfirmationDialog = (type, id) => {
    setDeleteType(type);
    setItemId(id);
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
    setItemId(null);
    setDeleteType("");
  };

  const handleCopyInfo = (contact) => {
    navigator.clipboard.writeText(
      `Name: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`
    );
    setCopiedId(contact._id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1200);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  console.log("User Role:", userData?.role);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Header user={user} onLogout={handleLogout} />

      <Container sx={{ mt: 10, flexGrow: 1, paddingTop: "64px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              mb: isMobile ? 2 : 0,
            }}
          >
            Welcome, {userData?.username}
          </Typography>
          {(userData?.role === "teacher" || userData?.role === "admin") && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/courses")}
            >
              Create Course
            </Button>
          )}
        </Box>

        {(userData?.role === "admin" ||
          userData?.role === "teacher" ||
          userData?.role === "student") && (
          <>
            {userData?.role === "admin" && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  All Users
                </Typography>
                <Grid container spacing={4}>
                  {users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user._id}>
                      <Card
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          boxShadow: 3,
                          transition: "transform 0.3s",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        <CardContent>
                          <Typography variant="h5" gutterBottom>
                            {user.username}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Role: {user.role}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Email: {user.email}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ mt: "auto" }}>
                          <Button
                            size="small"
                            color="error"
                            onClick={() =>
                              openConfirmationDialog("user", user._id)
                            }
                          >
                            Delete User
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
              {userData?.role === "student"
                ? "Enrolled Courses"
                : userData?.role === "teacher"
                ? "Courses You're Teaching"
                : "All Courses"}
            </Typography>

            {courses.length === 0 ? (
              <Typography>No courses available</Typography>
            ) : (
              <Grid container spacing={4}>
                {courses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course._id}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        boxShadow: 3,
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {course.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ mt: "auto" }}>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => navigate(`/courses/${course._id}`)}
                        >
                          View Course
                        </Button>
                        {(userData?.role === "teacher" ||
                          userData?.role === "admin") && (
                          <>
                            <Button
                              size="small"
                              color="primary"
                              onClick={() =>
                                navigate(`/courses/${course._id}/add-content`)
                              }
                            >
                              Add Content
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() =>
                                openConfirmationDialog("course", course._id)
                              }
                            >
                              Delete Course
                            </Button>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {userData?.role === "admin" && (
              <>
                <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
                  Contact Messages
                </Typography>
                {contacts.length === 0 ? (
                  <Typography>No contact messages available</Typography>
                ) : (
                  <Grid container spacing={4}>
                    {contacts.map((contact) => (
                      <Grid item xs={12} sm={6} md={4} key={contact._id}>
                        <Card
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            boxShadow: 3,
                            transition: "transform 0.3s",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <CardContent>
                            <Typography variant="h5" gutterBottom>
                              {contact.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Email: {contact.email}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Message: {contact.message}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ mt: "auto" }}>
                            <Button
                              size="small"
                              color={
                                copiedId === contact._id ? "success" : "primary"
                              }
                              onClick={() => handleCopyInfo(contact)}
                            >
                              {copiedId === contact._id
                                ? "Copied!"
                                : "Copy Info"}
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </>
        )}
      </Container>

      <Footer sx={{ mt: "auto" }} />

      <Dialog open={openDialog} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteType}? This action is
            permanent and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (deleteType === "course") {
                handleDeleteCourse();
              } else if (deleteType === "user") {
                handleDeleteUser();
              }
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
