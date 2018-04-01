import * as React from 'react';
import { Link } from 'react-router-dom';
import { Diagram } from '../interfaces';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { State } from '../reducers';
import { State as DiagramState } from '../reducers/diagramReducer';
import { fetchDiagramsRequest } from '../actions/diagramActions';

type StateProps = Pick<
  DiagramState,
  'diagrams' | 'isFetchingDiagrams' | 'error'
>;

interface DispatchProps {
  fetchDiagramsRequest: () => void;
}

const mapStateToProps = (state: State): StateProps => ({
  diagrams: state.diagram.diagrams,
  isFetchingDiagrams: state.diagram.isFetchingDiagrams,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(
    {
      fetchDiagramsRequest,
    },
    dispatch,
  );

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

class Home extends React.Component<StateProps & DispatchProps> {
  componentDidMount() {
    this.props.fetchDiagramsRequest();
  }

  render() {
    if (this.props.isFetchingDiagrams) {
      return <div>Fetching diagrams...</div>;
    }

    return <DiagramList diagrams={this.props.diagrams} />;
  }
}

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
