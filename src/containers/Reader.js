import React, { Component } from 'react';
import TWApi from 'api';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

class Reader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageCount: 0,
    };
  }

  componentDidMount() {
    const { mangaId, chapter, page } = this.props.match.params;

    TWApi.Commands.PageCount.execute(
      (res) => {
        this.setState({ pageCount: res.page_count });
      },
      null,
      { mangaId, chapterId: chapter },
    );
  }

  render() {
    const { mangaId, chapter, page } = this.props.match.params;
    const url = `/reader/${mangaId}/${chapter}/`;
    return (
      <div>
        <Button variant="raised" component={Link} to={`${url}${parseInt(page, 10) - 1}`}>
          Previous
        </Button>
        <Button variant="raised" component={Link} to={`${url}${parseInt(page, 10) + 1}`}>
          Next
        </Button>
        <h2>{this.state.pageCount}</h2>
        <h3>{`MangaId: ${mangaId}, Chapter: ${chapter}, Page ${page}`}</h3>
        <img src={`/api/img/${mangaId}/${chapter}/${page}`} />
      </div>
    );
  }
}

export default Reader;
