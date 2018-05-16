import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import TextField from 'material-ui/TextField';
import { FormGroup } from 'material-ui/Form';
import FilterSelect from './FilterSelect';
import FilterTristate from './FilterTristate';
import FilterGroup from './FilterGroup';
import FilterSort from './FilterSort';
import FilterActions from './FilterActions';

// FIXME: TODO: clicking on a manga and going back to catalogue resets any unsaved filter changes
//        This is because this component is removed when viewing a manga
//        Will need to lift state.filters up to parent container.

// FIXME: Reset puts you back at your last search's filters.
//        It should instead totally reset to the initial filters sent by the server.
//        Refer to catalogue duck initialState to see multiple changes I want to make.

// FIXME: Weird blue line when clicking the <FormGroup>

// Choosing to use lodash cloneDeep instead of the standard setState method
// It would be a huge pain to try updating an array of objects (and be less readable)
// https://stackoverflow.com/questions/29537299/react-how-do-i-update-state-item1-on-setstate-with-jsfiddle

const styles = {
  openButton: {
    marginBottom: 24,
    // Kinda hacking the UI for this together right now (right align)
    // https://stackoverflow.com/questions/6507014/how-to-space-the-children-of-a-div-with-css
    marginLeft: 'auto',
    marginRight: 8,
  },
  filters: {
    width: 250,
    marginLeft: 16,
    marginRight: 16,
    paddingBottom: 16,
    // Add margin to all children
    '& > *': { marginBottom: 16 },
  },
};

class DynamicSourceFilters extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // 1. Keep a deep copy of the filters for easier updates
    //
    // 2. Mixing sourceId into the state so I can check when it changes
    //    Not having access to prevProps is a limitation of this method =(
    //    https://github.com/facebook/react/issues/12188
    if (!prevState.filters || !prevState.sourceId) {
      // On instantiation, filters and sourceId are null
      return {
        ...prevState,
        filters: nextProps.filters,
        sourceId: nextProps.sourceId,
      };
    } else if (prevState.sourceId !== nextProps.sourceId) {
      return {
        ...prevState,
        filters: null,
        sourceId: nextProps.sourceId,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      filters: null,
      // sourceId is only used for reference purposes in getDerivedStateFromProps
      sourceId: null,
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTristateChange = this.handleTristateChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.filterElements = this.filterElements.bind(this);
  }

  toggleDrawer = isOpen => () => {
    this.setState({ drawerOpen: isOpen });
  };

  handleChange(index) {
    // Generic handler, should handle input, select
    return (event) => {
      const newFilters = cloneDeep(this.state.filters);
      newFilters[index].state = event.target.value;
      this.setState({ filters: newFilters });
    };
  }

  handleTristateChange(index) {
    return () => {
      const newFilters = cloneDeep(this.state.filters);
      const { state } = this.state.filters[index];
      newFilters[index].state = updateTristate(state);
      this.setState({ filters: newFilters });
    };
  }

  handleGroupChange(index) {
    // NOTE: Assuming that GROUP will only contain TRISTATE children
    return nestedIndex => () => {
      const newFilters = cloneDeep(this.state.filters);

      const { state } = this.state.filters[index]; // This is an array of objects
      const nestedState = state[nestedIndex].state; // This is the tristate value
      newFilters[index].state[nestedIndex].state = updateTristate(nestedState);
      this.setState({ filters: newFilters });
    };
  }

  handleSortChange(index) {
    return nestedIndex => () => {
      const newFilters = cloneDeep(this.state.filters);
      const currentlyAscending = newFilters[index].state.ascending;
      const currentIndex = newFilters[index].state.index;

      if (currentIndex === nestedIndex) {
        newFilters[index].state.ascending = !currentlyAscending;
      } else {
        newFilters[index].state.index = nestedIndex;
        newFilters[index].state.ascending = false;
      }

      this.setState({ filters: newFilters });
    };
  }

  handleResetClick() {
    this.setState({ filters: this.props.filters });
  }

  filterElements() {
    const { filters } = this.state;

    return filters.map((filter, index) => {
      const {
        _type: type, name, state, values,
      } = filter;

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
        return (
          <TextField label={name} value={state} onChange={this.handleChange(index)} key={index} />
        );
      } else if (type === 'SELECT') {
        return (
          <FilterSelect
            index={index}
            values={values}
            name={name}
            state={state}
            onChange={this.handleChange(index)}
            key={index}
          />
        );
      } else if (type === 'TRISTATE') {
        return (
          <FilterTristate
            name={name}
            state={state}
            onChange={this.handleTristateChange(index)}
            key={index}
          />
        );
      } else if (type === 'GROUP') {
        // NOTE: Assuming that GROUP will only contain TRISTATE children
        return (
          <FilterGroup
            name={name}
            state={state}
            onChange={this.handleGroupChange(index)}
            key={index}
          />
        );
      } else if (type === 'SORT') {
        return (
          <FilterSort
            values={values}
            name={name}
            state={state}
            onChange={this.handleSortChange(index)}
            key={index}
          />
        );
      }

      return null;
    });
  }

  render() {
    const { drawerOpen, filters } = this.state;
    const { classes, onSearchClick } = this.props;

    return (
      <React.Fragment>
        <Button
          variant="raised"
          color="primary"
          onClick={this.toggleDrawer(true)}
          className={classes.openButton}
        >
          Filters
        </Button>

        <Drawer anchor="right" open={drawerOpen} onClose={this.toggleDrawer(false)}>
          <div tabIndex={0} role="button">
            <FilterActions
              onResetClick={this.handleResetClick}
              onSearchClick={onSearchClick(filters)}
            />
            {filters && <FormGroup className={classes.filters}>{this.filterElements()}</FormGroup>}
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

// Helper Functions
function updateTristate(oldState) {
  if (oldState < 2) {
    return oldState + 1;
  }
  return 0;
}

DynamicSourceFilters.propTypes = {
  classes: PropTypes.object.isRequired,
  filters: PropTypes.array,
  onSearchClick: PropTypes.func.isRequired,
};

DynamicSourceFilters.defaultProps = {
  filters: null,
};

export default withStyles(styles)(DynamicSourceFilters);
