// @flow
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuDrawer from 'components/MenuDrawer';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import type { SourceType } from 'types';

type Props = {
  sourceId: ?number,
  sources: Array<SourceType>,
  searchQuery: string,
  onSourceChange: Function,
  onSearchChange: Function,
};

const CatalogueHeader = ({
  sourceId,
  sources,
  searchQuery,
  onSourceChange,
  onSearchChange,
}: Props) => {
  const sourcesExist: boolean = sources && sources.length > 0;

  return (
    <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
      <Toolbar>
        <MenuDrawer />

        {sourcesExist &&
          sourceId != null && (
            <form onSubmit={e => e.preventDefault()}>
              <FormControl>
                <Select value={findSourceIndex(sources, sourceId)} onChange={onSourceChange}>
                  {sources.map((source, index) => (
                    <MenuItem value={index} key={source.id}>
                      {source.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField label="Search" value={searchQuery} onChange={onSearchChange} />
            </form>
          )}
      </Toolbar>
    </AppBar>
  );
};

function findSourceIndex(sources, sourceId) {
  return sources.findIndex(source => source.id === sourceId);
}

export default CatalogueHeader;
