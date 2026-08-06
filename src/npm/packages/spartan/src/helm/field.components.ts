import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  output,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { noop } from "./control-value-accessor.util";
import type { HelmSize, SelectItem } from "./types";

@Component({
  selector: "qg-sh-select",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    @if (mode() === "multi") {
      <select
        class="qg-sh-select"
        [class.qg-sh-select--small]="size() === 'small'"
        [class.qg-sh-select--large]="size() === 'large'"
        multiple
        [disabled]="isDisabled"
        [value]="selectedValues()"
        (change)="onMultiChange($event)"
        (blur)="handleBlur()"
      >
        @for (item of items(); track item.value) {
          <option [value]="stringValue(item.value)" [disabled]="item.disabled">
            {{ item.label }}
          </option>
        }
      </select>
    } @else {
      <select
        class="qg-sh-select"
        [class.qg-sh-select--small]="size() === 'small'"
        [class.qg-sh-select--large]="size() === 'large'"
        [disabled]="isDisabled"
        [value]="stringValue(value)"
        (change)="onSingleChange($event)"
        (blur)="handleBlur()"
      >
        @if (placeholder(); as text) {
          <option value="" disabled hidden>{{ text }}</option>
        }
        @for (item of items(); track item.value) {
          <option [value]="stringValue(item.value)" [disabled]="item.disabled">
            {{ item.label }}
          </option>
        }
      </select>
    }
  `,
  styleUrl: "./field.component.scss",
})
export class SelectComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly items = input<SelectItem[]>([]);
  readonly size = input<HelmSize>("medium");
  readonly mode = input<"single" | "multi">("single");
  readonly placeholder = input<string | undefined>(undefined);

  readonly selectionChange = output<unknown>();

  protected value: unknown = undefined;
  protected isDisabled = false;

  private onChange: (value: unknown) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: unknown): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: unknown) => void): void {
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

  protected stringValue(val: unknown): string {
    return val === null || val === undefined ? "" : String(val);
  }

  protected selectedValues(): string[] {
    if (!Array.isArray(this.value)) {
      return [];
    }

    return this.value.map((entry) => this.stringValue(entry));
  }

  protected onSingleChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const match = this.items().find((item) => this.stringValue(item.value) === raw);
    const next = match?.value ?? (raw === "" ? null : raw);
    this.value = next;
    this.onChange(next);
    this.selectionChange.emit(next);
    this.onTouched();
  }

  protected onMultiChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const values = Array.from(select.selectedOptions).map((option) => option.value);
    const resolved = values
      .map((entry) => this.items().find((item) => this.stringValue(item.value) === entry)?.value)
      .filter((entry) => entry !== undefined);
    this.value = resolved;
    this.onChange(resolved);
    this.selectionChange.emit(resolved);
    this.onTouched();
  }
}

@Component({
  selector: "qg-sh-text",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextComponent),
      multi: true,
    },
  ],
  template: `
    <input
      class="qg-sh-field"
      [class.qg-sh-field--small]="size() === 'small'"
      [class.qg-sh-field--large]="size() === 'large'"
      type="text"
      [placeholder]="placeholder() ?? ''"
      [value]="displayValue()"
      [disabled]="isDisabled"
      (input)="onInput($event)"
      (blur)="handleBlur()"
    />
  `,
  styleUrl: "./field.component.scss",
})
export class TextComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly size = input<HelmSize>("medium");
  readonly placeholder = input<string | undefined>(undefined);

  protected value: unknown = "";
  protected isDisabled = false;

  private onChange: (value: string) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: unknown): void {
    this.value = value;
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

  protected displayValue(): string {
    return this.value === null || this.value === undefined ? "" : String(this.value);
  }

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value = next;
    this.onChange(next);
  }
}

@Component({
  selector: "qg-sh-number",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberComponent),
      multi: true,
    },
  ],
  template: `
    <input
      class="qg-sh-field"
      [class.qg-sh-field--small]="size() === 'small'"
      [class.qg-sh-field--large]="size() === 'large'"
      type="number"
      [placeholder]="placeholder() ?? ''"
      [value]="displayValue()"
      [disabled]="isDisabled"
      (input)="onInput($event)"
      (blur)="handleBlur()"
    />
  `,
  styleUrl: "./field.component.scss",
})
export class NumberComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly size = input<HelmSize>("medium");
  readonly placeholder = input<string | undefined>(undefined);

  protected value: unknown = null;
  protected isDisabled = false;

  private onChange: (value: unknown) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: unknown): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: unknown) => void): void {
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

  protected displayValue(): string {
    return this.value === null || this.value === undefined ? "" : String(this.value);
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const next = raw === "" ? null : Number(raw);
    this.value = next;
    this.onChange(next);
  }
}

@Component({
  selector: "qg-sh-date",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true,
    },
  ],
  template: `
    <input
      class="qg-sh-field"
      [class.qg-sh-field--small]="size() === 'small'"
      [class.qg-sh-field--large]="size() === 'large'"
      type="date"
      [placeholder]="placeholder() ?? ''"
      [value]="displayValue()"
      [disabled]="isDisabled"
      (input)="onInput($event)"
      (blur)="handleBlur()"
    />
  `,
  styleUrl: "./field.component.scss",
})
export class DateComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly size = input<HelmSize>("medium");
  readonly placeholder = input<string | undefined>(undefined);

  protected value: unknown = null;
  protected isDisabled = false;

  private onChange: (value: unknown) => void = noop;
  private onTouched: () => void = noop;

  writeValue(value: unknown): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: unknown) => void): void {
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

  protected displayValue(): string {
    return this.value === null || this.value === undefined ? "" : String(this.value);
  }

  protected onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value || null;
    this.value = next;
    this.onChange(next);
  }
}
