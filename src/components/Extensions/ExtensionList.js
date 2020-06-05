// @flow
import * as React from "react";
import type { ExtensionType } from "types";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ExtensionListItem from "components/Extensions/ExtensionListItem";
import ExtensionButton from "components/Extensions/ExtensionButton";
import { useInstallExtension, useUninstallExtension } from "apiHooks";

type Props = {
  title: string,
  extensions: Array<ExtensionType>
};

const ExtensionList = ({ title, extensions, ...otherProps }: Props) => {
  const installExtension = useInstallExtension();
  const uninstallExtension = useUninstallExtension();

  const handleInstallExtension = extension => installExtension(extension);

  const handleUninstallExtension = extension => uninstallExtension(extension);

  if (!extensions.length) return null;

  return (
    <div {...otherProps}>
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
                  onUpdateClick={() => handleInstallExtension(extension)}
                  onInstallClick={() => handleInstallExtension(extension)}
                  onUninstallClick={() => handleUninstallExtension(extension)}
                />
              </ExtensionListItem>
            );
          })}
        </List>
      </Paper>
    </div>
  );
};

export default ExtensionList;
