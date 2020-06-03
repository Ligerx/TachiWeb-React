// @flow
import React from "react";
import { useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import EditCategoriesList from "components/Library/EditCategoriesList";
import { reorderCategory } from "redux-ducks/categories/actionCreators";
import { useCategories } from "components/apiHooks";

// Following the functional component example in the react-beautiful-dnd docs
// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/about/examples.md

const EditCategoriesDraggableList = () => {
  const dispatch = useDispatch();

  // also fetching categories here instead of inside EditCategoriesList.
  // I think the memo() wrapping it might be causing it to never run.
  const { data: categories } = useCategories();

  const handleDragEnd = result => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    dispatch(reorderCategory(result.source.index, result.destination.index));
  };

  if (categories == null) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="edit-categories-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <EditCategoriesList categories={categories} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default EditCategoriesDraggableList;
