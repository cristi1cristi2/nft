import React, { useState, useEffect } from "react";
import storageClient from "./storageClient";
import Button from "react-bootstrap/Button";
import { getContract, getCurrAccount } from './contract';
import ChainDataModal from "./chainDataModal";
import web3 from './web3';
import { Spinner } from "reactstrap";

function SubmitFile(props) {
  const [contract, setContract] = useState(null)
  const [currentAcc, setCurrentAcc] = useState("")
  const [uploadStatus, setUploadStatus] = useState(false)
  const [modalShow, setModalShow] = React.useState(false);
  const [txData, setTxData] = React.useState({});

  useEffect(() => {
    getContract().then(c => {
      setContract(c);
    })
    getCurrAccount().then(acc => {
      setCurrentAcc(acc);
    })
  }, []);

  const submitAssig = (cid, subject) => {
    const resourceURL = cid;
    contract.methods.submitSchoolRecord(currentAcc, subject, resourceURL).send({ from: currentAcc }).on('transactionHash', function (hash) {
      web3.eth.getTransactionReceipt(hash).then((res) => {
        setTxData(res);
        setModalShow(true);
      })
    })
  }

  const uploadFiles = (name) => {
    const fileInput = document.querySelector(`input[name=${name}]`)
    setUploadStatus(true)
    storageClient.put(fileInput.files).then((cid) => {
      setUploadStatus(false)
      submitAssig(cid, name);
    })
  }

  return (
    <div>
      <input type="file" name={props.subject} />
      {!uploadStatus && (<Button onClick={() => uploadFiles(props.subject)} >Submit</Button>)}
      {uploadStatus && (<button class="btn btn-primary" type="button" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...
      </button>)}
      <p>{uploadStatus}</p>
      <div>
        <ChainDataModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          txData={txData}
        />
      </div>
    </div>
  );
}

export default SubmitFile