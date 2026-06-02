# Royal Study Plan - Personal Android Planner

Your complete 60-day study planner app for JEE/Board exam preparation.

## 📱 Features

✅ **Complete 60-Day Curriculum**
- Phase 1: Class 11 Foundation (Days 1-30)
- Phase 2: Class 12 + Organic + Calculus (Days 31-60)
- All 3 subjects: Physics, Chemistry, Maths

✅ **Daily Completion Criteria**
- 5 essential checkpoints for every subject:
  - Theory completed
  - Short notes made (1–2 pages)
  - 15–20 basic questions solved
  - Important formulas/reactions memorized
  - Doubts marked

✅ **Progress Tracking**
- Visual progress bars for each day
- Overall study progress dashboard
- Subject-wise completion tracking
- Daily breakdown statistics

✅ **Simple & Elegant UI**
- Clean Material Design interface
- Easy navigation with bottom tabs
- Smooth animations
- Light color scheme for studying

✅ **Personal Use**
- Private repository (only for you)
- Local database (no cloud sync)
- All data stored locally
- Works offline

## 🚀 Getting Started

### Prerequisites
- Android tablet
- Expo Go app (free from Google Play Store)
- Node.js & npm (for development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jayinprasad/royal-study-plan.git
   cd royal-study-plan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Run on Android:**
   - Press `a` in the terminal to open on Android
   - Or scan QR code with Expo Go app

## 📊 Screens

### 1. Home Tab
- View today's (or selected day's) curriculum
- See all 3 subjects for the day
- Quick progress indicator
- Navigate between days with Next/Previous

### 2. Detail View
- Click any subject to see full checklist
- Check off completion criteria
- View progress bar
- Get pro tips for studying

### 3. Progress Tab
- Overall completion percentage
- Statistics cards (Days Planned, Complete, In Progress)
- Day-by-day breakdown
- Subject-wise progress tracking

### 4. Settings Tab
- Notification preferences
- App version info
- Help & support
- Privacy policy

## 💾 Local Database Structure

```
Days
├── Day Number (1-60)
├── Phase (Class 11 / Class 12)
└── Subjects
    ├── Physics
    ├── Chemistry
    ├── Maths
    └── Checklist (5 items each)
        ├── Theory completed
        ├── Short notes made
        ├── 15–20 questions solved
        ├── Formulas/reactions memorized
        └── Doubts marked
```

## 🎯 Usage

1. **Open the app** on your Android tablet
2. **View today's plan** in the Home tab
3. **Tap on a subject** to see the checklist
4. **Check off items** as you complete them
5. **Monitor progress** in the Progress tab
6. **Adjust settings** in the Settings tab

## 🔒 Privacy

This is a **personal use only** app:
- No data is sent to servers
- All data stays on your device
- Private GitHub repository
- Complete offline functionality

## 📝 Notes

- The 60-day curriculum is pre-loaded
- Complete all 5 checkpoints daily for best results
- Your progress is automatically saved
- All data persists even after app restart

## 🛠 Technologies Used

- **React Native** - Cross-platform mobile framework
- **Expo** - Easy Android development & deployment
- **SQLite** - Local database
- **React Navigation** - App navigation
- **Material Design** - UI Components

## 📞 Support

For issues or questions, check the Settings → Help & Support section.

---

**Built with ❤️ for serious JEE/Board exam preparation**

Last Updated: June 2, 2026
