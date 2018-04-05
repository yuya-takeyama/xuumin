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

interface StateProps {
  isCreatingDiagram: boolean;
}

interface DispatchProps {
  createDiagramRequest: (params: CreateDiagramParams) => Promise<Diagram>;
}

interface OwnProps extends RouteComponentProps<{}> {}

interface FormProps {
  isCreatingDiagram: boolean;
  error?: { message: string };
  form: CreateDiagramParams;
  onSubmit: (params: CreateDiagramParams) => void;
  onChangeTitle: (title: string) => void;
  onChangeSource: (source: string) => void;
}

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

const Form: React.SFC<FormProps> = props => (
  <div>
    {props.error && <div>{props.error.message}</div>}
    <form
      onSubmit={event => {
        event.preventDefault();
        props.onSubmit(props.form);
      }}
    >
      <dl>
        <dt>Title</dt>
        <dd>
          <input
            type="text"
            size={60}
            value={props.form.title}
            onChange={event => props.onChangeTitle(event.target.value)}
          />
        </dd>
        <dt>Source</dt>
        <dd>
          <textarea
            rows={20}
            cols={80}
            onChange={event => props.onChangeSource(event.target.value)}
          >
            {props.form.source}
          </textarea>
        </dd>
      </dl>
      <div>
        <input type="submit" value="Post" disabled={props.isCreatingDiagram} />
      </div>
    </form>
  </div>
);

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
          isCreatingDiagram={this.props.isCreatingDiagram}
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
