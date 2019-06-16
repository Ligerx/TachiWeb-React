// @flow
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import ResponsiveGrid from "components/ResponsiveGrid";
import MangaCard from "components/MangaCard";
import Grid from "@material-ui/core/Grid";
import BackgroundImage from "components/MangaInfo/BackgroundImage";
import { withStyles } from "@material-ui/core/styles";
import type { Manga, Source } from "@tachiweb/api-client";
import classNames from "classnames";
import { Server } from "api";
import upperFirst from "lodash/upperFirst";
import capitalize from "lodash/capitalize";
import FavoriteFab from "components/FavoriteFab";

// TODO: increase top/bottom padding for description so it doesn't touch the FAB

// TODO: I'm applying padding to the ResponsiveGrid. This doesn't feel very elegant.
//       Is there any simple way to keep all the styling in THIS component?

const styles = () => ({
  gridPadding: {
    padding: "32px 24px"
  },
  fabParent: {
    position: "relative"
  }
});

type Props = {
  classes: Object,
  mangaInfo: Manga,
  numChapters: number,
  source: ?Source
};

const MangaInfoDetails = ({
  classes,
  source,
  mangaInfo,
  numChapters
}: Props) => {
  const coverUrl: string = Server.cover(mangaInfo.id);

  return (
    <>
      <BackgroundImage coverUrl={coverUrl}>
        <ResponsiveGrid
          className={classNames(classes.gridPadding, classes.fabParent)}
        >
          <Grid item xs={4} sm={3}>
            <MangaCard coverUrl={coverUrl} />
          </Grid>
          <Grid item xs={8} sm={9}>
            <Typography variant="h6" gutterBottom>
              {mangaInfo.title}
            </Typography>
            <DetailComponent fieldName="Chapters" value={numChapters} />
            {detailsElements(mangaInfo)}
            <DetailComponent
              fieldName="Status"
              value={capitalize(mangaInfo.status)}
            />
            {source != null && (
              <DetailComponent fieldName="Source" value={source.name} />
            )}
          </Grid>

          <FavoriteFab mangaId={mangaInfo.id} />
        </ResponsiveGrid>
      </BackgroundImage>

      <ResponsiveGrid className={classes.gridPadding}>
        <DetailComponent
          fieldName="Description"
          value={mangaInfo.description || ""}
        />
      </ResponsiveGrid>
    </>
  );
};

MangaInfoDetails.defaultProps = {
  children: null
};

// Helper functions
function detailsElements(mangaInfo: Manga): React.Node {
  const fieldNames = ["author", "artist", "genre"];

  return fieldNames.map(fieldName => {
    const value = mangaInfo[fieldName];
    if (
      (!Array.isArray(value) && value) ||
      (Array.isArray(value) && value.length > 0)
    ) {
      // NOTE: using field name as the key, this shouldn't be a problem
      return (
        <DetailComponent fieldName={fieldName} value={value} key={fieldName} />
      );
    }
    return null;
  });
}

type DetailComponentProps = {
  fieldName: string,
  value: string | Array<string> | number
};

const DetailComponent = ({
  fieldName,
  value
}: DetailComponentProps): React.Node => (
  <Typography>
    <b>{`${upperFirst(fieldName)}: `}</b>
    {value}
  </Typography>
);

export default withStyles(styles)(MangaInfoDetails);
