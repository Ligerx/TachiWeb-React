// @flow
import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import "rc-slider/assets/index.css";
import Slider, { createSliderWithTooltip } from "rc-slider";
import { withStyles } from "@material-ui/core/styles";

const SliderWithTooltip = createSliderWithTooltip(Slider);

// need whiteSpace: 'pre' so it doesn't wrap. rc-slider's width was forcing them to be too small
const marginSlider = 24;
const marginButton = 8;
const styles = {
  leftText: {
    whiteSpace: "pre",
    marginLeft: marginButton,
    marginRight: marginSlider
  },
  rightText: {
    whiteSpace: "pre",
    marginLeft: marginSlider,
    marginRight: marginButton
  }
};

type Props = {
  classes: Object,

  pageCount: number,
  page: number,
  onJumpToPage: Function
};

// Using sliderValue state so slider can be dragged around (which updates the state onChange)
// If you use props.page, the slider value can't be changed
// Once the user releases the mouse, this fires the onAfterChange event

// Input and output values should be 0 indexed, but will add 1 to the displayed values

// FIXME: I added some CSS to index.css
//        ReaderOverlay has a z-index, which is interfering with the tooltip.
//        Ideally, this CSS wouldn't be necessary

// FIXME: Not sure if it's due to PageSlider, WebtoonReader, or Reader. But jumping pages
//        with the slider seems slow. And going FORWARD makes the url go through every
//        page individually. It doesn't seem to be breaking WebtoonReader pagesToLoad[] though.

const PageSlider = ({ classes, pageCount, page, onJumpToPage }: Props) => {
  const [sliderValue, setSliderValue] = useState(page);
  useEffect(() => {
    setSliderValue(page);
  }, [page]);

  return (
    <>
      <Typography className={classes.leftText}>{`Page ${page + 1}`}</Typography>
      <SliderWithTooltip
        min={1}
        max={pageCount}
        value={sliderValue + 1}
        onChange={(value: number) => setSliderValue(value - 1)}
        onAfterChange={(value: number) => onJumpToPage(value - 1)}
        tipFormatter={value => `Page ${value}`}
      />
      <Typography className={classes.rightText}>{pageCount}</Typography>
    </>
  );
};

export default withStyles(styles)(PageSlider);
