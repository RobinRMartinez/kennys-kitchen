# From Kenny's Kitchen to Ours 🍳

A family recipe sharing app built with React and Firebase. Kenny and the family can add, browse, and share recipes from any device.

## Live App
**https://from-kennys-kitchen.web.app**

---

## Project Info
- **Firebase Project:** family-recipes-d806b
- **Database:** Cloud Firestore (us-central1)
- **Hosting:** Firebase Hosting
- **Account:** robinbuchler15@gmail.com

---

## Local Development

### Prerequisites
- Node.js v24+
- Firebase CLI v15+

### Getting Started
1. Open Command Prompt
2. Navigate to the project folder:
```
cd "C:\Users\Robin\OneDrive\Apps\kennys-kitchen"
```
3. Start the local dev server:
```
npm run dev
```
4. Open your browser to **http://localhost:5173**

---

## Deploying Updates
Whenever you make changes to the app, follow these steps to push them live:

**Step 1 — Build the app:**
```
npm run build
```

**Step 2 — Deploy to Firebase:**
```
firebase deploy --only hosting:kennys-kitchen
```

That's it! Changes will be live at https://from-kennys-kitchen.web.app within seconds.

---

## Project Structure
```
kennys-kitchen/
├── src/
│   └── App.jsx          ← Main app code (edit this for changes)
├── dist/                ← Built files (auto-generated, don't edit)
├── firebase.json        ← Firebase hosting config
├── .firebaserc          ← Firebase project config
├── package.json         ← Project dependencies
└── README.md            ← This file
```

---

## Firebase Console
Manage your database and hosting at:
**https://console.firebase.google.com/project/family-recipes-d806b**

- **Firestore Database** → View, edit, or delete recipes
- **Hosting** → View deployment history
- **Rules** → Manage database security

---

## Features
- 🍳 Add recipes with title, author, category, emoji, note, ingredients and instructions
- 🔍 Search recipes by name or family member
- 📂 Filter by category (Breakfast, Lunch, Dinner, Dessert, Snack, Drinks, Other)
- ⚡ Real-time updates — everyone sees new recipes instantly
- 📱 Works on any device — phone, tablet, or computer
- 🏠 Can be added to phone home screen like a native app

## Adding to Phone Home Screen
**iPhone:** Open in Safari → Share button → "Add to Home Screen"

**Android:** Open in Chrome → 3 dots menu → "Add to Home Screen"

---

## Family Members
- Kenny 👨‍🍳 (primary contributor)
- Chelsea
- Tess
- Mom
- Dad

---

## Built With
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

*Made with ❤️ for the family*
