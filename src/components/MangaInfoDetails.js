import React from 'react';
import Typography from 'material-ui/Typography';
import ResponsiveGrid from 'components/ResponsiveGrid';
import MangaCard from 'components/MangaCard';
import Grid from 'material-ui/Grid';
import BackgroundImage from 'components/BackgroundImage';

// TODO: make the html a bit more DRY

const MangaInfoDetails = ({ mangaInfo }) => (
  <div>
    <BackgroundImage thumbnailUrl={mangaInfo.thumbnail_url}>
      <ResponsiveGrid>
        <Grid item xs={4}>
          <MangaCard thumbnailUrl={mangaInfo.thumbnail_url} />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="title" gutterBottom>
            {mangaInfo.title}
          </Typography>
          <Typography>
            <strong>Author: </strong>
            {mangaInfo.author}
            <br />
            <strong>Chapters: </strong>
            {mangaInfo.chapters}
            <br />
            <strong>Status: </strong>
            {mangaInfo.status}
            <br />
            <strong>Source: </strong>
            {mangaInfo.source}
            <br />
            <strong>Genres: </strong>
            {mangaInfo.genres}
            <br />
          </Typography>
        </Grid>
      </ResponsiveGrid>
    </BackgroundImage>

    <ResponsiveGrid>
      <Typography>
        <strong>Description: </strong>
        {mangaInfo.description}
      </Typography>
    </ResponsiveGrid>
  </div>
);

export default MangaInfoDetails;
