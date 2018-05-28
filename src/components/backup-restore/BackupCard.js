// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import { Server } from 'api';

const BackupCard = () => (
  <Paper>
    <Button variant="raised" color="primary" href={Server.backupDownload()} download>
      <Icon>cloud_download</Icon>
      Backup
    </Button>
  </Paper>
);

export default BackupCard;
