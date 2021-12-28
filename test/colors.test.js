const { assert } = require('chai')

const Color = artifacts.require('./Color.sol')
require('chai')
        .use(require('chai-as-promised'))
        .should()

contract('Color', (accounts) => {
    let contract

    before(async () =>{
        contract = await Color.deployed()
    })
    describe('deployment', async () => {
        it('deploys succesfully', async () => {
            contract = await Color.deployed()
            const address = contract.address
            console.log(address)
            assert.notEqual(address, 0x0)
            assert.notEqual(address, null)  
            assert.notEqual(address, '')
            assert.notEqual(address, undefined)
        })
        it('has a name', async () =>{
            const name = await contract.name()
            assert.equal(name, 'Color')
        })
        it('has a symbol', async () =>{
            const symbol = await contract.symbol()
            assert.equal(symbol, 'COLOR')
        })
    })
    describe('minting', async () => {
        it('creates a new token', async () =>{
            const result = await contract.mint('#EBBB00')
            const totalSupply = await contract.totalSupply()
            const event = result.logs[0].args
            assert.equal(totalSupply, 1)
            assert.equal(event.tokenId.toNumber(),1,'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'form is correct')
            assert.equal(event.to, accounts[0], 'to is correct')

            await contract.mint('#EBBB00').should.be.rejected;
        })
    })
    describe('indexing', async () => {
        it('lists colors', async () =>{
            
            await contract.mint('#EBBB01')
            await contract.mint('#EBBB02')
            const totalSupply = await contract.totalSupply()
            let color
            let result = []
            for(var i = 1; i<= totalSupply; i++){
                color = await contract.colors(i-1)
                result.push(color)
            }
            let expected = ['#EBBB00','#EBBB01','#EBBB02']
            assert.equal(result.join(','),expected.join(','))
        })
    })
})
