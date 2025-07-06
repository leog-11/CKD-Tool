import CalculatorPage from "@/components/CalculatorPage";
import ClinicianPage from "@/components/ClinicianPage";
import ForgotPassPage from "@/components/ForgotPassPage";
import Login from "@/components/Login";
import PatientGroupResults from "@/components/PatientGroupResults";
import PatientPage from "@/components/PatientPage";
import PediatricCalcPage from "@/components/PediatricCalcPage";
import ResultsPage from "@/components/ResultsPage";
import SignUpPage from "@/components/SignUpPage";
import { Navigate, Route, Routes } from "react-router-dom";

// React's routes allow us to specifify route path and page to navigate to
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/clinician" element={<ClinicianPage />} />
      <Route path="/patient" element={<PatientPage />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/forgotPass" element={<ForgotPassPage />} />
      <Route path="/signUp" element={<SignUpPage />} />
      <Route path="/pediatricCalc" element={<PediatricCalcPage />} />
      <Route path="/patientGroupResults" element={<PatientGroupResults />} />
    </Routes>
  );
};

export default AppRouter;
