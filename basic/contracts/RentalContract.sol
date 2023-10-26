// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalAgreement {
    struct Tenant {
        address walletAddress;
        string firstName;
        string lastName;
        bool blacklisted;
    }

    struct Ownership {
        address owner;
        string propertyType;
        bool blacklisted;
        bool active;
    }

    struct Agreement {
        Tenant tenant;
        Ownership property;
        uint rentStartDate;
        uint rentEndDate;
        bool active;
    }

    Agreement[] public agreements;
    mapping(address => Tenant) public tenants;
    mapping(address => Ownership) public propertyOwners;

    function addTenant(
        address walletAddress,
        string memory firstName,
        string memory lastName
    ) public {
        Tenant storage tenant = tenants[msg.sender];
        tenant.walletAddress = walletAddress;
        tenant.firstName = firstName;
        tenant.lastName = lastName;
        tenant.blacklisted = false;
    }

    function addProperty(string memory propertyType) public {
        Ownership storage property = propertyOwners[msg.sender];
        property.owner = msg.sender;
        property.propertyType = propertyType;
        property.blacklisted = false;
        property.active = true;
    }

    function startAgreement(
        address tenantAddress,
        address propertyOwnerAddress,
        uint rentStart,
        uint rentEnd
    ) public {
        require(
            rentStart < rentEnd,
            "Rent start date must be before the rent end date."
        );

        Tenant storage tenant = tenants[tenantAddress];
        Ownership storage property = propertyOwners[propertyOwnerAddress];
        require(
            !tenant.blacklisted && !property.blacklisted,
            "Tenant or property owner is blacklisted."
        );

        Agreement memory newAgreement = Agreement({
            tenant: tenant,
            property: property,
            rentStartDate: rentStart,
            rentEndDate: rentEnd,
            active: true
        });
        agreements.push(newAgreement);
    }

    function addTenantToBlacklist(address tenantAddress) public {
        require(msg.sender != tenantAddress, "You cannot blacklist yourself.");
        Tenant storage tenant = tenants[tenantAddress];
        tenant.blacklisted = true;
    }

    function addPropertyOwnerToBlacklist(address propertyOwnerAddress) public {
        require(
            msg.sender != propertyOwnerAddress,
            "You cannot blacklist yourself."
        );
        Ownership storage property = propertyOwners[propertyOwnerAddress];
        property.blacklisted = true;
    }

    function endAgreement(uint agreementIndex) public {
        require(agreementIndex < agreements.length, "Invalid agreement index.");
        Agreement storage agreement = agreements[agreementIndex];
        require(
            msg.sender == agreement.tenant.walletAddress ||
                msg.sender == agreement.property.owner,
            "Only tenant or property owner can end the agreement."
        );
        agreement.active = false;
    }
}
