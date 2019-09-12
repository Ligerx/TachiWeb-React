// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import { Client } from "api";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import BackButton from "components/BackButton";
import { langPrettyPrint } from "components/utils";
import {
  selectSourcesByLanguage,
  selectSourceLanguages
} from "redux-ducks/sources";
import { fetchSources } from "redux-ducks/sources/actionCreators";

const Sources = () => {
  const sourceLanguages = useSelector(selectSourceLanguages);
  const sourcesByLanguage = useSelector(selectSourcesByLanguage);

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

      <Container>
        {sourceLanguages.map(lang => (
          <>
            <Typography variant="h5">{langPrettyPrint(lang)}</Typography>
            {sourcesByLanguage[lang].map(source => (
              <div>{source.name}</div>
            ))}
          </>
        ))}
      </Container>

      {/* {isExtensionsLoading && <FullScreenLoading />} */}
    </>
  );
};

export default Sources;
