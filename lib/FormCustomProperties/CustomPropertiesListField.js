import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { IntlConsumer } from '@folio/stripes/core';
import {
  Button,
  Col,
  InfoPopover,
  KeyValue,
  Row,
  Select,
  TextArea,
} from '@folio/stripes/components';
import CustomPropertyValue from './CustomPropertyValue';

import EditCard from '../EditCard';
import customPropertyTypes from '../customPropertyTypes';

export default class CustomPropertiesListField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      onChange: PropTypes.func,
    }),
    meta: PropTypes.object,
    optionalSectionLabel: PropTypes.node.isRequired,
    primarySectionLabel: PropTypes.node.isRequired,
    translationKey: PropTypes.string,
    availableCustomProperties: PropTypes.arrayOf(PropTypes.shape({
      description: PropTypes.string,
      label: PropTypes.string.isRequired,
      options: PropTypes.array,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      defaultInternal: PropTypes.bool,
    })).isRequired,
  };

  state = {
    customProperties: [], // This is the list of customProperties we're currently displaying for edit.
  }

  static getDerivedStateFromProps(props, state) {
    const {
      input: { value },
      meta: { pristine },
      availableCustomProperties = [],
    } = props;

    // When the user loads this form, we want to init the list of customProperties
    // we're displaying (state.customProperties) with the list of customProperties that have been set
    // either via defaults or previously-saved data. Since that data may come in
    // _after_ we have mounted this component, we need to check if new data has come in
    // while the form is still marked as pristine.
    //
    // final-form unsets `pristine` after its `onChange` is called, but we also dirty
    // the component when we add/remove rows. That happens _before_ `onChange` is called,
    // so internally we use `state.dirtying` to show that we just initiated an action
    // that will result in a dirty component.
    if (pristine && !state.dirtying) {
      return {
        customProperties: availableCustomProperties.filter(customProperty => value[customProperty.value] !== undefined),
      };
    }

    return null;
  }

  getCustomProperty = (customPropertyValue) => {
    return this.props.availableCustomProperties.find(customProperty => customProperty.value === customPropertyValue);
  }

  renderCustomPropertyName = (customProperty, i) => {
    const { availableCustomProperties, input: { onChange, value } } = this.props;

    const unsetCustomProperties = availableCustomProperties.filter(t => {
      const customPropertyValue = value[t.value];

      // The customProperty is unset and has no value.
      if (customPropertyValue === undefined) return true;

      // The customProperty is set but is marked for deletion. Allow reuse.
      if (customPropertyValue[0] && customPropertyValue[0]._delete) return true;

      return false;
    });

    const customPropertyValue = value[customProperty.value];
    const id = customPropertyValue ? customPropertyValue[0].id : null;

    return (
      <Select
        autoFocus={!id}
        data-test-customproperty-name
        dataOptions={[customProperty, ...unsetCustomProperties]} // The selected customProperty, and the available unset customProperties
        id={`edit-customproperty-${i}-name`}
        label={<FormattedMessage id="stripes-erm-components.prop.customPropertyName" />}
        onChange={e => {
          const newValue = e.target.value;

          // Update `state.customProperties` which controls what customProperties are being edited.
          this.setState(prevState => {
            const newCustomProperties = [...prevState.customProperties];
            newCustomProperties[i] = this.getCustomProperty(newValue);

            return { customProperties: newCustomProperties };
          });

          // Update final-form (which tracks what the values for a given customProperty are) because
          // in essence we're deleting a customProperty and creating a new customProperty.
          // We do this by 1) marking the current customProperty for deletion and 2) initing
          // the new customProperty to an empty object.
          const currentValue = value[customProperty.value] ? value[customProperty.value][0] : {};
          onChange({
            ...value,
            [customProperty.value]: [{
              id: currentValue.id,
              _delete: true,
            }],
            [newValue]: [{}],
          });
        }}
        required
        value={customProperty.value}
      />
    );
  }

  validate = (fieldValue, allValues, customProperty) => {
    const { customProperties } = allValues;
    const val = customProperties?.[customProperty?.value];
    const { note, publicNote, value } = val?.[0] ?? {};

    if ((note && !value) || (publicNote && !value)) {
      if (customProperty.type === customPropertyTypes.NUMBER || customProperty.type === customPropertyTypes.DECIMAL) {
        return <FormattedMessage id="stripes-erm-components.errors.customPropertyNoteInvalidNumber" />;
      } else {
        return <FormattedMessage id="stripes-erm-components.errors.customPropertyNoteWithoutValue" />;
      }
    }

    if (customProperty.type === customPropertyTypes.DECIMAL) {
      const regexp = /^-?[0-9]*(\.[0-9]{0,2})?$/;
      return (fieldValue && !regexp.test(fieldValue)) ?
        <FormattedMessage id="stripes-erm-components.errors.customPropertyMaxTwoDecimals" /> : undefined;
    }

    if (customProperty.type === customPropertyTypes.NUMBER) {
      const min = Number.MIN_SAFE_INTEGER;
      const max = Number.MAX_SAFE_INTEGER;

      return (fieldValue && !Number.isInteger(+fieldValue)) ?
        <FormattedMessage id="stripes-erm-components.errors.customPropertyValueNotInRange" values={{ min, max }} /> : undefined;
    }

    return undefined;
  }

  renderCustomPropertyValue = (customProperty, i) => {
    return (
      <IntlConsumer>
        {intl => (
          <CustomPropertyValue
            customProperty={customProperty}
            index={i}
            intl={intl}
            validate={this.validate}
            {...this.props}
          />
        )}
      </IntlConsumer>
    );
  }

  renderCustomPropertyVisibility = (customProperty, i) => {
    const { input: { onChange, value } } = this.props;
    const customPropertyObject = value[customProperty.value] ? value[customProperty.value][0] : {};
    const { internal } = customPropertyObject;

    const dataOptions = (intl) => {
      return [
        { value: true, label: intl.formatMessage({ id: 'stripes-erm-components.customProperty.internalTrue' }) },
        { value: false, label: intl.formatMessage({ id: 'stripes-erm-components.customProperty.internalFalse' }) }
      ];
    };

    const handleChange = e => {
      onChange({
        ...value,
        [customProperty.value]: [{
          ...customPropertyObject,
          internal: e.target.value
        }],
      });
    };

    return (
      /* TODO: Refactor this component to use `injectIntl` when Folio starts using react-intl 3.0 */
      <IntlConsumer>
        {intl => (
          <Select
            data-test-customproperty-visibility
            dataOptions={dataOptions(intl)}
            id={`edit-customproperty-${i}-visibility`}
            label={<FormattedMessage id="stripes-erm-components.prop.customPropertyVisibility" />}
            onChange={handleChange}
            value={internal === undefined ? customProperty.defaultInternal : internal}
          />
        )}
      </IntlConsumer>
    );
  }

  handleDeleteCustomProperty = (customProperty, i) => {
    const { input: { onChange, value } } = this.props;
    const currentValue = value[customProperty.value] ? value[customProperty.value][0] : {};

    this.setState(prevState => {
      const newCustomProperties = [...prevState.customProperties];
      newCustomProperties.splice(i, 1);
      return {
        dirtying: true,
        customProperties: newCustomProperties
      };
    });

    onChange({
      ...value,
      [customProperty.value]: [{
        ...currentValue,
        _delete: true,
      }],
    });
  }

  renderCustomPropertyNoteInternal = (customProperty, i) => {
    const { input: { onChange, value } } = this.props;
    const customPropertyObject = value[customProperty.value] ? value[customProperty.value][0] : {};
    const { note } = customPropertyObject;

    const handleChange = e => {
      onChange({
        ...value,
        [customProperty.value]: [{
          ...customPropertyObject,
          note: e.target.value
        }],
      });
    };

    return (
      <TextArea
        data-test-customproperty-note
        id={`edit-customproperty-${i}-internal-note`}
        label={<FormattedMessage id="stripes-erm-components.customProperty.internalNote" />}
        onChange={handleChange}
        value={note}
      />
    );
  }

  renderCustomPropertyNotePublic = (customProperty, i) => {
    const { input: { onChange, value } } = this.props;
    const customPropertyObject = value[customProperty.value] ? value[customProperty.value][0] : {};
    const { publicNote } = customPropertyObject;

    const handleChange = e => {
      onChange({
        ...value,
        [customProperty.value]: [{
          ...customPropertyObject,
          publicNote: e.target.value
        }],
      });
    };

    return (
      <TextArea
        data-test-customproperty-public-note
        id={`edit-customproperty-${i}-public-note`}
        label={<FormattedMessage id="stripes-erm-components.customProperty.publicNote" />}
        onChange={handleChange}
        value={publicNote}
      />
    );
  }

  renderAddCustomProperty = () => {
    const { translationKey } = this.props;
    return (
      <Button
        id="add-customproperty-btn"
        onClick={() => {
          this.setState(prevState => {
            return {
              dirtying: true,
              customProperties: [...prevState.customProperties, {}],
            };
          });
        }}
      >
        <FormattedMessage id={`stripes-erm-components.customProperties.${translationKey}.add`} />
      </Button>
    );
  }

  renderCustomPropertiesList = () => {
    const { availableCustomProperties, optionalSectionLabel, primarySectionLabel } = this.props;
    return (
      <div>
        { availableCustomProperties.some((customProperty = {}) => customProperty.primary) ?
          <KeyValue
            label={primarySectionLabel}
            value={this.renderCustomProperties('primary')}
          />
          :
          null
        }
        { availableCustomProperties.some((customProperty = {}) => !customProperty.primary) ?

          <KeyValue
            label={optionalSectionLabel}
            value={this.renderCustomProperties('optional')}
          />
          :
          null
        }
      </div>
    );
  }

  renderCustomProperties = (customPropertyType) => {
    const { translationKey } = this.props;

    let optionalCustomPropertyCounter = 0;

    const customPropertiesList = this.state.customProperties.map((customProperty = {}, i) => {
      if (customPropertyType === 'primary' && !customProperty.primary) return undefined;
      if (customPropertyType === 'optional' && customProperty.primary) return undefined;

      const deleteBtnProps = customPropertyType === 'optional' ? {
        'id': `edit-customproperty-${i}-delete`,
        'data-test-customproperty-delete-btn': true
      } : null;

      const header = customPropertyType === 'optional' ?
        <FormattedMessage
          id={`stripes-erm-components.customProperty.${translationKey}Title`}
          values={{ number: optionalCustomPropertyCounter + 1 }}
        /> : customProperty.label;

      optionalCustomPropertyCounter += 1;

      return (
        <EditCard
          key={customProperty.value}
          data-test-customproperty={customPropertyType}
          deleteBtnProps={deleteBtnProps}
          deleteButtonTooltipText={<FormattedMessage id="stripes-erm-components.customProperty.remove" values={{ type: translationKey }} />}
          header={
            <div>
              {header}
              {customProperty.description ? (
                <InfoPopover
                  content={customProperty.description}
                />
              ) : null}
            </div>
          }
          onDelete={customPropertyType === 'optional' ? () => this.handleDeleteCustomProperty(customProperty, i) : null}
        >
          {
            customPropertyType === 'optional' &&
            <Row>
              <Col xs={12}>
                {this.renderCustomPropertyName(customProperty, i)}
              </Col>
            </Row>
          }
          <Row>
            <Col md={6} xs={12}>
              {this.renderCustomPropertyValue(customProperty, i)}
            </Col>
            <Col md={6} xs={12}>
              {this.renderCustomPropertyNoteInternal(customProperty, i)}
            </Col>
          </Row>
          <Row>
            <Col md={6} xs={12}>
              {this.renderCustomPropertyVisibility(customProperty, i)}
            </Col>
            <Col md={6} xs={12}>
              {this.renderCustomPropertyNotePublic(customProperty, i)}
            </Col>
          </Row>
        </EditCard>
      );
    }).filter(customProperty => customProperty !== undefined);

    return customPropertiesList;
  }

  render() {
    const { availableCustomProperties } = this.props;
    return (
      <div>
        {this.renderCustomPropertiesList()}
        {availableCustomProperties.some((customProperty = {}) => !customProperty.primary) ?
          this.renderAddCustomProperty()
          :
          null}
      </div>
    );
  }
}
