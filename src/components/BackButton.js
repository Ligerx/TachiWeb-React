import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';

const BackButton = ({ onBackClick }) => {
  if (typeof onBackClick === 'function') {
    return (
      <IconButton onClick={onBackClick}>
        <Icon>arrow_back</Icon>
      </IconButton>
    );
  } else if (typeof onBackClick === 'string') {
    return (
      <IconButton component={Link} to={onBackClick}>
        <Icon>arrow_back</Icon>
      </IconButton>
    );
  }

  console.error('No valid back button action passed to BackButton');
  return (
    <IconButton disabled>
      <Icon>arrow_back</Icon>
    </IconButton>
  );
};

BackButton.propTypes = {
  onBackClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
};

export default BackButton;
