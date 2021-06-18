import React from 'react';
import { StaticRouter as Router } from 'react-router-dom';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';
import { get } from 'lodash';

import { mountWithContext } from '../../../tests/helpers';

import LicenseCardInteractor from './interactor';
import LicenseCard from '../LicenseCard';

const licensecard = new LicenseCardInteractor();

const license = {
  name: 'Test License 001',
  type: {
    id: '4028808d6a2cf32b016a2cf3f17f000d',
    label: 'Local',
    value: 'local'
  },
  status: {
    id: '4028808d6a2cf32b016a2cf3f1bf0014',
    label: 'Active',
    value: 'active'
  },
  startDate: '2019-01-01T05:00:00Z',
  openEnded: true,
  orgs: [
    {
      org: {
        id: '4028808d6a2cf32b016a35ae37660043',
        name: 'Some Content Provider',
        reference: 'Some CP',
        vendorsUuid: '1234-5678-9102-3355',
      },
      primaryOrg: true,
      roles: [{
        role: {
          id: '4028808d6a2cf32b016a2cf3f10a0002',
          label: 'Licensor',
          value: 'licensor',
        }
      }]
    }
  ]
};

describe('LicenseCard', () => {
  describe('basic rendering with no data', () => {
    beforeEach(async () => {
      await mountWithContext(
        <LicenseCard license={{}} renderName />
      );
    });

    it('renders without crashing', () => {
      expect(true).to.be.true;
    });
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Router context={{}}>
          <LicenseCard license={license} renderName />
        </Router>
      );
    });

    it('renders the license card Name', () => {
      expect(licensecard.isLicenseCardNamePresent).to.be.true;
    });

    it('sets name to license card Name', () => {
      expect(licensecard.licenseCardName).to.equal(license.name);
    });

    it('renders the license card type', () => {
      expect(licensecard.isLicenseCardTypePresent).to.be.true;
    });

    it('sets type to license card type', () => {
      expect(licensecard.licenseCardType).to.equal(get(license, ['type', 'label'], '-'));
    });

    it('renders the license card status', () => {
      expect(licensecard.isLicenseCardStatusPresent).to.be.true;
    });

    it('sets status to license card status', () => {
      expect(licensecard.licenseCardStatus).to.equal(get(license, ['status', 'label'], '-'));
    });

    it('renders the license card start date', () => {
      expect(licensecard.isStartDatePresent).to.be.true;
    });

    it('sets startDate to license card startDate', () => {
      expect(licensecard.licenseCardStartDate).to.equal('1/1/2019');
    });

    it('renders the license card endDate', () => {
      expect(licensecard.isEndDatePresent).to.be.true;
    });

    it('sets endDate to openEnded', () => {
      expect(licensecard.licenseCardEndDate).to.equal('Open ended');
    });

    it('renders the primaryOrg', () => {
      expect(licensecard.isPrimaryOrgPresent).to.be.true;
    });

    it('sets primary org to license card primary org', () => {
      const { orgs = [] } = license;
      const primaryOrg = orgs.find(o => o.primaryOrg === true);
      const primaryOrgName = get(primaryOrg, 'org.name');
      expect(licensecard.primaryOrg).to.equal(primaryOrgName);
    });
  });
});
