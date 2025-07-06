import CardLayout from "@/layout/CardLayout";
import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

// Define types for the eGFR attributes
interface EGFRResult {
  date: string;
  value: number;
  stage: string;
  name?: string;
  createdAt?: any;
}

const PatientPage = () => {
  const navigate = useNavigate();
  // This state will hold the most recent eGFR result
  const [mostRecentResult, setMostRecentResult] = useState<EGFRResult | null>(
    null
  );
  // This state will update the Patient's name
  const [patientName, setPatientName] = useState<string>("");

  // Function to handle navigation to calculator
  const handleNavigation = () => {
    navigate("/calculator");
  };

  // Function to get CKD stage based on eGFR value
  const getCKDStage = (egfr: number): string => {
    if (egfr >= 90) return "Stage 1";
    if (egfr >= 60) return "Stage 2";
    if (egfr >= 45) return "Stage 3a";
    if (egfr >= 30) return "Stage 3b";
    if (egfr >= 15) return "Stage 4";
    return "Stage 5";
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Get current user
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate("/login");
          return;
        }

        // Fetch user document
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPatientName(userData.name || userData.identifier);

          // Fetch most recent eGFR result
          const resultsQuery = query(
            collection(db, "users", currentUser.uid, "egfrResults"),
            orderBy("createdAt", "desc"),
            limit(1)
          );

          const resultsSnapshot = await getDocs(resultsQuery);

          if (!resultsSnapshot.empty) {
            const latestResultData = resultsSnapshot.docs[0].data();

            const latestResult = {
              date: latestResultData.date || new Date().toISOString(),
              value: latestResultData.value || 0,
              stage:
                latestResultData.stage ||
                getCKDStage(latestResultData.value || 0),
              createdAt: latestResultData.createdAt,
            };

            setMostRecentResult(latestResult);
          }
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [navigate]);

  // Format date and time from Firestore timestamp or date string
  const formatDateTime = (date: any) => {
    // Handle Firestore timestamp
    if (date && typeof date.toDate === "function") {
      const dateObj = date.toDate();

      // Format time first, then date
      return `${dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })} · ${dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`;
    }
    // creates new date
    else if (date) {
      const dateObj = new Date(date);

      return `${dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })} · ${dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`;
    }

    return "Unknown date";
  };

  return (
    <CardLayout>
      <CardHeader
        title="Patient Dashboard"
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
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
            width: "100%",
            maxWidth: "650px",
            margin: "0 auto",
          }}
        >
          <Button
            onClick={handleNavigation}
            type="submit"
            variant="contained"
            sx={{
              py: 1.5,
              width: "100%",
              fontWeight: 500,
              transition: "all 0.2s ease-in-out",
              background: "#e57373",
              "&:hover": {
                bgcolor: "#c62828",
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
              borderRadius: 1.5,
            }}
          >
            Calculate eGFR
          </Button>

          <Card
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Previous eGFR Results
                </Typography>
              }
            />
            <CardContent sx={{ pt: 1 }}>
              {mostRecentResult && mostRecentResult.value > 0 ? (
                <Box sx={{ py: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" fontWeight="medium">
                      {patientName}
                    </Typography>
                    <Typography variant="body1">
                      {formatDateTime(
                        mostRecentResult.createdAt || mostRecentResult.date
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" fontWeight="medium">
                      {mostRecentResult.value} mL/min/1.73m²
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mostRecentResult.stage}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ py: 2, textAlign: "center" }}
                >
                  No previous results available
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Reminder
                </Typography>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="body1">Check your eGFR regularly</Typography>
            </CardContent>
          </Card>
        </Box>
      </CardContent>
    </CardLayout>
  );
};

export default PatientPage;
