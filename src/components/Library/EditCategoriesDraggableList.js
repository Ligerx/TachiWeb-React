// @flow
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import EditCategoriesList from "components/Library/EditCategoriesList";
import { useReorderCategory } from "components/apiHooks";

// Following the functional component example in the react-beautiful-dnd docs
// https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/about/examples.md

const EditCategoriesDraggableList = () => {
  const reorderCategory = useReorderCategory();

  const handleDragEnd = result => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    reorderCategory(result.source.index, result.destination.index);
  };

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
