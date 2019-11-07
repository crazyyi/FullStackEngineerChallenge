import React, { Fragment } from 'react';
import { Button, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import './table.css';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
  dialogTitle: {
    backgroundColor: '#75c5eb',
  }
});

const PERFORMANCE_REVIEW_URL = 'http://localhost:3001/nofeedbackreviews';

class EmployeeReviewList extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      hoverOnId: 0,
      reviews: null,
      selectedReview: null,
      form: {
        feedback: null
      }
    };
  }

  componentDidMount() {
    this._isMounted = true;
    fetch(PERFORMANCE_REVIEW_URL + '/' + this.props.location.state.employeeId)
    .then(res => res.json())
    .then(data => {
      this.setState(pre => ({
        reviews: data
      }));
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(preProps, preState) {
    if (preProps.location.state.employeeId !== this.props.location.state.employeeId) {
      this._isMounted = true;
      fetch(PERFORMANCE_REVIEW_URL + '/' + this.props.location.state.employeeId)
      .then(res => res.json())
      .then(data => {
        this.setState(pre => ({
          reviews: data
        }));
      });
    }
    
  }

  toggleHover(e, id) {
    this.setState({ hoverOnId: id });
  }

  toggleLeave() {
    this.setState({ hoverOnId: 0 });
  }

  addFeedback(data) { 
    this.setState({
      selectedReview: data.id,
      open: !this.state.open,
      content: data.content
    });
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  handleChange(e) {
    let change = {};
    change[e.target.name] = e.target.value;
    console.log('change = ', change)
    this.setState((pre) => ({
      form: change
    }));
  }

  submit() {
    fetch('http://localhost:3001/employees/' + this.props.location.state.employeeId + '/performanceReviews/' + this.state.selectedReview, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
          ...this.state.form, 
          reviewee: this.props.location.state.employeeId,
          reviewer: '001',
          content: this.state.content
          })
    })
    .then(res => res.json())
    .then(data => {
      this.handleClose();
    })
  }

  renderReviews() {
    const { classes } = this.props;
    const { reviews } = this.state;

    return !reviews ? null : reviews.map((review, i) => {
      const { _id, content, reviewer, feedback } = review;
      return <tr key={_id}
                className={this.state.hoverOnId === _id ? "hover" : "normal"} 
                onMouseEnter={(e) => this.toggleHover(e, _id)} 
                onMouseLeave={this.toggleLeave.bind(this)}>
        <td>{i + 1}</td>
        <td>{content}</td>
        <td>{reviewer}</td>
        <td> {feedback ? feedback :
          <Button variant="contained" className={classes.button} onClick={this.addFeedback.bind(this, {id: _id, content})} >
            Submit Feedback
          </Button>}
        </td>
      </tr>
    })
  }

  render() {
    const { open, reviews } = this.state;
    const { classes } = this.props;

    const errorMessage = 'No reviews can be found!';

    return <Fragment>
      <div>
        {reviews ? 
        (<table className='App-table' id='employee-review-list'>
          <thead>
            <tr>
              <td>ID</td>
              <td>Review content</td>
              <td>Reviewer</td>
              <td>Feedback</td>
            </tr>
          </thead>
          <tbody>
            {this.renderReviews()}
          </tbody>
        </table>) : <div>{errorMessage}</div>}
      </div>
      <Dialog
        open={open}
        className='feedbackBox'
        onClose={this.handleClose.bind(this)}>
          <DialogTitle id='form-dialog-title' className={classes.dialogTitle}>Composing Feedback</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add a feedback here:
            </DialogContentText>
            <form>
              <TextField autoFocus variant="outlined" name='feedback' style ={{width: '100%'}} rows={4} multiline={true} label='feedback' defaultValue='' onChange={this.handleChange.bind(this)} margin='normal'/>
            </form>
          </DialogContent>
          <DialogActions>
            <Button color="primary" variant='outlined' onClick={this.handleClose.bind(this)}>
              Cancel
            </Button>
            <Button color='primary' variant='outlined' onClick={this.submit.bind(this)}>
              Submit
            </Button>
          </DialogActions>      
        </Dialog>
    </Fragment>
  }
}

export default withStyles(styles, { withTheme: true })(EmployeeReviewList);