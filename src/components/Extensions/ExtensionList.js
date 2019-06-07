// @flow
import * as React from "react";
import { useDispatch } from "react-redux";
import type { ExtensionType } from "types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ExtensionListItem from "components/Extensions/ExtensionListItem";
import ExtensionButton from "components/Extensions/ExtensionButton";
import { installExtension, uninstallExtension } from "redux-ducks/extensions";

type Props = {
  title: string,
  extensions: Array<ExtensionType>
};

const ExtensionList = ({ title, extensions }: Props) => {
  const dispatch = useDispatch();

  const handleInstallExtension = packageName =>
    dispatch(installExtension(packageName));

  const handleUninstallExtension = packageName =>
    dispatch(uninstallExtension(packageName));

  if (!extensions.length) return null;

  return (
    <Grid item xs={12}>
      <Typography variant="h5" gutterBottom>
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
                  onUpdateClick={() =>
                    handleInstallExtension(extension.pkg_name)
                  }
                  onInstallClick={() =>
                    handleInstallExtension(extension.pkg_name)
                  }
                  onUninstallClick={() =>
                    handleUninstallExtension(extension.pkg_name)
                  }
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
