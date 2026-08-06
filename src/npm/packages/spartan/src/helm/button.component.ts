import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { IconComponent } from "./icon.component";
import type { HelmIconName, HelmSize } from "./types";

@Component({
  selector: "qg-sh-btn",
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [attr.type]="type()"
      class="qg-sh-btn"
      [class.qg-sh-btn--small]="size() === 'small'"
      [class.qg-sh-btn--large]="size() === 'large'"
      [class.qg-sh-btn--outline]="appearance() === 'outline'"
      [class.qg-sh-btn--subtle]="appearance() === 'subtle'"
      [class.qg-sh-btn--transparent]="appearance() === 'transparent'"
      [class.qg-sh-btn--primary]="variant() === 'primary'"
      [class.qg-sh-btn--danger]="variant() === 'danger'"
      [class.qg-sh-btn--selected]="selected()"
      [class.qg-sh-btn--icon-only]="icon() && !text()"
      [class.qg-sh-btn--full]="fullWidth()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      (click)="onClick($event)"
    >
      @if (icon(); as iconName) {
        <qg-sh-icon [icon]="iconName" [size]="size()" />
      }
      @if (text(); as label) {
        <span class="qg-sh-btn__text">{{ label }}</span>
      }
    </button>
  `,
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {
  readonly appearance = input<"outline" | "subtle" | "transparent" | "default">("default");
  readonly variant = input<"primary" | "secondary" | "danger">("secondary");
  readonly size = input<HelmSize>("medium");
  readonly icon = input<HelmIconName | undefined>(undefined);
  readonly text = input<string | undefined>(undefined);
  readonly type = input<"button" | "submit">("button");
  readonly disabled = input(false);
  readonly selected = input(false);
  readonly fullWidth = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);

  readonly click = output<Event>();

  protected onClick(event: Event): void {
    if (!this.disabled()) {
      this.click.emit(event);
    }
  }
}
