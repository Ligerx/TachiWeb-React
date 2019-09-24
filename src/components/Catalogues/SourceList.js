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
          <div key={source.id}>
            <ListItem
              key={source.id}
              button
              component={Link}
              to={Client.catalogue(source.id)}
            >
              <ListItemAvatar>
                <Avatar
                  style={{
                    backgroundColor: getColorTachiyomi(source.name)
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
          </div>
        ))}
      </List>
    </Paper>
  );
};

const MATERIAL_COLORS = [
  "e57373",
  "f06292",
  "ba68c8",
  "9575cd",
  "7986cb",
  "64b5f6",
  "4fc3f7",
  "4dd0e1",
  "4db6ac",
  "81c784",
  "aed581",
  "ff8a65",
  "d4e157",
  "ffd54f",
  "ffb74d",
  "a1887f",
  "90a4ae"
];

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = 31 * h + str.charCodeAt(i);
  }
  return h;
}

function getColor(key) {
  return MATERIAL_COLORS[Math.abs(hashCode(key)) % MATERIAL_COLORS.length];
}

function getColorTachiyomi(string: string) {
  // Specifically, Tachiyomi calls the getColor method, supplying the uppercase first
  // letter of the catalogue name as the key argument.
  // The algorithm used is located here:
  // https://github.com/amulyakhare/TextDrawable/blob/master/library/src/main/java/com/amulyakhare/textdrawable/util/ColorGenerator.java
  const char = string.charAt(0).toUpperCase();
  return `#${getColor(char)}`;
}

export default SourceList;
