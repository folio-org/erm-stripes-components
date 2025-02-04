import { MemoryRouter } from 'react-router-dom';

import { waitFor, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Button, TestForm, Dropdown } from '@folio/stripes-erm-testing';

import { translationsProperties } from '../../test/jest/helpers';
import DocumentFilterArray from './DocumentFilterArray';

const translatedContentOptions = [
  {
    'value': 'alternateNames',
    'label': 'Alternative names'
  },
  {
    'value': 'agreementContentTypes',
    'label': 'Content types'
  },
  {
    'value': 'contacts',
    'label': 'Internal contacts'
  },
  {
    'value': 'orgs',
    'label': 'Organizations'
  },
  {
    'value': 'items',
    'label': 'Agreement lines'
  },
  {
    'value': 'linkedLicenses',
    'label': 'Linked licenses'
  },
  {
    'value': 'externalLicenseDocs',
    'label': 'External licenses'
  },
  {
    'value': 'supplementaryDocs',
    'label': 'Supplementary documents'
  },
  {
    'value': 'usageDataProviders',
    'label': 'Usage data'
  },
  {
    'value': 'relatedAgreements',
    'label': 'Related agreements'
  },
  {
    'value': 'tags',
    'label': 'Tags'
  }
];

const initialValues = {
  'agreementContent': [
    {
      'attribute': ' isNotEmpty',
      'content': [
        {
          'value': 'agreementContentTypes',
          'label': 'Content types'
        }
      ]
    },
    {
      'grouping': '&&',
      'attribute': ' isEmpty',
      'content': [
        {
          'value': 'contacts',
          'label': 'Internal contacts'
        }
      ]
    }
  ]
};
const onSubmit = jest.fn();
const handleSubmit = jest.fn();

let renderComponent;
describe('DocumentFilterArray', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <TestForm initialValues={initialValues} onSubmit={onSubmit}>
          <DocumentFilterArray
            handleSubmit={handleSubmit}
            name="agreementContent"
            translatedContentOptions={translatedContentOptions}
          />
        </TestForm>,
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the add filter dropdown', async () => {
    await Dropdown('Add filter').exists();
  });

  describe('clicking Add filter dropdown', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('Add filter').click();
      });
    });

    it('should render the AND and OR filter buttons', async () => {
      await Button('AND').exists();
      await Button('OR').exists();
    });
  });

  describe('clicking OR button', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('Add filter').click();
        await Button('OR').click();
      });
    });

    it('should display the OR label', async () => {
      const { getAllByText } = renderComponent;
      await waitFor(async () => {
        expect(getAllByText('OR').length).toEqual(2);
      });
    });
  });

  describe('clicking the AND button', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('Add filter').click();
        await Button('AND').click();
      });
    });

    it('adds a new filter with grouping set to && (AND)', async () => {
      const { getAllByText } = renderComponent;
      await waitFor(async () => {
        expect(getAllByText('AND').length).toEqual(3);
      });
    });
  });

  describe('clicking the remove button should remove the filter', () => {
    beforeEach(async () => {
      const { getAllByRole } = renderComponent;
      await waitFor(async () => {
        await Button('Add filter').click();
        const removeButton = getAllByRole('button', { icon: /times-circle-solid/i })[0];
        fireEvent.click(removeButton);
      });
    });

    it('removes the filter', async () => {
      const { getAllByText } = renderComponent;
      await waitFor(async () => {
        expect(getAllByText('OR').length).toEqual(1);
      });
    });
  });

  it('should pass the correct data to onSubmit', async () => {
    await Button('Submit').click();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
