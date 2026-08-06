import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  TemplateRef,
  ViewContainerRef,
  type EmbeddedViewRef,
} from "@angular/core";

@Directive({
  selector: "[qgShPopover]",
  standalone: true,
  host: {
    "(click)": "onTriggerClick($event)",
    class: "qg-sh-popover-trigger",
  },
})
export class PopoverDirective implements OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly viewContainer = inject(ViewContainerRef);

  readonly qgShPopover = input<TemplateRef<unknown> | undefined>(undefined);
  readonly qgShPopoverOpen = input(false);
  readonly qgShPopoverPosition = input<"bottom" | "top">("bottom");
  readonly qgShPopoverSize = input<"medium" | "large">("medium");

  readonly qgShPopoverOpenChange = output<boolean>();

  private panel: HTMLElement | null = null;
  private viewRef: EmbeddedViewRef<unknown> | null = null;
  private readonly onDocumentClick = (event: MouseEvent) => this.handleDocumentClick(event);

  constructor() {
    effect(() => {
      if (this.qgShPopoverOpen()) {
        this.open();
        document.addEventListener("click", this.onDocumentClick);
      } else {
        this.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.close();
    document.removeEventListener("click", this.onDocumentClick);
  }

  protected onTriggerClick(event: MouseEvent): void {
    event.stopPropagation();
    this.qgShPopoverOpenChange.emit(!this.qgShPopoverOpen());
  }

  private open(): void {
    const template = this.qgShPopover();
    if (!template) {
      return;
    }

    this.close();
    this.viewRef = this.viewContainer.createEmbeddedView(template);
    this.panel = document.createElement("div");
    this.panel.className = `qg-sh-popover-panel qg-sh-popover-panel--${this.qgShPopoverSize()}`;
    for (const node of this.viewRef.rootNodes) {
      this.panel.appendChild(node);
    }

    document.body.appendChild(this.panel);
    this.positionPanel();
  }

  private positionPanel(): void {
    if (!this.panel) {
      return;
    }

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const panelRect = this.panel.getBoundingClientRect();
    const top =
      this.qgShPopoverPosition() === "top" ? rect.top - panelRect.height - 8 : rect.bottom + 8;
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - panelRect.width - 8);

    this.panel.style.position = "fixed";
    this.panel.style.top = `${top}px`;
    this.panel.style.left = `${left}px`;
    this.panel.style.zIndex = "1000";
  }

  private close(): void {
    document.removeEventListener("click", this.onDocumentClick);
    this.viewRef?.destroy();
    this.viewRef = null;
    this.panel?.remove();
    this.panel = null;
  }

  private handleDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (
      this.elementRef.nativeElement.contains(target) ||
      (this.panel && this.panel.contains(target))
    ) {
      return;
    }

    this.close();
    this.qgShPopoverOpenChange.emit(false);
  }
}
