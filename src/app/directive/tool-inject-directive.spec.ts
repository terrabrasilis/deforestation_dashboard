import { ToolInjectDirective } from './tool-inject-directive';
import { ViewContainerRef } from '@angular/core';

describe('ToolInjectDirectiveDirective', () => {
  it('should create an instance', () => {
    let viewContainerRef: ViewContainerRef;
    const directive = new ToolInjectDirective(viewContainerRef);
    expect(directive).toBeTruthy();
  });
});
