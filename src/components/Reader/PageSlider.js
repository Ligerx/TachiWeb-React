// @flow
import React, { useState, useEffect, useRef } from "react";
import "rc-slider/assets/index.css";
import Slider, { createSliderWithTooltip } from "rc-slider";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";

// Using sliderValue state so slider can be dragged around (which updates the state onChange)
// If you use props.page, the slider value can't be changed
// Once the user releases the mouse, this fires the onAfterChange event

// Input and output values should be 0 indexed, but will add 1 to the displayed values

// FIXME: I added some CSS to index.css
//        ReaderOverlay has a z-index, which is interfering with the tooltip.
//        Ideally, this CSS wouldn't be necessary

// FIXME: For some reason, the slider seems to shift around a bit. It seems to be happening
//        most frequently when jumping backwards a large number of pages. Not really sure
//        why, but it's also only a cosmetic bug.

type Props = {
  pageCount: number,
  page: number,
  onJumpToPage: number => any
};

const SliderWithTooltip = createSliderWithTooltip(Slider);

// need whiteSpace: 'pre' so it doesn't wrap. rc-slider's width was forcing them to be too small
const marginSlider = 24;
const marginButton = 8;
const useStyles = makeStyles({
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
});

const PageSlider = ({ pageCount, page, onJumpToPage }: Props) => {
  // Using an intermediate value that tracks page so that you can drag the
  // slider without jumping until mouse up.
  const [sliderValue, setSliderValue] = useState(page);

  // Keep an internal value that remember if we are currently jumping pages.
  // This is used to prevent the sliderValue from returning to the current page
  // and then slowly changing value as the page changes.
  const isJumpingRef = useRef(false);

  useEffect(() => {
    if (!isJumpingRef.current) {
      setSliderValue(page);
    }
  }, [page]);

  useEffect(() => {
    if (isJumpingRef.current && page === sliderValue) {
      isJumpingRef.current = false;
    }
  }, [page, sliderValue]);

  const handleAfterChange = (value: number) => {
    isJumpingRef.current = true;
    onJumpToPage(value - 1);
  };

  const classes = useStyles();

  return (
    <>
      <Typography className={classes.leftText}>{`Page ${page + 1}`}</Typography>
      <SliderWithTooltip
        min={1}
        max={pageCount}
        value={sliderValue + 1}
        onChange={(value: number) => setSliderValue(value - 1)}
        onAfterChange={handleAfterChange}
        tipFormatter={value => `Page ${value}`}
      />
      <Typography className={classes.rightText}>{pageCount}</Typography>
    </>
  );
};

export default PageSlider;
