import React, { useState } from 'react'
import {
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink
} from 'reactstrap'
import web3 from './web3';

const textStyle = {
    color: 'black',
    textDecoration: 'none'
};

function NavigationBar() {
    const [currentAccount, setCurrentAccount] = useState(["0x"])

    React.useEffect(() => {
        web3.eth.getAccounts().then( (accounts) => {
            setCurrentAccount([accounts[0]])
        });
    }, []);

    return (
        <div >
            <Navbar color="light" light expand="md" >
                <NavbarBrand href="/">
                    <label>EduBlocks</label>
                </NavbarBrand>

                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink align="right" style={textStyle} href="/">Metamask Account</NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink align="right" style={textStyle} href="/nft">NFT </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink align="right" style={textStyle} href="/token">Token </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink align="right" style={textStyle} href="/record">Record </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink align="right" style={textStyle} href="/mainPage">Let's do this</NavLink>
                    </NavItem>
                </Nav>
                
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink align="left" style={textStyle} >Account: {currentAccount}</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    );
}

export default NavigationBar
