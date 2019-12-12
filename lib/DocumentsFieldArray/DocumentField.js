import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import FileUploaderField from '../FileUploaderField';
import { composeValidators } from '../validators';

export default class DocumentField extends React.Component {
  static propTypes = {
    documentCategories: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    id: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    onDownloadFile: PropTypes.func,
    onUploadFile: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (!get(this.props, 'input.value.id') && get(this.inputRef, 'current')) {
      this.inputRef.current.focus();
    }
  }

  validateDocIsSpecified = (value, allValues, meta) => {
    if (meta) {
      const { fileUpload, location, name, url } = get(allValues, this.props.input.name, {});
      if (name && (!fileUpload && !location && !url)) {
        return <FormattedMessage id="stripes-erm-components.doc.error.docsMustHaveLocationOrURL" />;
      }
    }

    return undefined;
  }

  validateURLIsValid = (value) => {
    if (value) {
      try {
        // Test if the URL is valid
        new URL(value); // eslint-disable-line no-new
      } catch (_) {
        return <FormattedMessage id="stripes-erm-components.doc.error.invalidURL" />;
      }
    }

    return undefined;
  }

  validateRequired = (value) => (
    !value ? <FormattedMessage id="stripes-core.label.missingRequiredField" /> : undefined
  )

  renderCategory = () => {
    const { documentCategories, id, input: { name } } = this.props;

    if (!get(documentCategories, 'length')) return null;

    return (
      <Row>
        <Col xs={12}>
          <Field
            component={Select}
            data-test-document-field-category
            dataOptions={[
              { value: '', label: '' },
              ...documentCategories,
            ]}
            id={`${id}-category`}
            label={<FormattedMessage id="stripes-erm-components.doc.category" />}
            name={`${name}.atType`}
            parse={v => v} // Lets us send an empty string instead of `undefined`
          />
        </Col>
      </Row>
    );
  }

  render = () => {
    const {
      id,
      input: { name },
      onDownloadFile,
      onUploadFile,
    } = this.props;

    return (
      <div>
        <Row>
          <Col xs={12} md={onUploadFile ? 6 : 12}>
            <Row>
              <Col xs={12}>
                <Field
                  data-test-document-field-name
                  component={TextField}
                  id={`${id}-name`}
                  inputRef={this.inputRef}
                  label={<FormattedMessage id="stripes-erm-components.doc.name" />}
                  name={`${name}.name`}
                  required
                  validate={this.validateRequired}
                />
              </Col>
            </Row>
            {this.renderCategory()}
            <Row>
              <Col xs={12}>
                <Field
                  data-test-document-field-note
                  component={TextArea}
                  id={`${id}-note`}
                  label={<FormattedMessage id="stripes-erm-components.doc.note" />}
                  name={`${name}.note`}
                  parse={v => v} // Lets us send an empty string instead of `undefined`
                />
              </Col>
            </Row>
          </Col>
          {onUploadFile &&
            <Col xs={12} md={6}>
              <Field
                component={FileUploaderField}
                data-test-document-field-file
                id={`${id}-file`}
                label={<FormattedMessage id="stripes-erm-components.doc.file" />}
                name={`${name}.fileUpload`}
                onDownloadFile={onDownloadFile}
                onUploadFile={onUploadFile}
                validate={this.validateDocIsSpecified}
              />
            </Col>
          }
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              data-test-document-field-location
              component={TextField}
              id={`${id}-location`}
              label={<FormattedMessage id="stripes-erm-components.doc.location" />}
              name={`${name}.location`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
              validate={this.validateDocIsSpecified}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              component={TextField}
              data-test-document-field-url
              id={`${id}-url`}
              label={<FormattedMessage id="stripes-erm-components.doc.url" />}
              name={`${name}.url`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
              validate={composeValidators(
                this.validateDocIsSpecified,
                this.validateURLIsValid,
              )}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
