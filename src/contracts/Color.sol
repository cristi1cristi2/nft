pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Color is ERC721Enumerable {

    string[] public colors;

    mapping(string => bool) _colorExists;

    constructor() ERC721("Color", "COLOR") public{

    }

    function mint(string memory _color) public {
        //require unique color
        //color - add it
        //call the mint functon
        //color - track it
        require(!_colorExists[_color]);
        colors.push(_color);
         uint _id  = colors.length -1;
        _mint(msg.sender, _id);
        _colorExists[_color] = true;

    }
}