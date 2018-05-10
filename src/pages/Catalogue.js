import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mangaType } from 'types';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

// TODO: sources type
// TODO: filter type?

class Catalogue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Select based on index of the array instead of id
      // this makes it less reliant on having to sync state with the data
      value: 0,
    };
  }

  componentDidMount() {
    const { fetchSources, fetchCatalogue } = this.props;
    // I think there's a bug in babel. I should be able to reference 'this' (in the outer scope)
    // when using an arrow function, but it's undefined. So I'm manually binding 'this'.
    const that = this;
    fetchSources().then(() => {
      fetchCatalogue(that.props.sources[0].id, 1);
    });
  }

  render() {
    const { sources } = this.props;

    return (
      <React.Fragment>
        TESTING CATALOGUE
        <form autoComplete="off">
          <FormControl>
            <InputLabel htmlFor="age-simple">Age</InputLabel>
            <Select value={this.state.value} onChange={this.handleChange}>
              {sources.map((source, index) => (
                <MenuItem value={index} key={source.id}>
                  {source.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </React.Fragment>
    );
  }
}

Catalogue.propTypes = {
  mangaLibrary: PropTypes.arrayOf(mangaType),
  sources: PropTypes.array,
  mangaIds: PropTypes.arrayOf(PropTypes.number.isRequired),
  page: PropTypes.number.isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  filters: PropTypes.array,
  fetchSources: PropTypes.func.isRequired,
  fetchCatalogue: PropTypes.func.isRequired,
};

Catalogue.defaultProps = {
  mangaLibrary: [],
  sources: [],
  mangaIds: [],
  filters: null,
};

export default Catalogue;
