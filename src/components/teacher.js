import React, { useState, useEffect } from "react";
import web3 from './web3';
import HeaderTab from "./headerTab"
import AddAssig from "./addAssig";
import ChainDataModal from "./chainDataModal";
import { getContract, getCurrAccount } from './contract';
import AssigCardList from "./assigCardList";
import { Container, Col, Row } from "react-bootstrap";
function Teacher() {
  const [modalShow, setModalShow] = React.useState(false);
  const [txData, setTxData] = React.useState({});
  const [contract, setContract] = useState(null)
  const [currentAcc, setCurrentAcc] = useState("")

  useEffect(() => {
    getContract().then(c => {
      setContract(c);
    })
    getCurrAccount().then(acc => {
      setCurrentAcc(acc);
    })
  }, []);

  const addRecord = (data) => {
    contract.methods.addSchoolRecord(data.subject, data.student, data.mandatory, data.credits, data.time.getTime()).send({ from: currentAcc }).on('transactionHash', function (hash) {
      web3.eth.getTransactionReceipt(hash).then((res) => {
        setTxData(res);
        setModalShow(true);
      })
    })
  }

  return (
    <Container fluid>
      <Row md={2}>
        <Col>
        <h3>Hello Teacher!</h3>
        <HeaderTab />
        <AddAssig
          assign={(data) => addRecord(data)} />
          </Col>
          <Col>
        <h3>Assignments:</h3>
        <AssigCardList></AssigCardList>
        </Col>
      </Row>
      <div>
        <ChainDataModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          txData={txData}
        />
      </div>
    </Container>
  );
}

export default Teacher