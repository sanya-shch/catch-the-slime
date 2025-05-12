# 🎮 Catch the Slime

**"Catch the Slime"** is a fun, fast-paced arcade game where your goal is to catch all the bouncing slimes before time runs out!
Built with **TypeScript**, **PixiJS**, and **Howler.js**.
Includes multiple levels, time boosters, sound effects, and a star-based rating system.

## 🚀 Project Setup

```bash
npm install
```

## Run the project

```bash
# Development mode
npm run start
```

## 📁 File Structure

```bash
 ├── 📁public/
 │   ├── 📁assets/
 │   │   ├── 📁levels/
 │   │   │   ├── level1.json
 │   │   │   ├── level2.json
 │   │   │   └── level3.json
 │   │   ├── 📁sounds/
 │   │   │   ├── bg.mp3
 │   │   │   ├── kill.mp3
 │   │   │   ├── win.mp3
 │   │   │   └── lose.mp3
 │   │   ├── background.jpg
 │   │   ├── Dead.json
 │   │   ├── Dead.png
 │   │   ├── Idle.json
 │   │   └── Idle.png
 │   └── index.html
 ├── 📁src/
 │   ├── 📁core/
 │   │   ├── Game.ts
 │   │   └── constants.ts
 │   ├── 📁entities/
 │   │   ├── Enemy.ts
 │   │   ├── EnemyAssets.ts
 │   │   └── EnemyBehavior.ts
 │   ├── 📁managers/
 │   │   ├── AssetManager.ts
 │   │   ├── LevelManager.ts
 │   │   ├── SoundManager.ts
 │   │   └── UIManager.ts
 │   ├── 📁types/
 │   │   └── index.ts
 │   ├── 📁utils/
 │   │   ├── colorUtils.ts
 │   │   └── uiUtils.ts
 │   └── index.ts
 ├── .gitignore
 ├── package.json
 ├── package-lock.json
 ├── README.md
 ├── tsconfig.json
 └── webpack.config.js
```

## 📸 Screenshots

![Main](/assets/MainScreenshot.png)
![Game](/assets/GameScreenshot.png)
![Won](/assets/WonScreenshot.png)
![Lose](/assets/LoseScreenshot.png)
![HardMode](/assets/HardModeScreenshot.png)
