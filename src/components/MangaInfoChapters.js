// @flow
import React from 'react';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ChapterListItem from 'components/ChapterListItem';
import type { ChapterType, MangaType } from 'types';

// TODO: update <ResponsiveGrid> so the list can be a lot tighter width

// TODO: List is slow with 200+ chapters
//       Can just use the virtualized library to speed it up.
//       https://github.com/bvaughn/react-virtualized
//       But first, try the production build to see if that improves performance.

const styles = () => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

type Props = {
  classes: Object,
  mangaInfo?: MangaType,
  chapters: Array<ChapterType>,
};

const MangaInfoChapters = ({ classes, mangaInfo, chapters }: Props) => (
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

MangaInfoChapters.defaultProps = {
  mangaInfo: null,
};

export default withStyles(styles)(MangaInfoChapters);
