import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Diagram } from '../../interfaces';
import { ensureError } from '../../utils';

interface RouteParams {
  id: string;
}

interface Props extends RouteComponentProps<RouteParams> {}

interface State {
  diagram?: Diagram;
  error?: Error;
}

class ShowDiagram extends React.Component<Props, State> {
  componentDidMount() {
    fetch(`/v1/diagrams/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(json => {
        this.setState({ diagram: json });
      })
      .catch(err => {
        this.setState({ error: ensureError(err) });
      });
  }

  render() {
    if (this.state && this.state.diagram) {
      return (
        <div>
          <h2>{this.state.diagram.title}</h2>

          <img src={`/diagrams/${this.props.match.params.id}.svg`} />
          <div>
            <Link to="/">Home</Link>
          </div>
        </div>
      );
    }
    if (this.state && this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    }

    return <div>Loading...</div>;
  }
}

export default ShowDiagram;
