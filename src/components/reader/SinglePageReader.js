// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import ScrollToTop from 'components/ScrollToTop';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ImageWithLoader from 'components/reader/ImageWithLoader';

// TODO: disable next / prev page buttons if there is no page?

// TODO: add some spacing around the nav buttons
// TODO: evenly space them?

// TODO: add instructions on how to use reader
//       e.g. keyboard actions, clicking on the image

// TODO: add a way to go back? I'm thinking esc key would be good.

// TODO: what's a good maxWidth for the image?

// TODO: It could be cool to return the user to the MangaInfo page if they click next page
//       and there are no more chapters/pages

// Left and right arrow key press will change the page
//
// References for key press events
// https://stackoverflow.com/questions/29069639/listen-to-keypress-for-document-in-reactjs
// https://stackoverflow.com/questions/32553158/detect-click-outside-react-component

const styles = {
  page: {
    width: '100%',
    cursor: 'pointer', // to indicate clickable
    marginBottom: 80,
  },
  navButtonsParent: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 40,
  },
  topOffset: {
    marginTop: 144,
  },
};

type Props = {
  classes: Object, // styles
  imageSource: string,
  onNextPageClick: Function,
  onPrevPageClick: Function,
};

class SinglePageReader extends Component<Props> {
  componentDidMount() {
    document.addEventListener('keydown', this.handleArrowKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleArrowKeyDown);
  }

  handleArrowKeyDown = (event: SyntheticKeyboardEvent<>) => {
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;

    // TODO: is this the expected direction the arrows should take you?
    if (event.keyCode === LEFT_ARROW) {
      this.props.onPrevPageClick();
    } else if (event.keyCode === RIGHT_ARROW) {
      this.props.onNextPageClick();
    }
  };

  render() {
    const {
      classes, imageSource, onNextPageClick, onPrevPageClick,
    } = this.props;

    return (
      <React.Fragment>
        <ScrollToTop />

        <ResponsiveGrid className={classes.topOffset}>
          <Grid item xs={12}>
            <ImageWithLoader
              src={imageSource}
              onClick={onNextPageClick}
              className={classes.page}
            />
          </Grid>

          <Grid item xs={12} className={classes.navButtonsParent}>
            <Button onClick={onPrevPageClick}>
              <Icon>navigate_before</Icon>
              Previous Page
            </Button>
            <Button onClick={onNextPageClick}>
              Next Page
              <Icon>navigate_next</Icon>
            </Button>
          </Grid>
        </ResponsiveGrid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(SinglePageReader);
