import React from 'react';
import List, { ListItem } from 'material-ui/List';
import Moment from 'moment';
import Grid from 'material-ui/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

// TODO: center align the middle text?
// TODO: right align the right text?
// TODO: grey out list item when it's read
// TODO: update <ResponsiveGrid> so the list can be a lot tighter width
// TODO: parent component, sort (and filter?) chapters. Currently they're in reverse order.

const styles = () => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

const chapterText = (read, last_page_read) => {
  let text = '';
  if (!read && last_page_read > 0) {
    text = `Page ${last_page_read + 1}`;
  }
  return text;
};

const downloadText = (download_status) => {
  let text = '';
  if (download_status === 'DOWNLOADED') {
    text = 'Downloaded';
  }
  return text;
};

const MangaInfoChapters = ({ classes, chapters }) => (
  <ResponsiveGrid>
    <Grid item xs={12}>
      <Paper>
        <List className={classes.list}>
          {chapters.map(chapter => (
            <ListItem button divider key={chapter.id}>
              <Grid container>
                <Grid item xs={12}>
                  {chapter.name}
                </Grid>
                <Grid item xs={4}>
                  {Moment(chapter.date).format('L')}
                </Grid>
                <Grid item xs={4}>
                  {chapterText(chapter.read, chapter.last_page_read)}
                </Grid>
                <Grid item xs={4}>
                  {downloadText(chapter.download_status)}
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Grid>
  </ResponsiveGrid>
);

export default withStyles(styles)(MangaInfoChapters);
