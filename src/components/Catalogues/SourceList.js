// @flow
import React from "react";
import type { Source } from "@tachiweb/api-client";
import { makeStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { Client } from "api";
import Link from "components/Link";

type Props = { sources: ?Array<Source> };

const useStyles = makeStyles({
  paper: { marginBottom: 24 }
});

const SourceList = ({ sources }: Props) => {
  const classes = useStyles();

  if (sources == null) return null;

  return (
    <Paper className={classes.paper}>
      <List>
        {sources.map((source, index) => (
          <>
            <ListItem
              key={source.id}
              button
              component={Link}
              to={Client.catalogue(source.id)}
            >
              <ListItemAvatar>
                <Avatar
                  style={{
                    backgroundColor: stringToColor(source.name)
                  }}
                >
                  {source.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText>{source.name}</ListItemText>

              <ListItemSecondaryAction>
                <Button disabled>Latest</Button>
                <Button component={Link} to={Client.catalogue(source.id)}>
                  Browse
                </Button>
              </ListItemSecondaryAction>
            </ListItem>

            {index !== sources.length - 1 && <Divider />}
          </>
        ))}
      </List>
    </Paper>
  );
};

// https://github.com/mui-org/material-ui/issues/12700#issuecomment-527927896
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let colour = "";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  if (parseInt(colour, 16) > 15658734) return "#eeeeee";
  return `#${colour}`;
}

export default SourceList;
