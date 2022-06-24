import { AsyncCustomRedactorConfig, CompositeRedactorOptions, ISyncRedactor } from '../types';
import { snakeCase } from 'lodash';
import { addReplaceWithBorders } from '../utils';

export class SimpleRegexpRedactor implements ISyncRedactor {
  regexpMatcher: RegExp;
  replaceWith: string;

  constructor({
    replaceWith = snakeCase().toUpperCase(),
    regexpPattern: regexpMatcher,
  }: {
    replaceWith: string;
    regexpPattern: RegExp;
  }) {
    this.replaceWith = replaceWith;
    this.regexpMatcher = regexpMatcher;
  }

  redact(textToRedact: string, opts: CompositeRedactorOptions<AsyncCustomRedactorConfig>) {
    const replaceText = addReplaceWithBorders(this.replaceWith, opts.replaceWithBorder);

    return textToRedact.replace(this.regexpMatcher, replaceText);
  }
}
