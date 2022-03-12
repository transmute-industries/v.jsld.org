import Editor from "./Editor";
import { Box, Button, ThemeProvider, createTheme } from "@mui/material";
import { blue, deepPurple, grey } from "@mui/material/colors";
import ForkMeOnGithub from "fork-me-on-github";
import ShareIcon from "@mui/icons-material/Share";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import history from "./history";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: grey[800],
    },
    primary: {
      main: deepPurple[400],
    },
    secondary: {
      main: blue["A200"],
    },
  },
} as any);

function fallbackCopyTextToClipboard(text: string) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", height: "100%", p: 2 }}>
        <ForkMeOnGithub
          repo="https://github.com/transmute-industries/v.jsld.org"
          colorBackground={deepPurple[500]}
        />
        <Button
          color={"secondary"}
          variant="contained"
          onClick={() => {
            fallbackCopyTextToClipboard(
              window.location.origin + history.location.pathname
            );
            toast.success("Copied to clipboard!");
          }}
          startIcon={<ShareIcon />}
        >
          Share
        </Button>
        <Editor />
        <ToastContainer theme={"dark"} position="top-left" />
      </Box>
    </ThemeProvider>
  );
}

export default App;
