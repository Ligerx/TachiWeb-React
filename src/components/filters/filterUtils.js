import React from 'react';
import TextField from 'material-ui/TextField';
import FilterSelect from './FilterSelect';
import FilterTristate from './FilterTristate';
import FilterGroup from './FilterGroup';
import FilterSort from './FilterSort';

/* eslint-disable import/prefer-default-export */

export function filterElements(filters, onChange) {
  return filters.map((filter, index) => {
    const {
      _type: type, name, state, values,
    } = filter;
    const updateFunc = updateFiltersObject(index, type, filters, onChange);

    // TODO: header, separator, checkbox
    //       not doing right now because none of the sources use it
    if (type === 'HEADER') {
      console.error('DynamicSourcesFilters HEADER not implemented');
      return null;
    } else if (type === 'SEPARATOR') {
      console.error('DynamicSourcesFilters SEPARATOR not implemented');
      return null;
    } else if (type === 'CHECKBOX') {
      console.error('DynamicSourcesFilters CHECKBOX not implemented');
      return null;
    } else if (type === 'TEXT') {
      return <TextField label={name} value={state} onChange={updateFunc} key={index} />;
    } else if (type === 'SELECT') {
      return (
        <FilterSelect
          index={index}
          values={values}
          name={name}
          state={state}
          onChange={updateFunc}
          key={index}
        />
      );
    } else if (type === 'TRISTATE') {
      return <FilterTristate name={name} state={state} onChange={updateFunc} key={index} />;
    } else if (type === 'GROUP') {
      // NOTE: Assuming that GROUP will only contain TRISTATE children
      return <FilterGroup name={name} state={state} onChange={updateFunc} key={index} />;
    } else if (type === 'SORT') {
      return (
        <FilterSort values={values} name={name} state={state} onChange={updateFunc} key={index} />
      );
    }

    return null;
  });
}

function updateFiltersObject(index, type, filters, onChange) {
  if (type === 'TEXT' || type === 'SELECT') {
    return handleChange(index, filters, onChange);
  } else if (type === 'TRISTATE') {
    return handleTristateChange(index, filters, onChange);
  } else if (type === 'GROUP') {
    return handleGroupChange(index, filters, onChange);
  } else if (type === 'SORT') {
    return handleSortChange(index, filters, onChange);
  }

  console.error('filterUtils updateFiltersObject no match found');
  return null;
}

function handleChange(index, filters, onChange) {
  // Generic handler, should handle input, select
  return (event) => {
    const newFilters = cloneDeep(filters);
    newFilters[index].state = event.target.value;
    onChange(newFilters);
  };
}

function handleTristateChange(index, filters, onChange) {
  return () => {
    const newFilters = cloneDeep(filters);
    const { state } = filters[index];
    newFilters[index].state = updateTristate(state);
    onChange(newFilters);
  };
}

function handleGroupChange(index, filters, onChange) {
  // NOTE: Assuming that GROUP will only contain TRISTATE children
  return nestedIndex => () => {
    const newFilters = cloneDeep(filters);

    const { state } = filters[index]; // This is an array of objects
    const nestedState = state[nestedIndex].state; // This is the tristate value
    newFilters[index].state[nestedIndex].state = updateTristate(nestedState);
    onChange(newFilters);
  };
}

function handleSortChange(index, filters, onChange) {
  return nestedIndex => () => {
    const newFilters = cloneDeep(filters);
    const currentlyAscending = newFilters[index].state.ascending;
    const currentIndex = newFilters[index].state.index;

    if (currentIndex === nestedIndex) {
      newFilters[index].state.ascending = !currentlyAscending;
    } else {
      newFilters[index].state.index = nestedIndex;
      newFilters[index].state.ascending = false;
    }

    onChange(newFilters);
  };
}

// Helper Functions
function updateTristate(oldState) {
  if (oldState < 2) {
    return oldState + 1;
  }
  return 0;
}

function cloneDeep(oldObject) {
  // Turns out this is much faster
  // As long as the object is only text, there shouldn't be any problems

  // FIXME: still too laggy. Might have to do a normal object update
  return JSON.parse(JSON.stringify(oldObject));
}
