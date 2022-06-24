import { composeChildRedactors } from './composition';
import { CompositeRedactorOptions, ISyncRedactor, SyncCustomRedactorConfig } from './types';

/** @public */
export interface SyncCompositeRedactorOptions extends CompositeRedactorOptions<SyncCustomRedactorConfig> {}

/** @public */
export class SyncCompositeRedactor implements ISyncRedactor {
  private childRedactors: ISyncRedactor[] = [];
  private opts: SyncCompositeRedactorOptions;

  constructor(opts: SyncCompositeRedactorOptions = {}) {
    this.childRedactors = composeChildRedactors(opts);
    this.opts = opts;
  }

  redact = (textToRedact: string) => {
    for (const redactor of this.childRedactors) {
      textToRedact = redactor.redact(textToRedact, this.opts);
    }
    return textToRedact;
  };
}
