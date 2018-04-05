import * as React from 'react';
import { Link } from 'react-router-dom';
import { Diagram } from '../interfaces';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State as RootState } from '../reducers';
import { fetchDiagramsRequest } from '../actions/diagramActions';
import { denormalize } from 'normalizr';
import { diagramsSchema, NormalizedDiagrams } from '../schema';
import { ensureError } from '../utils';

interface StateProps {
  diagrams: Diagram[];
  isFetchingDiagrams: boolean;
}

interface DispatchProps {
  fetchDiagramsRequest: () => Promise<NormalizedDiagrams>;
}

interface State {
  error?: Error;
}

const mapStateToProps = (state: RootState): StateProps => {
  const { diagrams } = denormalize(
    { diagrams: state.diagram.ids },
    diagramsSchema,
    { diagrams: state.diagram.entities },
  );

  return {
    diagrams,
    isFetchingDiagrams: state.diagram.isFetchingDiagrams,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  fetchDiagramsRequest: () => dispatch(fetchDiagramsRequest()),
});

const DiagramList: React.SFC<{ diagrams: Diagram[] }> = ({ diagrams }) => (
  <div>
    <ul>
      {diagrams.map((diagram, i) => (
        <li key={i}>
          <Link to={`/diagrams/${diagram.uuid}`}>{diagram.title}</Link>
        </li>
      ))}
    </ul>
  </div>
);

class Home extends React.Component<StateProps & DispatchProps, State> {
  constructor(props: StateProps & DispatchProps) {
    super(props);

    this.state = { error: undefined };
  }

  componentDidMount() {
    this.props
      .fetchDiagramsRequest()
      .catch(err => this.setState({ error: ensureError(err) }));
  }

  render() {
    if (this.props.isFetchingDiagrams) {
      return <div>Fetching diagrams...</div>;
    }

    return (
      <div>
        {this.state.error && (
          <div>Loading Error: {this.state.error.message}</div>
        )}
        <DiagramList diagrams={this.props.diagrams} />
        <Link to={'/diagrams/new'}>New</Link>
      </div>
    );
  }
}

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
