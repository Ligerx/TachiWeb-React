// @flow
import React from "react";
import { useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import EditCategoriesList from "components/Library/EditCategoriesList";

// Following the functional component example in the react-beautiful-dnd docs
// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/about/examples.md

const EditCategoriesDraggableList = () => {
  const dispatch = useDispatch();

  const handleDragEnd = () => {};

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="edit-categories-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <EditCategoriesList />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default EditCategoriesDraggableList;
