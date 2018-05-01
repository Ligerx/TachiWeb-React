import React from 'react';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';

const MangaInfoTabs = ({ tabValue, handleChange }) => (
  <Paper>
    <Tabs value={tabValue} onChange={handleChange} indicatorColor="primary" centered>
      <Tab label="Info" />
      <Tab label="Chapters" />
    </Tabs>
  </Paper>
);

export default MangaInfoTabs;
