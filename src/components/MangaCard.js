import React from 'react';
import Card, { CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

// * fullWidth
// Stretch card width to parent container.
// * image
// This component makes the image fill the entire container by default
// Image aspect ratio hack
// height: 0, paddingTop: X%   [(Image Height / Image Width) * 100%]
// * gradient
// Simple gradient to make the text readable over the image.
// * title
// White text for readability over back gradient.
// Also the ButtonBase's text is centered, so reset that to left align.
const styles = {
  fullWidth: {
    width: '100%',
  },
  image: {
    height: 0,
    paddingTop: '130%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: '24px 16px 16px',
    background:
      'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0) 100%)',
  },
  title: {
    color: 'white',
    textAlign: 'left',
  },
};

// NOTE: this is a basic implementation, and is meant to be wrapped by other components
// At minumum, you should probably wrap it with a <Grid item>

// Gradient will not render if there is no title passed

const MangaCard = ({ classes, title, thumbnailUrl }) => (
  <Card className={classes.fullWidth}>
    <CardMedia className={classes.image} image={thumbnailUrl} title={title} />
    {!!title && (
      <div className={classes.gradient}>
        <Typography variant="title" className={classes.title}>
          {title}
        </Typography>
      </div>
    )}
  </Card>
);

// TODO: props validation?

export default withStyles(styles)(MangaCard);
