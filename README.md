# Dining Philosophers Simulation

## Overview
The Dining Philosophers problem is a classic example in computer science that illustrates issues related to concurrency and resource allocation. It involves philosophers sitting around a table, each needing two forks to eat, leading to potential deadlock and starvation scenarios.

## Implementation
This simulation is implemented using HTML5 Canvas for visualization and JavaScript for logic. The simulation visually represents philosophers and forks, allowing users to observe the state changes and interactions.

## Key Features
- **Philosopher States**: Philosophers can be in one of three states - thinking, hungry, or eating.
- **Fork Management**: Forks are shared resources that philosophers must acquire to eat.
- **User Controls**: Users can start, pause, and stop the simulation using buttons.

## Setup and Running
To run the simulation:
1. Ensure you have a web browser that supports HTML5 Canvas.
2. Open the `index.html` file in your browser.
3. Use the buttons to control the simulation.

## Detailed Description
This simulation models the concurrency problem by allowing each philosopher to pick up forks only when both are available, thus preventing deadlock. The visual representation helps in understanding the state transitions of philosophers and the allocation of forks. The use of HTML5 Canvas provides a dynamic and interactive visualization, while JavaScript handles the logic for state management and user interactions.

The simulation is designed to be intuitive, with clear visual cues for each philosopher's state and the availability of forks. The user interface is straightforward, with buttons to control the flow of the simulation, making it accessible for educational purposes and demonstrations.

## Resources
- [Dining Philosophers Problem](https://en.wikipedia.org/wiki/Dining_philosophers_problem)
- HTML5 Canvas Documentation
- JavaScript Documentation
