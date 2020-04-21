# exercise-picker

> pick exercise videos, pick random chapters

`exercise-picker` is a small set of utilities that used together, help pick videos and chapters from videos to combine into a playlist. this was created as a means to get short, unique, exercise workouts.

# internals

`exercise-picker` consists of three different programs,

1. [`pick-video`](./pick-video.js), to select random videos out of a selection of videos.
2. [`pick-chapter`](./pick-chapter.js), to select random chapters out of a selection of videos.
3. [`pick-playlist`](./pick-playlist.js), to combine a chapter selection into a playlist.
