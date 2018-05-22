// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { Client } from 'api';
import { Link } from 'react-router-dom';
import { ChapterType, MangaType } from 'types';

// TODO: add additional actions such as mark as read/unread.
// TODO: align the bottom row text? It's a little off horizontally right now.

const styles = () => ({
  read: {
    color: '#AAA',
  },
});

type Props = {
  classes: Object,
  mangaInfo?: MangaType,
  chapter: ChapterType,
};

const ChapterListItem = ({ classes, mangaInfo, chapter }: Props) => {
  const dimIfRead = read => classNames({ [classes.read]: read });
  const goToPage = chapter.read ? 0 : chapter.last_page_read;
  const pageLink = mangaInfo ? Client.page(mangaInfo.id, chapter.id, goToPage) : null;

  return (
    <ListItem button divider component={Link} to={pageLink}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="subheading" className={dimIfRead(chapter.read)}>
            {chapter.name}
          </Typography>
        </Grid>
        <Grid item style={{ flex: 1 }}>
          <Typography variant="caption" className={dimIfRead(chapter.read)}>
            {Moment(chapter.date).format('L')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>{chapterText(chapter.read, chapter.last_page_read)}</Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

// Helper Functions
/* eslint-disable camelcase */
function chapterText(read, last_page_read) {
  let text = '';
  if (!read && last_page_read > 0) {
    text = `Page ${last_page_read + 1}`;
  }
  return text;
}
/* eslint-enable camelcase */

ChapterListItem.defaultProps = {
  mangaInfo: null,
};

export default withStyles(styles)(ChapterListItem);
