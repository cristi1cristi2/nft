import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './chainDataModel.css';
import { Badge } from "reactstrap";

function ChainDataModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Data written on Blockchain!<Badge color="warning">Blockchain</Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Block hash: {props.txData.blockHash}</p>
        <p>Block number: {props.txData.blockNumber}</p>
        <p>Gas used: {props.txData.gasUsed} wei</p>
        <p>Transaction hash: {props.txData.transactionHash}</p>
        <p>Transaction index: {props.txData.transactionIndex}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ChainDataModal