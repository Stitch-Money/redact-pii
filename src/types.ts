import * as simpleRegexpBuiltIns from './built-ins/simple-regexp-patterns';

export interface ISyncRedactor {
  redact(textToRedact: string, opts: CompositeRedactorOptions<AsyncCustomRedactorConfig>): string;
}

export interface IAsyncRedactor {
  redactAsync(textToRedact: string, opts: CompositeRedactorOptions<AsyncCustomRedactorConfig>): Promise<string>;
}

export type IRedactor = ISyncRedactor | IAsyncRedactor;

export interface SimpleRegexpCustomRedactorConfig {
  regexpPattern: RegExp;
  replaceWith: string;
}

export type SyncCustomRedactorConfig = SimpleRegexpCustomRedactorConfig | ISyncRedactor;

export type AsyncCustomRedactorConfig = SyncCustomRedactorConfig | IAsyncRedactor;

export interface CompositeRedactorOptions<T extends AsyncCustomRedactorConfig> {
  globalReplaceWith?: string;
  replaceWithBorder?: {
    before?: string;
    after?: string;
  };
  builtInRedactors?: {
    [RedactorName in keyof typeof simpleRegexpBuiltIns | 'names']?: {
      enabled?: boolean;
      replaceWith?: string;
    };
  };
  customRedactors?: {
    before?: Array<T>;
    after?: Array<T>;
  };
}
