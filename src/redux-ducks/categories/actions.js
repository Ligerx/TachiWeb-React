// @flow

// ================================================================================
// etc
// ================================================================================
export const CHANGE_CURRENT_CATEGORY_ID =
  "categories/CHANGE_CURRENT_CATEGORY_ID";
type CHANGE_CURRENT_CATEGORY_ID_TYPE = "categories/CHANGE_CURRENT_CATEGORY_ID";

export type ChangeCurrentCategoryIdAction = {
  type: CHANGE_CURRENT_CATEGORY_ID_TYPE,
  categoryId: ?number
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type CategoriesAction = ChangeCurrentCategoryIdAction;
