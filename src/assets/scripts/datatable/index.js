// DataTable implementation

export default (function () {
  
  // Vanilla JS DataTable implementation
  class VanillaDataTable {
    constructor(element, options = {}) {
      this.element = element;
      this.options = {
        sortable: true,
        searchable: true,
        pagination: true,
        pageSize: 10,
        ...options,
      };
      
      this.originalData = [];
      this.filteredData = [];
      this.currentPage = 1;
      this.sortColumn = null;
      this.sortDirection = 'asc';
      
      this.init();
    }
    
    init() {
      this.extractData();
      this.createControls();
      this.applyStyles();
      this.bindEvents();
      this.render();
    }
    
    extractData() {
      const rows = this.element.querySelectorAll('tbody tr');
      this.originalData = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return Array.from(cells).map(cell => cell.textContent.trim());
      });
      this.filteredData = [...this.originalData];
    }
    
    createControls() {
      const wrapper = document.createElement('div');
      wrapper.className = 'datatable-wrapper';
      
      // Create search input
      if (this.options.searchable) {
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'datatable-search';
        searchWrapper.innerHTML = `
          <label>
            Search: 
            <input type="text" class="form-control" placeholder="Search...">
          </label>
        `;
        wrapper.appendChild(searchWrapper);
      }
      
      // Create pagination info
      if (this.options.pagination) {
        const infoWrapper = document.createElement('div');
        infoWrapper.className = 'datatable-info';
        wrapper.appendChild(infoWrapper);
      }
      
      // Wrap the table
      this.element.parentNode.insertBefore(wrapper, this.element);
      wrapper.appendChild(this.element);
      
      // Create pagination controls
      if (this.options.pagination) {
        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'datatable-pagination';
        wrapper.appendChild(paginationWrapper);
      }
      
      this.wrapper = wrapper;
    }
    
    applyStyles() {
      // Apply Bootstrap-like styles
      this.element.classList.add('table', 'table-striped', 'table-bordered');
      
      // Add custom styles
      const style = document.createElement('style');
      style.textContent = `
        .datatable-wrapper {
          margin: 20px 0;
        }
        
        .datatable-search {
          margin-bottom: 15px;
        }
        
        .datatable-search input {
          width: 250px;
          display: inline-block;
          margin-left: 5px;
        }
        
        .datatable-info {
          margin-top: 15px;
          color: var(--c-text-muted, #6c757d);
          font-size: 14px;
        }
        
        .datatable-pagination {
          margin-top: 15px;
          display: flex;
          justify-content: center;
        }
        
        .datatable-pagination button {
          background: var(--c-bkg-card, #fff);
          border: 1px solid var(--c-border, #dee2e6);
          color: var(--c-text-base, #333);
          padding: 6px 12px;
          margin: 0 2px;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .datatable-pagination button:hover {
          background: var(--c-primary, #007bff);
          color: white;
        }
        
        .datatable-pagination button.active {
          background: var(--c-primary, #007bff);
          color: white;
        }
        
        .datatable-pagination button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .datatable-sort {
          cursor: pointer;
          user-select: none;
          position: relative;
        }
        
        .datatable-sort:hover {
          background: var(--c-bkg-card, #f8f9fa);
        }
        
        .datatable-sort::after {
          content: '↕';
          position: absolute;
          right: 8px;
          opacity: 0.5;
        }
        
        .datatable-sort.asc::after {
          content: '↑';
          opacity: 1;
        }
        
        .datatable-sort.desc::after {
          content: '↓';
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }
    
    bindEvents() {
      // Search functionality
      if (this.options.searchable) {
        const searchInput = this.wrapper.querySelector('.datatable-search input');
        searchInput.addEventListener('input', (e) => {
          this.search(e.target.value);
        });
      }
      
      // Sorting functionality
      if (this.options.sortable) {
        const headers = this.element.querySelectorAll('thead th');
        headers.forEach((header, index) => {
          header.classList.add('datatable-sort');
          header.addEventListener('click', () => {
            this.sort(index);
          });
        });
      }
    }
    
    search(query) {
      if (!query) {
        this.filteredData = [...this.originalData];
      } else {
        this.filteredData = this.originalData.filter(row => 
          row.some(cell => 
            cell.toLowerCase().includes(query.toLowerCase())
          )
        );
      }
      this.currentPage = 1;
      this.render();
    }
    
    sort(columnIndex) {
      if (this.sortColumn === columnIndex) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = columnIndex;
        this.sortDirection = 'asc';
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
          comparison = aVal.localeCompare(bVal);
        }
        
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
      
      this.updateSortHeaders();
      this.render();
    }
    
    updateSortHeaders() {
      const headers = this.element.querySelectorAll('thead th');
      headers.forEach((header, index) => {
        header.classList.remove('asc', 'desc');
        if (index === this.sortColumn) {
          header.classList.add(this.sortDirection);
        }
      });
    }
    
    render() {
      const tbody = this.element.querySelector('tbody');
      const startIndex = (this.currentPage - 1) * this.options.pageSize;
      const endIndex = startIndex + this.options.pageSize;
      const pageData = this.filteredData.slice(startIndex, endIndex);
      
      // Clear tbody
      tbody.innerHTML = '';
      
      // Add rows
      pageData.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
          const cell = document.createElement('td');
          cell.textContent = cellData;
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
      
      // Update pagination
      if (this.options.pagination) {
        this.updatePagination();
      }
      
      // Update info
      this.updateInfo();
    }
    
    updatePagination() {
      const totalPages = Math.ceil(this.filteredData.length / this.options.pageSize);
      const paginationWrapper = this.wrapper.querySelector('.datatable-pagination');
      
      paginationWrapper.innerHTML = '';
      
      if (totalPages <= 1) return;
      
      // Previous button
      const prevBtn = document.createElement('button');
      prevBtn.textContent = 'Previous';
      prevBtn.disabled = this.currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.render();
        }
      });
      paginationWrapper.appendChild(prevBtn);
      
      // Page numbers
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.toggle('active', i === this.currentPage);
        pageBtn.addEventListener('click', () => {
          this.currentPage = i;
          this.render();
        });
        paginationWrapper.appendChild(pageBtn);
      }
      
      // Next button
      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Next';
      nextBtn.disabled = this.currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.render();
        }
      });
      paginationWrapper.appendChild(nextBtn);
    }
    
    updateInfo() {
      const infoWrapper = this.wrapper.querySelector('.datatable-info');
      if (!infoWrapper) return;
      
      const startIndex = (this.currentPage - 1) * this.options.pageSize + 1;
      const endIndex = Math.min(startIndex + this.options.pageSize - 1, this.filteredData.length);
      const total = this.filteredData.length;
      
      infoWrapper.textContent = `Showing ${startIndex} to ${endIndex} of ${total} entries`;
    }
    
    destroy() {
      if (this.wrapper && this.wrapper.parentNode) {
        this.wrapper.parentNode.replaceChild(this.element, this.wrapper);
      }
    }
  }
  
  // Initialize DataTable
  const initializeDataTable = () => {
    const tableElement = document.getElementById('dataTable');
    if (tableElement) {
      // Clean up existing instance
      if (tableElement.dataTableInstance) {
        tableElement.dataTableInstance.destroy();
      }
      
      // Create new instance
      const dataTable = new VanillaDataTable(tableElement, {
        sortable: true,
        searchable: true,
        pagination: true,
        pageSize: 10,
      });
      
      // Store instance for cleanup
      tableElement.dataTableInstance = dataTable;
    }
  };
  
  // Initialize on load
  initializeDataTable();
  
  // Reinitialize on theme change
  window.addEventListener('adminator:themeChanged', () => {
    setTimeout(initializeDataTable, 100);
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    const tableElement = document.getElementById('dataTable');
    if (tableElement && tableElement.dataTableInstance) {
      tableElement.dataTableInstance.destroy();
    }
  });
  
  // Return public API
  return {
    init: initializeDataTable,
    VanillaDataTable,
  };
}());