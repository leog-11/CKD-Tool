import { Box, Card, CardContent } from "@mui/material";
import React, { ReactNode } from "react";

interface CardLayoutProps {
  children: ReactNode;
}
// Main style container that we will use
const CardLayout = ({ children }: CardLayoutProps) => {
  return (
    <Box
      sx={{
        background: "#ffefef",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Card
        sx={{
          display: "flex",
          background: "#ffeaea",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 550,
          minHeight: 700,
          gap: 2,
        }}
      >
        {children}
      </Card>
    </Box>
  );
};

export default CardLayout;
