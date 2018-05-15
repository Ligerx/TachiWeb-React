import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import TextField from 'material-ui/TextField';
import { FormGroup } from 'material-ui/Form';
import FilterSelect from './FilterSelect';
import FilterCheckbox from './FilterCheckbox';

// Kinda hacking the UI for this together right now.
const styles = {
  button: {
    marginBottom: 24,
    // right align
    marginLeft: 'auto',
    marginRight: 8,
  },
};

class DynamicSourceFilters extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // 1. Keep a deep copy of the filters for easier updates
    //
    // 2. Mixing sourceId into the state so I can check when it changes
    //    Not having access to prevProps is a limitation of this method =(
    //    https://github.com/facebook/react/issues/12188
    const initialFilters = !prevState.filters && nextProps.filters && nextProps.filters.length > 0;
    const sourceChanged = prevState.sourceId !== nextProps.sourceId;

    if (initialFilters || sourceChanged) {
      return {
        ...prevState,
        filters: sourceChanged ? null : cloneDeep(nextProps.filters),
        sourceId: nextProps.sourceId,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      filters: null, // TODO: safe to keep this as null?
      sourceId: null, // This is only used for reference purposes.
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTristateChange = this.handleTristateChange.bind(this);
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
      const { state } = this.state.filters[index];
      let newState;
      if (state < 2) {
        newState = state + 1;
      } else {
        newState = 0;
      }

      const newFilters = cloneDeep(this.state.filters);
      newFilters[index].state = newState;
      this.setState({ filters: newFilters });
    };
  }

  filterElements() {
    const { filters } = this.state;

    return filters.map((filter, index) => {
      const {
        _type: type, name, state, values,
      } = filter;

      if (type === 'TEXT') {
        return (
          <TextField label={name} value={state} onChange={this.handleChange(index)} key={index} />
        );
      } else if (type === 'SELECT') {
        return (
          <FilterSelect
            name={name}
            values={values}
            index={index}
            state={state}
            onChange={this.handleChange(index)}
            key={index}
          />
        );
      } else if (type === 'TRISTATE') {
        // TODO: I think I need my own special handler
        return (
          <FilterCheckbox
            name={name}
            state={state}
            onChange={this.handleTristateChange(index)}
            key={index}
          />
        );
      }
      return null;
    });
  }

  render() {
    const { drawerOpen, filters } = this.state;

    return (
      <React.Fragment>
        <Button
          variant="raised"
          color="primary"
          onClick={this.toggleDrawer(true)}
          className={this.props.classes.button}
        >
          Filters
        </Button>

        <Drawer anchor="right" open={drawerOpen} onClose={this.toggleDrawer(false)}>
          <div tabIndex={0} role="button">
            {filters && <FormGroup>{this.filterElements()}</FormGroup>}
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

DynamicSourceFilters.propTypes = {
  classes: PropTypes.object.isRequired,
  filters: PropTypes.array,
};

// TODO: not sure if filters should be required or not here...
DynamicSourceFilters.defaultProps = {
  filters: [],
};

export default withStyles(styles)(DynamicSourceFilters);
