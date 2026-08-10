import { Directive, inject, TemplateRef } from "@angular/core";

/** Marks a template as the empty-state content shown when there are no rows. */
@Directive({ selector: "[dgEmpty]", standalone: true })
export class DgEmptyDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
