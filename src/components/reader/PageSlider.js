// @flow
import React, { Component } from "react";
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

type State = {
  sliderValue: number
};

// Using state.sliderValue so slider can be dragged around (which updates the state onChange)
// If you use props.page, the slider value can't be changed
// Once the user releases the mouse, this fires the onAfterChange event

// Input and output values should be 0 indexed, but will add 1 to the displayed values

// FIXME: I added some CSS to index.css
//        ReaderOverlay has a z-index, which is interfering with the tooltip.
//        Ideally, this CSS wouldn't be necessary

class PageSlider extends Component<Props, State> {
  state = { sliderValue: 0 };

  componentDidMount() {
    const { page } = this.props;
    this.setState({ sliderValue: page });
  }

  componentDidUpdate(prevProps) {
    const { page } = this.props;
    if (page !== prevProps.page) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ sliderValue: page });
    }
  }

  updateSliderValue = (value: number) => {
    this.setState({ sliderValue: value - 1 });
  };

  handleAfterChange = (value: number) => {
    const { onJumpToPage } = this.props;
    onJumpToPage(value - 1);
  };

  render() {
    const { classes, pageCount, page } = this.props;
    const { sliderValue } = this.state;

    return (
      <React.Fragment>
        <Typography className={classes.leftText}>
          {`Page ${page + 1}`}
        </Typography>
        <SliderWithTooltip
          min={1}
          max={pageCount}
          value={sliderValue + 1}
          onChange={this.updateSliderValue}
          onAfterChange={this.handleAfterChange}
          tipFormatter={value => `Page ${value}`}
        />
        <Typography className={classes.rightText}>{pageCount}</Typography>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PageSlider);
