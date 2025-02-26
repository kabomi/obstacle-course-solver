# Suse Observability Front-end Engineer Assessment

## Assignment

Your assignment is to create a **visual obstacle course solver**. The obstacle course game is played on a grid of cells. The object of the game is to calculate a route from the starting location to the target location, navigating the terrain in the grid. Each game starts with a blank grid and consists of two phases:

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
- If the solver is unable to calculate a route, it displays a message to that effect.

## Requirements

- Develop the solution to the assignment using **React** and **TypeScript**.
- Ensure your solution can be run standalone, either by:
  - Running `npm start`, **or**
  - Opening the `index.html` file in a browser.
