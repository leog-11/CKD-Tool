import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardLayout from "@/layout/CardLayout";
import useLoginForm from "@/hooks/useLoginForm";
import {
  Box,
  Button,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const PediatricCalcPage = () => {
  const [calculationResult, setCalculationResult] = useState<number | null>(
    null
  );
  const navigate = useNavigate();
  const { formData, handleChange } = useLoginForm();

  const calculatePediatricEGFR = () => {
    if (!formData.height || !formData.creatinineValue) {
      return null;
    }

    const height = Number(formData.height);
    const creatinine = Number(formData.creatinineValue);

    // eGFR for under 18 = 0.413 × height / creatininine
    const k = 0.413;
    const egfr = (k * height) / creatinine;

    // Round to one decimal place
    return Math.round(egfr * 10) / 10;
  };

  const handleCalculate = () => {
    const result = calculatePediatricEGFR();
    setCalculationResult(result);
    return result;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = handleCalculate();

    if (result !== null) {
      navigate("/results", { state: { egfr: result, isPediatric: true } });
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleBackToAdult = () => {
    navigate("/calculator");
  };

  return (
    <CardLayout>
      <CardHeader
        title="Pediatric eGFR Calculator"
        sx={{
          mt: 1,
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
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          mt: 0,
          mb: 0.5,
          color: "#d36d8c",
          fontWeight: 500,
        }}
      >
        For patients under 18 years old
      </Typography>
      <CardContent sx={{ pt: 1, pb: 1 }}>
        {" "}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <TextField
            fullWidth
            name="age"
            value={formData.age}
            onChange={handleChange}
            size="medium"
            margin="dense"
            label="Age (1-17 years)"
            type="number"
            InputProps={{
              sx: {
                borderRadius: 1.5,
              },
            }}
          />

          <FormControl fullWidth margin="dense" size="medium">
            {" "}
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
              <MenuItem value="">Select gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            name="height"
            value={formData.height || ""}
            onChange={handleChange}
            size="medium"
            margin="dense"
            label="Height (cm)"
            type="number"
            required
            InputProps={{
              sx: {
                borderRadius: 1.5,
              },
            }}
          />

          <TextField
            fullWidth
            name="creatinineValue"
            value={formData.creatinineValue}
            onChange={handleChange}
            size="medium"
            margin="dense"
            label="Creatinine value (mg/dL)"
            type="number"
            required
            InputProps={{
              sx: {
                borderRadius: 1.5,
              },
            }}
          />

          <FormControl fullWidth margin="dense" size="medium">
            {" "}
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
              <MenuItem value="">Select ethnicity</MenuItem>
              <MenuItem value="white">White</MenuItem>
              <MenuItem value="black">Black</MenuItem>
              <MenuItem value="asian">Asian</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            sx={{
              py: 1.5,
              mt: 1.5,
              width: "100%",
              fontWeight: 500,
              borderRadius: 1.5,
              transition: "all 0.2s ease-in-out",
              background: "#e57373",
              "&:hover": {
                bgcolor: "#c62828",
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}
          >
            Calculate
          </Button>

          <Button
            onClick={handleBackToAdult}
            variant="outlined"
            sx={{
              py: 1.5,
              mt: 1,
              mb: 1,
              width: "100%",
              fontWeight: 500,
              borderRadius: 1.5,
              transition: "all 0.2s ease-in-out",
              borderColor: "#d36d8c",
              color: "#d36d8c",
              "&:hover": {
                borderColor: "#c62828",
                bgcolor: "rgba(198, 40, 40, 0.04)",
                color: "#c62828",
                transform: "translateY(-2px)",
              },
            }}
          >
            Return to Adult Calculator
          </Button>
        </Box>
      </CardContent>
    </CardLayout>
  );
};

export default PediatricCalcPage;
