import React, { Component } from 'react';
import Header from 'components/Header';
import MangaGrid from 'components/MangaGrid';
import TWApi from 'api';

class Library extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
    };
  }

  componentDidMount() {
    const api = TWApi.init();

    api.Commands.Library.execute(
      (res) => {
        console.log('Success');
        console.log(res.content);
        this.setState({ content: res.content });
      },
      () => console.log('Failure'),
    );
  }

  render() {
    return (
      <div>
        <Header />

        <MangaGrid />
      </div>
    );
  }
}

export default Library;
