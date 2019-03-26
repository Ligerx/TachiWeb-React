// @flow
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import ResponsiveGrid from 'components/ResponsiveGrid';
import MangaCard from 'components/MangaCard';
import Grid from '@material-ui/core/Grid';
import BackgroundImage from 'components/mangaInfo/BackgroundImage';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Server } from 'api';
import { capitalize, upperFirst } from 'lodash';
import FavoriteFABContainer from 'containers/FavoriteFABContainer';
import type { Manga, Source } from "@tachiweb/api-client";

// TODO: increase top/bottom padding for description so it doesn't touch the FAB

// TODO: I'm applying padding to the ResponsiveGrid. This doesn't feel very elegant.
//       Is there any simple way to keep all the styling in THIS component?

const styles = () => ({
  gridPadding: {
    padding: '32px 24px',
  },
  fabParent: {
    position: 'relative',
  },
});

type Props = {
  classes: Object,
  source: ?Source,
  mangaInfo: Manga,
  numChapters: number,
};

const MangaInfoDetails = ({
  classes,
  source,
  mangaInfo,
  numChapters
}: Props) => {
  const coverUrl: string = Server.cover(mangaInfo.id);

  return (
    <React.Fragment>
      <BackgroundImage coverUrl={coverUrl}>
        <ResponsiveGrid className={classNames(classes.gridPadding, classes.fabParent)}>
          <Grid item xs={4} sm={3}>
            <MangaCard coverUrl={coverUrl} />
          </Grid>
          <Grid item xs={8} sm={9}>
            <Typography variant="title" gutterBottom>
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

          <FavoriteFABContainer mangaId={mangaInfo.id} />
        </ResponsiveGrid>
      </BackgroundImage>

      <ResponsiveGrid className={classes.gridPadding}>
        <DetailComponent fieldName="Description" value={mangaInfo.description || ''} />
      </ResponsiveGrid>
    </React.Fragment>
  );
};

MangaInfoDetails.defaultProps = {
  children: null,
};

// Helper functions
function detailsElements(mangaInfo: Manga): React.Node {
  const fieldNames = ["author", "artist", "genre"];

  return fieldNames.map((fieldName) => {
    const value = mangaInfo[fieldName];
    if ((!Array.isArray(value) && value) || (Array.isArray(value) && value.length > 0)) {
      // NOTE: using field name as the key, this shouldn't be a problem
      return <DetailComponent fieldName={fieldName} value={value} key={fieldName} />;
    }
    return null;
  });
}

type DetailComponentProps = {
  fieldName: string,
  value: string | Array<string> | number,
};

const DetailComponent = ({ fieldName, value }: DetailComponentProps): React.Node => (
  <Typography>
    <b>{`${upperFirst(fieldName)}: `}</b>
    {value}
  </Typography>
);

export default withStyles(styles)(MangaInfoDetails);
