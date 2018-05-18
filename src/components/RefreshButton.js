import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

const RefreshButton = ({ onClick }) => (
  <Tooltip title="Refresh">
    <IconButton onClick={onClick}>
      <Icon>refresh</Icon>
    </IconButton>
  </Tooltip>
);

RefreshButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RefreshButton;
