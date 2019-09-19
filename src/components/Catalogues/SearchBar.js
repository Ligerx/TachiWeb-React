// @flow
import React from "react";
import { makeStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

type Props = {
  value: string,
  onChange: Function,
  onSubmit: Function,
  textFieldProps?: Object,
  buttonProps?: Object
};

// Not manually merging classNames or styles currently. So overriding them may not work as expected.
const useStyles = makeStyles({
  root: {
    display: "flex"
  },
  textField: {
    flex: 1
  },
  button: {}
});

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  textFieldProps = {},
  buttonProps = {}
}: Props) => {
  const classes = useStyles();

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        variant="outlined"
        value={value}
        onChange={onChange}
        className={classes.textField}
        {...textFieldProps}
      />

      <Button
        variant="contained"
        className={classes.button}
        onClick={handleSubmit}
        {...buttonProps}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
