import { connect } from 'react-redux';
import { Util } from '../interfaces';

/**
 * @deprecated This function should be replace with useSelector hook for better Typescript compatitity
 */
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
