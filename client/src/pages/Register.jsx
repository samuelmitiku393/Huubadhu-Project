import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const history = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/register", formData);
      console.log("User registered:", res.data);
      history.push("/login");
    } catch (err) {
      console.error("Error during registration:", err.response.data);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
        margin: "0 auto",
        mt: 4,
        p: 3,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="div" sx={{ mb: 3 }}>
        Register
      </Typography>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        margin="normal"
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        margin="normal"
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={onChange}
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Register
      </Button>
    </Box>
  );
};

export default Register;
