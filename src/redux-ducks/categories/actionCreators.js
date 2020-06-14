// @flow
import {
  CHANGE_CURRENT_CATEGORY_ID,
  type ChangeCurrentCategoryIdAction
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================

export function changeCurrentCategoryId(
  categoryId: ?number
): ChangeCurrentCategoryIdAction {
  return { type: CHANGE_CURRENT_CATEGORY_ID, categoryId };
}
