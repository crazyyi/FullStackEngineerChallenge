import React, { Fragment } from 'react';
import { List, Button, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { MdEdit } from 'react-icons/md';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { ListItem, ListItemText, ListItemSecondaryAction, Checkbox } from '@material-ui/core';

const EMPLOYEE_URL = 'http://localhost:3001/employees';
const PERFORMANCE_REVIEW_URL = 'http://localhost:3001/performanceReviews';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
    width: '250px',
  },
  dialogTitle: {
    backgroundColor: '#75c5eb',
  }
});

class EditEmployeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverOnId: 0,
      openEditReview: false,
      openCheckList: false,
      openAddReview: false,
      checked: [1], // state to monitor assigned employee's index
      employee: null,
      reviews: null,
      selectedReview: null,
      form: {
        content: ''
      },
      editForm: {
        content: ''
      }
    }
  }

  componentDidMount() {
    Promise.all([
      fetch(EMPLOYEE_URL + '/' + this.props.employeeId),
      fetch('http://localhost:3001/performanceReviews/' + this.props.employeeId),
      fetch(EMPLOYEE_URL)
    ])
    .then(([res1, res2, res3]) => Promise.all([res1.json(), res2.json(), res3.json()]))
    .then(([data1, data2, data3]) => {
      this.setState({ 
        employee: data1,
        reviews: data2,
        employees: data3
      });
    });
  }

  componentDidUpdate(preProps, preStates) {
    if (this.state.openAddReview !== preStates.openAddReview) {
      fetch('http://localhost:3001/performanceReviews/' + this.props.employeeId)
      .then(res => res.json())
      .then(data => {
        this.setState({ reviews: data, })
      });
    }
  }

  renderReviews() {
    if (!this.state.reviews) {
      const errorMessage = 'No reviews can be found!';
      return (<tr><td>{errorMessage}</td></tr>);
    }

    return this.state.reviews.map((review, i) => {
      const { _id, content, reviewer, feedback } = review;
      
      return <tr key={_id} 
                className={this.state.hoverOnId === _id ? "hover" : "normal"} 
                onMouseEnter={(e) => this.toggleHover(e, _id)} 
                onMouseLeave={this.toggleLeave.bind(this)} >
              <td>{i + 1}</td>
              <td>{content}</td>
              <td>{reviewer}</td>
              <td>{feedback || 'none'}</td>
              <td><Button onClick={this.openEditReviewDialog.bind(this, {id: _id, content})} startIcon={<MdEdit/>} >
                    Edit
                  </Button>
              </td>
            </tr>
    });
  }

  openEditReviewDialog(data) {
    const {id, content} = data;
    this.setState({
      selectedReview: id,
      openEditReview: !this.state.openEditReview,
      editForm: {
        content: content
      }
    });
  }

  handleCloseEditReview() {
    this.setState({
      openEditReview: false
    });
  }

  handleEditReview() {
    fetch('http://localhost:3001/employees/' + this.props.employeeId + '/performanceReviews/' + this.state.selectedReview, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
          ...this.state.editForm, 
          reviewee: this.props.employeeId,
          reviewer: '001'
          })
    })
    .then(res => res.json())
    .then(data => {
      this.handleCloseEditReview();
    });
  }

  handleEditFormChange(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState((pre) => ({
      editForm: change
    }));
  }

  toggleHover(e, id) {
    this.setState({ hoverOnId: id });
  }

  toggleLeave() {
    this.setState({ hoverOnId: 0 });
  }

  addReview() {
    this.setState({
      openAddReview: !this.state.openAddReview
    });
  }

  handleCloseAddReview() {
    this.setState({
      openAddReview: false
    });
  }

  /**
   * Operation to add a review
   */
  handleAddReview() {
    fetch(PERFORMANCE_REVIEW_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
          ...this.state.form, 
          reviewee: this.props.employeeId,
          reviewer: '001'
          })
    })
    .then(res => res.json())
    .then(data => {
      this.handleCloseAddReview();
    });
  }

  handleAddFormChange(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState((pre) => ({
      form: change
    }));
  }

  handleCheckboxToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }

  handleToggle() {
    this.setState({
      openCheckList: !this.state.openCheckList
    });
  }

  handleClose() {
    this.setState({
      openCheckList: false
    });
  }

  moveCaretToEnd(e) {
    var temp_value = e.target.value;
    e.target.value = '';
    e.target.value = temp_value;
  }

  renderEmployeeList() {
    const { checked, employees } = this.state;

    return employees.map((employee, i) => {
      const { _id, name } = employee;
      const isCurrentEmployee = this.props.employeeId === _id;
      const labelId = `checkboxlistlabel${i}`;
      return ( isCurrentEmployee ? null :
        <ListItem key={_id} button>
          <ListItemText id={labelId} primary={name} />
          <ListItemSecondaryAction>
            <Checkbox edge="end"
                onChange={this.handleCheckboxToggle.bind(this, name)}
                checked={checked.indexOf(name) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
             />
          </ListItemSecondaryAction>
        </ListItem>
      )
      });
  }

  render() {
    const { 
      employee, 
      openEditReview, 
      openCheckList, 
      openAddReview, 
      editForm: {content}, 
      form: { name } 
    } = this.state;
    const { classes } = this.props;

    if (!employee) {
      return <Fragment></Fragment>
    }

    return <Fragment>
      <div className='App-employeeDetail'>
        <div className='App-content'>
        <label>Name:</label>
        <p>{employee.name}</p>
        </div>
        <div>
          <div>
            <Button variant="contained" className={classes.button} onClick={this.handleToggle.bind(this)}>
              Assign employee
            </Button>
          </div>
          <div>
            <Button variant="contained" className={classes.button} onClick={this.addReview.bind(this)} >
              Add Performance Review
            </Button>
          </div>
        </div>
      </div>
      <div>
        <table className='App-table' id='employees'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Review content</th>
              <th>Reviewer</th>
              <th>Feedback</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.renderReviews()}
          </tbody>
        </table>
      </div>
      <Dialog open={openAddReview} onClose={this.handleCloseAddReview.bind(this)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Add a performance review </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a performance review for {employee.name}
          </DialogContentText>
          <form>
            <TextField autoFocus variant="outlined" name='content' style ={{width: '100%'}} rows={4} multiline={true} label='content' defaultValue={name} onChange={this.handleAddFormChange.bind(this)} margin='normal'/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseAddReview.bind(this)} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleAddReview.bind(this)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditReview} onClose={this.handleCloseEditReview.bind(this)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Edit review </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Editing performance review for {employee.name}
          </DialogContentText>
          <form>
            <TextField autoFocus onFocus={this.moveCaretToEnd} variant="outlined" name='content' style ={{width: '100%'}} rows={4} multiline={true} label='content' value={content} onChange={this.handleEditFormChange.bind(this)} margin='normal'/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseEditReview.bind(this)} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleEditReview.bind(this)} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCheckList} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Assign an employee to participate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Assign an employee to participate
          </DialogContentText>
          <List dense className='list'>
            {this.renderEmployeeList()}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose.bind(this)} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClose.bind(this)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  }
}

export default withStyles(styles, { withTheme: true })(EditEmployeeForm);