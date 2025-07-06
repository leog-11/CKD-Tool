import { useState } from "react";
import img from "../assets/img.png";
import {
  Avatar,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
import CardLayout from "@/layout/CardLayout";
import { useNavigate } from "react-router-dom";
import useLoginForm from "@/hooks/useLoginForm";
import CustomButton from "@/layout/CustomButton";
import { login } from "@/config/firebase";

//Main LoginPage Component
const Login = () => {
  const navigate = useNavigate();
  //Destructures formData state and handleChange handler to be able to utilise in our forms
  const { formData, handleChange } = useLoginForm();
  const [error, setError] = useState("");

  const navigateToForgotPass = () => {
    navigate("/forgotPass");
  };

  //navigates to SignUp Page
  const navigateToSignUp = () => {
    navigate("/signUp");
  };

  ///handles form submission, differentiates between user and clinician
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.username) {
      setError("Please enter NHS Number/ HCP ID");
      return;
    }

    if (!formData.password) {
      setError("Please enter password");
      return;
    }

    if (!formData.userType) {
      setError("Please select user type");
      return;
    }

    try {
      // Attempt to login with Firebase
      const user = await login(
        formData.username,
        formData.password,
        formData.userType === "Clinician" ? "Clinician" : "Patient"
      );

      // Navigate based on user type
      if (formData.userType === "Clinician") {
        navigate("/clinician");
      } else {
        navigate("/patient");
      }
    } catch (error: any) {
      setError("Invalid login credentials");
    }
  };

  return (
    <CardLayout>
      <CardHeader
        title="Data Core"
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
        avatar={
          <Avatar
            src={img}
            alt="Data Core Logo"
            sx={{
              height: 80,
              width: 80,
              p: 1,
              bgcolor: "background.paper",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              borderRadius: "50%",
            }}
          />
        }
      />
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
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
          <TextField
            fullWidth
            size="medium"
            margin="normal"
            name="username"
            value={formData.username}
            onChange={handleChange}
            label="Enter NHS Number/ HCP ID"
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
          <CustomButton type="submit"> Login </CustomButton>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={formData.userType}
            name="userType"
            onChange={handleChange}
          >
            <FormControlLabel
              value="Clinician"
              control={<Radio />}
              label="I am a Clinician"
            />
            <FormControlLabel
              value="Patient"
              control={<Radio />}
              label="I am a Patient"
            />
          </RadioGroup>
          <Button color="secondary" onClick={navigateToForgotPass}>
            Forgot Password?
          </Button>
          <Button color="secondary" onClick={navigateToSignUp}>
            Sign Up
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "0.875rem",
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              Patient Data is secure and not stored locally.
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </CardLayout>
  );
};

export default Login;
