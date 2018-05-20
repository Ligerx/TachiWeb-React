import { combineReducers } from 'redux';
import loading from './loading';
import error from './error';
import library from './library';
import chapters from './chapters';
import pageCounts from './pageCounts';
import sources from './sources';
import catalogue from './catalogue';

export default combineReducers({
  loading,
  error,
  library,
  chapters,
  pageCounts,
  sources,
  catalogue,
});
