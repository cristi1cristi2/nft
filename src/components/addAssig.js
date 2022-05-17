import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class AddAssig extends Component {
  state = {
    subject: "",
    student: "",
    credits: 0,
    mandatory: false,
    time:new Date()
  }

  onSubmit = () => {
    this.props.assign(this.state);
  };


  render() {
    return (
      <div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Subject</Form.Label>
            <Form.Control type="text" placeholder="enter subject" onChange={e => this.setState({ subject: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Student</Form.Label>
            <Form.Control type="text" placeholder="address" onChange={e => this.setState({ student: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Due Date</Form.Label>
            <DatePicker selected={this.state.time} onChange={date => this.setState({time: date})}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>credits</Form.Label>
            <Form.Control type="text" placeholder="e.g. 2" onChange={e => this.setState({ credits: parseInt(e.target.value) })} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Mandatory submit?" onChange={e => this.setState({ mandatory: e.target.checked })} />
          </Form.Group>

          <Button variant="primary" onClick={this.onSubmit}>Submit</Button>
        </Form>
      </div>
    );
  }
}