import Editor from "./Editor";
import { Box, Button, ThemeProvider, createTheme } from "@mui/material";
import { blue, deepPurple, grey } from "@mui/material/colors";
import ForkMeOnGithub from "fork-me-on-github";
import ShareIcon from "@mui/icons-material/Share";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", height: "100%", p: 2 }}>
        <ForkMeOnGithub
          repo="https://github.com/transmute-industries/v.jsld.org"
          colorBackground={deepPurple[500]}
        />
        <CopyToClipboard
          text={window.location.href}
          onCopy={() => toast.success("Copied to clipboard!")}
        >
          <Button
            color={"secondary"}
            variant="contained"
            startIcon={<ShareIcon />}
          >
            Share
          </Button>
        </CopyToClipboard>
        <Editor />
        <ToastContainer theme={"dark"} position="top-left" />
      </Box>
    </ThemeProvider>
  );
}

export default App;
