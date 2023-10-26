import { expect } from 'chai';
import { ethers } from 'hardhat';
import { RentalAgreement } from '../typechain';

describe('RentalAgreement', function () {
    let rentalAgreement: RentalAgreement;
    let owner: any, tenant: any, propertyOwner: any;


    before(async () => {
        const [deployer, tenantSigner, propertyOwnerSigner] = await ethers.getSigners();
        owner = deployer;
        tenant = tenantSigner;
        propertyOwner = propertyOwnerSigner;

        const RentalAgreementFactory = await ethers.getContractFactory('RentalAgreement');
        rentalAgreement = (await RentalAgreementFactory.connect(owner).deploy()) as RentalAgreement;
    });

    it('should add a tenant and verify tenant details', async function () {
        const tenantAddress = tenant.address;
        const firstName = 'John';
        const lastName = 'Doe';

        await rentalAgreement.connect(owner).addTenant(tenantAddress, firstName, lastName);
        const addedTenant = await rentalAgreement.tenants(tenantAddress);

        expect(addedTenant.walletAddress).to.equal(tenantAddress);
        expect(addedTenant.firstName).to.equal(firstName);
        expect(addedTenant.lastName).to.equal(lastName);
        expect(addedTenant.blacklisted).to.be.false;
    });
    it('should add a property owner and verify property owner details', async function () {
        const propertyType = 'Apartment';

        await rentalAgreement.connect(propertyOwner).addProperty(propertyType);
        const addedPropertyOwner = await rentalAgreement.propertyOwners(propertyOwner.address);

        expect(addedPropertyOwner.owner).to.equal(propertyOwner.address);
        expect(addedPropertyOwner.propertyType).to.equal(propertyType);
        expect(addedPropertyOwner.blacklisted).to.be.false;
        expect(addedPropertyOwner.active).to.be.true;
    });



    it('should start an agreement and verify agreement details', async function () {
        const rentStart = Math.floor(Date.now() / 1000); // current time in seconds
        const rentEnd = rentStart + 60 * 60 * 24 * 30; // 30 days later

        await rentalAgreement.connect(owner).startAgreement(tenant.address, propertyOwner.address, rentStart, rentEnd);
        const agreement = await rentalAgreement.agreements(0);

        expect(agreement.tenant.walletAddress).to.equal(tenant.address);
        expect(agreement.property.owner).to.equal(propertyOwner.address);
        expect(agreement.rentStartDate).to.equal(rentStart);
        expect(agreement.rentEndDate).to.equal(rentEnd);
        expect(agreement.active).to.be.true;
    });

    it('should add a tenant to the blacklist and verify blacklist status', async function () {
        await rentalAgreement.connect(owner).addTenantToBlacklist(tenant.address);
        const addedTenant = await rentalAgreement.tenants(tenant.address);

        expect(addedTenant.blacklisted).to.be.true;
    });

    it('should add a property owner to the blacklist and verify blacklist status', async function () {
        await rentalAgreement.connect(owner).addPropertyOwnerToBlacklist(propertyOwner.address);
        const addedPropertyOwner = await rentalAgreement.propertyOwners(propertyOwner.address);

        expect(addedPropertyOwner.blacklisted).to.be.true;
    });

    it('should end an agreement and verify agreement is not active', async function () {
        await rentalAgreement.connect(tenant).endAgreement(0);
        const agreement = await rentalAgreement.agreements(0);

        expect(agreement.active).to.be.false;
    });
});
