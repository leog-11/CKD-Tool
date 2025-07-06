import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontWeight: 500,
      fontSize: "2rem",
      letterSpacing: "-0.01562em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      letterSpacing: "0.00938em",
    },
    button: {
      fontWeight: 500,
      letterSpacing: "0.02857em",
      textTransform: "uppercase",
    },
  },
  palette: {
    primary: {
      light: "#e57373",
      main: "#d36d8c",
      dark: "#c62828",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffb2b2",
      main: "#e57373",
      dark: "#c62828",
      contrastText: "#fff",
    },
    background: {
      default: "#fff5f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  shape: {
    borderRadius: 8,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        },
        elevation2: {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
        elevation3: {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "10px 16px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
            },
            "&.Mui-focused": {
              boxShadow: "0px 2px 8px rgba(211, 109, 140, 0.2)",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
