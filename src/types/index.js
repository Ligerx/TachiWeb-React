// @flow
import type { Source } from "@tachiweb/api-client";

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

export type PrefValue = string | Array<string> | number | boolean | null | void;
export type PrefsType = $ReadOnly<{ [key: string]: PrefValue }>;

export type SourceMap = $ReadOnly<{ [id: string]: Source }>;

export type CategoryType = {
  id: number,
  manga: $ReadOnlyArray<number>,
  name: string,
  order: number
};

export type ChapterPageLinkState = { chapterId: number, jumpToPage: number };
