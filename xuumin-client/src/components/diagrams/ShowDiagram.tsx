import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Diagram } from '../../interfaces';
import { State } from '../../reducers';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchDiagramRequest } from '../../actions/diagramActions';

interface StateProps {
  entities: { [key: string]: Diagram };
  ids: string[];
  isFetchingDiagram: boolean;
  error?: { message: string };
}

interface DispatchProps {
  fetchDiagramRequest: (params: { uuid: string }) => void;
}

interface RouteParams {
  id: string;
}

interface OwnProps extends RouteComponentProps<RouteParams> {}

const mapStateToProps = (state: State): StateProps => ({
  entities: state.diagram.entities,
  ids: state.diagram.ids,
  isFetchingDiagram: state.diagram.isFetchingDiagram,
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
    const diagram = this.getDiagram();

    if (!diagram) {
      this.props.fetchDiagramRequest({ uuid: this.props.match.params.id });
    }
  }

  getDiagram(): Diagram | undefined {
    return this.props.entities[this.props.match.params.id];
  }

  render() {
    const diagram = this.getDiagram();

    if (this.props.isFetchingDiagram) {
      return <div>Loading a diagram...</div>;
    }
    if (diagram) {
      return (
        <div>
          <h2>{diagram.title}</h2>

          <img src={`/diagrams/${diagram.uuid}.svg`} />
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
