/**
 * DataTable Implementation with TypeScript
 * Vanilla JavaScript DataTable with sorting, searching, and pagination
 */

import type { ComponentInterface } from '../../types';

// Type definitions for DataTable
export interface DataTableOptions {
  sortable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  responsive?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
}

export interface DataTableColumn {
  title: string;
  data: string | number;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  className?: string;
  render?: (data: any, row: any[], index: number) => string;
}

export interface DataTableData {
  columns: DataTableColumn[];
  rows: any[][];
}

export interface DataTableState {
  currentPage: number;
  sortColumn: number | null;
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  filteredData: any[][];
  totalPages: number;
}

export type SortDirection = 'asc' | 'desc';

declare global {
  interface HTMLTableElement {
    dataTableInstance?: VanillaDataTable;
  }
}

// Enhanced DataTable implementation
export class VanillaDataTable implements ComponentInterface {
  public name: string = 'VanillaDataTable';
  public element: HTMLTableElement;
  public options: DataTableOptions;
  public isInitialized: boolean = false;

  private originalData: any[][] = [];
  private filteredData: any[][] = [];
  private state: DataTableState;
  private wrapper: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private infoElement: HTMLElement | null = null;
  private paginationElement: HTMLElement | null = null;

  constructor(element: HTMLTableElement, options: DataTableOptions = {}) {
    this.element = element;
    this.options = {
      sortable: true,
      searchable: true,
      pagination: true,
      pageSize: 10,
      responsive: true,
      striped: true,
      bordered: true,
      hover: true,
      ...options,
    };

    this.state = {
      currentPage: 1,
      sortColumn: null,
      sortDirection: 'asc',
      searchQuery: '',
      filteredData: [],
      totalPages: 0,
    };

    this.init();
  }

  public init(): void {
    this.extractData();
    this.createControls();
    this.applyStyles();
    this.bindEvents();
    this.render();
    this.isInitialized = true;
  }

