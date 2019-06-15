// @flow
import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Drawer from '@material-ui/core/Drawer';
import MenuList from 'components/MenuList';

const MenuDrawer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (newOpenState: boolean) => () => {
    setDrawerOpen(newOpenState);
  };

  return (
    <>
      <IconButton onClick={toggleDrawer(true)}>
        <Icon>menu</Icon>
      </IconButton>

      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <MenuList />
        </div>
      </Drawer>
    </>
  );
};

export default MenuDrawer;
