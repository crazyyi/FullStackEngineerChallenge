import React from 'react';
import DisplayPanel from './components/DisplayPanel';
import EditEmployeeForm from './components/EditEmployeeForm';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import EmployeeSelectView from './components/EmployeeSelectView';
import EmployeeReviewList from './components/EmployeeReviewList';
import AddEmployeeForm from './components/AddEmployeeForm';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  link: {
    textDecoration: 'none'
  }
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
    <div className="App">
       <h1 id='title'>Performance Review</h1>
        <div className='menu'>
          <Link to='/' className={classes.link}>
            <Button color='primary' className={classes.margin}>
              Admin
            </Button>
          </Link>
          <Link to='/employeeView' className={classes.link}>
            <Button color='primary' className={classes.margin}>
              Employee
            </Button>
          </Link>
        </div>
      <div className="App-body">
        <Route exact path='/' component={DisplayPanel} />
        <Route path='/employeeView' component={EmployeeSelectView} />
        <Route path='/employees/:id' render={ props => {
            const id = props.match.params.id;
            return <EditEmployeeForm {...props} employeeId={id} />
            }
          }/>
        <Route path='/employeeView/employees/:id' component={EmployeeReviewList} />
      </div>
    </div>
    <Route path='/addEmployee' component={AddEmployeeForm}/>
    </BrowserRouter>
  );
}

export default App;
