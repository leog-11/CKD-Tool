import useLoginForm from "@/hooks/useLoginForm";
import CardLayout from "@/layout/CardLayout";
import {
  Box,
  Button,
  CardHeader,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CalculatorPage = () => {
  // Result state to contain result so that it can be kept through navigation
  const [calculationResult, setCalculationResult] = useState<number | null>(
    null
  );
  const [openPediatricDialog, setOpenPediatricDialog] = useState(false);
  const navigate = useNavigate();
  const { formData, handleChange } = useLoginForm();
  //if none of these attributes are provided then return nothing
  const calculateEGFR = () => {
    if (!formData.age || !formData.gender || !formData.creatinineValue) {
      return null;
    }
    const age = formData.age;
    const creatinine = formData.creatinineValue;
    const isFemale = formData.gender === "female";
    const isBlackEthnicity = formData.ethnicity === "black";
    // Normal person egFr formula
    let egfr =
      186 * Math.pow(creatinine / 88.4, -1.154) * Math.pow(age, -0.203);
    // Female weigh
    if (isFemale) {
      egfr *= 0.742;
    }
    // Black Ethnicity Weigh
    if (isBlackEthnicity) {
      egfr *= 1.21;
    }

    return Math.round(egfr * 10) / 10;
  };

  const handleCalculate = () => {
    const result = calculateEGFR();
    setCalculationResult(result);

    return result;
  };
  const handlePediatricDialogOpen = () => {
    setOpenPediatricDialog(true);
  };

  const handlePediatricDialogClose = () => {
    setOpenPediatricDialog(false);
  };
  const navigateToPediatricCalculator = () => {
    navigate("/pediatricCalc");
    setOpenPediatricDialog(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = handleCalculate();
    //converts age string into number
    const age = Number(formData.age);
    if (age < 18) {
      handlePediatricDialogOpen();
      return;
    }
    if (result !== null) {
      navigate("/results", {
        state: {
          egfr: result,
          userType: formData.userType === "Patient" ? "Patient" : "Clinician",
        },
      });
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <CardLayout>
      <CardHeader
        title="eGFR Calculator"
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
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: "600px",
            mx: "auto",
            px: 2,
          }}
        >
          <TextField
            name="age"
            value={formData.age}
            onChange={handleChange}
            size="medium"
            margin="normal"
            label="Age"
            fullWidth
            InputProps={{
              sx: {
                borderRadius: 1.5,
              },
            }}
          />
          <FormControl size="medium" margin="normal" fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Gender"
              sx={{
                borderRadius: 1.5,
              }}
            >
              <MenuItem value="">Select your gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="medium" margin="normal" fullWidth>
            <InputLabel>Ethnicity</InputLabel>
            <Select
              onChange={handleChange}
              name="ethnicity"
              value={formData.ethnicity}
              label="Ethnicity"
              sx={{
                borderRadius: 1.5,
              }}
            >
              <MenuItem value="">Select your ethnicity</MenuItem>
              <MenuItem value="white">White</MenuItem>
              <MenuItem value="black">Black</MenuItem>
              <MenuItem value="asian">Asian</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="creatinineValue"
            value={formData.creatinineValue}
            onChange={handleChange}
            size="medium"
            margin="normal"
            label="Creatinine value"
            fullWidth
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
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
                bgcolor: "#c62828",
              },
              background: "#e57373",
            }}
          >
            Calculate
          </Button>
        </Box>
      </CardContent>
      <Dialog
        open={openPediatricDialog}
        onClose={handlePediatricDialogClose}
        aria-labelledby="pediatric-dialog-title"
        aria-describedby="pediatric-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle id="pediatric-dialog-title">
          Pediatric eGFR Calculator Needed
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="pediatric-dialog-description">
            For patients under 18 years old, a different formula is needed to
            calculate eGFR accurately. Would you like to use our pediatric eGFR
            calculator instead?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlePediatricDialogClose}
            sx={{ color: "#d36d8c" }}
          >
            Cancel
          </Button>
          <Button
            onClick={navigateToPediatricCalculator}
            variant="contained"
            sx={{
              background: "#e57373",
              "&:hover": {
                bgcolor: "#c62828",
                transform: "translateY(-1px)",
                boxShadow: 2,
              },
              transition: "all 0.2s ease-in-out",
            }}
            autoFocus
          >
            Go to Pediatric Calculator
          </Button>
        </DialogActions>
      </Dialog>
    </CardLayout>
  );
};

export default CalculatorPage;
