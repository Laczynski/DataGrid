import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { HelmSize } from "./types";

@Component({
  selector: "dg-sh-spinner",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="dg-sh-spinner"
      [class.dg-sh-spinner--small]="size() === 'small'"
      [class.dg-sh-spinner--large]="size() === 'large'"
      role="status"
      [attr.aria-label]="ariaLabel() ?? 'Loading'"
    ></div>
  `,
  styleUrl: "./spinner.component.scss",
})
export class SpinnerComponent {
  readonly size = input<HelmSize>("medium");
  readonly ariaLabel = input<string | undefined>(undefined);
}
