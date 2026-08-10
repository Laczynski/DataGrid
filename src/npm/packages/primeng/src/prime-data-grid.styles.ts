export const GRID_TABLE_STYLES = `
  :host {
    display: block;
  }

  :host.dg-scrollable {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
  }

  :host.dg-scrollable .p-datatable {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
  }

  :host .dg-caption {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  :host .dg-caption-toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap;
  }

  :host .dg-caption-search {
    flex: 1 1 auto;
    min-width: 0;
    max-width: 28rem;
  }

  :host .dg-caption-search input {
    width: 100%;
  }

  :host .dg-caption-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    margin-left: auto;
  }

  :host .dg-caption-filters {
    border: 1px solid var(--p-content-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 0.375rem);
    padding: 1rem;
  }

  :host .dg-caption-feed {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.4;
    color: var(--p-text-color, #0f172a);
  }

  :host .dg-caption-feed__token {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    max-width: 100%;
    padding: 0.125rem 0.25rem 0.125rem 0.5rem;
    border: 1px solid var(--p-content-border-color, #e2e8f0);
    border-radius: var(--p-border-radius, 0.375rem);
    background: var(--p-content-hover-background, #f1f5f9);
  }

  :host .dg-caption-feed__token-text {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  :host .dg-caption-feed__remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    border: 0;
    border-radius: 0.25rem;
    background: transparent;
    color: var(--p-text-muted-color, #64748b);
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
  }

  :host .dg-caption-feed__remove:hover {
    background: color-mix(in srgb, var(--p-text-color, #0f172a) 10%, transparent);
    color: var(--p-text-color, #0f172a);
  }

  :host .dg-caption-feed__logic {
    color: var(--p-text-muted-color, #64748b);
    white-space: pre-wrap;
  }

  :host .dg-caption-bulk-toolbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--p-primary-color, #3b82f6);
    border-radius: var(--p-border-radius, 0.375rem);
    background: color-mix(in srgb, var(--p-primary-color, #3b82f6) 8%, transparent);
  }

  :host .dg-caption-bulk-toolbar-count {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--p-text-color, #0f172a);
    white-space: nowrap;
  }

  :host .dg-caption-bulk-toolbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    min-width: 0;
  }

  :host .dg-header-cell--selection,
  :host .dg-body-cell--selection {
    width: 2.75rem;
    min-width: 2.75rem;
    max-width: 2.75rem;
    padding: 0 !important;
    text-align: center;
    vertical-align: middle;
  }

  :host .dg-selection-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 2.75rem;
  }

  :host .dg-body-cell--selection .dg-selection-cell {
    min-height: 2.5rem;
  }

  :host .dg-column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    min-width: 0;
  }

  :host .dg-column-header-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  :host .dg-column-drag-handle {
    display: inline-flex;
    align-items: center;
    color: var(--p-text-muted-color, #64748b);
    cursor: grab;
    flex-shrink: 0;
    opacity: 0;
    border-radius: 0.25rem;
    padding: 0.125rem;
    transition:
      opacity 150ms ease,
      color 150ms ease,
      background-color 150ms ease;
  }

  :host .dg-header-cell--reorderable:hover .dg-column-drag-handle,
  :host .dg-header-cell.cdk-drag-dragging .dg-column-drag-handle,
  :host .dg-header-row--dragging .dg-column-drag-handle {
    opacity: 1;
  }

  :host .dg-column-drag-handle:hover {
    color: var(--p-text-color, #0f172a);
    background: var(--p-content-hover-background, #f1f5f9);
  }

  :host .dg-column-drag-handle:active {
    cursor: grabbing;
  }

  :host .dg-header-cell.cdk-drag-dragging {
    z-index: 50 !important;
    overflow: hidden;
    opacity: 0;
  }

  :host .dg-header-cell.cdk-drag-placeholder {
    opacity: 1;
    background: color-mix(in srgb, var(--p-primary-color, #3b82f6) 8%, transparent);
    outline: 1px dashed var(--p-primary-color, #3b82f6);
    outline-offset: -1px;
  }

  :host .dg-header-cell.cdk-drag-placeholder .dg-column-header {
    visibility: hidden;
  }

  :host .dg-header-cell.cdk-drag-animating {
    transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
  }

  :host .dg-header-row.cdk-drop-list-dragging .dg-header-cell:not(.cdk-drag-placeholder) {
    transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
  }

  .dg-column-drag-preview {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: auto !important;
    min-height: 2.25rem;
    max-height: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 8px 24px rgb(15 23 42 / 16%);
    color: #0f172a;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25;
    cursor: grabbing;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dg-column-drag-preview.cdk-drag-preview {
    overflow: hidden;
  }

  :host .dg-column-pin-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    border-radius: 0.25rem;
    background: transparent;
    color: var(--p-text-muted-color, #64748b);
    cursor: pointer;
  }

  :host .dg-column-pin-button--active {
    color: var(--p-primary-color, #3b82f6);
  }

  :host ::ng-deep .p-datatable-scrollable-table > .p-datatable-thead {
    z-index: 40;
  }

  :host .p-datatable-thead > tr > th {
    background: var(--p-datatable-header-background, var(--p-content-background, #ffffff));
  }

  :host .p-datatable-thead > tr > .dg-header-cell--selection,
  :host .p-datatable-thead > tr > .dg-header-cell.dg-pinned-left,
  :host .p-datatable-thead > tr > .dg-header-cell.dg-pinned-right {
    top: 0;
  }

  :host .dg-header-cell:not(.dg-pinned-left):not(.dg-pinned-right):not(.dg-header-cell--selection),
  :host .dg-body-cell:not(.dg-pinned-left):not(.dg-pinned-right):not(.dg-body-cell--selection) {
    position: relative;
  }

  :host .dg-header-cell.dg-pinned-left,
  :host .dg-header-cell.dg-pinned-right {
    position: sticky;
    background: var(--p-content-background, #ffffff);
    border-right: none;
  }

  :host .dg-body-cell.dg-pinned-left,
  :host .dg-body-cell.dg-pinned-right {
    position: sticky;
    background: var(--p-content-background, #ffffff);
    border-right: none;
  }

  :host .dg-header-cell--selection,
  :host .dg-body-cell--selection {
    position: sticky;
    left: 0;
    border-right: none;
  }

  :host .dg-header-cell--selection-edge,
  :host .dg-body-cell--selection-edge {
    box-shadow:
      inset -1px 0 0 0 var(--p-content-border-color, #e2e8f0),
      4px 0 6px -2px color-mix(in srgb, var(--p-content-border-color, #e2e8f0) 50%, transparent);
  }

  :host .dg-header-cell--selection-separator,
  :host .dg-body-cell--selection-separator {
    box-shadow: inset -1px 0 0 0 var(--p-content-border-color, #e2e8f0);
  }

  :host .dg-header-cell--selection {
    background: var(--p-datatable-header-background, var(--p-content-background, #ffffff));
  }

  :host .dg-body-cell--selection {
    background: var(--p-content-background, #ffffff);
  }

  :host .p-datatable-striped .p-datatable-tbody > tr:nth-child(even) > .dg-body-cell--selection {
    background: var(--p-datatable-row-striped-background, #f8fafc);
  }

  :host .p-datatable-tbody > tr:hover > .dg-body-cell--selection {
    background: var(--p-datatable-row-hover-background, #f1f5f9);
  }

  :host .p-datatable-tbody > tr.dg-row--selected > .dg-body-cell--selection {
    background: color-mix(in srgb, var(--p-primary-color, #3b82f6) 10%, transparent);
  }

  :host .p-datatable-striped .p-datatable-tbody > tr:nth-child(even) > .dg-body-cell.dg-pinned-left,
  :host .p-datatable-striped .p-datatable-tbody > tr:nth-child(even) > .dg-body-cell.dg-pinned-right {
    background: var(--p-datatable-row-striped-background, #f8fafc);
  }

  :host .p-datatable-tbody > tr:hover > .dg-body-cell.dg-pinned-left,
  :host .p-datatable-tbody > tr:hover > .dg-body-cell.dg-pinned-right {
    background: var(--p-datatable-row-hover-background, #f1f5f9);
  }

  :host .dg-header-cell.dg-pinned-left-separator,
  :host .dg-body-cell.dg-pinned-left-separator {
    box-shadow: inset 1px 0 0 0 var(--p-content-border-color, #e2e8f0);
  }

  :host .dg-header-cell.dg-pinned-left-edge,
  :host .dg-body-cell.dg-pinned-left-edge {
    box-shadow:
      inset -1px 0 0 0 var(--p-content-border-color, #e2e8f0),
      4px 0 6px -2px color-mix(in srgb, var(--p-content-border-color, #e2e8f0) 50%, transparent);
  }

  :host .dg-header-cell.dg-pinned-left-separator.dg-pinned-left-edge,
  :host .dg-body-cell.dg-pinned-left-separator.dg-pinned-left-edge {
    box-shadow:
      inset 1px 0 0 0 var(--p-content-border-color, #e2e8f0),
      inset -1px 0 0 0 var(--p-content-border-color, #e2e8f0),
      4px 0 6px -2px color-mix(in srgb, var(--p-content-border-color, #e2e8f0) 50%, transparent);
  }

  :host .dg-header-cell.dg-pinned-right-separator,
  :host .dg-body-cell.dg-pinned-right-separator {
    box-shadow: inset -1px 0 0 0 var(--p-content-border-color, #e2e8f0);
  }

  :host .dg-header-cell.dg-pinned-right-edge,
  :host .dg-body-cell.dg-pinned-right-edge {
    box-shadow:
      inset 1px 0 0 0 var(--p-content-border-color, #e2e8f0),
      -4px 0 6px -2px color-mix(in srgb, var(--p-content-border-color, #e2e8f0) 50%, transparent);
  }

  :host .dg-header-cell.dg-pinned-right-separator.dg-pinned-right-edge,
  :host .dg-body-cell.dg-pinned-right-separator.dg-pinned-right-edge {
    box-shadow:
      inset 1px 0 0 0 var(--p-content-border-color, #e2e8f0),
      inset -1px 0 0 0 var(--p-content-border-color, #e2e8f0),
      -4px 0 6px -2px color-mix(in srgb, var(--p-content-border-color, #e2e8f0) 50%, transparent);
  }

  :host .dg-column-resize-handle {
    position: absolute;
    top: 0;
    right: -0.25rem;
    width: 0.75rem;
    height: 100%;
    cursor: col-resize;
    touch-action: none;
  }

  :host .dg-column-resize-handle:hover {
    background: color-mix(in srgb, var(--p-primary-color, #3b82f6) 35%, transparent);
  }

  :host .dg-column-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  :host.dg-appearance-plain .dg-plain-caption {
    margin-bottom: 0.75rem;
  }

  :host.dg-appearance-plain .p-datatable {
    border: 1px solid var(--p-content-border-color, #e2e8f0);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  :host.dg-appearance-plain .p-datatable-thead > tr > th {
    background: var(--p-content-hover-background, #f8fafc);
    font-size: 0.875rem;
  }

  :host.dg-appearance-plain .p-datatable-tbody > tr > td {
    font-size: 0.875rem;
  }
`;
