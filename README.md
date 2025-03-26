# Dining Philosophers Simulation

A visual implementation of the classic Dining Philosophers problem, demonstrating concurrent programming concepts and resource sharing challenges through an interactive web-based simulation.

## Overview

The Dining Philosophers problem is a classic computer science problem that illustrates synchronization issues and techniques for resolving them. In this simulation, five philosophers sit around a circular table, alternating between thinking, becoming hungry, and eating. Each philosopher needs two forks to eat, but there are only five forks in total (one between each pair of philosophers).

## Features

- 🎨 Visual representation of philosophers and forks
- 🔄 Real-time state updates
- ⏯️ Start, pause, and stop controls
- 📊 Status display for each philosopher
- 📱 Responsive canvas design
- 🎯 Clear state indicators (thinking, hungry, eating)
- 💫 Visual effects for different states
- 📋 Interactive legend

## States

- **Thinking (Blue)**: Philosopher is in contemplation
- **Hungry (Orange)**: Philosopher is attempting to acquire forks
- **Eating (Green)**: Philosopher has successfully acquired both forks and is eating
