import * as React from 'react';

interface FormProps {
  isSubmitting: boolean;
  error?: { message: string };
  form: FormParams;
  onSubmit: (params: FormParams) => void;
  onChangeTitle: (title: string) => void;
  onChangeSource: (source: string) => void;
}

export interface FormParams {
  title: string;
  source: string;
}

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
            value={props.form.source}
          />
        </dd>
      </dl>
      <div>
        <input type="submit" value="Post" disabled={props.isSubmitting} />
      </div>
    </form>
  </div>
);

export default Form;
