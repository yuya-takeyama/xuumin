import * as React from 'react';
import { Diagram } from '../../interfaces';
import { State as RootState } from '../../reducers';
import { Dispatch, connect } from 'react-redux';
import {
  FetchDiagramParams,
  fetchDiagramRequest,
  UpdateDiagramParams,
  updateDiagramRequest,
} from '../../actions/diagramActions';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Form, { FormParams } from './Form';
import { ensureError } from '../../utils';

interface StateProps {
  entities: { [key: string]: Diagram };
  ids: string[];
  isFetchingDiagram: boolean;
  isUpdatingDiagram: boolean;
}

interface DispatchProps {
  fetchDiagramRequest: (params: FetchDiagramParams) => Promise<Diagram>;
  updateDiagramRequest: (params: UpdateDiagramParams) => Promise<Diagram>;
}

interface RouteParams {
  id: string;
}

interface OwnProps extends RouteComponentProps<RouteParams> {}

interface State {
  form: FormParams;
  error?: { message: string };
}

const mapStateToProps = (state: RootState): StateProps => ({
  entities: state.diagram.entities,
  ids: state.diagram.ids,
  isFetchingDiagram: state.diagram.isFetchingDiagram,
  isUpdatingDiagram: state.diagram.isUpdatingDiagram,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  fetchDiagramRequest: (params: FetchDiagramParams) =>
    dispatch(fetchDiagramRequest(params)),
  updateDiagramRequest: (params: UpdateDiagramParams) =>
    dispatch(updateDiagramRequest(params)),
});

class EditDiagram extends React.Component<
  StateProps & DispatchProps & OwnProps,
  State
> {
  constructor(props: StateProps & DispatchProps & OwnProps) {
    super(props);

    const initialState: State = {
      form: {
        title: '',
        source: '',
      },
    };

    // @ts-ignore
    this.state = initialState;
  }

  componentDidMount() {
    const diagram = this.getDiagram();
    if (diagram) {
      this.setState({
        form: {
          title: diagram.title,
          source: diagram.source,
        },
      });
    }

    if (!diagram) {
      this.props
        .fetchDiagramRequest({ uuid: this.props.match.params.id })
        .then(fetchedDiagram =>
          this.setState({
            form: {
              title: fetchedDiagram.title,
              source: fetchedDiagram.source,
            },
          }),
        )
        .catch(err => this.setState({ error: ensureError(err) }));
    }
  }

  getDiagram(): Diagram | undefined {
    return this.props.entities[this.props.match.params.id];
  }

  render() {
    const diagram = this.getDiagram();
    return (
      <div>
        {diagram ? (
          <Form
            isSubmitting={this.props.isUpdatingDiagram}
            error={this.state.error}
            form={this.state.form}
            onSubmit={params => this.onSubmit(params)}
            onChangeTitle={title => this.onChangeTitle(title)}
            onChangeSource={source => this.onChangeSource(source)}
          />
        ) : (
          <div>Loading diagram...</div>
        )}
        <div>
          <Link to={`/diagrams/${this.props.match.params.id}`}>Back</Link>
        </div>
        <div>
          <Link to="/">Home</Link>
        </div>
      </div>
    );
  }

  async onSubmit(params: FormParams) {
    const id = this.props.match.params.id;
    this.setState({ error: undefined });
    try {
      await this.props.updateDiagramRequest({
        uuid: id,
        ...params,
      });
      this.props.history.push(`/diagrams/${id}`);
    } catch (err) {
      this.setState({ error: ensureError(err) });
    }
  }

  onChangeTitle(title: string) {
    this.setState({
      form: {
        ...this.state.form,
        title,
      },
    });
  }

  onChangeSource(source: string) {
    this.setState({
      form: {
        ...this.state.form,
        source,
      },
    });
  }
}

export default withRouter(
  connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(
    EditDiagram,
  ),
);
