// @flow
import React from "react";
import { useDispatch } from "react-redux";
import type { Source } from "@tachiweb/api-client";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import SourceRow from "components/Sources/SourceRow";
import { langPrettyPrint } from "components/utils";

type Props = {
  lang: string,
  sources: $ReadOnlyArray<Source>,
  isEnabled: boolean
};

const SourceLanguage = ({ lang, sources, isEnabled }: Props) => {
  const dispatch = useDispatch();

  return (
    <>
      <Typography variant="h5">{langPrettyPrint(lang)}</Typography>

      <Switch checked={isEnabled} onChange={() => {}} />

      {sources.map(source => (
        <SourceRow source={source} />
      ))}
    </>
  );
};

export default SourceLanguage;
