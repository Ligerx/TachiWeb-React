// Basically schemas for data retrieved from the server
// Based on the below link
// https://medium.freecodecamp.org/react-pattern-centralized-proptypes-f981ff672f3b

import { shape, number, string, bool, array } from 'prop-types';

export const mangaType = shape({
  chapters: number.isRequired,
  unread: number, // not required because catalogue manga data does not include this
  author: string.isRequired,
  flags: shape({
    DISPLAY_MODE: string.isRequired,
    READ_FILTER: string.isRequired,
    SORT_DIRECTION: string.isRequired,
    SORT_TYPE: string.isRequired,
    DOWNLOADED_FILTER: string.isRequired,
  }),
  description: string.isRequired,
  source: string.isRequired,
  title: string.isRequired,
  thumbnail_url: string.isRequired,
  downloaded: bool.isRequired,
  url: string.isRequired,
  genres: string.isRequired,
  id: number.isRequired,
  categories: array.isRequired,
  favorite: bool.isRequired,
  status: string.isRequired,
});

export const chapterType = shape({
  date: number.isRequired,
  source_order: number.isRequired,
  read: bool.isRequired,
  name: string.isRequired,
  chapter_number: number.isRequired,
  download_status: string.isRequired,
  id: number.isRequired,
  last_page_read: number.isRequired,
});
