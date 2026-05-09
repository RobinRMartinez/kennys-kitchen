# 🍳 From Kenny's Kitchen to Ours

A family recipe sharing app built with React and Firebase. 
Family members can add, browse, and share recipes from any device 
in real time.

## Live App

**[Launch Kenny's Kitchen](https://from-kennys-kitchen.web.app)**

## Features

- Add recipes with title, author, category, emoji, ingredients, and instructions
- Search recipes by name or family member
- Filter by category (Breakfast, Lunch, Dinner, Dessert, Snack, Drinks, Other)
- Real-time updates — everyone sees new recipes instantly
- Works on any device — phone, tablet, or computer
- Installable on phone home screen like a native app

## Planned Features

- AI recipe parser — paste any recipe text and auto-fill all fields automatically

## Tech Stack

React · Vite · Firebase Firestore · Firebase Hosting

## Local Development

```bash
npm run dev
```

## Deployment

```bash
npm run build
firebase deploy --only hosting:kennys-kitchen
```

## What I Learned

This project introduced me to React component architecture, 
real-time database sync with Firestore, and deploying a 
production app used by real people daily. The planned AI 
integration will use the Claude API to parse unstructured 
recipe text into structured data automatically.

## Author

Robin Martinez — [github.com/RobinRMartinez](https://github.com/RobinRMartinez)

---
*Made with ❤️ for the family*
