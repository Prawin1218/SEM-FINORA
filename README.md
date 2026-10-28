# FINORA – Smart Finance & Budget Tracker

> **"Your Money. Your Future."**  
> MCA Semester III – Mobile Application Development Examination Project  
> **Brand Theme**: Premium Fintech Yellow + Black (#FFD600 / #121212) with Persistent Dark & Light Modes

---

## 1. Project Overview

**FINORA** is an original, production-grade React Native and Expo mobile application designed for personal finance management and budget tracking. It features distinct role-based experiences for **Customers** and **System Administrators**, complete local data persistence, personalized transaction alerts, period-wise financial reporting, category-level spending distribution, and advanced analytics.

The application has been completely redesigned with a **Premium Yellow + Black Fintech Theme**, featuring a **live Dark Mode and Light Mode** architecture and full mobile responsiveness optimized for standard Android and iOS mobile displays.

---

## 2. Examination Requirements Matrix

| Requirement | Implementation Details | Status |
| :--- | :--- | :--- |
| **Home Screen (Welcome)** | Geometric brand hero, brand pitch, Customer & Admin sign-in entries, quick Sun/Moon toggle | ✅ Satisfied |
| **Customer Home Dashboard** | Hero Balance Card with Yellow accents, Quick Actions, Period Reports, Spending Insights, Recent Logs | ✅ Satisfied |
| **Analysis Screen** | Customer view (cashflow ratios, spending trends, category ranks) & Admin platform analytics | ✅ Satisfied |
| **Customer Profile & Edit** | Account details, tier badge, avatar presets, Theme & Appearance segmented switcher, inline validation | ✅ Satisfied |
| **Month-wise Transactions** | Month filter pills, dynamic monthly summary, search bar, type & category filters, safe padding | ✅ Satisfied |
| **Overall Categories** | 2-column responsive grid covering all 9 required categories with progress meters | ✅ Satisfied |
| **Category Details** | Category hero card, budget share %, current month total, category-exclusive transactions | ✅ Satisfied |
| **Admin Dashboard** | System stats (demo users, total income, total expenses, transactions), activity telemetry | ✅ Satisfied |
| **User Overview** | Mock registered user registry with search, status pills, and detail modal | ✅ Satisfied |
| **Stack Navigation** | Root authentication stack, detail screens (Add/Edit Transaction, Edit Profile, Category Details) | ✅ Satisfied |
| **Bottom Tab Navigation** | 5 Customer tabs (Home, Analysis, Transactions, Categories, Profile) with Yellow active pills | ✅ Satisfied |
| **Drawer Navigation** | Custom branded drawers for both Customer and Administrator with Yellow highlight & theme switch | ✅ Satisfied |
| **Personalized Alerts** | Dynamic alerts addressing the logged-in customer by name on all mutations | ✅ Satisfied |
| **Daily, Weekly, Monthly Reports**| Interactive 3-way toggle with clear Yellow highlight calculating live metrics from transaction records | ✅ Satisfied |
| **Dark & Light Mode** | Instant theme switcher, persistent via `@finora_theme_mode` in AsyncStorage, defaults to Dark Mode | ✅ Satisfied |
| **Mobile Responsiveness** | No overflow, text truncation protections, keyboard avoiding views, safe-area bottom tab clearance | ✅ Satisfied |
| **Local Persistence** | `AsyncStorage` with automatic resilient in-memory fallback | ✅ Satisfied |

---

## 3. Technology Stack

- **Framework**: React Native 0.88 with Expo SDK 58
- **Language**: JavaScript (ES6+ / React 19)
- **Navigation**: React Navigation v7 (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `@react-navigation/drawer`)
- **Theme Architecture**: Centralized `ThemeContext` providing dynamic `darkTheme` / `lightTheme` tokens and persistent storage
- **State Management**: React Context API (`AuthContext`, `TransactionContext`, `ThemeContext`)
- **Storage**: `@react-native-async-storage/async-storage` with seamless in-memory fallback
- **Icons**: `@expo/vector-icons` (`Ionicons`)
- **Styling**: React Native `StyleSheet` with responsive layout metrics (`flexbox`, `useSafeAreaInsets`, `KeyboardAvoidingView`)
- **Animations**: React Native `Animated` API for in-app alert banners and transitions

---

## 4. Visual Identity & Brand Design System (Yellow + Black)

FINORA features a high-contrast, modern fintech design inspired by leading wealth management and neo-banking platforms:

### Brand Color Tokens

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Primary Yellow** | `#FFD600` | Primary buttons, active navigation pills, highlighted metrics, selected filters |
| **Bright Yellow** | `#FFEA00` | Subtle active borders, focus glows, glowing badges |
| **Deep Black** | `#121212` | Dark cards, bottom tabs in dark mode, text on yellow buttons |
| **Dark Background** | `#0B0B0B` | Default dark screen canvas |
| **Dark Surface** | `#1C1C1C` | Cards, forms, modals in dark mode |
| **Secondary Dark Surface** | `#262626` | Elevated cards, inner chips, input fields |
| **Primary Light Background** | `#FFFDF5` | Warm off-white canvas for light mode |
| **Light Surface** | `#FFFFFF` | Cards, forms, modals in light mode |
| **Secondary Light Surface** | `#F5F5F0` | Inner chips, input backgrounds in light mode |
| **Primary Dark Text** | `#171717` | High-contrast main text in light mode |
| **Secondary Light Text** | `#757575` | Captions, muted labels in light mode |
| **Income Indicator** | `#16A34A` | Emerald Green for inflows & income tags |
| **Expense Indicator** | `#EF4444` | Coral Red for outflows & expense tags |
| **Warning / Alert** | `#F59E0B` | Amber for warnings and important notices |

### Yellow Usage Rules
- **High-contrast readability**: Text on yellow buttons and active yellow pills is strictly `#121212` (black), never white.
- **Selective emphasis**: Yellow is used selectively on interactive items (active tabs, primary CTA buttons, selected period filters, balance highlights) to maintain a premium look without visual fatigue.

---

## 5. Dark Mode & Light Mode Implementation

1. **Default Mode**: Dark Mode (`#0B0B0B`) is the initial default on first application launch.
2. **Instant Reactive Switching**: Switching themes via the Profile screen or header toggle immediately updates all screens, cards, inputs, buttons, navigation bars, and drawers without needing an application restart.
3. **Persistence**: The selected theme mode (`'dark'` or `'light'`) is saved to `AsyncStorage` under `@finora_theme_mode` and restored automatically on next launch.
4. **Access Points**:
   - **Quick Toggle**: Sun/Moon icon in headers and drawer menus.
   - **Segmented Control**: Dedicated "Theme & Appearance" selector on the Profile screen.

---

## 6. Mobile Responsiveness Optimizations

The user interface has been optimized for standard mobile screen sizes:

1. **Safe-Area Inset Handling**: All scrollable screens compute dynamic bottom padding (`insets.bottom + 95`) so bottom navigation tabs never obscure cards or buttons.
2. **Horizontal Overflow Prevention**: Hardcoded component widths have been replaced with `width: '100%'`, flexible flexbox containers, and responsive column calculations (`width: '48.5%'` with `justifyContent: 'space-between'`).
3. **Text Truncation Protections**: Long transaction titles, customer names, and large currency amounts use `numberOfLines={1}` with `adjustsFontSizeToFit` where appropriate.
4. **Keyboard Usability**: Forms (`SignIn`, `SignUp`, `AddTransaction`, `EditTransaction`, `EditProfile`) are wrapped in `KeyboardAvoidingView` with `keyboardShouldPersistTaps="handled"` on the enclosing `ScrollView`.
5. **Touch Ergonomics**: All interactive buttons and chips have touch targets of at least 44px with comfortable padding and `hitSlop` where appropriate.

---

## 7. Demo Credentials

The application includes pre-configured demo credentials for examination evaluation. On the Sign In screen, **Quick-Fill** helper buttons allow instantaneous testing:

### A. Customer Demo Account
- **Email**: `alex@finora.com`
- **Password**: `alex123`
- **Role**: `Customer`
- **Initial Data**: Populated with realistic income and expense transactions spanning today, past week, current month, and prior months.

### B. Administrator Demo Account
- **Email**: `admin@finora.com`
- **Password**: `admin123`
- **Role**: `Administrator`
- **Privileges**: Platform-wide telemetry, system activity signals, aggregate category distribution, and user account directory.

---

## 8. Project Architecture & Folder Structure

```
SEM-EXAM/
├── App.js                         # Root entry point with ThemeProvider & NavigationContainer
├── app.json                       # Expo configuration & app metadata
├── index.js                       # Entry point with Gesture Handler registration
├── package.json                   # Verified Expo SDK 58 dependencies
├── README.md                      # Comprehensive project documentation
└── src/
    ├── components/
    │   ├── BalanceCard.js         # Hero balance card with Yellow accents
    │   ├── CategoryCard.js        # 2-column grid card with progress indicators
    │   ├── CustomButton.js        # Reusable button with Yellow variant & loading state
    │   ├── CustomInput.js         # Form input with validation error display
    │   ├── EmptyState.js          # Reusable zero-data placeholder with action
    │   ├── LoadingIndicator.js    # Themed activity indicator
    │   ├── PersonalizedAlert.js   # Animated top banner for transaction alerts
    │   ├── ReportCard.js          # Daily/Weekly/Monthly interactive report card
    │   ├── ScreenHeader.js        # Header with Sun/Moon theme toggle & drawer triggers
    │   └── TransactionItem.js     # Transaction list row with category badge
    ├── context/
    │   ├── AuthContext.js         # User state, login, registration, session storage
    │   └── TransactionContext.js  # Transaction CRUD, live calculations, alerts
    ├── data/
    │   └── mockData.js            # Initial users, categories, and transactions
    ├── navigation/
    │   ├── AdminDrawerNavigator.js     # Drawer navigation for Admin with theme styling
    │   ├── AppNavigator.js             # Root Stack Navigator with role protection
    │   ├── CustomerDrawerNavigator.js  # Drawer navigation for Customer with theme switch
    │   └── CustomerTabNavigator.js     # 5-tab Bottom navigation with Yellow active pills
    ├── screens/
    │   ├── AddTransactionScreen.js     # Add transaction form with KeyboardAvoidingView
    │   ├── AdminDashboardScreen.js     # Admin telemetry & system activity
    │   ├── AnalysisScreen.js           # Deep-dive analytics (Customer & Admin)
    │   ├── CategoriesScreen.js         # 9 required categories 2-column grid
    │   ├── CategoryDetailsScreen.js    # Category-filtered transactions & share
    │   ├── CustomerHomeScreen.js       # Customer main dashboard with Sun/Moon toggle
    │   ├── EditProfileScreen.js        # Profile edit form with avatar selector
    │   ├── EditTransactionScreen.js    # Edit & delete transaction form
    │   ├── HomeScreen.js               # Welcome / Entry screen with Sun/Moon toggle
    │   ├── ProfileScreen.js            # Customer profile with Theme & Appearance switcher
    │   ├── SignInScreen.js             # Sign In screen with role selector & demo fill
    │   ├── SignUpScreen.js             # Customer registration screen
    │   ├── TransactionsScreen.js       # Month-wise transaction ledger & search
    │   └── UserOverviewScreen.js       # Admin user directory & modal details
    ├── storage/
    │   └── localStorage.js        # AsyncStorage keys & fallback
    ├── theme/
    │   ├── colors.js              # Core Yellow + Black palette tokens
    │   ├── themes.js              # Semantic darkTheme & lightTheme definitions
    │   ├── ThemeContext.js        # ThemeProvider & useTheme hook with persistence
    │   ├── spacing.js             # Margins, paddings, and border radii
    │   └── typography.js          # Font weights, sizes, and line heights
    └── utils/
        ├── dateUtils.js           # Date grouping, formatting, period checks
        ├── formatters.js          # INR currency & percentage formatters
        ├── reportUtils.js         # Period report & trend calculations
        └── validation.js          # Input validation helpers
```

---

## 9. Installation & Execution Instructions

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v24)
- Expo Go app on mobile device OR a web browser

