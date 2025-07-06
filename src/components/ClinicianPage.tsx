import CardLayout from "@/layout/CardLayout";
import useLoginForm from "@/hooks/useLoginForm";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { auth, db } from "@/config/firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  addDoc,
} from "firebase/firestore";

// CSV data from file
interface CSVPatient {
  PatientID: string | number;
  Gender: number;
  Ethnicity: string;
  Age: number;
  Creatinine: number;
  Height?: number;
}

interface RecentPatient {
  id: string;
  name: string;
  lastCalculated: string;
  egfr: number;
}

const ClinicianPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { formData } = useLoginForm();
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  // format date and time
  const formatDateTime = (date: any) => {
    if (date && typeof date.toDate === "function") {
      const dateObj = date.toDate();

      return `${dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })} · ${dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`;
    } else if (date) {
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

  // load recent patients
  useEffect(() => {
    const fetchRecentPatients = async () => {
      setIsLoadingPatients(true);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("No user is signed in");
          setIsLoadingPatients(false);
          return;
        }

        // Recent eGFR results from firestore
        const resultsQuery = query(
          collection(db, "users", currentUser.uid, "egfrResults"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const resultsSnapshot = await getDocs(resultsQuery);

        if (resultsSnapshot.empty) {
          console.log("No recent patients found");
          setIsLoadingPatients(false);
          return;
        }

        // Firestore data gets formatted to recent patient data format
        const patients = resultsSnapshot.docs.map((doc, index) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: `Patient ${index + 1}`,
            lastCalculated: formatDateTime(data.createdAt || new Date()),
            egfr: data.value || 0,
          };
        });

        setRecentPatients(patients);
      } catch (error) {
        console.error("Error fetching recent patients:", error);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchRecentPatients();
  }, []);

  // Go to single patient calculator
  const handleNavigation = () => {
    navigate("/calculator");
  };

  // Normal eGFR calculation function
  const calculateAdultEGFR = (
    age: number,
    gender: string,
    ethnicity: string,
    creatinine: number
  ) => {
    let egfr =
      186 * Math.pow(creatinine / 88.4, -1.154) * Math.pow(age, -0.203);

    if (gender === "female") {
      egfr *= 0.742;
    }

    if (ethnicity === "black") {
      egfr *= 1.21;
    }

    // Round to 1 decimal place
    return Math.round(egfr * 10) / 10;
  };

  // age < 18 formula
  const calculatePediatricEGFR = (height: number, creatinine: number) => {
    // eGFR = (0.413 × height in cm) / serum creatinine in mg/dL
    const k = 0.413;
    const creatinineMgDl = creatinine / 88.4;
    const egfr = (k * height) / creatinineMgDl;

    // Round to one decimal place
    return Math.round(egfr * 10) / 10;
  };

  // Save patient eGFR result to Firestore
  const savePatientResult = async (patientData: any) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Reference to the user's egfrResults subcollection
      const resultsRef = collection(
        db,
        "users",
        currentUser.uid,
        "egfrResults"
      );

      // Add the document to the subcollection
      await addDoc(resultsRef, {
        patientId: patientData.patientId,
        value: patientData.egfr,
        stage: getCKDStage(patientData.egfr),
        createdAt: new Date(),
        age: patientData.age,
        gender: patientData.gender,
        ethnicity: patientData.ethnicity,
        creatinine: patientData.creatinineValue,
      });
    } catch (error) {
      console.error("Error saving patient result:", error);
    }
  };

  // Get CKD stage based on eGFR value
  const getCKDStage = (egfrValue: number) => {
    if (egfrValue >= 90) return "Stage 1";
    if (egfrValue >= 60) return "Stage 2";
    if (egfrValue >= 45) return "Stage 3a";
    if (egfrValue >= 30) return "Stage 3b";
    if (egfrValue >= 15) return "Stage 4";
    return "Stage 5";
  };

  // Handle selected CSV file
  const handleSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    // Parse CSV raw data into javascript object
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: async (results) => {
        // Process each row in the CSV
        const patients = results.data
          .filter(
            (row: any) =>
              row.PatientID &&
              row.Gender !== undefined &&
              row.Ethnicity &&
              row.Age !== undefined &&
              row.Age >= 0 &&
              row.Age <= 110 &&
              row.Creatinine > 0
          )
          .map((row: any) => {
            // Convert data to our format
            const gender = row.Gender === 1 ? "male" : "female";
            const ethnicity = row.Ethnicity === "B" ? "black" : "other";
            const age = row.Age;
            const isPediatric = age < 18;

            // calculate eGFR based on age
            let egfr;
            if (isPediatric && row.Height) {
              egfr = calculatePediatricEGFR(row.Height, row.Creatinine);
            } else {
              egfr = calculateAdultEGFR(age, gender, ethnicity, row.Creatinine);
            }

            // Return patient
            return {
              patientId: row.PatientID.toString(),
              age: age,
              gender: gender,
              ethnicity: ethnicity,
              creatinineValue: row.Creatinine,
              height: row.Height,
              egfr: egfr,
              isPediatric: isPediatric,
              userType: formData.userType || "Clinician",
            };
          });

        // Save all the patient results to firestore database
        for (const patient of patients) {
          await savePatientResult(patient);
        }

        // Refresh the recent patients list
        const currentUser = auth.currentUser;
        if (currentUser) {
          const resultsQuery = query(
            collection(db, "users", currentUser.uid, "egfrResults"),
            orderBy("createdAt", "desc"),
            limit(5)
          );

          const resultsSnapshot = await getDocs(resultsQuery);

          const updatedPatients = resultsSnapshot.docs.map((doc, index) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: `Patient ${index + 1}`,
              lastCalculated: formatDateTime(data.createdAt || new Date()),
              egfr: data.value || 0,
            };
          });

          setRecentPatients(updatedPatients);
        }

        setLoading(false);

        if (patients.length === 0) {
          alert("No valid patient data found in the CSV file.");
          return;
        }

        // Navigate to results page with processed patients
        navigate("/patientGroupResults", { state: { patients } });
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setLoading(false);
        alert("Error parsing CSV file. Please check the format.");
      },
    });
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <CardLayout>
      <CardHeader
        title="Clinician Dashboard"
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
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleSelectedFile}
        />

        <Box
          sx={{
            display: "flex",
            gap: "16px",
            mb: 3,
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleNavigation}
            sx={{
              py: 1.5,
              px: 3,
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
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              px: 3,
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
            {loading ? "Processing..." : "Upload Patient Data (CSV)"}
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            mt: 2,
            width: "100%",
            maxWidth: "650px",
            margin: "0 auto",
          }}
        >
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Patients
                </Typography>
              }
            />
            <CardContent>
              {isLoadingPatients ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                >
                  Loading patients...
                </Typography>
              ) : recentPatients.length > 0 ? (
                recentPatients.map((patient) => (
                  <Box
                    key={patient.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1">{patient.name}</Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {patient.lastCalculated}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        eGFR: {patient.egfr}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                >
                  No recent patients
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography variant="body1" color="text.secondary" align="center">
                Patient data is secure and not stored locally
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </CardContent>
    </CardLayout>
  );
};

export default ClinicianPage;
