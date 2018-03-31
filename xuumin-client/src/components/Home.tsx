import * as React from 'react';
import { Link } from 'react-router-dom';

interface Diagram {
  uuid: string;
  source: string;
  title: string;
}

interface State {
  diagrams?: Diagram[];
}

type Props = {};

class Home extends React.Component<Props, State> {
  componentDidMount() {
    fetch('/v1/diagrams')
      .then(res => res.json())
      .then(json => {
        this.setState({ diagrams: json.diagrams });
      })
      .catch(err => {
        // tslint:disable-next-line:no-console
        console.error(err);
      });
  }

  render() {
    return (
      this.state &&
      this.state.diagrams && (
        <div>
          <ul>
            {this.state.diagrams.map((diagram, i) => (
              <li key={i}>
                <Link to={`/diagrams/${diagram.uuid}`}>{diagram.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )
    );
  }
}

export default Home;
