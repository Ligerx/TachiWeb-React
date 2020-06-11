// @flow

// NOTE: For any calls using the Server.api().{call}, I'm sort of hacking around SWR's intended usage pattern.
// I'm manually adding a unique key, then using the api call as the fetcher.
// This is because the api() calls fetch() directly and I don't have access to the url as the key.

export * from "./mangaInfo";
export * from "./chapters";
export * from "./sources";
export * from "./library";
export * from "./categories";
export * from "./extensions";
export * from "./catalogue";
