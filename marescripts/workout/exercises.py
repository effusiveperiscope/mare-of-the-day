from dataclasses import dataclass
@dataclass
class Exercise:
    name: str
    time_sec: int = 0
    # Whether exercise is performed on one side at a time
    unilateral: bool = False 

EXERCISES = {
    'warm-up': {
        'core': [
            Exercise('jumping jacks'),
        ],
        'aux': [
            Exercise('butt kicks'), 
            Exercise('high knees'), 
            Exercise('arm circles'), 
            Exercise('standing leg raises'), 
            Exercise('torso twists'),
        ]
    },
    'lower body': {
        'core': [
            Exercise('squats'), 
            Exercise('lunges'), 
        ],
        'aux': [
            Exercise('glute bridges'), 
            Exercise('calf raises'), 
            Exercise('jump squats'),
            Exercise('supermans')
        ]
    },
    'upper body': {
        'core': [
            Exercise('push-ups')
        ],
        'aux': [
            Exercise('pike push-ups'), 
            Exercise('diamond push-ups'), 
            Exercise('tricep dips'),
        ]
    },
    'core': {
        'core': [
            Exercise('plank'), 
            Exercise('crunches'), 
            Exercise('side plank', unilateral=True),
            Exercise('bicycle crunches')
        ],
        'aux': [
            Exercise('plank shoulder taps'), 
            Exercise('flutter kicks')
        ]
    },
    'misc': {
        'core': [
            Exercise('burpees')
        ],
        'aux': []
    }
}