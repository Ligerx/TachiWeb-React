import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Moment from 'moment';

const MangaInfoChapters = ({ chapters }) => (
  <List component="nav">
    {chapters.map(chapter => (
      <ListItem button key={chapter.id}>
        <ListItemText primary={chapter.name} secondary={Moment(chapter.date).format('L')} />
      </ListItem>
    ))}
  </List>
);

export default MangaInfoChapters;
