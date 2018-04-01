import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Diagram } from '../../interfaces';
import { State } from '../../reducers';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchDiagramRequest } from '../../actions/diagramActions';

interface StateProps {
  diagram?: Diagram;
  isFetchingDiagram: boolean;
  error?: Error;
}

interface DispatchProps {
  fetchDiagramRequest: (params: { uuid: string }) => void;
}

interface RouteParams {
  id: string;
}

interface OwnProps extends RouteComponentProps<RouteParams> {}

const mapStateToProps = (state: State): StateProps => ({
  isFetchingDiagram: state.diagram.isFetchingDiagram,
  diagram: state.diagram.diagram,
  error: state.diagram.error,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) =>
  bindActionCreators(
    {
      fetchDiagramRequest,
    },
    dispatch,
  );

class ShowDiagram extends React.Component<
  StateProps & DispatchProps & OwnProps
> {
  componentDidMount() {
    this.props.fetchDiagramRequest({ uuid: this.props.match.params.id });
  }

  render() {
    if (this.props.isFetchingDiagram) {
      return <div>Loading a diagram...</div>;
    }
    if (this.props.diagram) {
      return (
        <div>
          <h2>{this.props.diagram.title}</h2>

          <img src={`/diagrams/${this.props.diagram.uuid}.svg`} />
          <div>
            <Link to="/">Home</Link>
          </div>
        </div>
      );
    }
    if (this.props.error) {
      return <div>Error: {this.props.error.message}</div>;
    }

    return <div>Unkonwn error</div>;
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ShowDiagram);
