// CREATING MY OWN NEW API
const Server = {
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
    return `api/update/${mangaId}/info`;
  },

  updateMangaChapters(mangaId) {
    return `api/update/${mangaId}/chapters`;
  },

  cover(mangaId) {
    return `/api/cover/${mangaId}`;
  },

  pageCount(mangaId, chapterId) {
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
};
export { Server };

const Client = {
  library() {
    return '/library';
  },

  catalogue() {
    return '/catalogue';
  },

  manga(mangaId) {
    return `/${mangaId}`;
  },

  page(mangaId, chapterId, page) {
    // URL of the manga page on the client
    return `/${mangaId}/${chapterId}/${page}`;
  },
};
export { Client };
