import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { noop } from "./control-value-accessor.util";
import type { HelmSize } from "./types";

@Component({
  selector: "dg-sh-search",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchComponent),
      multi: true,
    },
  ],
  template: `
    <div class="dg-sh-search">
      <svg
        class="dg-sh-search__icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3-3" />
      </svg>
      <input
        class="dg-sh-search__input"
        [class.dg-sh-search__input--small]="size() === 'small'"
        [class.dg-sh-search__input--large]="size() === 'large'"
        type="search"
        [placeholder]="placeholder() ?? ''"
        [value]="value"
        [disabled]="isDisabled"
        (input)="onInput($event)"
        (blur)="handleBlur()"
      />
    </div>
  `,
  styleUrl: "./search.component.scss",
})
export class SearchComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly size = input<HelmSize>("medium");
  readonly placeholder = input<string | undefined>(undefined);

  protected value = "";
  protected isDisabled = false;

  private onChange: (value: string) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: string | null | undefined): void {
    this.value = value ?? "";
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  protected onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }
}
