# 🎮 Head Mouse Demo - Interactive Testing Suite

An engaging React application designed to test and showcase the capabilities of a head-mounted wireless mouse. Features smooth animations, interactive games, and comprehensive performance analytics.

## ✨ Features

- **5 Interactive Games:**
  - 👆 **Left Click Test** - Hit moving targets (30s)
  - 👉 **Right Click Test** - Activate context boxes (30s)
  - ⬆️ **Scroll Test** - Collect gems by scrolling (30s)
  - 📋 **Copy & Paste** - Accuracy challenge (45s)
  - 🚀 **Space Dodge** - Avoid meteorites (unlimited)

- **Professional Features:**
  - 🎯 Real-time scoring system
  - 📊 Performance analytics and grading
  - ✨ Smooth Framer Motion animations
  - 🌈 Modern neon design with gradient effects
  - 📱 Fully responsive layout
  - 🎨 Particle effects and micro-animations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Mahmoudayesh145/head-mouse-demo.git
cd head-mouse-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

Your demo will be available at: `https://Mahmoudayesh145.github.io/head-mouse-demo/`

## 🎮 Game Mechanics

### Scoring System
| Test | Max Points | Duration |
|------|-----------|----------|
| Left Click | 300 | 30s |
| Right Click | 300 | 30s |
| Scroll | 80 | 30s |
| Copy & Paste | 100 | 45s |
| Space Dodge | 500 | Unlimited |
| **TOTAL** | **1,280** | - |

### Grading
- **A:** 90-100%
- **B:** 80-89%
- **C:** 70-79%
- **D:** 60-69%
- **F:** Below 60%

## 📁 Project Structure

```
head-mouse-demo/
├── src/
│   ├── components/
│   │   ├── Welcome.jsx          # Welcome screen with animations
│   │   ├── LeftClickTest.jsx    # Left-click target game
│   │   ├── RightClickTest.jsx   # Right-click challenge
│   │   ├── ScrollTest.jsx       # Horizontal scroll game
│   │   ├── CopyPasteTest.jsx    # Copy & paste accuracy
│   │   ├── SpaceDodge.jsx       # Canvas-based dodge game
│   │   └── Results.jsx          # Results and analytics
│   ├── App.jsx                  # Main app component
│   ├── index.jsx                # React entry point
│   └── index.css                # Global styles
├── public/
│   └── index.html               # HTML template
├── package.json                 # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind customization
└── README.md                    # This file
```

## 🛠 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Canvas API** - Space Dodge game

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` to modify neon colors:
```javascript
colors: {
  neon: {
    purple: '#a855f7',
    cyan: '#06b6d4',
    pink: '#ec4899',
  }
}
```

### Adjust Difficulty
Modify time limits and spawn rates in each component:
```javascript
const [timeLeft, setTimeLeft] = useState(30); // Change duration
```

### Add New Games
1. Create new component in `src/components/`
2. Add to stages array in `App.jsx`
3. Define score range and implement game logic

## 🚀 Deployment Options

### GitHub Pages (Recommended)
```bash
npm run build
npm run deploy
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
Connect your GitHub repo to Netlify dashboard and it will auto-deploy on push.

## 📊 Performance Tips

- Uses Canvas API for optimized Space Dodge rendering
- Framer Motion for GPU-accelerated animations
- Lazy loading of components with code splitting
- Optimized images and assets

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🎯 Future Enhancements

- [ ] Leaderboard system
- [ ] Sound effects and background music
- [ ] More game modes
- [ ] Mobile app version
- [ ] Multiplayer challenges
- [ ] Custom difficulty levels

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ for head mouse precision testing**
