import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import HeaderTab from "./headerTab"
import SubmitFile from "./submitFile";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Spinner } from "reactstrap";
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getContract, getCurrAccount } from './contract';

function AssignmentPage() {
  const [contract, setContract] = useState(null)
  const [currentAcc, setCurrentAcc] = useState("")
  const [record, setRecord] = React.useState(null)
  const [grade, setGrade] = React.useState(0)
  const [teacher, setTeacher] = React.useState(false)
  const [assigUi, setAssigUi] = React.useState({ graded: "", submitted: "" })
  const { student, subject } = useParams();

  useEffect(() => {
    getContract().then(c => {
      setContract(c);
    })
    getCurrAccount().then(acc => {
      setCurrentAcc(acc);
    })
  }, []);

  useEffect(() => {
    if (contract !== null) {
      getRecord(student, subject)
      isTeacher(setTeacher);
    }
  }, [contract]);

  useEffect(() => {
    if (record !== null) {
      let ui = { graded: "", submitted: "" };
      if (record.graded && record.grade.toNumber() >= 5)
        ui.graded = "success";
      else if (record.graded && record.grade.toNumber() < 5)
        ui.graded = "danger";
      if (record.submitted) {
        ui.submitted = "success";
      }
      else
        ui.submitted = ""
      setAssigUi(ui);
    }
  }, [record]);

  const getRecord = (student, subject) => {
    contract.methods.getRecordOfStudent(subject, student).call({ from: currentAcc }).then((receipt) => {
      setRecord(receipt);
    })
  }

  const removeSubmission = () => {
    contract.methods.removeSubmission(currentAcc, record.subject).send({ from: currentAcc }).then((receipt) => {
      return receipt;
    })
  }

  const gradeSubmission = (grade) => {
    contract.methods.gradeSchoolRecord(record.subject, record.student, grade).send({ from: currentAcc }).then((receipt) => {
      return receipt;
    })
  }

  const isTeacher = () => {
    contract.methods.isTeacher.call({ from: currentAcc }).then((res) => {
      setTeacher(res);
    })
  }

  const isLate = () => {
    var d1 = Date.now();
    if(d1>record.submitDeadline.toNumber()){
      return "danger";
    }
    else{
      return "success";
    }
  }
  if (record == null) {
    return (
      <div class="text-center">
        <div class="spinner-border" role="status">
        </div>
      </div>);
  }
  else {
    var dateObj = new Date(parseInt(record.submitDeadline.toNumber()));
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    return (
      <div>
        <HeaderTab />
        <h3>hello assig page!</h3>

        <div style={{ padding: '200px' }}>
          <ListGroup >
            <ListGroup.Item action><strong>{record.subject}</strong></ListGroup.Item>
            <ListGroup.Item action variant="secondary">Description of assignment</ListGroup.Item>
            <ListGroup.Item action>Assigned by: {record.professor}</ListGroup.Item>
            <ListGroup.Item action variant="secondary">Assignee: {record.student}</ListGroup.Item>
            <ListGroup horizontal>
              <ListGroup.Item action variant={isLate()}><strong>Due Date</strong></ListGroup.Item>
              <ListGroup.Item action variant={isLate()}>{day + "/" + month + "/" + year}</ListGroup.Item>
            </ListGroup>
            <ListGroup horizontal>
              <ListGroup.Item action variant={assigUi.submitted}><strong>Submission status</strong></ListGroup.Item>
              {!record.submitted && (<ListGroup.Item action variant={assigUi.submitted}>No attempt</ListGroup.Item>)}
              {record.submitted && (<ListGroup.Item action variant={assigUi.submitted}>Submitted for grading</ListGroup.Item>)}
            </ListGroup>

            <ListGroup horizontal>
              <ListGroup.Item action variant="secondary"><strong>Submissions</strong></ListGroup.Item>
              <ListGroup.Item action variant="secondary"><a href={"https://" + record.resourceIPFS + ".ipfs.dweb.link"} target="_blank"> {record.resourceIPFS}</a></ListGroup.Item>
            </ListGroup>

            <ListGroup horizontal>
              <ListGroup.Item action variant={assigUi.graded}><strong>Grading status</strong></ListGroup.Item>
              {!record.graded && (<ListGroup.Item action variant={assigUi.graded}>Not yet graded</ListGroup.Item>)}
              {record.graded && (<ListGroup.Item action variant={assigUi.graded}>Graded</ListGroup.Item>)}
            </ListGroup>

            <ListGroup horizontal>
              <ListGroup.Item action variant="secondary"><strong>grade</strong></ListGroup.Item>
              {!record.graded && (<ListGroup.Item action variant={assigUi.graded}></ListGroup.Item>)}
              {record.graded && (<ListGroup.Item action variant={assigUi.graded}>{record.grade.toNumber()}</ListGroup.Item>)}
            </ListGroup>
          </ListGroup>

          {!teacher && (<Button disabled={!record.submitted} onClick={() => removeSubmission()}>Remove submission</Button>)}
          {!teacher && !record.submitted && (<SubmitFile subject={record.subject} />)}
          {teacher && (<Form>
            <Row>
              <Col>
                <Form.Control placeholder="Grade / 10" onChange={e => setGrade(e.target.value)} />
              </Col>
              <Col>
                <Button disabled={!record.submitted} onClick={() => gradeSubmission(grade)}>Grade this submission</Button>
              </Col>
            </Row>
          </Form>)}
        </div>
      </div>
    );
  }
}

export default AssignmentPage