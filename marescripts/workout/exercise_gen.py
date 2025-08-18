from dataclasses import dataclass
from exercises import EXERCISES, Exercise
import copy
import random

# Algorithm:
# 1. Select 1-2 core exercises from each category
# 2. Assign randomized times (increments of 10 seconds, with a minimum of 30 seconds and maximum of 90 seconds)
# 3. Select aux exercises from random category and assign randomized times until time window is filled.

# Future:
# - Circuits?

@dataclass
class Workout:
    exercises : list[Exercise]
    total_dur : int

def round_robin_iter_aux(
    shuffled_exercises : dict,
    dict_exercises_out : dict,
    total_dur_start,
    max_time_s,
    max_ex_s,
    min_ex_s):
    i = 0
    total_dur = total_dur_start
    while True:
        for category in shuffled_exercises.keys():
            auxes = shuffled_exercises[category]['aux']
            if i >= len(auxes):
                continue
            sel_ex = auxes[i]
            sel_ex.time_sec = 10 * round((
                (random.random() * (max_ex_s - min_ex_s)) + min_ex_s) / 10)
            total_dur += sel_ex.time_sec
            dict_exercises_out[category]['aux'].append(sel_ex)
            if total_dur > max_time_s:
                return
        i += 1

def generate_workout_norepeat(
    max_time_s: int = 60 * 15, # 15 minute workout
    max_ex_s : int = 90, # maximum exercise time, seconds
    min_ex_s : int = 30, # minimum exercise time, seconds
    break_s : int = 10, # breaks between categories
    ):
    dict_exercises = {}
    shuffled_exercises = {}

    num_breaks = len(EXERCISES.keys())
    total_dur = num_breaks * break_s
    for k,v in EXERCISES.items():
        core_exercise_count = round(random.random() + 1)

        shuffled_exercises[k] = copy.deepcopy(v)
        random.shuffle(shuffled_exercises[k]['core'])
        random.shuffle(shuffled_exercises[k]['aux'])

        core_exercises = shuffled_exercises[k]['core'][0:core_exercise_count]
        for ex in core_exercises:
            ex : Exercise
            ex.time_sec = 10 * round((
                (random.random() * (max_ex_s - min_ex_s)) + min_ex_s) / 10)
            total_dur += ex.time_sec
        dict_exercises[k] = {
            'core': core_exercises,
            'aux': []}

    # Round robin iteration
    round_robin_iter_aux(
        shuffled_exercises=shuffled_exercises,
        dict_exercises_out=dict_exercises,
        total_dur_start=total_dur,
        max_time_s=max_time_s,
        max_ex_s=max_ex_s,
        min_ex_s=min_ex_s)

    final_exercises = []
    for v in dict_exercises.values():
        final_exercises.extend(v['core'])
        final_exercises.extend(v['aux'])
        final_exercises.append(Exercise(name='break', time_sec=break_s))

    return Workout(final_exercises, total_dur=total_dur)