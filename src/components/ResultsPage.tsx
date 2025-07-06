import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardLayout from "@/layout/CardLayout";
import { Box, Button, Typography } from "@mui/material";
import { auth, db, saveEGFRResult } from "@/config/firebase";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const egfr = location.state?.egfr;
  const [userType, setUserType] = useState("");
  const [resultSaved, setResultSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUserType = async () => {
      setIsLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserType(userData.userType || "Patient");
          } else {
            setUserType("Patient");
          }
        } else {
          setUserType("Patient");
        }
      } catch (error) {
        setUserType("Patient");
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUserType();
  }, []);

  if (!egfr) {
    return <div>No results available</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getCKDStage = (egfrValue: number) => {
    if (egfrValue >= 90) return "Stage 1";
    if (egfrValue >= 60) return "Stage 2";
    if (egfrValue >= 45) return "Stage 3a";
    if (egfrValue >= 30) return "Stage 3b";
    if (egfrValue >= 15) return "Stage 4";
    return "Stage 5";
  };
  const ckdStage = getCKDStage(egfr);

  const handleSaveResults = async () => {
    try {
      // Get current user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Save results using the new function
      await saveEGFRResult(currentUser.uid, {
        value: egfr,
        stage: ckdStage,
      });

      setResultSaved(true);
    } catch (error) {
      alert("Failed to save results");
    }
  };

  const handleDownload = () => {
    const resultText = `
eGFR Results
===========
Date: ${new Date().toLocaleDateString()}

Patient Results:
- eGFR: ${egfr}mL/min/1.73m²
- CKD Stage: ${ckdStage}

This is an automated result from the eGFR Calculator.
Please consult with your healthcare provider for interpretation.
`;
    const blob = new Blob([resultText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eGFR-Results-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEmailResult = () => {
    const subject = "Your eGFR Calculator Results";
    const body = `eGFR Results
===========
Date: ${new Date().toLocaleDateString()}

Patient Results:
- eGFR: ${egfr}mL/min/1.73m²
- CKD Stage: ${ckdStage}

This is an automated result from the eGFR Calculator.
Please consult with your healthcare provider for interpretation.`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  const handleGoToDashboard = () => {
    navigate(userType === "Clinician" ? "/clinician" : "/patient");
  };

  return (
    <CardLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          padding: 2,
          minHeight: "calc(100vh - 100px)",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            eGFR: {egfr}mL/min/1.73m²
          </Typography>
          <Typography variant="h6">CKD Stage: {ckdStage}</Typography>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            Recommendations: Follow Lifestyle Changes
          </Typography>

          <Button
            variant="contained"
            onClick={handleSaveResults}
            disabled={resultSaved}
            sx={{
              width: 350,
              background: "#e57373",
              "&:hover": { bgcolor: "#c62828" },
              "&.Mui-disabled": {
                background: "#f0a0a0",
                color: "white",
              },
            }}
          >
            {resultSaved ? "Results Saved" : "Save Results"}
          </Button>
          <Button
            variant="contained"
            onClick={handleDownload}
            sx={{
              background: "#e57373",
              "&:hover": { bgcolor: "#c62828" },
              width: 350,
            }}
          >
            Download Result
          </Button>
          <Button
            variant="contained"
            onClick={handleEmailResult}
            sx={{
              width: 350,
              background: "#e57373",
              "&:hover": { bgcolor: "#c62828" },
            }}
          >
            Email Result
          </Button>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleGoToDashboard}
          sx={{
            alignSelf: "center",
            mb: 2,
          }}
        >
          {userType === "Clinician"
            ? "Go to Clinician Dashboard"
            : "Go to Patient Dashboard"}
        </Button>
      </Box>
    </CardLayout>
  );
};

export default ResultsPage;
