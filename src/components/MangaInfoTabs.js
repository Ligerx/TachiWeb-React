import React from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';

// TODO: I added padding to the tabs. Is this the best/right method? Will it work on small screens?

const styles = () => ({
  tab: {
    paddingLeft: 48,
    paddingRight: 48,
  },
});

const MangaInfoTabs = ({ classes, tabValue, handleChange }) => (
  <Tabs value={tabValue} onChange={handleChange} indicatorColor="primary" centered>
    <Tab label="Info" className={classes.tab} />
    <Tab label="Chapters" className={classes.tab} />
  </Tabs>
);

export default withStyles(styles)(MangaInfoTabs);
