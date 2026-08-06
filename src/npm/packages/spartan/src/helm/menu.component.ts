import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { ButtonComponent } from "./button.component";
import type { MenuItem } from "./types";

@Component({
  selector: "qg-sh-menu",
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="qg-sh-menu">
      <qg-sh-btn
        appearance="outline"
        [size]="size()"
        [icon]="icon()"
        [text]="text()"
        [disabled]="disabled()"
        (click)="toggle($event)"
      />
      @if (open()) {
        <div class="qg-sh-menu__panel" role="menu">
          @for (item of menuItems(); track item.id) {
            <button
              type="button"
              class="qg-sh-menu__item"
              role="menuitem"
              [disabled]="item.disabled"
              (click)="select(item)"
            >
              {{ item.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styleUrl: "./menu.component.scss",
})
export class MenuComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly triggerVariant = input<"dropdown">("dropdown");
  readonly appearance = input<"outline">("outline");
  readonly size = input<"small" | "medium" | "large">("medium");
  readonly icon = input<string | undefined>(undefined);
  readonly text = input<string | undefined>(undefined);
  readonly disabled = input(false);
  readonly menuItems = input<MenuItem[]>([]);

  readonly menuItemClick = output<MenuItem>();

  protected readonly open = signal(false);

  protected toggle(event: Event): void {
    event.stopPropagation();
    this.open.update((value) => !value);
  }

  protected select(item: MenuItem): void {
    if (item.disabled) {
      return;
    }

    this.open.set(false);
    this.menuItemClick.emit(item);
  }

  @HostListener("document:click", ["$event"])
  protected closeOnOutsideClick(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }

    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
