import React, { useState } from "react";
import web3 from './web3';
import EduChain from '../abis/EduChain.json';
import { makeStyles } from '@material-ui/core/styles';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Badge } from "reactstrap";

function HeaderTab() {
  const [details, setDetails] = useState({ transactionHash: "", address: "", contractName: "" })

  const getContractData = () => {

    web3.eth.net.getId().then((id) => {
      const networkData = EduChain.networks[id];
      if (networkData) {
        const address = networkData.address;
        setDetails({ transactionHash: networkData.transactionHash, address: address, contractName: EduChain.contractName });
      }
      else {
        alert("contract not found, probably not deployed!");
      }
    })
  }

  React.useEffect(() => {
    getContractData();
  }, []);

  return (
    <div>

      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="contract" title="Contract">
          <h3>Contract deployed at address: {details.address}</h3>
          <h3>Transaction hash: {details.transactionHash}</h3>
        </Tab>
        <Tab eventKey="profile" title="Profile">
          Teacher account: Yes
          account:
          CristiToken:
        </Tab>
        <Tab eventKey="info" title="Info" >
          <p>Data coming from Blockchain will have an orange badge next to it. <Badge color="warning">Blockchain</Badge></p>
          <p>Data coming from Spring Boot server will have a green badge next to it <Badge color="success">Server</Badge></p>
          <p>After every transaction, you will have the option to see blockchaion related data such as transaction hash, gas used, or block number where the transaction is</p>
        </Tab>
      </Tabs>
    </div>
  );
}

export default HeaderTab