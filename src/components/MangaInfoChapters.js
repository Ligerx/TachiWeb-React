import React from 'react';
import List from 'material-ui/List';
import Grid from 'material-ui/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import ChapterListItem from 'components/ChapterListItem';

// TODO: update <ResponsiveGrid> so the list can be a lot tighter width
// TODO: parent component, sort (and filter?) chapters. Currently they're in reverse order.

const styles = () => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

const MangaInfoChapters = ({ classes, chapters }) => (
  <ResponsiveGrid>
    <Grid item xs={12}>
      <Paper>
        <List className={classes.list}>
          {chapters.map(chapter => <ChapterListItem chapter={chapter} />)}
        </List>
      </Paper>
    </Grid>
  </ResponsiveGrid>
);

export default withStyles(styles)(MangaInfoChapters);
