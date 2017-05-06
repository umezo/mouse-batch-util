# Requirement

- node v7.6.0 ~
  - async / await
- opencv
  - setup according to [node-opencv](https://github.com/peterbraden/node-opencv) readme

# Support
Environments supported by this library depends on backend libraries.

- position detection
  - opencv
  - [node-opencv](https://github.com/peterbraden/node-opencv)
- mouse operation and capturing screen
  - [robotjs](https://github.com/octalmage/robotjs)

# For retina display
In retina display resolution of screen shot and detected position is double.
Set `POSITION_MODIFIER` environment variable to ajust this. (maybe set to `2`)
