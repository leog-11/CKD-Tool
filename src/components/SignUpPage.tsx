import { useState } from "react";
import useLoginForm from "@/hooks/useLoginForm";
import CardLayout from "@/layout/CardLayout";
import {
  CardHeader,
  Box,
  TextField,
  Button,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/config/firebase";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { formData, handleChange } = useLoginForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.lastName) {
      setError("Please enter your full name");
      return;
    }

    if (!formData.username) {
      setError("Please enter NHS Number or HCP ID");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!formData.userType) {
      setError("Please select a user type");
      return;
    }

    try {
      // tries to create new user
      const user = await signUp(
        formData.username,
        formData.password,
        formData.userType === "Clinician" ? "Clinician" : "Patient",
        formData.name,
        formData.lastName
      );

      setSuccess("Account created successfully!");

      // short delay to navigate to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    }
  };

  return (
    <CardLayout>
      <CardHeader
        title="Create Account"
        sx={{
          pb: 0,
          "& .MuiCardHeader-title": {
            fontSize: "2.2rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            background: "linear-gradient(45deg, #2C3E50 30%, #4A235A 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0px 1px 2px rgba(0,0,0,0.05)",
          },
        }}
      />
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSignUp}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {error && (
            <Typography
              color="error"
              variant="body2"
              align="center"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}
          {success && (
            <Typography
              color="success"
              variant="body2"
              align="center"
              sx={{ mb: 2, color: "green" }}
            >
              {success}
            </Typography>
          )}
          <TextField
            fullWidth
            size="medium"
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            label="Name"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 1.5,
              },
            }}
          />
          <TextField
            fullWidth
            size="medium"
            margin="normal"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            label="Last Name"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 1.5,
              },
            }}
          />
          <TextField
            fullWidth
            size="medium"
            margin="normal"
            name="username"
            value={formData.username}
            onChange={handleChange}
            label="NHS Number/ HCP ID"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 1.5,
              },
            }}
          />
          <FormControl
            fullWidth
            size="medium"
            margin="normal"
            variant="outlined"
          >
            <InputLabel>User Type</InputLabel>
            <Select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              label="User Type"
              sx={{
                borderRadius: 1.5,
              }}
            >
              <MenuItem value="Patient">Patient</MenuItem>
              <MenuItem value="Clinician">Clinician</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            size="medium"
            margin="normal"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 1.5,
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              py: 1.5,
              mt: 2,
              width: "100%",
              fontWeight: 500,
              borderRadius: 1.5,
              transition: "all 0.2s ease-in-out",
              background: "#e57373",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
                bgcolor: "#c62828",
              },
            }}
          >
            Create Account
          </Button>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Already have an account?{" "}
            <Typography
              component="span"
              color="primary"
              sx={{
                cursor: "pointer",
                fontWeight: "medium",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </Typography>
          </Typography>
        </Box>
      </CardContent>
    </CardLayout>
  );
};

export default SignUpPage;
