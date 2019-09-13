// @flow
import React from "react";
import { useDispatch } from "react-redux";
import type { Source } from "@tachiweb/api-client";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { langPrettyPrint } from "components/utils";
import {
  updateSourcesEnabledLanguages,
  updateHiddenSources
} from "redux-ducks/settings/actionCreators";

type Props = {
  lang: string,
  sources: $ReadOnlyArray<Source>,
  isEnabled: boolean,
  hiddenSources: $ReadOnlyArray<string>
};

const useStyles = makeStyles({
  root: { position: "relative", marginBottom: 24 },
  switch: {
    position: "absolute",
    top: 0,
    right: 0
  },
  sourceList: { marginLeft: 24 },
  checkbox: { display: "block" }
});

const SourcesByLanguage = ({
  lang,
  sources,
  isEnabled,
  hiddenSources
}: Props) => {
  const dispatch = useDispatch();

  const handleLangChange = event => {
    dispatch(updateSourcesEnabledLanguages(lang, event.target.checked));
  };

  const handleSourceChange = sourceId => event => {
    dispatch(updateHiddenSources(sourceId, !event.target.checked));
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        {langPrettyPrint(lang)}
      </Typography>

      <Switch
        checked={isEnabled}
        onChange={handleLangChange}
        className={classes.switch}
      />

      <div className={classes.sourceList}>
        {isEnabled &&
          sources.map(source => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!hiddenSources.includes(source.id)}
                  onChange={handleSourceChange(source.id)}
                />
              }
              label={source.name}
              key={source.id}
              className={classes.checkbox}
            />
          ))}
      </div>
    </div>
  );
};

export default SourcesByLanguage;
