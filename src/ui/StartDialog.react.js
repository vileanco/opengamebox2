import React from 'react';
import {Modal, Button, FormControl, FormGroup, ControlLabel} from 'react-bootstrap';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';

let StartDialog = ({fields, setPlayerName}) => {
  const {name} = fields;
  return (
    <div className="static-modal">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Who are you?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="text" placeholder="John Doe" {...name} />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="primary"
                  disabled={name.error !== undefined}
                  onClick={() => { setPlayerName(name.value); }}>PLAY</Button>
        </Modal.Footer>

      </Modal.Dialog>
    </div>
  );
};

const validate = values => {
  const errors = {};
  if (!values.name || values.name.length === 0) {
    errors.name = 'Required';
  }
  return errors;
};

StartDialog = reduxForm({
  form: 'startDialog',
  fields: ['name'],
  validate
})(StartDialog);

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPlayerName: name => {
      console.log(name);
      // dispatch some action here
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StartDialog);