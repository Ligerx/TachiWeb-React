import { combineReducers } from 'redux';
import loading from './loading';
import error from './error';
import library from './library';
import chapters from './chapters';
import pageCounts from './pageCounts';
import sources from './sources';
import catalogue from './catalogue';
import filters from './filters';
import mangaInfos from './mangaInfos';

export default combineReducers({
  loading,
  error,
  library,
  chapters,
  pageCounts,
  sources,
  catalogue,
  filters,
  mangaInfos,
});
