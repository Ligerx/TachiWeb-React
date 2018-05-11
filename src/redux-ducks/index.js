import { combineReducers } from 'redux';
import library from './library';
import chapters from './chapters';
import pageCounts from './pageCounts';
import sources from './sources';
import catalogue from './catalogue';

export default combineReducers({
  library,
  chapters,
  pageCounts,
  sources,
  catalogue,
});

// TODO: add meta data to actions that don't have enough context. Makes things easier to read.
