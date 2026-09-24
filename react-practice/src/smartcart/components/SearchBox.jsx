import { forwardRef, useRef, useImperativeHandle } from "react";
import { TextField } from "@mui/material";

// forwardRef + useImperativeHandle are unchanged from Week 2 — only the
// rendered element changed to MUI's TextField, whose inputRef still forwards to the native <input>.
const SearchBox = forwardRef(function SearchBox(
  { value, onChange, placeholder },
  ref
) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));

  return (
    <TextField
      inputRef={inputRef}
      size="small"
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
});

export default SearchBox;
