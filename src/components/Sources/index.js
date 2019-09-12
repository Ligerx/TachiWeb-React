// @flow
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Client } from "api";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import ResponsiveGrid from "components/ResponsiveGrid";
import BackButton from "components/BackButton";
import { useSelector, useDispatch } from "react-redux";
import { selectSources } from "redux-ducks/sources";
import { fetchSources } from "redux-ducks/sources/actionCreators";

const Sources = () => {
  const sources = useSelector(selectSources);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSources());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet title="Sources - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <BackButton onBackClick={Client.catalogue()} />

          <Typography variant="h6" style={{ flex: 1 }}>
            Sources
          </Typography>
        </Toolbar>
      </AppBar>

      <ResponsiveGrid maxWidth="xs">{JSON.stringify(sources)}</ResponsiveGrid>

      {/* {isExtensionsLoading && <FullScreenLoading />} */}
    </>
  );
};

export default Sources;
