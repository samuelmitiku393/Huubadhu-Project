import React from "react";
import {
  Box,
  Typography,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Card,
} from "@mui/material";
import { Link } from "react-router-dom";

function CoursesLs() {
  const courses = [
    {
      src: "/images/appDev.jpg",
      title: "Mobile Application Development",
      link: "/courses/66cb5effee8d8bc01aeb6fc2",
      description:
        "Learn to build mobile applications for Android and iOS using React Native and Flutter.",
    },
    {
      src: "/images/webDev.jpg",
      title: "Web Application Development",
      link: "/courses/66cb5f1cee8d8bc01aeb6fca",
      description:
        "Master the art of building modern, responsive web applications using HTML, CSS, and JavaScript.",
    },
    {
      src: "/images/databaseImg.png",
      title: "Advanced Database Course",
      link: "/courses/66cb5f34ee8d8bc01aeb6fd2",
      description:
        "Deep dive into database management systems, focusing on SQL and NoSQL databases.",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        margin: 0,
        backgroundColor: "background.default",
        minHeight: "100vh",
        pb: 5,
      }}
    >
      <Typography variant="h1" sx={{ padding: 10 }}>
        COURSES
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
            justifyContent: {
              xs: "center",
              md: "space-evenly",
            },
            width: "100%",
            maxWidth: "1000px",
            gap: 4,
            padding: 2,
            flexGrow: 1,
          }}
        >
          {courses.map((course, index) => (
            <Card
              key={index}
              sx={{
                maxWidth: 345,
                backgroundColor: "background.paper",
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardMedia
                sx={{
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={course.src}
                  alt="Course thumbnail"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={course.link} style={{ textDecoration: "none" }}>
                  <Button variant="contained" size="small">
                    Detail
                  </Button>
                </Link>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default CoursesLs;
