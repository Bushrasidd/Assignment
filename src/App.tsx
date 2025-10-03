import { useState, useRef, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { fetchArtworks } from '../services/api';
import type { Artwork } from '../services/api';

import './App.css'


function App() {
  const [rowClick, setRowClick] = useState<boolean>(false);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const op = useRef<OverlayPanel>(null);
  const [rowsToSelect, setRowsToSelect] = useState<number | ''>('');
  const [globalSelectedArtworks, setGlobalSelectedArtworks] = useState<Set<number>>(new Set());
  
  // Store which items should be selected on each page
  const [pageSelections, setPageSelections] = useState<Map<number, number>>(new Map());

 
  const getCurrentPageSelections = () => {
    return artworks.filter(artwork => globalSelectedArtworks.has(artwork.id));
  };

  // Function to update global selection when current page selections change
  const handleSelectionChange = (selectedItems: Artwork[]) => {
    setSelectedArtworks(selectedItems);
    
    // Update global state
    const newGlobalSelections = new Set(globalSelectedArtworks);
    
    // Remove all current page items from global selection
    artworks.forEach(artwork => {
      newGlobalSelections.delete(artwork.id);
    });
    
    // Add newly selected items from current page
    selectedItems.forEach(artwork => {
      newGlobalSelections.add(artwork.id);
    });
    
    setGlobalSelectedArtworks(newGlobalSelections);
    

    setPageSelections(prev => {
      const newPageSelections = new Map(prev);
      newPageSelections.delete(currentPage);
      return newPageSelections;
    });
  };


  // Function to select items across multiple pages (without auto-navigation)
  const selectItemsAcrossPages = (totalItems: number) => {
    const itemsPerPage = 12;
    let remainingItems = totalItems;
    let currentPageNum = 1;
    
    // Clear existing selections
    setGlobalSelectedArtworks(new Set());
    setPageSelections(new Map());
    
    // Calculate how many items to select on each page
    const newPageSelections = new Map<number, number>();
    
    // Use a reasonable max pages if totalRecords is not available
    const maxPages = totalRecords > 0 ? Math.ceil(totalRecords / itemsPerPage) : Math.ceil(totalItems / itemsPerPage);
    
    while (remainingItems > 0 && currentPageNum <= maxPages) {
      const itemsToSelectOnThisPage = Math.min(remainingItems, itemsPerPage);
      newPageSelections.set(currentPageNum, itemsToSelectOnThisPage);
      
      remainingItems -= itemsToSelectOnThisPage;
      currentPageNum++;
    }
    
    setPageSelections(newPageSelections);
    
    // Select items on current page
    const itemsToSelectOnCurrentPage = newPageSelections.get(currentPage) || 0;
    if (itemsToSelectOnCurrentPage > 0) {
      const currentPageSelections = artworks.slice(0, itemsToSelectOnCurrentPage);
      handleSelectionChange(currentPageSelections);
    }
  };

  // Add click handler for chevron icon
  useEffect(() => {
    const handleChevronClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('p-column-header-content')) {
        // Get the header cell element for positioning
        const headerCell = target.closest('th');
        if (headerCell && op.current) {

          if (op.current.isVisible()) {
            op.current.hide();
          } else {
            op.current.show(event as any, headerCell);
          }
        }
      }
    };

    document.addEventListener('click', handleChevronClick);
    
    return () => {
      document.removeEventListener('click', handleChevronClick);
    };
  }, []);



  const loadPageData = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`API called: https://api.artic.edu/api/v1/artworks?page=${page}`);
      const response = await fetchArtworks(page);
      setArtworks(response.data);
      setTotalRecords(response.pagination.total);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPageData(1);
  }, []);

  // Sync current page selections when artworks change (page navigation)
  useEffect(() => {
    const itemsToSelectOnCurrentPage = pageSelections.get(currentPage);
    
    if (itemsToSelectOnCurrentPage && itemsToSelectOnCurrentPage > 0) {
      // Use predefined selections - but only if user hasn't manually changed them
      const currentPageSelections = artworks.slice(0, itemsToSelectOnCurrentPage);
      setSelectedArtworks(currentPageSelections);
      
      // Update global selection
      setGlobalSelectedArtworks(prev => {
        const newGlobalSelections = new Set(prev);
        artworks.forEach(artwork => {
          newGlobalSelections.delete(artwork.id);
        });
        currentPageSelections.forEach(artwork => {
          newGlobalSelections.add(artwork.id);
        });
        return newGlobalSelections;
      });
    } else {
      // Use existing global selections
      const currentSelections = getCurrentPageSelections();
      setSelectedArtworks(currentSelections);
    }
  }, [artworks, currentPage, pageSelections]);
  
  const handlePageChange = (event: any) => {
    const newPage = event.page + 1;
    loadPageData(newPage);
  };

   if (loading) {
    return (
      <div className="loading-container">
        <h1 className="app-header">Art Institute Data</h1>
        <div>Loading artworks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1 className="app-header">Art Institute Data</h1>
        <div className="error-message">Error: {error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app-container">
    <h1 className="app-header">Art Institute Data</h1>
    <div className="controls-container">
      <label htmlFor="rowClickSwitch">Enable Row Click</label>
      <InputSwitch id="rowClickSwitch" checked={rowClick} onChange={(e) => setRowClick(e.value)} />
    </div>
    <DataTable 
      value={artworks} 
      paginator 
      rows={12} 
      rowsPerPageOptions={[12]} 
      totalRecords={totalRecords}
      first={(currentPage - 1) * 12}
      onPage={handlePageChange}
      lazy={true}
      selectionMode={rowClick ? null : 'checkbox'} 
      selection={selectedArtworks} 
      onSelectionChange={(e: { value: Artwork[] }) => handleSelectionChange(e.value)} 
      dataKey="id" 
      tableStyle={{ minWidth: '50rem', alignContent: 'center' }}
    >
    <Column selectionMode="multiple" headerClassName="custom-header" headerStyle={{ width: '3rem' }}></Column>
    <Column field="title" header="Title" style={{ width: '16.66%' }}></Column>
    <Column field="place_of_origin" header="Place_of_origin" style={{ width: '16.66%' }}></Column>
    <Column field="artist_display" header="Artist_display" style={{ width: '16.66%' }}></Column>
    <Column field="inscriptions" header="Inscriptions" style={{ width: '16.66%' }}></Column>
    <Column field="date_start" header="Date_start" style={{ width: '16.66%' }}></Column>
    <Column field="date_end" header="Date_end" style={{ width: '16.66%' }}></Column>
</DataTable>



    {/* OverlayPanel that opens when chevron is clicked */}
    <OverlayPanel ref={op} style={{ width: '200px' }}>
      <div className="overlay-content">
        <h3 className="overlay-title">Select Rows</h3>
        <div className="overlay-form">
          <InputText 
            placeholder="Select rows..."
            type="number"
            min="1"
            max={totalRecords}
            step="1"
            className="overlay-input"
            value={rowsToSelect as any}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setRowsToSelect('');
                return;
              }
              // Accept only integer digits
              if (!/^\d+$/.test(value)) {
                return;
              }
              const parsed = parseInt(value, 10);
              if (!isNaN(parsed)) {
                setRowsToSelect(parsed);
              }
            }}
            onKeyDown={(e) => {
              if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <div className="overlay-buttons">
                     <Button 
              label="Submit" 
              size="small"
              className="overlay-button"
              disabled={!(typeof rowsToSelect === 'number' && rowsToSelect > 0 && rowsToSelect <= totalRecords)}
              onClick={() => {
                if (typeof rowsToSelect === 'number' && rowsToSelect > 0 && rowsToSelect <= totalRecords) {
                  if (rowsToSelect <= 12) {
                    // Select within current page
                    const newSelections = artworks.slice(0, rowsToSelect);
                    handleSelectionChange(newSelections);
                  } else {
                    // Select across multiple pages
                    selectItemsAcrossPages(rowsToSelect);
                  }
                }
                op.current?.hide();
              }}
            />
          </div>
        </div>
      </div>
    </OverlayPanel>
    </div>
  )
}

export default App
