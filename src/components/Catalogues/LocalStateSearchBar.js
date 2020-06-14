// @flow
import React, { useState, useEffect } from "react";
import SearchBar from "components/Catalogues/SearchBar";

type Props = {
  value?: string,
  onSubmit: string => any
}; // all other props will be passed down to <SearchBar />

const LocalStateSearchBar = ({
  value = "",
  onSubmit,
  ...otherProps
}: Props) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChangeSearchQuery = event => {
    setLocalValue(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(localValue);
  };

  return (
    <SearchBar
      {...otherProps}
      value={localValue}
      onChange={handleChangeSearchQuery}
      onSubmit={handleSubmit}
    />
  );
};

export default LocalStateSearchBar;
