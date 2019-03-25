// @flow
import React from 'react';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ChapterListItem from 'components/mangaInfo/ChapterListItem';
import type { ChapterType } from 'types';
import type { Manga } from "@tachiweb/api-client";

// TODO: I've made ResponsiveGrid maxWidth="xs". What happens when the chapter title is too long?

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
  mangaInfo: Manga,
  chapters: Array<ChapterType>,
  toggleRead: Function,
};

const MangaInfoChapterList = ({
  classes, mangaInfo, chapters, toggleRead,
}: Props) => (
  <ResponsiveGrid maxWidth="xs">
    <Grid item xs={12}>
      <Paper>
        <List className={classes.list}>
          {chapters.map(chapter => (
            <ChapterListItem
              key={chapter.id}
              mangaInfo={mangaInfo}
              chapter={chapter}
              toggleRead={toggleRead}
            />
          ))}
        </List>
      </Paper>
    </Grid>
  </ResponsiveGrid>
);

export default withStyles(styles)(MangaInfoChapterList);
