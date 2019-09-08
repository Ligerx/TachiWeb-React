// @flow
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/styles";
import CenteredLoading from "components/Loading/CenteredLoading";
import LazyLoad from "components/Reader/LazyLoad";

// https://www.javascriptstuff.com/detect-image-load/

// I'm manually setting the image's key. Possibly a little hacky?
// But this fixes 2 problems by forcefully refreshing the <img> when its key changes.
//
//   1. If you change page and the new image needs time to load, React will continue
//      to show the previous image until the new image loads.
//      I believe this is a quirk of how React diffs images. (even though the src is changed)
//
//   2. If you successfully reload the image after it fails (handleRetryClick),
//      for some reason, it won't actually show the new image.
//      It instead shows the image error placeholder as if it failed.
//      I'm guessing React is confused that it's image (in cache) changed, but the src/key didn't.

type Props = {
  src: string,
  alt: string, // requiring alt so eslint doesn't yell at me
  lazyLoad?: boolean,
  preventLoading?: boolean // used to have control over lazyLoad
}; // extra props will be passed to <img>

type StatusType = "LOADING" | "LOADED" | "FAILED";

const useStyles = makeStyles({
  placeholderChild: {
    // https://stackoverflow.com/questions/11535827/responsive-height-proportional-to-width
    // Doing some quick research, the average manga page seems to have a height/width
    // ratio of ~1.43. Setting that ratio for the placeholder here.
    // But since it's relying on padding, this div has no actual height. So instead I'm
    // relying on a parent wrapper div to have actual height and vertically position the buttons.
    height: 0,
    paddingTop: "143%"
  },
  placeholderParent: {
    // vertically center children
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  img: {
    width: "100%",

    // Visible only after image is loaded to prevent the image-not-found visual from appearing
    display: ({ status }: { status: StatusType }) =>
      status === "LOADED" ? "block" : "none"
  }
});

const ImageWithLoader = ({
  src,
  alt,
  lazyLoad = false,
  preventLoading = false,
  ...otherProps
}: Props) => {
  const [status, setStatus] = useState<StatusType>("LOADING");
  const [retries, setRetries] = useState(0);

  const classes = useStyles({ status });

  const handleImageLoad = () => setStatus("LOADED");
  const handleImageError = () => setStatus("FAILED");
  const handleRetryClick = () => {
    setStatus("LOADING");
    setRetries(prevRetries => prevRetries + 1);

    // https://stackoverflow.com/questions/23160107/javascript-how-to-retry-loading-an-image-without-appending-query-string
    const img = new Image();
    img.onload = handleImageLoad;
    img.onerror = handleImageError;
    img.src = src;
  };

  const image = (
    <img
      {...otherProps}
      className={classes.img}
      onLoad={handleImageLoad}
      onError={handleImageError}
      src={src}
      alt={alt}
      key={`${src}-${retries}`}
    />
  );

  return (
    <>
      {/* img should occupy no space before it loads */}
      {lazyLoad ? (
        <LazyLoad topThreshhold={200} preventLoading={preventLoading}>
          {image}
        </LazyLoad>
      ) : (
        image
      )}

      {(status === "LOADING" || status === "FAILED") && (
        <div className={classes.placeholderParent}>
          <div className={classes.placeholderChild} />

          {status === "LOADING" && <CenteredLoading />}
          {status === "FAILED" && (
            <Button variant="contained" onClick={handleRetryClick}>
              <Icon>refresh</Icon>
              Retry
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default ImageWithLoader;
