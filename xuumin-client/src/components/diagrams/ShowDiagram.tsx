import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

interface RouteParams {
  id: string;
}

interface Props extends RouteComponentProps<RouteParams> {}

const Diagram = (props: Props) => (
  <div>
    <img src={`/diagrams/${props.match.params.id}.svg`} />
    <div>
      <Link to="/">Home</Link>
    </div>
  </div>
);

export default Diagram;