  public destroy(): void {
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.replaceChild(this.element, this.wrapper);
    }
    this.isInitialized = false;
  }

  private extractData(): void {
    const tbody = this.element.querySelector('tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    this.originalData = Array.from(rows).map(row => {
      const cells = row.querySelectorAll('td');
      return Array.from(cells).map(cell => cell.textContent?.trim() || '');
    });
    this.filteredData = [...this.originalData];
    this.state.filteredData = this.filteredData;
  }

  private createControls(): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'datatable-wrapper';

    // Create top controls container
    const topControls = document.createElement('div');
    topControls.className = 'datatable-top-controls';

    // Create search input
    if (this.options.searchable) {
      const searchWrapper = document.createElement('div');
      searchWrapper.className = 'datatable-search';
      
      const searchLabel = document.createElement('label');
      searchLabel.textContent = 'Search: ';
      
      this.searchInput = document.createElement('input');
      this.searchInput.type = 'text';
      this.searchInput.className = 'form-control';
      this.searchInput.placeholder = 'Search...';
      
      searchLabel.appendChild(this.searchInput);
      searchWrapper.appendChild(searchLabel);
      topControls.appendChild(searchWrapper);
    }

    // Create info display
    if (this.options.pagination) {
      this.infoElement = document.createElement('div');
      this.infoElement.className = 'datatable-info';
      topControls.appendChild(this.infoElement);
    }

    wrapper.appendChild(topControls);

    // Wrap the table
    if (this.element.parentNode) {
      this.element.parentNode.insertBefore(wrapper, this.element);
    }
    wrapper.appendChild(this.element);

    // Create pagination controls
    if (this.options.pagination) {
      this.paginationElement = document.createElement('div');
      this.paginationElement.className = 'datatable-pagination';
      wrapper.appendChild(this.paginationElement);
    }

    this.wrapper = wrapper;
  }

  private applyStyles(): void {
    // Apply Bootstrap-like styles
    const classes = ['table'];
    if (this.options.striped) classes.push('table-striped');
    if (this.options.bordered) classes.push('table-bordered');
    if (this.options.hover) classes.push('table-hover');
    if (this.options.responsive) {
      const responsiveWrapper = document.createElement('div');
      responsiveWrapper.className = 'table-responsive';
      if (this.element.parentNode) {
        this.element.parentNode.insertBefore(responsiveWrapper, this.element);
        responsiveWrapper.appendChild(this.element);
      }
    }

    this.element.className = classes.join(' ');

    // Add custom styles
    this.injectStyles();
  }

  private injectStyles(): void {
    const styleId = 'datatable-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .datatable-wrapper {
        margin: 20px 0;
      }
      
      .datatable-top-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .datatable-search {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .datatable-search label {
        margin: 0;
        font-weight: 500;
      }
      
      .datatable-search input {
        width: 250px;
        padding: 6px 12px;
        border: 1px solid var(--c-border, #dee2e6);
        border-radius: 4px;
        font-size: 14px;
      }
      
      .datatable-info {
        color: var(--c-text-muted, #6c757d);
        font-size: 14px;
        margin: 0;
      }
      
      .datatable-pagination {
        margin-top: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      }
      
      .datatable-pagination button {
        background: var(--c-bkg-card, #fff);
        border: 1px solid var(--c-border, #dee2e6);
        color: var(--c-text-base, #333);
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 14px;
        transition: all 0.2s ease;
        min-width: 40px;
      }
      
      .datatable-pagination button:hover:not(:disabled) {
        background: var(--c-primary, #007bff);
        border-color: var(--c-primary, #007bff);
        color: white;
      }
      
      .datatable-pagination button.active {
        background: var(--c-primary, #007bff);
        border-color: var(--c-primary, #007bff);
        color: white;
      }
      
      .datatable-pagination button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: var(--c-bkg-muted, #f8f9fa);
      }
      
      .datatable-sort {
        cursor: pointer;
        user-select: none;
        position: relative;
        padding-right: 20px !important;
        transition: background-color 0.2s ease;
      }
      
      .datatable-sort:hover {
        background: var(--c-bkg-hover, #f8f9fa);
      }
      
      .datatable-sort::after {
        content: '↕';
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.5;
        font-size: 12px;
      }
      
      .datatable-sort.asc::after {
        content: '↑';
        opacity: 1;
        color: var(--c-primary, #007bff);
      }
      
      .datatable-sort.desc::after {
        content: '↓';
        opacity: 1;
        color: var(--c-primary, #007bff);
      }
      
      .datatable-no-results {
        text-align: center;
        color: var(--c-text-muted, #6c757d);
        font-style: italic;
        padding: 20px;
      }
      
      @media (max-width: 768px) {
        .datatable-top-controls {
          flex-direction: column;
          align-items: stretch;
        }
        
        .datatable-search input {
          width: 100%;
        }
        
        .datatable-pagination {
          justify-content: center;
        }
        
        .datatable-pagination button {
          padding: 6px 10px;
          font-size: 13px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private bindEvents(): void {
    // Search functionality
    if (this.options.searchable && this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        this.search(target.value);
      });
    }

    // Sorting functionality
    if (this.options.sortable) {
      const headers = this.element.querySelectorAll<HTMLTableCellElement>('thead th');
      headers.forEach((header, index) => {
        header.classList.add('datatable-sort');
        header.addEventListener('click', () => {
          this.sort(index);
        });
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-label', `Sort by ${header.textContent}`);
      });
    }
  }

  public search(query: string): void {
    this.state.searchQuery = query;
    
    if (!query.trim()) {
      this.filteredData = [...this.originalData];
    } else {
      const searchTerm = query.toLowerCase().trim();
      this.filteredData = this.originalData.filter(row => 
        row.some(cell => 
          cell.toString().toLowerCase().includes(searchTerm)
        )
      );
    }
    
    this.state.filteredData = this.filteredData;
    this.state.currentPage = 1;
    this.render();
  }

  public sort(columnIndex: number): void {
    if (this.state.sortColumn === columnIndex) {
      this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.state.sortColumn = columnIndex;
      this.state.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const aVal = a[columnIndex];
      const bVal = b[columnIndex];

      // Try to parse as numbers
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);

      let comparison = 0;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        comparison = aNum - bNum;
      } else {
        // Try to parse as dates
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        
        if (aDate.getTime() && bDate.getTime()) {
          comparison = aDate.getTime() - bDate.getTime();
        } else {
          comparison = aVal.toString().localeCompare(bVal.toString());
        }
      }

      return this.state.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.updateSortHeaders();
    this.render();
  }

  private updateSortHeaders(): void {
    const headers = this.element.querySelectorAll<HTMLTableCellElement>('thead th');
    headers.forEach((header, index) => {
      header.classList.remove('asc', 'desc');
      if (index === this.state.sortColumn) {
        header.classList.add(this.state.sortDirection);
      }
    });
  }

  public render(): void {
    const tbody = this.element.querySelector('tbody');
    if (!tbody) return;

    const startIndex = (this.state.currentPage - 1) * this.options.pageSize!;
    const endIndex = startIndex + this.options.pageSize!;
    const pageData = this.filteredData.slice(startIndex, endIndex);

    // Clear tbody
    tbody.innerHTML = '';

    if (pageData.length === 0) {
      // Show no results message
      const noResultsRow = document.createElement('tr');
      const noResultsCell = document.createElement('td');
      noResultsCell.colSpan = this.getColumnCount();
      noResultsCell.className = 'datatable-no-results';
      noResultsCell.textContent = this.state.searchQuery ? 
        'No matching records found' : 'No data available';
      noResultsRow.appendChild(noResultsCell);
      tbody.appendChild(noResultsRow);
    } else {
      // Add rows
      pageData.forEach((rowData, rowIndex) => {
        const row = document.createElement('tr');
        rowData.forEach((cellData, colIndex) => {
          const cell = document.createElement('td');
          cell.textContent = cellData.toString();
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
    }

    // Update pagination
    if (this.options.pagination) {
      this.updatePagination();
    }

    // Update info
    this.updateInfo();
  }

  private getColumnCount(): number {
    const headerRow = this.element.querySelector('thead tr');
    return headerRow ? headerRow.querySelectorAll('th').length : 0;
  }

  private updatePagination(): void {
    if (!this.paginationElement) return;

    this.state.totalPages = Math.ceil(this.filteredData.length / this.options.pageSize!);
    this.paginationElement.innerHTML = '';

    if (this.state.totalPages <= 1) return;

    // Previous button
    const prevBtn = this.createPaginationButton('Previous', () => {
      if (this.state.currentPage > 1) {
        this.state.currentPage--;
        this.render();
      }
    });
    prevBtn.disabled = this.state.currentPage === 1;
    this.paginationElement.appendChild(prevBtn);

    // Calculate page range to show
    const maxButtons = 5;
    let startPage = Math.max(1, this.state.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(this.state.totalPages, startPage + maxButtons - 1);
    
    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // First page if not in range
    if (startPage > 1) {
      const firstBtn = this.createPaginationButton('1', () => {
        this.state.currentPage = 1;
        this.render();
      });
      this.paginationElement.appendChild(firstBtn);
      
      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'pagination-ellipsis';
        this.paginationElement.appendChild(ellipsis);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = this.createPaginationButton(i.toString(), () => {
        this.state.currentPage = i;
        this.render();
      });
      pageBtn.classList.toggle('active', i === this.state.currentPage);
      this.paginationElement.appendChild(pageBtn);
    }

    // Last page if not in range
    if (endPage < this.state.totalPages) {
      if (endPage < this.state.totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'pagination-ellipsis';
        this.paginationElement.appendChild(ellipsis);
      }
      
      const lastBtn = this.createPaginationButton(this.state.totalPages.toString(), () => {
        this.state.currentPage = this.state.totalPages;
        this.render();
      });
      this.paginationElement.appendChild(lastBtn);
    }

    // Next button
    const nextBtn = this.createPaginationButton('Next', () => {
      if (this.state.currentPage < this.state.totalPages) {
        this.state.currentPage++;
        this.render();
      }
    });
    nextBtn.disabled = this.state.currentPage === this.state.totalPages;
    this.paginationElement.appendChild(nextBtn);
  }

  private createPaginationButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  }

  private updateInfo(): void {
    if (!this.infoElement) return;

    const startIndex = (this.state.currentPage - 1) * this.options.pageSize! + 1;
    const endIndex = Math.min(startIndex + this.options.pageSize! - 1, this.filteredData.length);
    const total = this.filteredData.length;
    const originalTotal = this.originalData.length;

    if (total === 0) {
      this.infoElement.textContent = 'No entries to show';
    } else if (total === originalTotal) {
      this.infoElement.textContent = `Showing ${startIndex} to ${endIndex} of ${total} entries`;
    } else {
      this.infoElement.textContent = `Showing ${startIndex} to ${endIndex} of ${total} entries (filtered from ${originalTotal} total entries)`;
    }
  }

  // Public API methods
  public goToPage(page: number): void {
    if (page >= 1 && page <= this.state.totalPages) {
      this.state.currentPage = page;
      this.render();
    }
  }

  public setPageSize(size: number): void {
    this.options.pageSize = size;
    this.state.currentPage = 1;
    this.render();
  }

  public getState(): Readonly<DataTableState> {
    return { ...this.state };
  }

  public refresh(): void {
    this.extractData();
    this.state.currentPage = 1;
    this.render();
  }

  public clear(): void {
    this.originalData = [];
    this.filteredData = [];
    this.state.currentPage = 1;
    this.render();
  }
}

// DataTable Manager
export class DataTableManager {
  private instances: Map<string, VanillaDataTable> = new Map();

  public initialize(selector: string = '#dataTable', options: DataTableOptions = {}): VanillaDataTable | null {
    const element = document.querySelector<HTMLTableElement>(selector);
    if (!element) {
      // Silently return null if element doesn't exist (normal for pages without tables)
      return null;
    }

    // Clean up existing instance
    if (element.dataTableInstance) {
      element.dataTableInstance.destroy();
    }

    // Create new instance
    const dataTable = new VanillaDataTable(element, options);
    element.dataTableInstance = dataTable;

    // Store in manager
    this.instances.set(selector, dataTable);

    return dataTable;
  }

  public getInstance(selector: string): VanillaDataTable | undefined {
    return this.instances.get(selector);
  }

  public destroyInstance(selector: string): void {
    const instance = this.instances.get(selector);
    if (instance) {
      instance.destroy();
      this.instances.delete(selector);
    }
  }

  public destroyAll(): void {
    this.instances.forEach((instance, selector) => {
      instance.destroy();
    });
    this.instances.clear();
  }
}

// Create singleton manager
const dataTableManager = new DataTableManager();

// Initialize DataTable
const initializeDataTable = (): void => {
  // Only initialize if the table exists
  if (document.querySelector('#dataTable')) {
    dataTableManager.initialize('#dataTable', {
      sortable: true,
      searchable: true,
      pagination: true,
      pageSize: 10,
      responsive: true,
      striped: true,
      bordered: true,
      hover: true,
    });
  }
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDataTable);
} else {
  initializeDataTable();
}

// Reinitialize on theme change
window.addEventListener('adminator:themeChanged', () => {
  setTimeout(initializeDataTable, 100);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  dataTableManager.destroyAll();
});

// Export default for compatibility
export default {
  init: initializeDataTable,
  manager: dataTableManager,
  VanillaDataTable,
  DataTableManager,
};