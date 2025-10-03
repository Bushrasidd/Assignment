# Art Institute Data Table

A React application that displays artwork data from the Art Institute of Chicago API with advanced selection and pagination features.

## Features

- 📊 **Data Table**: Display artwork information in a paginated table
- ✅ **Multi-Selection**: Select multiple artworks across pages
- 🔄 **Selection Persistence**: Selections are maintained when navigating between pages
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean interface with PrimeReact components

## Data Fields

- **Title**: Artwork title
- **Artist Display**: Artist information
- **Place of Origin**: Where the artwork was created
- **Inscriptions**: Any text on the artwork
- **Date Start/End**: Creation date range
- **Medium Display**: Materials used

## Selection Features

### Manual Selection
- Click checkboxes to select individual artworks
- Selections persist when navigating between pages

### Bulk Selection
- Use the overlay panel to select multiple items at once
- Select up to any number of items across multiple pages
- Items are automatically distributed across pages

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **PrimeReact** - UI component library
- **CSS3** - Styling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Bushrasidd/Assignment.git
cd Assignment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## API

This application fetches data from the Art Institute of Chicago API:
- **Endpoint**: `https://api.artic.edu/api/v1/artworks`
- **Pagination**: 12 items per page
- **Total Records**: 129,802+ artworks
- **API Calls**: Each page navigation triggers a new API call
- **Lazy Loading**: Data is fetched only when needed
- **Console Logging**: API calls are logged for debugging purposes

## Deployment

The application is deployed on Netlify and can be accessed at:
[Live Demo](https://your-app-name.netlify.app)

## Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── main.tsx         # Application entry point
└── services/
    └── api.ts       # API service functions
```

## Features in Detail

### Selection Persistence
- Global selection state tracks selected items by ID
- Selections are maintained across page navigation
- Manual unselections are respected and preserved

### Pagination
- Lazy loading for better performance
- 12 items per page
- Navigation between pages maintains selections

### Responsive Design
- Mobile-friendly interface
- Adaptive table layout
- Touch-friendly selection controls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes.

## Author

Bushra Siddiqui