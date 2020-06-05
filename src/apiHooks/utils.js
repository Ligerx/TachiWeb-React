// @flow
export function fetcher(url: string) {
  return fetch(url).then(res => res.json());
}

export function fetcherUnpackContent(url: string) {
  return fetcher(url).then(json => json.content);
}

export function fetcherUnpackData(url: string) {
  return fetcher(url).then(json => json.data);
}
