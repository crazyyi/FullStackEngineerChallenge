import React, {Fragment} from 'react';

const EMPLOYEE_URL = 'http://localhost:3001/employees';

export default class EmployeeSelectView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: null,
      selectedValue: '',
    }
  }
  
  componentDidMount() {
    fetch(EMPLOYEE_URL)
      .then(res => res.json())
      .then((data) => {
        this.setState({
          employees: data
        });
      });
  }

  handleChange(e) {
    this.props.history.push({
      pathname: `/employeeView/employees/${e.target.value}`, 
      state:{
        employeeId: e.target.value
      }
    });
  }

  renderEmployees() {
    const { employees } = this.state;

    return !employees ? '' : employees.map((employee, i) => {
      const { _id, name } = employee;
      return <option key={_id} value={_id}>
              {name}
              </option>
            
    });
  }

  render() {
    return <Fragment>
              <div className='box'>
                <select onChange={this.handleChange.bind(this)} defaultValue=''>
                  {this.renderEmployees()}
                </select>
              </div>
              <div className='infoBox'>Only display reviews that requires a feedback</div>
            </Fragment>
  }
}