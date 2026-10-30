// Movement Prep library: shared by Makos HQ and Hitting 2.0 (Hitting 2.0's build.py copies this file).
// DRAFT: movement list is a placeholder for the physical therapist to replace / approve.
// To add a video: set `video` on a move to a YouTube/Vimeo link or an .mp4 URL, e.g.
//   mv('Glute Bridge', '10 reps', 'https://youtu.be/xxxx')
// Leave it null and the app shows "Video coming".

(function () {
  const mv = (name, dose, video = null, cue = '') => ({ name, dose, video, cue });

  // Each routine is broken into the same four phases: Raise -> Mobilize -> Activate -> Prime.
  const PHASES = {
    raise:    { name: 'Raise',    goal: 'Get warm. Heart rate up, blood moving.' },
    mobilize: { name: 'Mobilize', goal: 'Open up the hips, spine and shoulders.' },
    activate: { name: 'Activate', goal: 'Wake up the muscles that protect and power the swing / throw.' },
    prime:    { name: 'Prime',    goal: 'Fast, sport-like reps so the first real one is not the first fast one.' }
  };
  const ph = (key, moves) => ({ ...PHASES[key], key, moves });

  const preHitting = band => ({
    id: 'hitting', name: 'Pre-Hitting', icon: '⚾', minutes: 8,
    when: 'Before cage work, BP, or a game.',
    phases: [
      ph('raise',    [mv('Jog + Skip', '1 lap'), mv('Lateral Shuffle', '2 down & back')]),
      ph('mobilize', [mv("World's Greatest Stretch", '3 each side'), mv('Open Book (T-Spine Rotation)', '5 each side'), mv('90/90 Hip Switches', '6 total')]),
      ph('activate', [mv('Glute Bridge', '10 reps'), mv(band === 'youth' ? 'Side Steps' : 'Lateral Band Walk', '10 steps each way'), mv('Dead Bug', '6 each side')]),
      ph('prime',    [mv(band === 'hs' ? 'Med-Ball Rotational Throw' : 'Slow-to-Fast Dry Swings', band === 'hs' ? '5 each side' : '5 swings'), mv('Broad Jump + Stick', '3 reps')])
    ]
  });

  const preThrowing = band => ({
    id: 'throwing', name: 'Pre-Throwing · Arm Care', icon: '🎯', minutes: 10,
    when: 'Before any catch, practice, or game. Every time.',
    phases: [
      ph('raise',    [mv('Jog', '1 lap'), mv('Carioca', '2 down & back')]),
      ph('mobilize', [mv('Arm Circles (small to big)', '10 each way'), mv('Quadruped T-Spine Reach', '5 each side'), mv('Wall Slides', '8 reps')]),
      ph('activate', band === 'youth'
        ? [mv('Prone Y-T-W (no weight)', '5 of each'), mv('Bear Crawl', '2 lengths')]
        : [mv('Band Pull-Aparts', '12 reps'), mv('Band External Rotation', '10 each arm'), mv('Band Y-T-W', '8 of each')]),
      ph('prime',    [mv('Wrist Flips', '10 throws'), mv('Short-to-Long Catch', 'Coach-led progression')])
    ]
  });

  const recovery = band => ({
    id: 'recovery', name: 'Day-Off Mobility', icon: '🧘', minutes: band === 'youth' ? 10 : 15,
    when: 'Off days or after a game. Easy pace, no pain.',
    phases: [
      ph('raise',    [mv('90/90 Breathing', '5 slow breaths')]),
      ph('mobilize', [mv('Half-Kneeling Hip Flexor Stretch', '30 sec each side'), mv('Hamstring Floss', '8 each side'), mv('Thread the Needle', '5 each side'), mv("Child's Pose Lat Reach", '30 sec each side')]),
      ph('activate', [mv(band === 'youth' ? 'Prone Y-T-W (no weight)' : 'Light Band Arm Care', 'Easy set')])
    ]
  });

  const GROUPS = [
    { id: 'youth', name: 'Ages 7–10', short: '7–10',
      note: 'Keep it a game. One cue at a time, about where the body goes ("push the floor away"), not muscles. Short and often beats long and rare. No weights.' },
    { id: 'mid', name: 'Ages 11–13', short: '11–13',
      note: 'Growth-spurt years. Mobility matters most here. Light bands only; quality over speed.' },
    { id: 'hs', name: 'High School', short: 'HS',
      note: 'Full routine before every throwing day. Med-ball work replaces dry swings in Prime.' }
  ];
  GROUPS.forEach(g => { g.routines = [preHitting(g.id), preThrowing(g.id), recovery(g.id)]; });

  window.MOVEMENT_PREP = {
    title: 'Movement Prep',
    credit: '',        // e.g. 'Built by [Name], PT, DPT'. Leave blank until it's signed off
    draft: true,       // shows the "draft list" banner; set false once the PT approves
    groups: GROUPS
  };
})();
