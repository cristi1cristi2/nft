import React from "react";
import Card from 'react-bootstrap/Card'

function AssigCard(props) {

  const redirect = (student, subject) => {
    window.location.href = `/assigPage/${student}/${subject}`
  }
  
  var dateObj = new Date(parseInt(props.record.submitDeadline.toNumber()));
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  
  if (props.record !== undefined) {
    return (
      <Card border="warning" >
        <Card.Body>
          <Card.Title onClick={() => redirect(props.record.student, props.record.subject)}>{props.record.subject}</Card.Title>
          <Card.Text>
          assigned by: {props.record.professor}
          </Card.Text>
          <Card.Text>
          asignee: {props.record.student}
          </Card.Text>
          <Card.Text>
          Due Date: {day + "/" + month + "/" + year}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>

    );
  }
  else
    return null;
}

export default AssigCard