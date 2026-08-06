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
  selector: "qg-sh-checkbox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <label class="qg-sh-checkbox" [class.qg-sh-checkbox--after]="labelPosition() === 'after'">
      <input
        type="checkbox"
        class="qg-sh-checkbox__input"
        [checked]="value"
        [disabled]="isDisabled"
        [indeterminate]="indeterminate()"
        [attr.aria-label]="label() ?? null"
        (change)="onInputChange($event)"
        (blur)="handleBlur()"
      />
      @if (label(); as text) {
        <span class="qg-sh-checkbox__label">{{ text }}</span>
      }
    </label>
  `,
  styleUrl: "./checkbox.component.scss",
})
export class CheckboxComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly label = input<string | undefined>(undefined);
  readonly labelPosition = input<"before" | "after">("before");
  readonly size = input<HelmSize>("medium");
  readonly disabled = input(false, { alias: "disabled" });
  readonly indeterminate = input(false);

  protected value = false;
  private formDisabled = false;

  protected get isDisabled(): boolean {
    return this.disabled() || this.formDisabled;
  }

  private onChange: (value: boolean) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: boolean): void {
    this.value = Boolean(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  protected onInputChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.value = checked;
    this.onChange(checked);
    this.onTouched();
  }
}
