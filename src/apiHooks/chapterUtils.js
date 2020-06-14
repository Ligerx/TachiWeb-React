// @flow
import type { ChapterType } from "types";

/**
 * You may want to memoize this result if it's causing performance issues.
 *
 * @param {*} chapters Expecting that this array of chapters is already sorted
 * in ascending order of what every your preferred ordering is.
 */
// eslint-disable-next-line import/prefer-default-export
export function findFirstUnreadChapter(
  chapters: ?(ChapterType[])
): ?ChapterType {
  if (chapters == null) return null;

  // Currently just relying on the default sort order
  let firstUnreadChapter = null;

  // using Array.some() for a short-circuit-able iterator
  chapters.some(chapter => {
    if (!chapter.read) {
      firstUnreadChapter = chapter;
      return true; // escape
    }
    return false; // continue
  });

  return firstUnreadChapter;
}
