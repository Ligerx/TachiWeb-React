// @flow
import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  // Stretch card width to parent container.
  root: {
    width: "100%"
    // overflow: "hidden"
  },

  // This component makes the image fill the entire container by default
  // Image aspect ratio hack
  // height: 0, paddingTop: X%   [(Image Height / Image Width) * 100%]
  image: {
    height: 0,
    paddingTop: "130%"
  },

  // Simple gradient to make the text readable over the image.
  // also hide overflow to prevent clicking
  gradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxHeight: "100%",
    padding: "24px 16px 16px",
    background:
      "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0) 100%)",

    // Hide any overflow text. Applied here because it doesn't seem
    // to work on the root element for some reason.
    overflow: "hidden"
  },

  // White text for readability over back gradient.
  // Also the ButtonBase's text is centered, so reset that to left align.
  title: {
    color: "white",
    textAlign: "left"
  }
});

type Props = {
  coverUrl: string,
  title?: string
};

// NOTE: this is a basic implementation, and is meant to be wrapped by other components
// At minumum, you should probably wrap it with a <Grid item>

// Gradient will not render if there is no title passed
// CardMedia / image will not render if there is no coverUrl

// FIXME: title can be too long. Limit the max length of the title.

const MangaCard = ({ title, coverUrl }: Props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      {!!coverUrl && (
        <CardMedia className={classes.image} image={coverUrl} title={title} />
      )}

      {!!title && (
        <div className={classes.gradient}>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </div>
      )}
    </Card>
  );
};

MangaCard.defaultProps = {
  title: ""
};

export default MangaCard;
