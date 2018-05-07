import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import 'rc-slider/assets/index.css';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Client } from 'api';
import { withStyles } from 'material-ui/styles';

const SliderWithTooltip = createSliderWithTooltip(Slider);

// need whiteSpace: 'pre' so it doesn't wrap. rc-slider's width was forcing them to be too small
const margin = 24;
const styles = {
  leftText: {
    whiteSpace: 'pre',
    marginRight: margin,
  },
  rightText: {
    whiteSpace: 'pre',
    marginLeft: margin,
  },
};

// rc-slider is finicky. Use state.sliderValue as the value of the slider at all times
// update it onChange, and use onAfterChange to fire any actual events

// FIXME: I added some CSS to index.css
//        ReaderOverlay has a z-index, which is interfering with the tooltip.
//        Ideally, this CSS wouldn't be necessary

class PageSlider extends Component {
  static getDerivedStateFromProps(nextProps) {
    // Set the initial sliderValue to always reflect the page # in the URL
    // 1 indexed for human readability (int)
    const currentPage = getCurrentPage(nextProps.match.params.page);
    return { sliderValue: currentPage };
  }

  constructor(props) {
    super(props);

    this.state = {
      sliderValue: 1,
    };

    this.updateSliderValue = this.updateSliderValue.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  updateSliderValue(value) {
    this.setState({ sliderValue: value });
  }

  changePage(newPage) {
    // Using the current URL's params. Not sure if this is an anti-pattern or not.
    const { mangaId, chapterId } = this.props.match.params;
    this.props.history.push(Client.page(mangaId, chapterId, newPage - 1));
  }

  render() {
    const currentPage = getCurrentPage(this.props.match.params.page);
    const { pageCount } = this.props;
    const { sliderValue } = this.state;

    return (
      <React.Fragment>
        <Typography className={this.props.classes.leftText}>{`Page ${currentPage}`}</Typography>
        <SliderWithTooltip
          min={1}
          max={pageCount}
          value={sliderValue}
          onChange={this.updateSliderValue}
          onAfterChange={this.changePage}
        />
        <Typography className={this.props.classes.rightText}>{pageCount}</Typography>
      </React.Fragment>
    );
  }
}

// Helper function
function getCurrentPage(pageParam) {
  return parseInt(pageParam, 10) + 1;
}

PageSlider.propTypes = {
  pageCount: PropTypes.number.isRequired,
  // Classes is the injected styles
  classes: PropTypes.object.isRequired,
  // Below are react-router props injected with withRouter
  match: PropTypes.shape({
    params: PropTypes.shape({
      mangaId: PropTypes.string.isRequired,
      chapterId: PropTypes.string.isRequired,
      page: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withStyles(styles)(withRouter(PageSlider));
