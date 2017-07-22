pragma solidity ^0.4.4;

contract W3Certs {
    address public certificateAuthority;
    string public certificateAuthorityName;
    mapping (bytes32 => bytes32) certificate; //sha3(register-number) => sha3(other info)
    
    event Issued(bytes32 key);

    function W3Certs(string _certificateAuthorityName) {
        certificateAuthority = msg.sender;
        certificateAuthorityName = _certificateAuthorityName;
    }
    //transactional functions
    function issue(bytes32 _regNo, bytes32 _name, uint _percentile) external {
        require(msg.sender == certificateAuthority); //check authority
        require(certificate[sha3(_regNo)] == 0 ); //check if already exists
        bytes32 key = sha3(_regNo);
        certificate[ key ] = sha3(_regNo, _name, _percentile); //storage
        Issued(key); //fire issued event
    }
    //constant functions
    function verify(bytes32 _regNo, bytes32 _name, uint _percentile) constant returns (bool) {
        if( certificate[sha3(_regNo)] == sha3(_regNo, _name, _percentile) ) {
            return true;
        }       
        return false;
    }
}