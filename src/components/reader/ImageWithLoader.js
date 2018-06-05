// @flow
import React, { Component } from 'react';
import CenteredLoading from 'components/loading/CenteredLoading';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

// https://www.javascriptstuff.com/detect-image-load/

const ImageComponent = (props: Object) => <img {...props} />;

type Props = { src: string }; // pass any other props to be passed to <img>

type State = { status: 'LOADING' | 'LOADED' | 'FAILED' };

class ImageWithLoader extends Component<Props, State> {
  state = { status: 'LOADING' };

  componentDidUpdate(prevProps: Props) {
    // Changing the img src doesn't trigger any event to update
    // status so you have to do it manually.
    if (prevProps.src !== this.props.src) {
      this.setState({ status: 'LOADING' });
    }
  }

  handleImageLoad = () => {
    this.setState({ status: 'LOADED' });
    console.error('image loaded');
  };

  handleImageError = () => {
    this.setState({ status: 'FAILED' });
    console.error('image error');
  };

  handleRetryClick = () => {
    // https://stackoverflow.com/a/23160210
    this.setState({ status: 'LOADING' });

    const img = new Image();
    img.onload = () => this.setState({ status: 'LOADED' });
    img.onerror = () => this.setState({ status: 'FAILED' });
    img.src = this.props.src;
    // FIXME: not actually sure if this works correctly.
    //        will it cause img to trigger another onLoad/onError event?
  };

  render() {
    const { src, ...otherProps } = this.props;
    const { status } = this.state;

    const showLoadedImage = { display: status === 'LOADED' ? 'block' : 'none' };

    return (
      <div>
        <ImageComponent
          {...otherProps}
          onLoad={this.handleImageLoad}
          onError={this.handleImageError}
          src={src}
          style={showLoadedImage}
        />

        {status === 'LOADING' && <CenteredLoading />}
        {status === 'FAILED' && (
          <Button variant="contained" onClick={this.handleRetryClick} style={{ marginTop: 200 }}>
            <Icon>refresh</Icon>
            Retry
          </Button>
        )}
      </div>
    );
  }
}
// FIXME: if loading or error UI state is not far enough down, it will get blocked by
//        the overlay. Must make sure it's low enough.

export default ImageWithLoader;
