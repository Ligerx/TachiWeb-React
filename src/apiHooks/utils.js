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

// https://decembersoft.com/posts/promises-in-serial-with-array-reduce/
export function serialPromiseChain(
  promiseArray: (() => Promise<any>)[]
): Promise<any> {
  return promiseArray.reduce(
    (promiseChain, currentPromise) => promiseChain.then(() => currentPromise()),
    Promise.resolve([])
  );
}
