// @flow
import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Client } from "api";
import CatalogueMangaCard from "components/Catalogues/CatalogueMangaCard";
import CenteredLoading from "components/Loading/CenteredLoading";
import {
  selectCatalogueManga,
  selectIsCatalogueLoading
} from "redux-ducks/catalogues";

type Props = { sourceId: string, urlPrefix: string };

const useStyles = makeStyles({
  root: {
    minHeight: 80,
    padding: "8px 16px"
  },
  noResults: { marginTop: 32 },
  loading: { marginTop: 32 }
});

const CatalogueSearchResultsPaper = ({ sourceId, urlPrefix }: Props) => {
  const classes = useStyles();

  const mangaLibrary = useSelector(state =>
    selectCatalogueManga(state, sourceId)
  );
  const catalogueIsLoading = useSelector(state =>
    selectIsCatalogueLoading(state, sourceId)
  );

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2}>
        {mangaLibrary.map(manga => (
          <CatalogueMangaCard
            key={manga.id}
            to={Client.manga(urlPrefix, manga.id)}
            manga={manga}
          />
        ))}
      </Grid>

      {catalogueIsLoading && <CenteredLoading className={classes.loading} />}
      {!catalogueIsLoading && mangaLibrary.length === 0 && (
        <Typography
          variant="caption"
          display="block"
          align="center"
          className={classes.noResults}
        >
          No results
        </Typography>
      )}
    </Paper>
  );
};

export default CatalogueSearchResultsPaper;