### Commands

1. **Install Dependencies** (Expo-compatible resolution):
   ```bash
   npx expo install
   ```

2. **Start the Development Server**:
   ```bash
   npx expo start
   ```

3. **Run on Desired Target**:
   - **Android Device/Emulator**: Press `a` in terminal or scan QR code in Expo Go
   - **iOS Device/Simulator**: Press `i` in terminal or scan QR code in Expo Go
   - **Web Browser**: Press `w` in terminal or run `npx expo start --web`

4. **Verify Health and Configuration**:
   ```bash
   npx expo-doctor
   ```

---

## 10. Verification Checklist

- [x] **Yellow + Black Palette**: #FFD600 primary yellow, #121212 deep black, #0B0B0B dark canvas, #FFFDF5 light canvas.
- [x] **Dark / Light Modes**: Immediate dynamic switching without app restart; persistent in AsyncStorage.
- [x] **Mobile Responsiveness**: Tab bars don't cover content; forms handle open keyboards; no horizontal overflows.
- [x] **All Examination Screens**: Home, SignIn, SignUp, CustomerHome, AdminDashboard, Analysis, Transactions, Categories, CategoryDetails, Profile, EditProfile, AddTransaction, EditTransaction, UserOverview.
- [x] **All 3 Navigation Types**: Stack, Bottom Tab (5 tabs), Drawer (Customer & Admin).
- [x] **Role Separation**: Customer vs Administrator accounts strictly segregated.
- [x] **Personalized Alerts**: In-app animated banner greets user by name on transaction create/edit/delete.

---

*FINORA – Smart Finance & Budget Tracker © 2026. Built for MCA Mobile Application Development Examination.*
