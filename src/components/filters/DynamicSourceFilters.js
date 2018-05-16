import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { FormGroup } from 'material-ui/Form';
import FilterActions from './FilterActions';
import { filterElements } from './filterUtils';

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
    if (!prevState.filters && nextProps.filters && nextProps.filters.length > 0) {
      // On instantiation, filters and sourceId are null
      return {
        ...prevState,
        filters: nextProps.filters,
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
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }

  toggleDrawer = isOpen => () => {
    this.setState({ drawerOpen: isOpen });
  };

  handleFilterChange(newFilters) {
    this.setState({ filters: newFilters });
  }

  handleResetClick() {
    this.setState({ filters: this.props.filters });
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
            {filters && (
              <FormGroup className={classes.filters}>
                {filterElements(filters, this.handleFilterChange)}
              </FormGroup>
            )}
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
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
