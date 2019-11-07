import React, { Fragment } from 'react';
import { TextField, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const EMPLOYEE_URL = 'http://localhost:3001/employees';

const styles = theme => ({
  dialogTitle: {
    backgroundColor: '#75c5eb',
  }
});

class AddEmployeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      isEditing: false,
      form: {
        name: ''
      },
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      fetch(EMPLOYEE_URL + '/' + id)
      .then(res => res.json())
      .then((data) => {
        this.setState(pre => ({
          form: {
            name: data.name
          }
        }))
      });
    }
  }

  handleChange(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState((pre) => ({
      form: change
    }));
  }

  handleToggle() {
    this.setState({
      open: !this.state.open
    });
  }

  submit() {
    fetch(EMPLOYEE_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(this.state.form)
    })
    .then(res => res.json())
    .then(data => {
      this.handleToggle();
    });
  }

  render() {
    const { open, form: { name } } = this.state;
    const { classes } = this.props;

    if (!open) {
      return <Redirect to={{path: '/'}} />
    }

    return <Fragment>
            <Dialog
              open={open}
              onClose={this.handleToggle.bind(this)}>
                <DialogTitle id='form-dialog-title' className={classes.dialogTitle}>Adding a New Employee</DialogTitle>
                <DialogContent>
                  <form>
                  <TextField autoFocus label='name' value={name} name='name' onChange={this.handleChange.bind(this)} margin='normal'/>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button color='primary' variant='outlined' onClick={this.handleToggle.bind(this)}>
                    Cancel
                  </Button>
                  <Button color='primary' variant='outlined' onClick={this.submit.bind(this)}>
                    Add
                  </Button>
                </DialogActions>
            </Dialog>
          </Fragment>
  }
}

export default withStyles(styles, { withTheme: true })(AddEmployeeForm);