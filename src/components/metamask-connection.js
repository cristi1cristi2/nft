import React, { useState } from "react";
import { Row, Col, Label, Button } from "reactstrap";

function MetamaskConnection() {
    const [currentAccount, setCurrentAccount] = useState(["0x"])

    const connectToMetamask = async () => {
        const ethereum = window.ethereum;
        if (!ethereum) {
            alert("Metamask is not installed in your browser!");
        }
        else {
            await ethereum.request({
                method: 'eth_requestAccounts',
            }).then(handleCurrentAccount)
            ethereum.on('accountsChanged', handleCurrentAccount)
        }
    };

    const handleCurrentAccount = (accounts) => {
        setCurrentAccount([accounts[0]])
    };

    return (
        <div style={{ padding: '50px' }}>
            <Row>
                <Col sm={{ size: '3', offset: 1 }} >
                    <Button color="primary" onClick={connectToMetamask}>Connect to Metamask</Button>
                </Col>
                <Col> <Label>Your account: {currentAccount}</Label></Col>
            </Row>
        </div>
    );
}

export default MetamaskConnection;
