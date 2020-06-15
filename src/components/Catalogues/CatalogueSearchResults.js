// @flow
import React from "react";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Client } from "api";
import CatalogueMangaCard from "components/Catalogues/CatalogueMangaCard";
import CenteredLoading from "components/Loading/CenteredLoading";
import { useCatalogueInfinite } from "apiHooks";
import CenterHorizontally from "components/CenterHorizontally";
import type { Manga, Source } from "@tachiweb/api-client";

type Props = { source: Source, searchQuery: string, urlPrefix: string };

const useStyles = makeStyles({
  root: {
    minHeight: 80,
    padding: "8px 16px"
  },
  noResults: { marginTop: 32, marginBottom: 16 },
  loading: { marginTop: 32, marginBottom: 16 },
  loadMore: { marginTop: 24, marginBottom: 8 }
});

const CatalogueSearchResults = ({
  source,
  searchQuery,
  urlPrefix,
  ...otherProps
}: Props) => {
  const classes = useStyles();

  const { data, error, page, setPage } = useCatalogueInfinite(
    source.id,
    searchQuery
  );

  const mangaInfos: ?(Manga[]) = data?.flatMap(
    cataloguePage => cataloguePage.mangas
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (data && typeof data[page - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1].hasNextPage === false;
  const isEmpty = data?.[0]?.mangas.length === 0;

  const handleLoadMoreClick = () => {
    setPage(page + 1);
  };

  if (isEmpty || error) {
    return null;
  }

  return (
    <div {...otherProps}>
      <Typography variant="h5" gutterBottom>
        {`${source.name} (${source.lang ?? ""})`}
      </Typography>

      <Paper className={classes.root}>
        <Grid container spacing={2}>
          {mangaInfos &&
            mangaInfos.map(manga => (
              <CatalogueMangaCard
                key={manga.id}
                to={Client.manga(urlPrefix, manga.id)}
                manga={manga}
              />
            ))}
        </Grid>

        {isLoadingMore && <CenteredLoading className={classes.loading} />}
        {isReachingEnd && (
          <Typography
            variant="caption"
            display="block"
            align="center"
            className={classes.noResults}
          >
            No more results
          </Typography>
        )}
        {!isLoadingMore && !isReachingEnd && (
          <CenterHorizontally>
            <Button
              color="primary"
              onClick={handleLoadMoreClick}
              className={classes.loadMore}
            >
              Load More
            </Button>
          </CenterHorizontally>
        )}
      </Paper>
    </div>
  );
};

export default CatalogueSearchResults;
