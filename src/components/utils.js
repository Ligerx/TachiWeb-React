// @flow
import ISO6391 from "iso-639-1";
import type { CategoryType } from "types";

// Sometimes chapter.chapter_number is a float.
// This function dynamically rounds those floats for easier display.
export function chapterNumPrettyPrint(chapterNum: number): number {
  return roundFloat(chapterNum);
}

// Rounding based on if rounding the digit after decimalPlace is 0
// e.g. num = 10.699
// [decimalPlace = 0, multiplier = 10]   -> 107,   not yet
// [decimalPlace = 1, multiplier = 100]  -> 1070,  last digit is 0, answer found
//                                                 decimalPlace is 1, so the result is 10.7
function roundFloat(num, decimalPlace = 0) {
  const multiplier = 10 ** (decimalPlace + 1);
  const roundUp = Math.round(num * multiplier);

  // If the number in the tens place is 0,
  const hasNoRemainder = roundUp % 10 === 0;
  if (hasNoRemainder) {
    return Number(num.toFixed(decimalPlace));
  }

  return roundFloat(num, decimalPlace + 1);
}

export function langPrettyPrint(lang: string) {
  // [Comment written on Sept 12, 2019]
  // Extensions include an ISO6391 coded lang property. This function is needed to
  // pretty print extension.lang
  //
  // Sources include a lang (ISO6391 coded), langDisplayName (native), and langName (english)
  // so it's not strictly necessary. However, I'm still using this function since it simplifies
  // the code a lot.

  if (lang === "all") return "All";

  const prettyPrint = ISO6391.getNativeName(lang);

  // ISO6391.getNativeName() returns "" if it can't find the native name.
  // Returning the original lang string seems like a more predictable outcome instead.
  return prettyPrint || lang;
}

export function defaultCategoryMangaIds(
  categories: CategoryType[] | null,
  libraryMangaIds: number[]
): number[] {
  if (categories == null) return [];

  let mangaNotInACategory = [...libraryMangaIds];

  categories.forEach(category => {
    mangaNotInACategory = mangaNotInACategory.filter(
      mangaId => !category.manga.includes(mangaId)
    );
  });

  return mangaNotInACategory;
}
