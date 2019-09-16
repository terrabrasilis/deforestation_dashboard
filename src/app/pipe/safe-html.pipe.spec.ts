import { SafeHtmlPipe } from './safe-html.pipe';
import { DomAdapter } from '@angular/platform-browser/src/dom/dom_adapter';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeHtmlPipe', () => {
  it('create an instance', () => {
    let domSanitizer: DomSanitizer;
    const pipe = new SafeHtmlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  });
});
