import {useState } from 'react';
import { connect } from 'react-redux'
import Alert from 'react-bootstrap/Alert';
import { authInit } from '@/libs/store/actions/auth';
import { Dispatch } from 'redux';


interface Props {
    error:string,
    message:string
}
const AlertShow = (props:Props) => {
const [show, setShow] = useState(true);

  if ((show) && (props.message)){
    return (
      <Alert onClose={() => setShow(false)}
      variant={(props.error) ? "danger" : "success"}>{props.message}</Alert>
    );
  }
  return null;
}

const mapDispatchToProps = (dispatch:Dispatch) => {
    return {
        onAuthInit: () => dispatch(authInit()),
    }
}

export default connect(null, mapDispatchToProps)(AlertShow);
