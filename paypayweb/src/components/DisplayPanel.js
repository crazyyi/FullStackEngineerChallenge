import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { MdEdit, MdDelete } from 'react-icons/md';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button
} from '@material-ui/core';
import './table.css';

const EMPLOYEE_URL = 'http://localhost:3001/employees';

const styles = theme => ({
  link: {
    textDecoration: 'none',
  },
  dialogTitle: {
    backgroundColor: '#75c5eb',
  }
});

class DisplayPanel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      hoverOnId: 0,
      selectedEmployee: '',
      selectedIndex: -1,
      openRemoveConfirm: false,
      openEdit: false,
      employees: null,
      form: {
        name: null
      }
    }
  }

  componentDidMount() {
    fetch(EMPLOYEE_URL)
    .then(res => res.json())
    .then(data => {
      this.setState({ employees: data })
    });
  }

  componentDidUpdate(preProps, preStates) {
    if (this.state.selectedEmployee !== preStates.selectedEmployee) {
      fetch(EMPLOYEE_URL)
      .then(res => res.json())
      .then(data => {
        this.setState({ employees: data })
      });
    }
  }

  viewEmployee(employeeId) {
    this.props.history.push(`/employees/${employeeId}`);
  }

  toggleHover(e, id) {
    this.setState({ hoverOnId: id });
  }

  toggleLeave() {
    this.setState({ hoverOnId: 0 });
  }

  moveCaretToEnd(e) {
    var temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value
  }

  deleteRow(e) {
    const { selectedIndex, selectedEmployee } = this.state;
    let data = this.state.employees;
    data.splice(selectedIndex, 1);
    this.setState({ employees: data });
    fetch(EMPLOYEE_URL + '/' + selectedEmployee, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
    .then(res => res.json())
    .then(data => {
      this.handleRemoveConfirmToggle();
    });
  }

  openEditEmployeeDialog(e, params) {
    e.stopPropagation();
    this.setState({
      selectedEmployee: params.id,
      openEdit: !this.state.openEdit,
      form: {
        name: params.name
      }
    });
  }

  handleToggle() {
    this.setState({
      openEdit: false,
      selectedEmployee: ''
    });
  }

  handleChange(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState((pre) => ({
      form: change
    }));
  }

  handleOpenRemoveConfirmDialog(e, params) {
    e.stopPropagation();
    this.setState({
      openRemoveConfirm: !this.state.openRemoveConfirm,
      selectedEmployee: params.id,
      selectedIndex: params.index
    });
  }

  handleRemoveConfirmToggle() {
    this.setState({
      openRemoveConfirm: false
    });
  }

  submit(selectedEmployee) {
    fetch(EMPLOYEE_URL + '/' + selectedEmployee, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
          ...this.state.form
          })
    })
    .then(res => res.json())
    .then(data => {
      this.handleToggle();
    });
  }

  renderEmployeeTableData() {
    if (!this.state.employees) {
      const errorMessage = 'No employees can be found!';
      return (<tr><td>{errorMessage}</td></tr>);
    }

    return this.state.employees.map((employee, i) => {
      const { _id, name } = employee;

      return (
        <tr key={_id} 
            className={this.state.hoverOnId === _id ? "hover" : "normal"} 
            onMouseEnter={(e) => this.toggleHover(e, _id)} 
            onMouseLeave={this.toggleLeave.bind(this)} 
            onClick={this.viewEmployee.bind(this, _id)}>
          <td>{i + 1}</td>
          <td>{name}</td>
          <td><Button variant="outlined" onClick={(e) => this.openEditEmployeeDialog(e, {id: _id, name})} startIcon={<MdEdit/>} >
                Edit
              </Button>
          </td>
          <td><Button variant="outlined" onClick={(e) => this.handleOpenRemoveConfirmDialog(e, { index: i, id: _id})} index={i} id={_id} startIcon={<MdDelete />}>
                Remove
              </Button>
          </td>
        </tr>
      )
    });
  }

  render() {
    const { openEdit, openRemoveConfirm, selectedEmployee, form: { name } } = this.state;
    const { classes } = this.props;

    return <Fragment>
        <div className='App-buttonBox'>
          <Link to='/addEmployee' className={classes.link}> 
            <Button color='primary' className={classes.margin}>
              Add
            </Button>
          </Link>
        </div>
        <div>
        <table className='App-table' id='employees'>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Action</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.renderEmployeeTableData()}
          </tbody>
        </table>
      </div>
      <Dialog
       open={openEdit}
       onClose={this.handleToggle.bind(this)}>
         <DialogTitle id='form-dialog-title' className={classes.dialogTitle}>Edit Employee</DialogTitle>
         <DialogContent>
            <DialogContentText>
              Editing employee detail for {name}
            </DialogContentText>
            <form>
            <TextField autoFocus onFocus={this.moveCaretToEnd} label='name' value={name} name='name' onChange={this.handleChange.bind(this)} margin='normal'/>
            </form>
         </DialogContent>
         <DialogActions>
            <Button color='primary' variant='outlined' onClick={this.handleToggle.bind(this)}>
              Cancel
            </Button>
            <Button color='primary' variant='outlined' onClick={this.submit.bind(this, selectedEmployee)}>
              Change
            </Button>
         </DialogActions>
      </Dialog>
      <Dialog
        open={openRemoveConfirm}
        onClose={this.handleRemoveConfirmToggle.bind(this)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
          {"Are you sure to remove?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once removed the operation is not reversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRemoveConfirmToggle.bind(this)} color="primary">
            No
          </Button>
          <Button onClick={(e) => this.deleteRow(e)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>       
      </Fragment>
  }
}

export default withStyles(styles, { withTheme: true })(DisplayPanel);