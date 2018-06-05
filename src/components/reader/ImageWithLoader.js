// @flow
import React, { Component } from 'react';
import CenteredLoading from 'components/loading/CenteredLoading';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

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

const styles = {
  retryParent: {
    display: 'flex',
    justifyContent: 'center',
  },
};

type Props = {
  className?: string, // FIXME: parent might have injected styles. Need to manually apply it.
  classes: Object, // injected styles (for this component)
  src: string,
  // extra props will be passed to <img>
};

type State = {
  status: 'LOADING' | 'LOADED' | 'FAILED',
  retries: number,
};

class ImageWithLoader extends Component<Props, State> {
  state = {
    status: 'LOADING',
    retries: 0,
  };

  componentDidUpdate(prevProps: Props) {
    // Changing the img src doesn't trigger any event to update
    // status so you have to do it manually.
    if (prevProps.src !== this.props.src) {
      this.setState({
        status: 'LOADING',
        retries: 0,
      });
    }
  }

  handleImageLoad = () => this.setState({ status: 'LOADED' });

  handleImageError = () => this.setState({ status: 'FAILED' });

  handleRetryClick = () => {
    // https://stackoverflow.com/a/23160210
    this.setState(prevState => ({
      status: 'LOADING',
      retries: prevState.retries + 1,
    }));

    const img = new Image();
    img.onload = () => this.setState({ status: 'LOADED' });
    img.onerror = () => this.setState({ status: 'FAILED' });
    img.src = this.props.src;
  };

  render() {
    const {
      className, classes, src, ...otherProps
    } = this.props;
    const { status, retries } = this.state;

    const imgStyles = {
      width: '100%',
      // when image fails to load, a placeholder thing appears in the DOM. Hide that.
      display: status === 'FAILED' ? 'none' : 'block',
    };

    return (
      <div className={className}>
        <img
          {...otherProps}
          onLoad={this.handleImageLoad}
          onError={this.handleImageError}
          src={src}
          style={imgStyles}
          key={`${src}-${retries}`}
        />

        {status === 'LOADING' && <CenteredLoading />}
        {status === 'FAILED' && (
          <div className={classes.retryParent}>
            <Button variant="contained" onClick={this.handleRetryClick}>
              <Icon>refresh</Icon>
              Retry
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ImageWithLoader);
