import { Button } from "@mui/material";
import { ReactNode } from "react";

interface CustomButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}
// Custom red reusable button
const CustomButton = ({
  children,
  onClick,
  type = "button",
}: CustomButtonProps) => {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{
        background: "#e57373",
        "&:hover": { bgcolor: "#c62828" },
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
