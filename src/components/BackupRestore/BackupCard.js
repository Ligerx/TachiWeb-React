// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import { Server } from "api";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles({
  icon: { marginRight: 8 },
  button: {
    width: "100%",
    marginTop: 16
  }
});

const BackupCard = ({ ...otherProps }: {}) => {
  const classes = useStyles();

  return (
    <Card {...otherProps}>
      <CardContent>
        <Typography gutterBottom variant="h5">
          Create a Backup
        </Typography>
        <Typography>
          A backup file can be used to restore your current library in TachiWeb
          or Tachiyomi
        </Typography>

        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          href={Server.backupDownload()}
          download
        >
          <Icon className={classes.icon}>cloud_download</Icon>
          Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default BackupCard;
