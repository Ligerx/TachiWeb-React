// @flow
import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import type { FiltersType } from 'types';
import type {
  FilterAnyType,
  FilterText as FilterTextType,
  FilterSelect as FilterSelectType,
  FilterTristate as FilterTristateType,
  FilterSort as FilterSortType,
} from 'types/filters';
import FilterSelect from './FilterSelect';
import FilterTristate from './FilterTristate';
import FilterGroup from './FilterGroup';
import FilterSort from './FilterSort';

// FIXME: still too laggy. (may partially be caused in dev by React DevTools)
//        Try a production build to see how bad it is.
//        If it's still bad, try using immer - https://github.com/mweststrate/immer
//        Other suggestions here - https://medium.freecodecamp.org/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5
//        last resort, I might have to do a normal object update

/* eslint-disable import/prefer-default-export, no-underscore-dangle */
// NOTE: using filter.name as the key. I doubt it'll be a problem.
export function filterElements(filters: FiltersType, onChange: Function): Array<React.Node> {
  return filters.map((filter: FilterAnyType, index: number) => {
    // TODO: header, separator, checkbox
    //       not doing right now because none of the sources use it
    if (filter._type === 'HEADER') {
      console.error('DynamicSourcesFilters HEADER not implemented');
      return null;
    } else if (filter._type === 'SEPARATOR') {
      console.error('DynamicSourcesFilters SEPARATOR not implemented');
      return null;
    } else if (filter._type === 'CHECKBOX') {
      console.error('DynamicSourcesFilters CHECKBOX not implemented');
      return null;
    } else if (filter._type === 'TEXT') {
      return (
        <TextField
          label={filter.name}
          value={filter.state}
          onChange={handleTextChange(index, filter, filters, onChange)}
          key={filter.name}
        />
      );
    } else if (filter._type === 'SELECT') {
      return (
        <FilterSelect
          index={index}
          values={filter.values}
          name={filter.name}
          state={filter.state}
          onChange={handleSelectChange(index, filter, filters, onChange)}
          key={filter.name}
        />
      );
    } else if (filter._type === 'TRISTATE') {
      return (
        <FilterTristate
          name={filter.name}
          state={filter.state}
          onChange={handleTristateChange(index, filter, filters, onChange)}
          key={filter.name}
        />
      );
    } else if (filter._type === 'GROUP') {
      // NOTE: Assuming that GROUP will only contain TRISTATE children
      return (
        <FilterGroup
          name={filter.name}
          state={filter.state}
          onChange={handleGroupChange(index, filters, onChange)}
          key={filter.name}
        />
      );
    } else if (filter._type === 'SORT') {
      return (
        <FilterSort
          values={filter.values}
          name={filter.name}
          state={filter.state}
          onChange={handleSortChange(index, filter, filters, onChange)}
          key={filter.name}
        />
      );
    }

    return null;
  });
}

// TODO: update so that updating doesn't remake the ENTIRE filters object

function handleTextChange(
  index: number,
  filter: FilterTextType,
  filters: FiltersType,
  onChange: Function,
) {
  return (event: SyntheticEvent<HTMLInputElement>) => {
    const updatedFilter: FilterTextType = { ...filter, state: event.currentTarget.value };
    onChange(updateArray(index, updatedFilter, filters));
  };
}

function handleSelectChange(
  index: number,
  filter: FilterSelectType,
  filters: FiltersType,
  onChange: Function,
) {
  // NOTE: LIElement is actually within a select
  return (event: SyntheticEvent<HTMLLIElement>) => {
    const newSelection = parseInt(event.currentTarget.dataset.value, 10);
    const updatedFilter: FilterSelectType = { ...filter, state: newSelection };
    onChange(updateArray(index, updatedFilter, filters));
  };
}

function handleTristateChange(
  index: number,
  filter: FilterTristateType,
  filters: FiltersType,
  onChange: Function,
) {
  return () => {
    const updatedFilter: FilterTristateType = { ...filter, state: updateTristate(filter.state) };
    onChange(updateArray(index, updatedFilter, filters));
  };
}

function handleGroupChange(index: number, filters: FiltersType, onChange: Function) {
  // NOTE: Assuming that GROUP will only contain TRISTATE children
  return nestedIndex => () => {
    const newFilters: FiltersType = cloneDeep(filters);

    const { state } = filters[index]; // This is an array of objects
    const nestedState = state[nestedIndex].state; // This is the tristate value
    newFilters[index].state[nestedIndex].state = updateTristate(nestedState);
    onChange(newFilters);
  };
}

type SortState = { index: number, ascending: boolean };
function handleSortChange(
  index: number,
  filter: FilterSortType,
  filters: FiltersType,
  onChange: Function,
) {
  return (clickedIndex: number) => () => {
    const isAscending: boolean = filter.state.ascending;
    const currentIndex: number = filter.state.index;

    const newState: SortState = updateSort(currentIndex, clickedIndex, isAscending);
    const updatedFilter: FilterSortType = { ...filter, state: newState };
    onChange(updateArray(index, updatedFilter, filters));
  };
}

// Helper Functions
function updateTristate(oldState: number): number {
  if (oldState < 2) {
    return oldState + 1;
  }
  return 0;
}

function updateSort(index: number, clickedIndex: number, isAscending: boolean): SortState {
  return {
    index: clickedIndex,
    ascending: index === clickedIndex ? !isAscending : false,
  };
}

function cloneDeep<T>(oldObject: T): T {
  // This is supposed to be faster than lodash cloneDeep
  // As long as the object is only text, there shouldn't be any problems
  return JSON.parse(JSON.stringify(oldObject));
}

function updateArray(
  index: number,
  updatedFilter: FilterAnyType,
  filters: FiltersType,
): FiltersType {
  return [...filters.slice(0, index), updatedFilter, ...filters.slice(index + 1)];
}
