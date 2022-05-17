import React, { useState } from "react";
import axiosInstance from "./axios";
import web3 from './web3';
import EduChain from '../abis/EduChain.json';
import { makeStyles } from '@material-ui/core/styles';
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import SubmitFile from "./assigCard";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const getRecords = (setRecord, contract) => {
  web3.eth.getAccounts().then((accounts) => {
    const curAcc = accounts[0];
    if (contract != null) {
      contract.methods.getAllRecordsOfStudent(curAcc).call({ from: curAcc }).then((receipt) => {
        //console.log(transact);
        console.log(receipt);
        setRecord(receipt);
        return receipt;
      })
    }
  })
}

const addTeacher = (contract) => {
  web3.eth.getAccounts().then((accounts) => {
    const curAcc = accounts[0];
    if (contract != null) {
      contract.methods.addTeacher(curAcc).send({ from: curAcc }).then((receipt) => {
        //console.log(transact);
        console.log(receipt);
        return receipt;
      })
    }
  })
}

const submitAssignment = (cid, contract) => {

}

const addRecord = (contract) => {
  web3.eth.getAccounts().then((accounts) => {
    const curAcc = accounts[0];
    if (contract != null) {
      const transaction = contract.methods.addSchoolRecord("mate", curAcc, curAcc, true, 2,).on('transactionHash', function (hash) {
        console.log(hash);
      })
    }
  })
}

function Record() {
  const [theData, setTheData] = useState([])
  const [theUser, setTheUser] = useState({ name: "", address: "x0" })
  const [contract, setContract] = useState(null)
  const [details, setDetails] = useState({ transactionHash: "", address: "", contractName: "" })


  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const getContract = () => {

    web3.eth.net.getId().then((id) => {
      const networkData = EduChain.networks[id];
      if (networkData) {
        const address = networkData.address;
        const abi = EduChain.abi;
        const c = new web3.eth.Contract(abi, address)
        setContract(c);
        setDetails({ transactionHash: networkData.transactionHash, address: address, contractName: EduChain.contractName });
      }
      else {
        alert("contract not found, probably not deployed!");
      }
    })
  }

  const [record, setRecord] = React.useState([])
  console.log(record)
  const getData = () => {
    axiosInstance
      .get("/student")
    .then((res) => {
      setTheData(res.data)
    });
  }

  React.useEffect(() => {
    getData();
    getContract();
  }, []);

  return (
    <div style={{ padding: '50px' }}>
      <h3>Contract deployed at address: {details.address}</h3>
      <h3>Transaction hash: {details.transactionHash}</h3>
      <Button onClick={() => getRecords(setRecord, contract)}>get my records</Button>
      <Button onClick={() => addRecord(contract)}>add a record</Button>
      <Button onClick={() => addTeacher(contract)}>make me a teacher</Button>

      <ListGroup as="ol" numbered>
        {record.map((r) => (
          <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">{r.student}</div>
              {r.professor}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Row  md={4}>
        {record.map((r) => (
          <Col>
          <SubmitFile
          record = {r}/>
          </Col>
        ))}
      </Row>
      <SubmitFile/>
    </div>
  );
}

export default Record