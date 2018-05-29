export const Server = {
  library() {
    return '/api/library';
  },

  libraryUnread() {
    return '/api/library?jw=$.success&jw=$.content.*.unread&jw=$.content.*.id';
  },

  mangaInfo(mangaId) {
    return `/api/manga_info/${mangaId}`;
  },

  chapters(mangaId) {
    return `/api/chapters/${mangaId}`;
  },

  updateMangaInfo(mangaId) {
    return `/api/update/${mangaId}/info`;
  },

  updateMangaChapters(mangaId) {
    return `/api/update/${mangaId}/chapters`;
  },

  cover(mangaId) {
    return `/api/cover/${mangaId}`;
  },

  pageCount(mangaId, chapterId) {
    // FIXME: server side inefficient design
    //        chapters are unique, so there's no need to require mangaId
    return `/api/page_count/${mangaId}/${chapterId}`;
  },

  image(mangaId, chapterId, page) {
    // URL to the manga chapter page's image on the server
    return `/api/img/${mangaId}/${chapterId}/${page}`;
  },

  toggleFavorite(mangaId, isFavorite) {
    return `/api/fave/${mangaId}?fave=${!isFavorite}`;
  },

  catalogue() {
    // NOTE: This should be a POST request with the following body params
    // {
    //   "sourceId": number,
    //   "page": number,
    //   "query": string, empty string, or null,
    //   "filters": big-complicated-array or null
    // }
    return '/api/catalogue';
  },

  sources(enabled = true) {
    let url = '/api/sources';
    if (enabled) {
      url += '?enabled=true';
    }
    return url;
  },

  filters(sourceId) {
    return `/api/get_filters/${sourceId}`;
  },

  updateReadingStatus(mangaId, chapterId, readPage, readLastPage) {
    // No edge case checking here. Handle that in the caller.
    // e.g. not updating because you're reading a previously read page
    let url = `/api/reading_status/${mangaId}/${chapterId}?lp=${readPage}`;

    if (readLastPage) {
      url += '&read=true';
    }
    return url;
  },

  backupDownload() {
    // FIXME: Because dev backend server is on a different port than this project,
    // I couldn't get this file to download via a relative path
    //
    // Using an absolute path will work in dev, but I need to fix this for the production version
    //
    // Don't use react router Link component, just use a normal <a href="..." download>
    return 'http://localhost:4567/api/backup?force-download=true';
  },

  restoreUpload() {
    return '/api/restore_file';
  },

  setFlag(mangaId: number, flag: string, state: string) {
    return `/api/set_flag/${mangaId}/${flag}/${state}`;
  },
};

export const Client = {
  library() {
    return '/library';
  },

  catalogue() {
    return '/catalogue';
  },

  manga(mangaId) {
    return `/${mangaId}`;
  },

  catalogueManga(mangaId) {
    return `/catalogue/${mangaId}`;
  },

  page(mangaId, chapterId, page) {
    // URL of the manga page on the client
    return `/${mangaId}/${chapterId}/${page}`;
  },

  backupRestore() {
    return '/backup_restore';
  },
};
