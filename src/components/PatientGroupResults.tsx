import CardLayout from "@/layout/CardLayout";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CardHeader,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface Patient {
  patientId: string | number;
  age: number;
  gender: string;
  ethnicity: string;
  creatinineValue: number;
  height?: number;
  egfr: number;
  isPediatric?: boolean;
  userType?: string;
}

// Function to determine CKD stage based on eGFR
const getCKDStage = (egfr: number): string => {
  if (egfr >= 90) return "Stage 1";
  if (egfr >= 60) return "Stage 2";
  if (egfr >= 45) return "Stage 3a";
  if (egfr >= 30) return "Stage 3b";
  if (egfr >= 15) return "Stage 4";
  return "Stage 5";
};

// Function to get row color based on CKD stage
const getRowColorByStage = (egfr: number): string => {
  if (egfr < 15) return "#ef9a9a";
  if (egfr < 30) return "#f8bbd0";
  if (egfr < 45) return "#fce4ec";
  return "white";
};

const PatientGroupResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get patients from navigation state or use empty array if none
  const patients: Patient[] = location.state?.patients || [];

  // Return to clinician dashboard
  const handleBackToDashboard = () => {
    navigate("/clinician");
  };

  return (
    <CardLayout>
      <CardHeader title="Patient Group Results" sx={{ pb: 0 }} />

      <Box sx={{ p: 2 }}>
        {patients.length === 0 ? (
          <Box sx={{ textAlign: "center", my: 2 }}>
            <Typography variant="h6">No patient data available</Typography>
            <Button
              variant="contained"
              onClick={handleBackToDashboard}
              sx={{
                mt: 2,
                background: "#e57373",
                "&:hover": { bgcolor: "#c62828" },
              }}
            >
              BACK TO DASHBOARD
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Patient Results ({patients.length} patients)
            </Typography>

            <Box
              sx={{
                height: "380px",
                maxWidth: "85%",
                margin: "0 auto",
                mb: 2,
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  height: "100%",
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          padding: "6px 8px",
                          bgcolor: "#f8b9c5",
                          color: "#d32f2f",
                        }}
                      >
                        Patient ID
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          padding: "6px 8px",
                          bgcolor: "#f8b9c5",
                          color: "#d32f2f",
                        }}
                      >
                        Age
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          padding: "6px 8px",
                          bgcolor: "#f8b9c5",
                          color: "#d32f2f",
                        }}
                      >
                        eGFR
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          padding: "6px 8px",
                          bgcolor: "#f8b9c5",
                          color: "#d32f2f",
                        }}
                      >
                        CKD Stage
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          padding: "6px 8px",
                          bgcolor: "#f8b9c5",
                          color: "#d32f2f",
                        }}
                      >
                        Formula
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.map((patient, index) => {
                      // get the color based on the ckd stages
                      const rowColor = getRowColorByStage(patient.egfr);

                      return (
                        <TableRow
                          key={patient.patientId || index}
                          sx={{ bgcolor: rowColor }}
                        >
                          <TableCell sx={{ padding: "6px 8px" }}>
                            {patient.patientId}
                          </TableCell>
                          <TableCell sx={{ padding: "6px 8px" }}>
                            {patient.age}
                          </TableCell>
                          <TableCell sx={{ padding: "6px 8px" }}>
                            {patient.egfr} mL/min/1.73m²
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: "6px 8px",
                              fontWeight: patient.egfr < 45 ? "bold" : "normal",
                            }}
                          >
                            {getCKDStage(patient.egfr)}
                          </TableCell>
                          <TableCell sx={{ padding: "6px 8px" }}>
                            {patient.isPediatric ? "Pediatric" : "Adult"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "center", mb: 2, gap: 3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: "#ef9a9a",
                    mr: 1,
                    border: "1px solid #d32f2f",
                  }}
                ></Box>
                <Typography variant="caption">Stage 5</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: "#f8bbd0",
                    mr: 1,
                    border: "1px solid #d32f2f",
                  }}
                ></Box>
                <Typography variant="caption">Stage 4</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: "#fce4ec",
                    mr: 1,
                    border: "1px solid #d32f2f",
                  }}
                ></Box>
                <Typography variant="caption">Stage 3b</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleBackToDashboard}
                sx={{
                  background: "#e57373",
                  "&:hover": { bgcolor: "#c62828" },
                  mt: 1,
                  mb: 1,
                }}
              >
                BACK TO DASHBOARD
              </Button>
            </Box>
          </>
        )}
      </Box>
    </CardLayout>
  );
};

export default PatientGroupResults;
