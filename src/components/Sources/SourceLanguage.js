// @flow
import React from "react";
import { useDispatch } from "react-redux";
import type { Source } from "@tachiweb/api-client";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/styles";
import SourceRow from "components/Sources/SourceRow";
import { langPrettyPrint } from "components/utils";
import { updateSourcesEnabledLanguages } from "redux-ducks/settings/actionCreators";

type Props = {
  lang: string,
  sources: $ReadOnlyArray<Source>,
  isEnabled: boolean,
  hiddenSources: $ReadOnlyArray<string> // a bit hacky to include the whole array here
};

const useStyles = makeStyles({
  root: { position: "relative", marginBottom: 16 },
  switch: {
    position: "absolute",
    top: 0,
    right: 0
  },
  sourceList: { marginLeft: 24 }
});

const SourceLanguage = ({ lang, sources, isEnabled, hiddenSources }: Props) => {
  const dispatch = useDispatch();

  const handleChange = event => {
    dispatch(updateSourcesEnabledLanguages(lang, event.target.checked));
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5">{langPrettyPrint(lang)}</Typography>

      <Switch
        checked={isEnabled}
        onChange={handleChange}
        className={classes.switch}
      />

      <div className={classes.sourceList}>
        {isEnabled &&
          sources.map(source => (
            <SourceRow
              key={source.id}
              source={source}
              isEnabled={!hiddenSources.includes(source.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default SourceLanguage;
