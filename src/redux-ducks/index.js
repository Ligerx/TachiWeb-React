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

// TODO: better isFetching handling
// TODO: actually implement error handling
