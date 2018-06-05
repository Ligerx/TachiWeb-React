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

// TODO: image loading state
//       also set a min size for the loading image?

// TODO: add some spacing around the nav buttons
// TODO: evenly space them?

const styles = {
  page: {
    width: '100%',
    cursor: 'pointer', // to indicate clickable
    marginTop: 80,
    marginBottom: 80,
  },
  navButtonsParent: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 40,
  },
};

type Props = {
  classes: Object, // styles
  imageSource: string,
  onNextPageClick: Function,
  onPrevPageClick: Function,
};

class SinglePageReader extends Component<Props> {
  render() {
    const {
      classes, imageSource, onNextPageClick, onPrevPageClick,
    } = this.props;

    return (
      <React.Fragment>
        <ScrollToTop />

        <ResponsiveGrid>
          <Grid item xs={12}>
            <ImageWithLoader src={imageSource} onClick={onNextPageClick} className={classes.page} />
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
