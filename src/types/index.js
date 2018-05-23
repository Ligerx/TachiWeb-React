// @flow
import type {
  FilterText,
  FilterSelect,
  FilterTristate,
  FilterGroup,
  FilterSort,
  FilterHeader,
  FilterSeparator,
  FilterCheckbox,
} from './filters';

export type MangaType = {
  // NOTE: Many non-required fields may be missing because the server needs time to
  //       scrape the website, but returns a barebones object early anyway.

  // Must be included
  id: string,
  favorite: boolean,
  title: string,

  // I believe these will always be incliuded
  source: string,
  url: string,
  downloaded: boolean,
  flags: {
    DISPLAY_MODE: string,
    READ_FILTER: string,
    SORT_DIRECTION: string,
    SORT_TYPE: string,
    DOWNLOADED_FILTER: string,
  },

  chapters: ?number,
  unread: ?number,
  author: ?string,
  description: ?string,
  thumbnail_url: ?string,
  genres: ?string,
  categories: ?(string[]),
  status: ?string,
};

export type ChapterType = {
  date: number,
  source_order: number,
  read: boolean,
  name: string,
  chapter_number: number,
  download_status: string,
  id: number,
  last_page_read: number,
};

export type SourceType = {
  name: string,
  supports_latest: boolean,
  id: number,
  lang: {
    name: string,
    display_name: string,
  },
};

export type FiltersType = Array<
  | FilterText
  | FilterSelect
  | FilterTristate
  | FilterGroup
  | FilterSort
  | FilterHeader
  | FilterSeparator
  | FilterCheckbox,
>;
