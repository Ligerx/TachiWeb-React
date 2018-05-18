// Basically schemas for data retrieved from the server
// Based on the below link
// https://medium.freecodecamp.org/react-pattern-centralized-proptypes-f981ff672f3b

import { shape, number, string, bool, array } from 'prop-types';

export const mangaType = shape({
  // NOTE: Many non-required fields may be missing because the server needs time to
  //       scrape the website, but returns a barebones object early anyway.

  // Must be included
  id: number.isRequired,
  favorite: bool.isRequired,
  title: string.isRequired,

  // I believe these will always be incliuded
  source: string.isRequired,
  url: string.isRequired,
  downloaded: bool.isRequired,
  flags: shape({
    DISPLAY_MODE: string.isRequired,
    READ_FILTER: string.isRequired,
    SORT_DIRECTION: string.isRequired,
    SORT_TYPE: string.isRequired,
    DOWNLOADED_FILTER: string.isRequired,
  }),

  chapters: number,
  unread: number,
  author: string,
  description: string,
  thumbnail_url: string,
  genres: string,
  categories: array,
  status: string,
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
