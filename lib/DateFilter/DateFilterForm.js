import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Checkbox,
  Datepicker,
  Layout
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form';

const DateFilterForm = ({ handleSubmit, name }) => {
  const validateEndDate = (value, allValues) => {
    if (value && allValues.dateFrom) {
      const dateFrom = new Date(allValues.dateFrom);
      const dateTo = new Date(allValues.dateTo);
      if (dateFrom > dateTo) {
        return <FormattedMessage id="stripes-erm-components.dateFilter.errors.OnOrAfterGreaterThanOnOrBefore" />;
      }
    }
    return undefined;
  };

  return (
    <>
      <Field
        backendDateStandard="YYYY-MM-DD"
        component={Datepicker}
        label={<FormattedMessage id="stripes-erm-components.dateFilter.onOrAfter" />}
        name="dateFrom"
        timeZone="UTC"
      />
      <Field
        backendDateStandard="YYYY-MM-DD"
        component={Datepicker}
        label={<FormattedMessage id="stripes-erm-components.dateFilter.onOrBefore" />}
        name="dateTo"
        timeZone="UTC"
        validate={validateEndDate}
      />
      <Layout className="padding-bottom-gutter">
        <Field
          component={Checkbox}
          label={<FormattedMessage id={`stripes-erm-components.dateFilter.${name}NotSet`} />}
          name="isDateSet"
          type="checkbox"
        />
      </Layout>
      <Button
        data-test-apply-button
        marginBottom0
        onClick={handleSubmit}
      >
        <FormattedMessage id="stripes-erm-components.apply" />
      </Button>
    </>
  );
};

DateFilterForm.propTypes = {
  handleSubmit: PropTypes.func,
  name: PropTypes.string
};

export default stripesFinalForm({
  enableReinitialize: true,
  subscription: {
    values: true,
  },
})(DateFilterForm);
