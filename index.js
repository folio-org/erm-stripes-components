// Components
export { default as ActionMenu } from './lib/ActionMenu';
export { default as AlternativeNamesFieldArray } from './lib/AlternativeNamesFieldArray';
export { default as DocumentCard } from './lib/DocumentCard';
export { default as DocumentsFieldArray } from './lib/DocumentsFieldArray';
export { default as DuplicateModal } from './lib/DuplicateModal';
export { default as EditCard } from './lib/EditCard';
export { default as Embargo } from './lib/Embargo';
export { default as EResourceType } from './lib/EResourceType';
export { default as FileUploader } from './lib/FileUploader';
export { default as FileUploaderField } from './lib/FileUploaderField';
export { default as FormattedDateTime } from './lib/FormattedDateTime';
export { default as InternalContactCard } from './lib/InternalContactCard';
export { default as InternalContactSelection } from './lib/InternalContactSelection';
export { default as InternalContactsFieldArray } from './lib/InternalContactsFieldArray';
export { default as OrganizationsFieldArray } from './lib/OrganizationsFieldArray';
export { default as DateFilter } from './lib/DateFilter';
export { default as ViewOrganizationCard } from './lib/ViewOrganizationCard';
export { default as LicenseCard } from './lib/LicenseCard';
export { default as LicenseEndDate } from './lib/LicenseEndDate';
export { default as LoadingPane } from './lib/LoadingPane';
export { default as LogsList } from './lib/LogsList';
export { default as OrganizationSelection } from './lib/OrganizationSelection';
export { default as SerialCoverage } from './lib/SerialCoverage';
export { default as Tags } from './lib/Tags';
export { default as TitleOnPlatformLink } from './lib/TitleOnPlatformLink';
export { default as CustomMetaSection } from './lib/CustomMetaSection';
export { default as SearchKeyControl } from './lib/SearchKeyControl';

// HOCs
export { default as withAsyncValidation } from './lib/withAsyncValidation';
export { default as withKiwtFieldArray } from './lib/withKiwtFieldArray';

// Functions, utilities, and misc.
export { default as generateQueryParams } from './lib/generateQueryParams';
export { default as getSASParams } from './lib/getSASParams';
export { default as getSiblingIdentifier } from './lib/getSiblingIdentifier';
export { default as getResourceIdentifier } from './lib/getResourceIdentifier';
export { default as isPackage } from './lib/isPackage';
export { default as renderUserName } from './lib/renderUserName';
export { default as getRefdataValuesByDesc } from './lib/getRefdataValuesByDesc';
export { default as renderDynamicRows } from './lib/renderDynamicRows';

export {
  tagsPath,
  defaultTagsParams,
  defaultTagQuery,
  tagNamespaceArray
} from './lib/tagsConfig'; // Tag configuration for consistency across ERM apps

export { default as preventResourceRefresh } from './lib/preventResourceRefresh';
export {
  composeValidators,
  composeValidatorsWithArgs,
  invalidNumber as invalidNumberValidator,
  rangeOverflow,
  rangeUnderflow,
  required as requiredValidator,
  requiredObject as requiredObjectValidator,
} from './lib/validators';

export { default as handleSaveKeyCommand } from './lib/keyboardShortcutHandlers';

// Shared registry components/functions
export { default as InternalContactsArrayDisplay } from './lib/InternalContactsArrayDisplay';
export { default as OrganizationsArrayDisplay } from './lib/OrganizationsArrayDisplay';

export { default as InfoBox } from './lib/InfoBox';
export { default as NewBox } from './lib/NewBox';

// customHooks
export {
  useHandleSubmitSearch,
  useComposedRefs,
  useTags,
  useInfiniteFetch,
  useBatchedFetch,
  useUsers,
  useTagsEnabled,
  useAsyncValidation,
  useFileHandlers,
  useAgreement
} from './lib/hooks';

// Testing
export {
  Harness,
  mockErmComponents,
  mockKintComponents,
  renderWithIntl,
  TestForm,
  translationsProperties
} from './test/jest/helpers';

// Interactors
export {
  HeadlineInteractor,
  IconButtonInteractor
} from './test/jest/interactors';
