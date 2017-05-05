# Requirement
some presetup is required.
check instruction
- [node-opencv](https://github.com/peterbraden/node-opencv)

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
