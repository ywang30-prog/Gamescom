# Ghost Controller Profile Interface

A pixel-perfect implementation of the Ghost gaming controller configuration interface with full interactivity using button states from the Elysium Design System.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎮 Features

### Interactive Components

#### 1. **Navigation**
- **Back Button** - IconButton with hover/active/focus states
  - Hover: Scale up with background color change
  - Active: Scale down effect
  - Focus: Blue ring indicator

#### 2. **Preset Selector Dropdown**
- Interactive button with Elysium Design System states
  - **Enabled**: Default dark background
  - **Hovered**: Lighter background (#222)
  - **Pressed**: Even lighter background (#2d2d2d)
  - **Focused**: Blue ring with 2px offset
- Displays current preset: "Desktop: Default"
- Click handler logs interaction to console

#### 3. **Menu List Items** (Left Sidebar)
All menu items use the ListItem component with full interactive states:

- **Mapping** - Configure button mappings
- **Sticks** - Adjust analog stick settings
- **Triggers** - Customize trigger behavior
- **Input test** - Test controller inputs
- **General settings** - Configure device settings

**Interactive States:**
- **Enabled**: Standard appearance
- **Hovered**: Background lightens, subtle scale up (1.01x)
- **Pressed**: Background darkens further, scale down (0.99x)
- **Focused**: Blue ring indicator with offset
- **Disabled**: Reduced opacity with disabled cursor

Each item includes:
- Icon (some with rotation)
- Title
- Subtitle
- Chevron indicator
- OnClick handler with console logging

#### 4. **Controller Hotspots** (Interactive Buttons)
13 clickable hotspots on the controller image:

- Left Shoulder
- Right Shoulder
- Right Trigger
- D-Pad
- Left Bumper
- Right Bumper
- Face Buttons
- Menu Button
- Left Stick Top
- Right Stick Top
- View Button
- Left Grip
- Right Grip

**Interactive States:**
- **Enabled**: Semi-transparent with blur effect
- **Hovered**: Border turns blue, scale up (1.25x), background lightens
- **Pressed**: Background darkens, scale to 1.1x
- **Focused**: Blue ring indicator
- **Selected**: Blue border, blue-tinted background, center dot turns blue, remains scaled up

## 🎨 Design System

### Elysium Button States
All interactive components follow the Elysium Design System button states:

1. **Enabled** - Default resting state
2. **Hovered** - Visual feedback on mouse over
3. **Pressed** - Active/clicking state
4. **Focused** - Keyboard navigation indicator
5. **Disabled** - Non-interactive state (where applicable)

### Color Palette
```javascript
{
  primary: '#00b6fa',       // Blue accent color
  background: {
    950: '#1a1a1a',         // Dark panel background
  },
  surface: {
    neutral: {
      default: '#242424',    // Button/item background
    },
  },
  text: {
    primary: '#00b6fa',      // Primary text (blue)
    neutral: {
      default: '#e6e6e6',    // Default text
      muted: '#a7a7a8',      // Secondary text
      white: '#fbfbfb',      // White text
    },
  },
  stroke: {
    primary: '#00b6fa',      // Blue borders/lines
    neutral: {
      default: '#666',       // Default borders
      disabled: '#333',      // Disabled borders
    },
  },
}
```

### Typography
- Font: Brown Logitech Pan (Logitech's brand font)
- Sizes: 12px (small), 14px (medium), 24px (headline)
- Weights: Regular (400), Bold (700)

## 📁 Project Structure

```
/Profile
├── src/
│   ├── components/
│   │   ├── Home.jsx              # Main component with state management
│   │   ├── Button.jsx            # Reusable button with Elysium states
│   │   ├── IconButton.jsx        # Icon-only button component
│   │   ├── ListItem.jsx          # Sidebar menu item component
│   │   ├── Hotspot.jsx           # Controller hotspot marker
│   │   ├── DeviceCardChipWide.jsx # Battery status indicator
│   │   ├── TabHorizontal.jsx     # Navigation tab component
│   │   └── SystemNavigation.jsx  # Window controls
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Figma MCP Server** - Design asset integration

## 🎯 State Management

The Home component manages all interactive state:

```javascript
const [selectedMenu, setSelectedMenu] = useState('Mapping');
const [selectedHotspot, setSelectedHotspot] = useState(null);
```

### Event Handlers

- `handleMenuClick(menuName)` - Tracks which menu item is clicked
- `handleHotspotClick(hotspotName)` - Tracks which controller button is selected
- `handleBackClick()` - Handles back navigation
- `handlePresetClick()` - Opens preset selector dropdown

All handlers log to console for debugging.

## 🎨 Customization

### Adding New Menu Items

```jsx
<ListItem
  icon={iconUrl}
  title="New Feature"
  subtitle="Description text"
  iconRotation={0}
  onClick={() => handleMenuClick('New Feature')}
/>
```

### Modifying Button Variants

The Button component supports three variants:
- `solid` - Default filled background
- `ghost` - Transparent background
- `outline` - Border only

```jsx
<Button variant="ghost" onClick={handleClick}>
  Click Me
</Button>
```

## 📝 Development Notes

- All image assets are served from Figma's MCP asset endpoint
- Assets expire after 7 days
- Hot module replacement (HMR) enabled for instant updates
- Components follow atomic design principles
- Accessibility features include ARIA labels and keyboard navigation

## 🔍 Browser Console

Open the browser console to see interaction logs:
- Menu item clicks
- Hotspot selections
- Button presses
- Dropdown toggles

## 📄 License

This is a prototype implementation for the Ghost gaming controller interface.
