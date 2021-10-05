import { connect } from 'react-redux';
import { Util } from '../interfaces';

export function withRedux<TOwnProps>({ 
  component, 
  stateProps = () => ({}), 
  dispatchProps = () => ({}) 
}: {
  component: any;
  stateProps?: Function;
  dispatchProps?: Function | Util.IObject;
}) {
  const mapStateToProps = () => stateProps;

  const mapDispatchToProps = dispatchProps;

  return connect<{}, {}, TOwnProps | {}>(mapStateToProps, mapDispatchToProps)(component);
}
