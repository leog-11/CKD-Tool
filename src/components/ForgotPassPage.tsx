import { useState } from "react";
import useLoginForm from "@/hooks/useLoginForm";
import CardLayout from "@/layout/CardLayout";
import {
  Box,
  Button,
  CardHeader,
  TextField,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";

const ForgotPassPage = () => {
  const { formData, handleChange } = useLoginForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userFound, setUserFound] = useState(false);

  const db = getFirestore();
  const auth = getAuth();

  const handleFindUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username) {
      setError("Please enter NHS Number or HCP ID");
      return;
    }

    if (!formData.userType) {
      setError("Please select user type");
      return;
    }

    try {
      // Find the user by identifier and userType
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("identifier", "==", formData.username),
        where("userType", "==", formData.userType)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("User not found");
      }

      // user has been found
      setSuccess("User found. Please enter your new password.");
      setUserFound(true);
    } catch (error: any) {
      setError(error.message || "Failed to find user");
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSuccess("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setError("Password reset failed.");
    }
  };

  return (
    <CardLayout>
      <CardHeader
        title="Reset Password"
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

        {!userFound ? (
          <Box component="form" onSubmit={handleFindUser}>
            <TextField
              fullWidth
              size="medium"
              margin="normal"
              name="username"
              value={formData.username}
              onChange={handleChange}
              label="NHS Number / HCP ID"
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
              Find Account
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              size="medium"
              margin="normal"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              label="New Password"
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
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              label="Confirm New Password"
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
              Reset Password
            </Button>
          </Box>
        )}

        <Button
          onClick={() => navigate("/login")}
          variant="text"
          color="secondary"
          sx={{ mt: 1, width: "100%" }}
        >
          Back to Login
        </Button>
      </CardContent>
    </CardLayout>
  );
};

export default ForgotPassPage;
