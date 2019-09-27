// @flow
import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";

// TODO: Animate search bar in and out
// TODO: pressing ESC to clear and close the search?

type Props = { searchQuery: string, onSearchChange: Function };

const LibrarySearch = ({ searchQuery, onSearchChange }: Props) => {
  const [searchVisible, setSearchVisible] = useState(false);

  const handleClick = () => {
    setSearchVisible(true);
  };

  const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    onSearchChange(event.currentTarget.value);
  };

  const handleClearSearch = () => {
    setSearchVisible(false);
    onSearchChange("");
  };

  const handleBlur = () => {
    if (!searchQuery) {
      setSearchVisible(false);
      onSearchChange("");
    }
  };

  return (
    <>
      <Tooltip title="Search">
        <IconButton onClick={handleClick}>
          <Icon>search</Icon>
        </IconButton>
      </Tooltip>

      {searchVisible ? (
        <FormControl>
          <InputLabel htmlFor="library-search-text">Search Library</InputLabel>
          <Input
            id="library-search-text"
            value={searchQuery}
            autoFocus
            onChange={handleChange}
            onBlur={handleBlur}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch}>
                  <Icon>close</Icon>
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      ) : null}
    </>
  );
};

export default LibrarySearch;
