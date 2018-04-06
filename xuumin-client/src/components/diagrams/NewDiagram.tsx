import * as React from 'react';
import { Diagram } from '../../interfaces';
import { State as RootState } from '../../reducers';
import { Dispatch, connect } from 'react-redux';
import {
  createDiagramRequest,
  CreateDiagramParams,
} from '../../actions/diagramActions';
import { RouteComponentProps, withRouter } from 'react-router';
import { ensureError } from '../../utils';
import { Link } from 'react-router-dom';
import Form from './Form';

interface StateProps {
  isCreatingDiagram: boolean;
}

interface DispatchProps {
  createDiagramRequest: (params: CreateDiagramParams) => Promise<Diagram>;
}

interface OwnProps extends RouteComponentProps<{}> {}

interface State {
  form: CreateDiagramParams;
  error?: { message: string };
}

const mapStateToProps = (state: RootState): StateProps => ({
  isCreatingDiagram: state.diagram.isCreatingDiagram,
});

const mapDispatchToProps = (dispatch: Dispatch<RootState>) => ({
  createDiagramRequest: (params: CreateDiagramParams) =>
    dispatch(createDiagramRequest(params)),
});

class NewDiagram extends React.Component<
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

  render() {
    return (
      <div>
        <Form
          isSubmitting={this.props.isCreatingDiagram}
          error={this.state.error}
          form={this.state.form}
          onSubmit={params => this.onSubmit(params)}
          onChangeTitle={title => this.onChangeTitle(title)}
          onChangeSource={source => this.onChangeSource(source)}
        />
        <Link to="/">Home</Link>
      </div>
    );
  }

  async onSubmit(params: CreateDiagramParams) {
    this.setState({ error: undefined });
    try {
      const diagram = await this.props.createDiagramRequest(params);
      this.props.history.push(`/diagrams/${diagram.uuid}`);
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
    NewDiagram,
  ),
);
