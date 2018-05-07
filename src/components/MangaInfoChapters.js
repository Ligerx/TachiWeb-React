import React from 'react';
import List from 'material-ui/List';
import Grid from 'material-ui/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import ChapterListItem from 'components/ChapterListItem';
import PropTypes from 'prop-types';
import { chapterType, mangaType } from 'types';

// TODO: update <ResponsiveGrid> so the list can be a lot tighter width
// TODO: parent component, sort (and filter?) chapters. Currently they're in reverse order.

// TODO: maybe paginate the list?
//       e.g. only show 10 chapters, then have a button underneath to show all

const styles = () => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

const MangaInfoChapters = ({ classes, mangaInfo, chapters }) => (
  <ResponsiveGrid>
    <Grid item xs={12}>
      <Paper>
        <List className={classes.list}>
          {chapters.map(chapter => (
            <ChapterListItem key={chapter.id} mangaInfo={mangaInfo} chapter={chapter} />
          ))}
        </List>
      </Paper>
    </Grid>
  </ResponsiveGrid>
);

MangaInfoChapters.propTypes = {
  classes: PropTypes.object.isRequired,
  mangaInfo: mangaType.isRequired,
  chapters: PropTypes.arrayOf(chapterType).isRequired,
};

export default withStyles(styles)(MangaInfoChapters);
