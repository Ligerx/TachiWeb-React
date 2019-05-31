// @flow
import * as React from "react";
import type { ExtensionType } from "types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ExtensionListItem from "components/extensions/ExtensionListItem";
import Typography from "@material-ui/core/Typography";
import ExtensionButton from "components/extensions/ExtensionButton";

type Props = {
  title: string,
  extensions: Array<ExtensionType>,
  onUpdateClick: Function,
  onInstallClick: Function,
  onUninstallClick: Function
};

const ExtensionList = ({
  title,
  extensions,
  onUpdateClick,
  onInstallClick,
  onUninstallClick
}: Props) => {
  if (!extensions.length) return null;

  return (
    <Grid item xs={12}>
      <Typography variant="headline" gutterBottom>
        {title} ({extensions.length})
      </Typography>
      <Paper>
        <List>
          {extensions.map((extension, index, array) => {
            const divider = index !== array.length - 1;
            return (
              <ExtensionListItem
                key={extension.pkg_name}
                extension={extension}
                divider={divider}
              >
                <ExtensionButton
                  status={extension.status}
                  has_update={extension.has_update}
                  name={extension.name}
                  onUpdateClick={() => onUpdateClick(extension.pkg_name)}
                  onInstallClick={() => onInstallClick(extension.pkg_name)}
                  onUninstallClick={() => onUninstallClick(extension.pkg_name)}
                />
              </ExtensionListItem>
            );
          })}
        </List>
      </Paper>
    </Grid>
  );
};

export default ExtensionList;
