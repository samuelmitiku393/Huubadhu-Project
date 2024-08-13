import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const history = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", formData);
      console.log("User logged in:", res.data);
      localStorage.setItem("token", res.data.token);
      history.push("/");
    } catch (err) {
      console.error("Error during login:", err.response.data);
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
        Login
      </Typography>
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
        Login
      </Button>
    </Box>
  );
};

export default Login;
