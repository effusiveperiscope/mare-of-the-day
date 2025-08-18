# We have several "tracks" of audio we want to overlay on each other

# 1. Background music - extend 15 minutes, possibly crossfade between them with a set time
# 2. SFX - Like exercise starts and exercise finish, n-second counters.
# 3. Rainbow Dash dialogue. 

# More thinking here:
# - There would be some kind of introduction and exit - so the dialogue influences timing

# We should try making one of these manually.

from exercise_gen import Workout

def generate_audio(workout : Workout):
    workout_dur_ms = workout.total_dur * 1000 

    pass