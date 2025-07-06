import { useState } from "react";

interface LoginFormData {
  name: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
  userType: string;
  age: number | null;
  gender: string;
  ethnicity: string;
  creatinineValue: number | null;
  height: number | null;
}

const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    name: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    userType: "Patient",
    age: null,
    gender: "",
    ethnicity: "",
    creatinineValue: null,
    height: null,
  });
  // Updates input where user types in the form
  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name) {
      setFormData({ ...formData, [name]: value });
    }
  };

  return { formData, handleChange };
};

export default useLoginForm;
