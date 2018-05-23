// @flow
import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import type { FiltersType } from 'types';
import type { FilterAnyType } from 'types/filters';
import FilterSelect from './FilterSelect';
import FilterTristate from './FilterTristate';
import FilterGroup from './FilterGroup';
import FilterSort from './FilterSort';

// FIXME: still too laggy. (may partially be caused in dev by React DevTools)
//        Try a production build to see how bad it is.
//        If it's still bad, try using immer - https://github.com/mweststrate/immer
//        Other suggestions here - https://medium.freecodecamp.org/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5
//        last resort, I might have to do a normal object update

/* eslint-disable import/prefer-default-export */

export function filterElements(filters: FiltersType, onChange: Function): Array<React.Node> {
  return filters.map((filter: FilterAnyType, index: number) => {
    // FIXME: typing is wonky cause I'm combining multiple types together.
    type Props = {
      _type: string,
      name: string,
      state: string | number | boolean,
      values?: Array<string>,
    };
    const {
      _type: type, name, state, values,
    }: Props = filter;

    const updateFunc: Function = updateFiltersObject(index, type, filters, onChange);

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

// TODO: update so that updating doesn't remake the ENTIRE filters object
function updateFiltersObject(
  index: number,
  type: string,
  filters: FiltersType,
  onChange: Function,
): Function {
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
  return () => null;
}

function handleChange(index: number, filters: FiltersType, onChange: Function) {
  // Generic handler, should handle input, select
  return (event: SyntheticInputEvent<HTMLInputElement> | SyntheticInputEvent<HTMLSelectElement>) => {
    const newFilters: FiltersType = cloneDeep(filters);
    newFilters[index].state = event.currentTarget.value;
    onChange(newFilters);
  };
}

function handleTristateChange(index: number, filters: FiltersType, onChange: Function) {
  return () => {
    const newFilters: FiltersType = cloneDeep(filters);
    const { state } = filters[index];
    newFilters[index].state = updateTristate(state);
    onChange(newFilters);
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

function handleSortChange(index: number, filters: FiltersType, onChange: Function) {
  return (nestedIndex: number) => () => {
    const newFilters: FiltersType = cloneDeep(filters);
    const currentlyAscending: boolean = newFilters[index].state.ascending;
    const currentIndex: number = newFilters[index].state.index;

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
function updateTristate(oldState: number): number {
  if (oldState < 2) {
    return oldState + 1;
  }
  return 0;
}

function cloneDeep(oldObject: Object): Object {
  // This is supposed to be faster than lodash cloneDeep
  // As long as the object is only text, there shouldn't be any problems
  return JSON.parse(JSON.stringify(oldObject));
}
