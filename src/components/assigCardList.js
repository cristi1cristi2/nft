import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AssigCard from "./assigCard";
import { getContract, getCurrAccount } from './contract';
import  Accordion  from "react-bootstrap/Accordion";

function AssigCardList(props) {
    const [record, setRecord] = React.useState([])
    const [contract, setContract] = useState(null)
    const [currentAcc, setCurrentAcc] = useState("")
    const [isTeacher, setIsTeacher] = useState(false)

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
            getRecords(setRecord)
        }
    }, [contract]);

    const getRecords = (setRecord) => {
        contract.methods.isTeacher().call({from: currentAcc}).then((isTeacher)=>{
            setIsTeacher(isTeacher);
            if(isTeacher == true){
        contract.methods.getAllRecordsOfTeacher(currentAcc).call({ from: currentAcc }).then((receipt) => {
            setRecord(receipt);
            return receipt;
        })}
        if(isTeacher == false){
            contract.methods.getAllRecordsOfStudent(currentAcc).call({ from: currentAcc }).then((receipt) => {
                setRecord(receipt);
                return receipt;
            })}
    })
    }
    return(
        <div>
        <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
    <Accordion.Header>Submitted</Accordion.Header>
    <Accordion.Body>
                <Row md={2}>
                    {record.map((r) => (
                        <Col>
                            {r.submitted && !r.graded && (<AssigCard
                                record={r}
                                student={isTeacher} />)}
                        </Col>
                    ))}
                </Row>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Header>Graded</Accordion.Header>
    <Accordion.Body>
    <Row md={2}>
                    {record.map((r) => (
                        <Col>
                            {r.graded && (<AssigCard
                                record={r}
                                student={isTeacher} />)}
                        </Col>
                    ))}
                </Row>
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
    <Accordion.Header>All</Accordion.Header>
    <Accordion.Body>
    <div>
                <Row  md={2}>
                    {record.map((r) => (
                        <Col id="colStudent">
                            {<AssigCard
                                record={r}
                                student={isTeacher} />}
                        </Col>
                    ))}
                </Row>
            </div>
    </Accordion.Body>
  </Accordion.Item>
</Accordion>
</div>
    );
}

export default AssigCardList