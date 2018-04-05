import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Diagram } from '../../interfaces';
import { State as RootState } from '../../reducers';
import { connect, Dispatch } from 'react-redux';
import {
  fetchDiagramRequest,
  FetchDiagramParams,
} from '../../actions/diagramActions';
import { ensureError } from '../../utils';

interface StateProps {
  entities: { [key: string]: Diagram };
  ids: string[];
  isFetchingDiagram: boolean;
}

interface DispatchProps {
  fetchDiagramRequest: (params: FetchDiagramParams) => Promise<Diagram>;
}

interface RouteParams {
  id: string;
}

interface OwnProps extends RouteComponentProps<RouteParams> {}

interface State {
  error?: Error;
}

const mapStateToProps = (state: RootState): StateProps => ({
  entities: state.diagram.entities,
  ids: state.diagram.ids,
  isFetchingDiagram: state.diagram.isFetchingDiagram,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  fetchDiagramRequest: (params: FetchDiagramParams) =>
    dispatch(fetchDiagramRequest(params)),
});

class ShowDiagram extends React.Component<
  StateProps & DispatchProps & OwnProps,
  State
> {
  componentDidMount() {
    const diagram = this.getDiagram();

    if (!diagram) {
      this.props
        .fetchDiagramRequest({ uuid: this.props.match.params.id })
        .catch(err => this.setState({ error: ensureError(err) }));
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
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    }

    return <div>Unkonwn error</div>;
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ShowDiagram);
