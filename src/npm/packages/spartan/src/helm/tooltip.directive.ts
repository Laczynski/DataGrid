import { Directive, input } from "@angular/core";

@Directive({
  selector: "[qgShTooltip]",
  standalone: true,
  host: {
    "[attr.title]": "qgShTooltip()",
  },
})
export class TooltipDirective {
  readonly qgShTooltip = input<string | undefined>(undefined);
  readonly qgShTooltipPosition = input<"top" | "bottom" | "left" | "right">("top");
}
