// @flow
export type MangaInfoFlagsType = {
  DISPLAY_MODE: "NAME" | "NUMBER",
  READ_FILTER: "READ" | "UNREAD" | "ALL",
  SORT_DIRECTION: "ASCENDING" | "DESCENDING",
  SORT_TYPE: "SOURCE" | "NUMBER",
  DOWNLOADED_FILTER: "DOWNLOADED" | "NOT_DOWNLOADED" | "ALL"
};

export type MangaType = {
  // NOTE: Many non-required fields may be missing because the server needs time to
  //       scrape the website, but returns a barebones object early anyway.

  // Must be included
  id: number,
  favorite: boolean,
  title: string,

  // I believe these will always be incliuded
  source: string,
  url: string,
  downloaded: boolean,
  flags: MangaInfoFlagsType,

  chapters: ?number,
  unread: ?number,
  author: ?string,
  description: ?string,
  thumbnail_url: ?string,
  genres: ?string,
  categories: ?Array<string>,
  status: ?string
};

export type ChapterType = {
  date: number,
  source_order: number,
  read: boolean,
  name: string,
  chapter_number: number,
  download_status: string,
  id: number,
  last_page_read: number
};

export type SourceType = {
  name: string,
  supports_latest: boolean,
  id: number,
  lang: {
    name: string,
    display_name: string
  }
};

export type LibraryFlagsFiltersType = [
  {
    type: "DOWNLOADED",
    status: "ANY" | "INCLUDE" | "EXCLUDE"
  },
  {
    type: "UNREAD",
    status: "ANY" | "INCLUDE" | "EXCLUDE"
  },
  {
    type: "COMPLETED",
    status: "ANY" | "INCLUDE" | "EXCLUDE"
  }
];

// ALPHA = alphabetically
// TOTAL = total chapters
export type LibraryFlagsSortType = {
  type: "ALPHA" | "LAST_READ" | "LAST_UPDATED" | "UNREAD" | "TOTAL" | "SOURCE",
  direction: "ASCENDING" | "DESCENDING"
};

export type LibraryFlagsDisplayType = "GRID" | "LIST";

export type LibraryFlagsDLBadgesType = boolean;

export type LibraryFlagsType = {
  filters: LibraryFlagsFiltersType,
  sort: LibraryFlagsSortType,
  display: LibraryFlagsDisplayType,
  show_download_badges: LibraryFlagsDLBadgesType
};

// Creating this so that you can type the different possible values in the library flags object
export type LibraryFlagsPossibleValueTypes =
  | LibraryFlagsFiltersType
  | LibraryFlagsSortType
  | LibraryFlagsDisplayType
  | LibraryFlagsDLBadgesType;

export type ExtensionType = {
  pkg_name: string,
  name: string,
  status: "AVAILABLE" | "INSTALLED" | "UNTRUSTED",
  // string of a version number. Eg. "1.2.6"
  version_name: string,
  // Computer-readable version code of extension. Eg. 6
  version_code: number,
  // Only present when extension status is UNTRUSTED. Used to trust the extension.
  signature_hash: ?string,
  // ISO 639-1 format, or "all" if the extension includes multiple languages.
  lang: string,
  // List of all source IDs included in the extension. Only present when the extension is INSTALLED.
  sources: ?Array<string>,
  has_update: ?boolean
};
