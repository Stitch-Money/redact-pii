import {
  SimpleRegexpCustomRedactorConfig,
  AsyncCustomRedactorConfig,
  ISyncRedactor,
  IRedactor,
  CompositeRedactorOptions
} from './types';

export function isSimpleRegexpCustomRedactorConfig(
  redactor: AsyncCustomRedactorConfig
): redactor is SimpleRegexpCustomRedactorConfig {
  return typeof (redactor as SimpleRegexpCustomRedactorConfig).regexpPattern !== 'undefined';
}

export function isSyncRedactor(redactor: IRedactor): redactor is ISyncRedactor {
  return typeof (redactor as ISyncRedactor).redact === 'function';
}

export function addReplaceWithBorders<T extends AsyncCustomRedactorConfig>(replaceWith: string, replaceWithBorder: CompositeRedactorOptions<T>['replaceWithBorder']): string {
  if (!replaceWithBorder) {
    return replaceWith;
  }

  const before = replaceWithBorder.before ?? '';
  const after = replaceWithBorder.after ?? '';

  return `${before}${replaceWith}${after}`;
}
