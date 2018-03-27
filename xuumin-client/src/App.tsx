import * as React from 'react';
import './App.css';

interface Diagram {
  uuid: string;
  source: string;
}

interface State {
  diagrams?: Diagram[];
}
type Props = {};

class App extends React.Component<Props, State> {
  componentDidMount() {
    fetch('/v1/diagrams')
      .then(res => res.json())
      .then(json => {
        this.setState({ diagrams: json.diagrams });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Xuumin</h1>
        </header>

        {this.state &&
          this.state.diagrams && (
            <div>
              <ul>
                {this.state.diagrams.map(diagram => (
                  <li>
                    <a href={`/diagrams/${diagram.uuid}`}>{diagram.uuid}</a>
                    <img src={`/diagrams/${diagram.uuid}.svg`} />
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    );
  }
}

export default App;
