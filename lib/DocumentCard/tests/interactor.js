import {
  clickable,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

@interactor class DocumentCardInteractor {
  static defaultScope = '[data-test-doc]'
  isHeadlinePresent = isPresent('[data-test-doc-name]');
  renderHeadline = text('[data-test-doc-name]');
  isNotePresent = isPresent('[data-test-doc-note]');
  renderNote = text('[data-test-doc-note]');
  isCategoryPresent = isPresent('[data-test-doc-note]');
  renderCategory = text('[data-test-doc-category]');
  isURLPresent = isPresent('[data-test-doc-url]')
  renderURL = text('[data-test-doc-url]');
  isLocationPresent = isPresent('[data-test-doc-location]');
  renderLocation = text('[data-test-doc-location]');
  isFilePresent = isPresent('[data-test-doc-file]');
  file = text('[data-test-doc-file]');
  downloadFile = clickable('[data-test-doc-file]');
}

export default DocumentCardInteractor;
