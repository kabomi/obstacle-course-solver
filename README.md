# Obstacle Course Solver

This app is part of a technical assessment. It has been coded mostly following BDD approach.

## Description

The obstacle course game is played on a grid of cells. The object of the game is to calculate a route from the starting location to the target location, navigating the terrain in the grid. Each game starts with a blank grid and consists of two phases:

1. **Placement Phase**:  
   The player places the starting location, the target location, and a number of obstacles on cells on the grid.

2. **Solving Phase**:  
   The solver calculates the shortest route from the starting location to the target location and displays the route on the grid.

## Obstacles

The obstacles that can be placed are:

- **Boulder**  
  There is no way to travel through boulders.
- **Gravel**  
  When traveling across gravel, you can only go at half the speed of travel across regular terrain.
- **Wormhole Entrance**  
  You can travel instantaneously to any wormhole exit from this location.
- **Wormhole Exit**  
  This location can be reached instantaneously from any wormhole entrance.

## Important Details

- There is only **one** starting location and **one** target location per game.
- When the solver is unable to calculate a route, it displays "Unable to calculate Route".

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run test`

Launches the Jest test runner in the interactive watch mode.

### `npm run test:ci`

Launches the Jest test runner on a single run and collects code coverage.

### `npm run lint`

We are using eslint with prettier in order to avoid typical issues and to have a common coding-style.
Feel free to configure your IDE prettier/eslint plugins to don't have the need to run this command.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles NextJS/React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


## Requirements

- Node Version >= 18.18.2
