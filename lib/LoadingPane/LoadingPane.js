import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Layout, Pane, Paneset, Spinner } from '@folio/stripes/components';

/* DEPRECATED */
export default class LoadingPane extends React.Component {
  static propTypes = {
    defaultWidth: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    renderPaneset: PropTypes.bool,
  }

  static defaultProps = {
    defaultWidth: '55%',
  }

  render() {
    /* eslint-disable no-console */
    console.warn(`Warning: <LoadingPane> is deprecated in stripes-erm-components and will be removed in a future release
        Switch to importing LoadingPane from @folio/stripes/components instead
        `);

    const { defaultWidth, onClose, renderPaneset } = this.props;

    const ParentComponent = renderPaneset ? Paneset : React.Fragment;
    const width = renderPaneset ? '100%' : defaultWidth;

    return (
      <ParentComponent>
        <Pane
          defaultWidth={width}
          dismissible
          onClose={onClose}
          paneTitle={<FormattedMessage id="stripes-erm-components.loading" />}
        >
          <Layout className="marginTop1">
            <Spinner />
          </Layout>
        </Pane>
      </ParentComponent>
    );
  }
}
