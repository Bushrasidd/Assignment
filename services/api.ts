// Types for Art Institute API
export interface Artwork {
  id: number;
  title: string;
  artist_display: string;
  place_of_origin: string;
  date_start: number;
  date_end: number;
  inscriptions: string;
}

export interface ArtworkResponse {
  data: Artwork[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}

// API service functions
export const fetchArtworks = async (page: number = 1): Promise<ArtworkResponse> => {
  try {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

// No conversion needed - use artwork data directly