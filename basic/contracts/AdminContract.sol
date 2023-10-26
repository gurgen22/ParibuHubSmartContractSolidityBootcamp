// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdminContract {
    struct Account {
        address adminAddress;
        string adminName;
    }

    Account[] public admins;

    function addAdmin(address _adminAddress, string memory _adminName) public {
        Account memory newAdmin = Account({
            adminAddress: _adminAddress,
            adminName: _adminName
        });
        admins.push(newAdmin);
    }

    function getAllAdmins() public view returns (Account[] memory) {
        return admins;
    }
}
