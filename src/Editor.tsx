import AceEditor from "react-ace";
import React from "react";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

import { Grid } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
// import FaceIcon from "@mui/icons-material/Face";
import CodeIcon from "@mui/icons-material/Code";

import documentLoader from "./documentLoader";
import history from "./history";
import utf8ArrayToStr from "./utf8ArrayToStr";

const editorTheme = "monokai";
const jsonld = require("jsonld");
const pako = require("pako");
const bs58 = require("bs58");

const exampleJson = JSON.stringify(
  {
    "@context": [
      "https://w3id.org/traceability/v1",
      //   {
      //     "type": "https://example.com",
      //     "name": "https://example.com",
      //     "description": "https://example.com"
      // }
    ],
    type: "Organization",
    name: "Bartell Inc 🔥",
    description: "Realigned maximized alliance",
    bar: "baz",
  },
  null,
  2
);

const getSourceFromHistory = (encoded: string) => {
  const decoded = bs58.decode(encoded);
  const inflated = pako.inflate(decoded);
  return utf8ArrayToStr(inflated);
};

const setSourceInHistory = (source: string) => {
  const output = pako.deflate(source);
  const encoded = bs58.encode(output);
  history.push(encoded);
};

const Editor = () => {
  const defaultEditorValue =
    window.location.pathname.length > 3
      ? getSourceFromHistory(window.location.pathname.substring(1))
      : exampleJson;
  const [source, setSource] = React.useState(defaultEditorValue);
  const [dest, setDest] = React.useState("");

  const [parseError, setParseError] = React.useState(false);
  const [unmappedProperties, setUnmappedProperties]: any = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let parsed = {};
      try {
        parsed = JSON.parse(source);
        setParseError(false);
      } catch (e) {
        console.error("Failed to parse: ", source);
        setParseError(true);
        setDest("");
        return;
      }
      try {
        const unmapped: any = [];
        const canonized = await jsonld.canonize(parsed, {
          algorithm: "URDNA2015",
          format: "application/n-quads",
          documentLoader,
          expansionMap: ({ unmappedProperty }: any) => {
            if (unmappedProperty && !unmapped.includes(unmappedProperty)) {
              unmapped.push(unmappedProperty);
            }
          },
        });

        setUnmappedProperties(unmapped);
        if (unmapped.length) {
          setDest("");
        } else {
          setDest(canonized);
          setSourceInHistory(source);
        }
      } catch (e) {
        console.error("Failed to canonize: ", source, e);
        setDest("");
      }
    })();
  }, [source]);
  return (
    <Grid container sx={{ mb: 4 }}>
      <Grid item xs={12}>
        <Stack direction="column" spacing={1} sx={{ mb: 2, mt: 2 }}>
          {parseError && (
            <Chip
              icon={<CodeIcon />}
              label="JSON is not valid"
              variant="outlined"
              color={"error"}
            />
          )}
          {unmappedProperties.map((p: string, i: any) => {
            return (
              <Chip
                key={i}
                icon={<CodeIcon />}
                label={`${p} is not defined in the context`}
                variant="outlined"
                color={"error"}
              />
            );
          })}
        </Stack>
      </Grid>
      <Grid item xs={12} sm={12}>
        <AceEditor
          style={{ width: "100%" }}
          mode={"json"}
          theme={editorTheme}
          maxLines={Infinity}
          onChange={setSource}
          editorProps={{ $blockScrolling: true }}
          value={source}
        />
      </Grid>
      {dest !== "" && (
        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
          <AceEditor
            style={{ width: "100%" }}
            mode={"text"}
            theme={editorTheme}
            maxLines={Infinity}
            editorProps={{ $blockScrolling: true }}
            value={dest}
            readOnly={true}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default Editor;
