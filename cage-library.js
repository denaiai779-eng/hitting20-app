// Hitting 2.0 cage plan library: focus areas and drills for 45-minute cage sessions.
// Coaches assign each player 1-3 focus areas; the session builder pulls drills from here.
// feeder: 'none' = hitter alone, 'tosser' = a parent or partner feeds (soft toss / front toss).

const CAGE_WARMUP = {
  id: 'warmup', name: 'Warm-Up', minutes: 5,
  steps: [
    'Jog the length of the cage and back twice.',
    '10 arm circles each way, 10 trunk twists, 10 walking lunges.',
    '10 dry swings at half speed, then 5 at full speed. Finish every swing balanced.'
  ],
  cue: 'Get loose before you get loud.'
};

const CAGE_FOCUS = [
  {
    id: 'ground-force', name: 'Farm Board Series', pillar: 'POWER', series: true,
    intro: { url: 'https://www.instagram.com/reel/DdSuLb_gtDR/', label: 'Intro to ground force (@okswings)', text: 'A lot of swing problems start further down the chain than we think. Before you change the hands, barrel or shoulders, look at the foundation: can you create leverage against the ground?' },
    why: 'Ground force, one detail at a time. Feel the ground push back into the back leg, land on the front leg and finish in a lunge, then take it to the tee. The barrel works north-south through the zone, not around it.',
    drills: [
      { id: 'fb-back-hold', name: 'Back Foot Scale', minutes: 3, feeder: 'none', equip: 'Farm Board',
        detail: 'Drive the number on the scale up as you stride. Stay grounded on the backside.',
        steps: ['Set the Farm Board under your back foot the way Coach showed you.', 'Think of the board as a scale. Load into it and feel the pressure on the inside of your back foot.', 'Stride out slowly. As you stride, drive the number on the scale as HIGH as you can. Freeze when the front foot lands.'],
        reps: '2 sets of 5 slow strides', cue: 'Maintain pressure. Stay grounded. Don\'t push out of your backside.',
        check: 'The pressure on the back foot gets stronger as you stride, not weaker, and you land stable.',
        mistake: 'Pushing out of the backside (weight leaving the back foot) as you stride.',
        video: { url: 'https://www.instagram.com/reel/DdR4dInvXB0/', label: 'Farm Board backside: the scale (@okswings)' }, source: "Joey Cunha's Farm Board drills" },
      { id: 'fb-back-swing', name: 'Back Foot Board Swings', minutes: 4, feeder: 'none', equip: 'Farm Board, tee',
        detail: 'Push the ground away to start the swing.',
        steps: ['Back foot on the Farm Board, tee middle-middle.', 'Load into the board, then push the ground away to start the swing.', 'Stay square and get the barrel delivered without the front side taking you off the ball.', 'Hold your finish for 2 seconds.'],
        reps: '2 rounds of 6 swings', cue: 'Push the ground away, let the hips turn the barrel.',
        check: 'The swing starts from the legs and the barrel stays in the zone through contact.',
        mistake: 'Spinning off the board with the shoulders, or the front side pulling you off the ball.', video: { url: 'https://www.instagram.com/reels/Ddbnw2KM-NC/', label: 'Back foot work (@okswings)' }, source: "Joey Cunha's Farm Board drills" },
      { id: 'fb-front-hold', name: 'Front Foot Landing Hold', minutes: 2, feeder: 'none', equip: 'Farm Board',
        detail: 'Land soft and stable on the front leg.',
        steps: ['Set the Farm Board under your front foot the way Coach showed you.', 'Stride and land on the board. Freeze at landing.', 'Front knee stays bent and stable over the foot. Hold 3 seconds. Head stays still.'],
        reps: '5 landings, 3-second hold', cue: 'Land quiet, stay stable.',
        check: 'Front knee stays over the foot and you do not drift forward.',
        mistake: 'Front knee caving toward the pitcher.', video: null, source: "Joey Cunha's Farm Board drills" },
      { id: 'fb-front-swing', name: 'Front Foot Board Swings', minutes: 4, feeder: 'none', equip: 'Farm Board, tee',
        detail: 'Turn through and finish with the front leg in a lunge.',
        steps: ['Front foot on the Farm Board, tee middle-middle.', 'Land, then turn through the ball.', 'Finish with the front leg in a lunging position, balanced, facing the pitcher.'],
        reps: '2 rounds of 6 swings', cue: 'Land, turn, finish in a lunge. Barrel stays north-south.',
        check: 'You finish with the front leg in a lunge and hold your finish.',
        mistake: 'Upper half pulling off early.', video: null, source: "Joey Cunha's Farm Board drills" },
      { id: 'fb-double', name: 'Double Farm Board', minutes: 5, feeder: 'tosser', equip: 'Two Farm Boards, L-screen or tee, balls',
        detail: 'Both feet on boards. Feet stay in the MIDDLE of each board.',
        steps: ['Set a Farm Board under each foot. Put each foot in the MIDDLE of its board, not on the edges or the ends.', 'Load into the back board, stride onto the front board, and swing into a lunging front-leg finish. Feet stay centered on the boards the whole time.', 'Front toss from a partner behind the L-screen. No partner? Use a tee.'],
        reps: '3 rounds of 6', cue: 'Feet in the middle of the boards.',
        check: 'Both feet finish in the middle of their boards and you hold a balanced finish.',
        mistake: 'Feet sliding to the edge of a board, or rolling off the side of it.',
        video: { url: 'https://www.instagram.com/p/DZtrUIPp2xi/', label: 'Double Farm Board (@micahfranklin56)' } },
      { id: 'fb-tee', name: 'Off the Board: Tee', minutes: 4, feeder: 'none', equip: 'Tee',
        detail: 'Same ground feel, no board.',
        steps: ['Step off the board. Tee middle-middle.', 'Recreate the back-leg push and the lunging front-leg finish.', 'Line drives only. Barrel works through the zone, not around it.'],
        reps: '2 rounds of 8 swings', cue: 'Ground, hips, then hands.',
        check: '6 of 8 are hard line drives up the middle.',
        mistake: 'Going back to an arms-only swing once the board is gone.' }
    ]
  },
  {
    id: 'mb-series', name: 'Med Ball Stability Series', pillar: 'POWER', series: true,
    why: 'A progression from movement prep to the tee. Each step isolates one small detail of stability and rotation, so the swing is driven by the ground and the hips, not the shoulders.',
    drills: [
      { id: 'mb-prep', name: 'Movement Prep', minutes: 3, feeder: 'none', equip: 'Med ball (4-6 lb)',
        detail: 'Open up the hips and the upper back.',
        steps: ['5 walking lunges each leg with a twist toward the front knee, ball held at the chest.', '5 hip openers each leg (knee up, open out to the side).', 'Half-kneeling, ball at the chest: 5 slow turns each way. Hips stay square, only the chest turns.'],
        reps: '1 round', cue: 'Loose hips, turning chest.',
        check: 'You can turn your chest without your hips moving in the half-kneeling turns.',
        mistake: 'Rushing it. Prep is slow and controlled.' },
      { id: 'mb-kneel', name: 'Half-Kneeling Scoop Toss', minutes: 3, feeder: 'none', equip: 'Med ball, cage net or wall',
        detail: 'Rotate from the core with the legs taken out.',
        steps: ['Half-kneel side-on to the net, back knee down, front knee up.', 'Stay tall. Turn the chest back, then rotate through and scoop the ball into the net.', 'No leaning. The core turns, the arms just follow.'],
        reps: '2 sets of 5 each side', cue: 'Stay tall, turn the middle.',
        check: 'You stay upright the whole throw and the ball comes off hard.',
        mistake: 'Leaning or throwing with the arms.' },
      { id: 'mb-loadhold', name: 'Load and Hold', minutes: 2, feeder: 'none', equip: 'Med ball',
        detail: 'Load the back hip and stay stable there.',
        steps: ['Get in your batting stance with the ball at your back hip.', 'Load into the back leg and hold for 3 seconds.', 'Feel the inside of the back foot. Head stays over the middle.'],
        reps: '5 holds of 3 seconds', cue: 'Load the hip, stay centered.',
        check: 'You can hold the load without swaying.',
        mistake: 'Weight rolling to the outside of the back foot.' },
      { id: 'mb-brace', name: 'Front Leg Lunge Toss', minutes: 3, feeder: 'none', equip: 'Med ball, cage net or wall',
        detail: 'Rotate through and finish in a lunge on the front leg.',
        steps: ['Start already in your landing position, ball at the back hip.', 'Rotate and scoop the ball into the net.', 'Finish with the front leg in a lunging position, knee bent over the foot.'],
        reps: '2 sets of 5', cue: 'Rotate through, finish in a lunge.',
        check: 'Your front leg is in a lunge at the finish and you are balanced.',
        mistake: 'Locking the front leg straight, or the front knee caving in.' },
      { id: 'mb-scoop', name: 'Full Scoop Toss', minutes: 3, feeder: 'none', equip: 'Med ball, cage net or wall',
        detail: 'Put it all together in order.',
        steps: ['Full stance, ball at the back hip.', 'Load, stride, rotate, release, finish in a lunge. Same order every rep.', 'Throw on a line into the net, not around in a circle.'],
        reps: '2 sets of 5', cue: 'Ground, hips, then hands.',
        check: 'Loud throw, straight into the net, stable finish.',
        mistake: 'Shoulders starting the throw.',
        video: { url: 'https://www.youtube.com/watch?v=Qq83wji4t2I', label: 'Rotational scoop toss (Simone Sports Performance)' } },
      { id: 'mb-tee', name: 'Transfer to the Tee', minutes: 4, feeder: 'none', equip: 'Tee, bat',
        detail: 'Take the same order into the swing.',
        steps: ['Put the ball down and pick up the bat. Tee middle-middle.', 'Swing with the exact feel of the last toss: load, rotate, finish in a lunge.', 'Barrel works north-south through the zone.'],
        reps: '2 rounds of 6 swings', cue: 'Same order, now with the bat.',
        check: 'The swing feels like the throw, and the ball comes off on a line.',
        mistake: 'Losing the lower half the moment the bat is back in your hands.',
        video: { url: 'https://www.youtube.com/watch?v=1ns15SvkuH0', label: "Hitter's scoop toss (Annex Sports Performance)" } }
    ]
  },
  {
    id: 'tank-series', name: 'Tidal Tank Series', pillar: 'POWER', series: true,
    why: 'The water moves if you move. Build a stable base, control the load, rotate clean, then take that control to the tee.',
    drills: [
      { id: 'tt-brace', name: 'Stance Brace', minutes: 2, feeder: 'none', equip: 'Tidal Tank',
        detail: 'Stable base, still water.',
        steps: ['Hold the Tidal Tank across your chest in your stance.', 'Brace your core and let the water settle.', 'Hold for 10 seconds without the water moving.'],
        reps: '3 holds of 10 seconds', cue: 'Quiet body, quiet water.',
        check: 'The water goes still and stays still.',
        mistake: 'Shifting your feet to fight the water.' },
      { id: 'tt-load', name: 'Load and Hold', minutes: 3, feeder: 'none', equip: 'Tidal Tank',
        detail: 'Get to the load without losing balance.',
        steps: ['From your stance, slowly load into your back leg.', 'Hold the load while the water settles. Do not let it rock you.', 'Come back to center and repeat.'],
        reps: '2 sets of 5 slow reps', cue: 'Stable base, quiet water.',
        check: 'You hold the load with no wobble.',
        mistake: 'Rushing the reps.',
        video: { url: 'https://www.youtube.com/watch?v=hxJkDH_uswA', label: 'Tidal Tank balance and stability (Northern Baseball Training)' } },
      { id: 'tt-rotate', name: 'Hold the Ground Rotation', minutes: 3, feeder: 'none', equip: 'Tidal Tank',
        detail: 'Deliver from up top while the bottom holds tension.',
        steps: ['From the load, rotate slowly to your finish.', 'The lower half holds tension and stays in the ground while the top delivers. Maintain your posture the whole way.', 'Stop and hold the finish until the water is still.'],
        reps: '2 sets of 5 each way', cue: 'Hold the ground. Maintain posture.',
        check: 'The water settles fast at the finish because the bottom never let go of the ground.',
        mistake: 'The lower half spinning out or the posture standing up as you rotate.',
        video: { url: 'https://www.instagram.com/reel/DdJe12bskw2/', label: 'Hold the ground, maintain posture (@okswings)' } },
      { id: 'tt-stretch', name: 'Stretch Swing', minutes: 3, feeder: 'none', equip: 'Tidal Tank',
        detail: 'Stretch, then fire, with one clean slam.',
        steps: ['Load and stretch into your back side.', 'Rotate hard and let the water slam to the front once.', 'Head still, feet in the ground.'],
        reps: '2 sets of 5', cue: 'Stay in the ground, let the water move, not your head.',
        check: 'One clean slam at the end, feet never slide.',
        mistake: 'Losing your base or swaying with the water.',
        video: { url: 'https://www.youtube.com/watch?v=0YcdBiFpG3E', label: 'Tidal Tank stretch drill (BB Sports Training)' } },
      { id: 'tt-inside-lane', name: 'Inside Lane Dry Reps', minutes: 3, feeder: 'none', equip: 'Bat',
        detail: 'Behind, inside, thru.',
        steps: ['Put the tank down and pick up a bat. Slow dry reps.', 'BEHIND: let the barrel work behind you as the body starts to turn. INSIDE: the hands stay in the inside lane, close to the body. THRU: the barrel goes through the ball toward the middle of the field.', 'Give the body and hands space to work. Same stable base you just built with the tank.'],
        reps: '2 sets of 6 slow dry reps', cue: 'Behind. Inside. Thru.',
        check: 'The barrel stays behind and inside the ball and finishes through the middle of the field.',
        mistake: 'Getting the barrel out and around the ball instead of working from behind.',
        video: { url: 'https://www.instagram.com/reel/Dcq129SMoo_/', label: 'Inside lane: behind, inside, thru (@okswings)' } },
      { id: 'tt-tee', name: 'Transfer to the Tee', minutes: 4, feeder: 'none', equip: 'Tee, bat',
        detail: 'Same stable rotation, now with the bat.',
        steps: ['Tee middle-middle.', 'Swing with the same stable base and clean rotation you just felt.', 'Hold every finish for 2 seconds.'],
        reps: '2 rounds of 6 swings', cue: 'Stable base, clean turn.',
        check: 'You hold every finish without stepping out.',
        mistake: 'Over-swinging and losing the base.' }
    ]
  },
  {
    id: 'stable-lower', name: 'Stable Lower Half Series', pillar: 'POWER', series: true,
    why: 'Balanced lower half, strong middle. The lower half stays stable and connected to the ground so the middle and upper body can work short, quick and efficient. Tidal Tank first, then Farm Boards, then live.',
    intro: { url: 'https://www.instagram.com/reel/DYPUOCsgxWr/', label: 'Stable lower half (@okswings)', text: 'A stable base gives you a solid foundation to hit from: strong legs, more ground force, better energy transfer. Stay connected to the ground.' },
    drills: [
      { id: 'sl-tube', name: 'Tidal Tank Tube: Stable Base Turns', minutes: 4, feeder: 'none', equip: 'Tidal Tank (tube)',
        detail: 'Lower half stays still while the middle turns.',
        steps: ['Hold the Tidal Tank tube across your body by the handles, in a wide athletic stance.', 'Turn the tank side to side with your middle. Your legs and feet stay still and strong.', 'Stay connected to the ground. The water moves, your base does not.'],
        reps: '2 sets of 8 turns', cue: 'Stable lower half. Stay connected to the ground.',
        check: 'Knees and feet do not move while the tank turns.',
        mistake: 'Legs and hips swaying with the water.',
        video: { url: 'https://www.instagram.com/reel/DYPUOCsgxWr/', label: 'Stable lower half: Tidal Tank, boards, live (@okswings)' } },
      { id: 'sl-sphere', name: 'Tidal Tank Sphere: Load and Rotate', minutes: 4, feeder: 'none', equip: 'Tidal Tank (sphere)',
        detail: 'Balanced lower, strong middle.',
        steps: ['Hold the Tidal Tank sphere at your back side in your batting stance.', 'Load, then rotate the sphere across your body to your finish. The middle does the work.', 'Hold the finish with the sphere low and in front until the water settles. Lower half stays balanced the whole time.'],
        reps: '2 sets of 6', cue: 'Balanced lower, strong middle.',
        check: 'You finish balanced and the water settles quickly.',
        mistake: 'Losing your base at the finish or muscling it with the arms.',
        video: { url: 'https://www.instagram.com/reel/DYhgJITg9KD/', label: 'Balanced lower and strong middle (@okswings)' } },
      { id: 'sl-boards', name: 'Farm Boards: Front Toss', minutes: 6, feeder: 'tosser', equip: 'Farm Boards, L-screen, balls',
        detail: 'Same stable base, now on the boards hitting live.',
        steps: ['Set the Farm Boards under your feet the way Coach showed you.', 'Partner front tosses from behind the L-screen.', 'Lower half stays stable and connected to the boards so the hands and barrel can work short and quick. Hold your finish.'],
        reps: '3 rounds of 6', cue: 'Lower half stable, swing short and quick.',
        check: 'You stay balanced on the boards through the finish and hit line drives.',
        mistake: 'Sliding or spinning off the boards.',
        video: { url: 'https://www.instagram.com/reel/DYPUOCsgxWr/', label: 'Boards into live swings (@okswings)' } },
      { id: 'sl-live', name: 'Off the Boards: Front Toss', minutes: 5, feeder: 'tosser', equip: 'L-screen, balls',
        detail: 'Keep the stable lower half with no boards.',
        steps: ['Boards out. Same front toss.', 'Recreate the same stable lower half and strong middle.', 'Short, quick, efficient swings. Line drives.'],
        reps: '3 rounds of 6', cue: 'Stay connected to the ground.',
        check: 'Your swing looks the same as it did on the boards.',
        mistake: 'Going back to a loose lower half once the boards are gone.' }
    ]
  },
  {
    id: 'middle-series', name: 'Deliver Thru the Middle Series', pillar: 'PRECISION', series: true,
    why: 'Tidal Tank prep into front toss. Stay anchored, move from the middle, rotate in line, and send everything through center field with good posture.',
    drills: [
      { id: 'dm-anchored', name: 'Deliver From the Middle', minutes: 4, feeder: 'none', equip: 'Tidal Tank (sphere)',
        detail: 'Stay anchored. Move from the middle.',
        steps: ['Hold the Tidal Tank sphere at your back side in your batting stance.', 'Stay anchored in the ground and turn the sphere through from your middle, not your arms.', 'Stay through it and hold the finish until the water settles.'],
        reps: '2 sets of 6', cue: 'Stay anchored. Move from the middle. Stay thru it.',
        check: 'Your feet stay planted and the water moves with your middle, not your arms.',
        mistake: 'Lifting off the ground or swinging the sphere with the arms.',
        video: { url: 'https://www.instagram.com/okswings/reel/DSaOJEmAAYS/', label: 'Deliver from the middle (@okswings)' } },
      { id: 'dm-inline', name: 'Rotate In Line', minutes: 4, feeder: 'none', equip: 'Tidal Tank (sphere), bat',
        detail: 'Rotate in line toward the pitcher, not around your body.',
        steps: ['Start with the sphere up at your back shoulder.', 'Rotate it down and through IN LINE toward the pitcher, the same line your barrel should take.', 'Put the sphere down and take 3 dry swings on that same line.'],
        reps: '2 sets of 5, then 3 dry swings', cue: 'Rotate in line.',
        check: 'The sphere travels toward the pitcher, not around in a circle.',
        mistake: 'Swinging the sphere around your body.',
        video: { url: 'https://www.instagram.com/okswings/reel/DTqA4gdAOvI/', label: 'Rotate in line (@okswings)' } },
      { id: 'dm-direction', name: 'Direction Thru the Middle', minutes: 5, feeder: 'none', equip: 'Tidal Tank (sphere), tee',
        detail: 'Stay square, create space, swing thru center field.',
        steps: ['5 sphere reps sending the water straight toward center field.', 'Tee middle-middle: stay square, give the hands space, and drive the ball through center field.', 'Every ball goes up the middle.'],
        reps: '5 sphere reps, then 2 rounds of 6 off the tee', cue: 'Stay square. Create space. Swing thru CF.',
        check: '4 of 6 each round go back up the middle.',
        mistake: 'Opening up early and pulling off the ball.',
        video: { url: 'https://www.instagram.com/okswings/reel/DSVBTMugNlY/', label: 'Direction thru the middle (@okswings)' } },
      { id: 'dm-front-toss', name: 'Chest Down, Hit Thru It', minutes: 6, feeder: 'tosser', equip: 'L-screen, balls',
        detail: 'Create good posture, keep it, and hit through the ball.',
        steps: ['Partner front tosses from behind the L-screen.', 'Get your chest down into good posture and keep it through the swing.', 'Hit through the ball back up the middle.'],
        reps: '3 rounds of 6', cue: 'Chest down. Hit thru it.',
        check: 'Your posture stays the same from load to contact and the ball goes through the middle.',
        mistake: 'Standing up out of your posture as you swing.',
        video: { url: 'https://www.instagram.com/reel/DW35zbNgPoW/', label: 'Chest down, hit thru it (@okswings)' } }
    ]
  },
  {
    id: 'inside-ball', name: 'Stay Inside the Ball Series', pillar: 'PRECISION', series: true,
    why: 'Work from behind and swing from the inside so the barrel stays in the zone longer. The bottom hand and the knob never push to the ball. Start with Inside Lane dry reps and the SHORT BAT (middle and deep-inside contact points only), then progress to your GAME BAT: a tee set up on the net hit UP THE MIDDLE, and a tee deep on the inner half driven the OTHER WAY.',
    drills: [
      { id: 'ib-inside-lane', name: 'Inside Lane Dry Reps', minutes: 3, feeder: 'none', equip: 'Short bat',
        detail: 'Work from behind and swing from the inside.',
        steps: ['Short bat. Slow dry reps, no ball.', 'BEHIND: let the barrel work behind you as the body starts to turn. INSIDE: the hands stay in the inside lane, close to the body. Do not push the hands or knob at the ball. THRU: the barrel goes through toward the middle of the field.', 'Give the body and hands space to work.'],
        reps: '2 sets of 6 slow dry reps', cue: 'Behind. Inside. Thru.',
        check: 'The barrel works from behind and inside, and finishes through the middle of the field.',
        mistake: 'Getting the barrel out and around the ball, or pushing the hands at it.',
        video: { url: 'https://www.instagram.com/reel/Dcq129SMoo_/', label: 'Inside lane: behind, inside, thru (@okswings)' } },
      { id: 'ib-hockey', name: 'Hockey Grip Swings', minutes: 4, feeder: 'none', equip: 'Bat, tee',
        detail: 'Split hands. The bottom hand and knob do not push to the ball.',
        steps: ['Split your hands on the bat like a hockey stick: bottom hand on the knob, top hand a few inches up the handle.', 'Take slow dry swings first. The knob can NOT lead or push toward the ball, and the bottom hand does not shove out at it. The body turns and the barrel turns with it.', 'Then take swings off a tee middle-middle with the same split grip.'],
        reps: '6 dry swings, then 2 rounds of 6 off the tee', cue: 'Don\'t push the bottom hand. Turn it.',
        check: 'The barrel gets to the ball without the knob or bottom hand pushing out first, and the ball comes off on a line.',
        mistake: 'Pushing the bottom hand or the knob at the ball, which drags the barrel and makes the swing long.',
        video: { url: 'https://www.instagram.com/p/DdDYJ4IJanR/', label: 'Hockey grip swings (@micahfranklin56)' } },
      { id: 'ib-short-fence', name: 'Short Bat: Fence Tee Up the Middle', minutes: 4, feeder: 'none', equip: 'Short bat, tee, side net',
        detail: 'Middle contact point. Stay tight to the net, hit it up the middle.',
        steps: ['Short bat only. Find your distance: knob on your belly button, end of the bat just touching the side net. Set the tee up on the net there, middle of the zone.', 'Swing without hitting the net and drive the ball straight up the middle.', 'A ball hooked to the pull side means the barrel came around. Reset and go again.'],
        reps: '2 rounds of 6', cue: 'Short to it, back up the middle.',
        check: '4 of 6 each round go up the middle and you never touch the net.',
        mistake: 'Pulling off and hooking it to the pull side.',
        video: { url: 'https://www.instagram.com/p/DUW-oV2jJvO/', label: 'Fence tee: stay tight (@turnerwardhitting)' } },
      { id: 'ib-short-deep', name: 'Short Bat: Deep Inner-Half Tee', minutes: 4, feeder: 'none', equip: 'Short bat, tee',
        detail: 'Deep-inside contact point. Drive it the other way.',
        steps: ['Short bat only. Tee on the inner half, deep in the zone (back near your back hip, not out front).', 'Keep the hands inside the ball and drive it to the opposite field.', 'Line drives the other way only.'],
        reps: '2 rounds of 6', cue: 'Hands inside, drive it the other way.',
        check: '4 of 6 each round go on a line to the opposite field.',
        mistake: 'Hands drifting away from the body and rolling over.' },
      { id: 'ib-fence-tee', name: 'Game Bat: Fence Tee Up the Middle', minutes: 5, feeder: 'none', equip: 'Game bat, tee, side net',
        detail: 'Same path, now with your game bat.',
        steps: ['Switch to your game bat. Reset your distance: knob on the belly button, end of the bat touching the net. You will be farther back than with the short bat.', 'Tee up on the net, middle of the zone.', 'Same short path, drive it up the middle without touching the net.'],
        reps: '2 rounds of 6', cue: 'Same path, longer bat.',
        check: '4 of 6 up the middle, no net.',
        mistake: 'Letting the longer barrel swing out around the zone.',
        video: { url: 'https://www.instagram.com/p/DUW-oV2jJvO/', label: 'Fence tee: stay tight (@turnerwardhitting)' } },
      { id: 'ib-fence-toss', name: 'Game Bat: Fence Front Toss', minutes: 5, feeder: 'tosser', equip: 'Game bat, side net, balls',
        detail: 'Same fence setup, now live. The net is your L-screen.',
        steps: ['Same setup as the fence tee: game bat, your distance from the net.', 'Partner front tosses from behind the net, so the net works as the L-screen.', 'Stay tight, keep the hands inside, and drive it up the middle without touching the net.'],
        reps: '3 rounds of 6', cue: 'Stay tight. Back up the middle.',
        check: '4 of 6 up the middle and you never clip the net.',
        mistake: 'The barrel coming around the ball once the ball is moving.',
        video: { url: 'https://www.instagram.com/p/DUW-oV2jJvO/', label: 'Fence tee: stay tight (@turnerwardhitting)' } },
      { id: 'ib-deep-tee', name: 'Game Bat: Deep Inner-Half Tee', minutes: 5, feeder: 'none', equip: 'Game bat, tee',
        detail: 'Game bat, deep inside, other way.',
        steps: ['Game bat. Tee on the inner half, deep in the zone.', 'Keep the hands inside and drive it the other way, just like the short bat.', 'Line drives the other way only.'],
        reps: '2 rounds of 6', cue: 'Hands inside, drive it the other way.',
        check: '4 of 6 each round go on a line to the opposite field.',
        mistake: 'Getting jammed or rolling over because the bat is longer.' },
      { id: 'ib-combo', name: 'Game Bat: Combo Round', minutes: 4, feeder: 'none', equip: 'Game bat, tee, side net',
        detail: 'Same inside path on both tees.',
        steps: ['Game bat. Alternate: 2 swings on the fence tee up the middle, then 2 on the deep inner-half tee the other way.', 'Same hand path every swing. Only the contact point changes.', 'A point for every ball that goes where it should.'],
        reps: '2 rounds of 8 (4 each)', cue: 'Same path, every swing.',
        check: '6 of 8 or better each round.',
        mistake: 'Changing the swing between the two tees.' }
    ]
  },
  {
    id: 'contact-point', name: 'Contact Point', pillar: 'PRECISION',
    why: 'Where you hit the ball decides where it goes. Inside pitch out front, middle pitch even with your front foot, outside pitch deeper.',
    drills: [
      { id: 'cp-three-tee', name: 'Three-Spot Tee', minutes: 12, feeder: 'none', equip: 'Tee',
        steps: ['Inside: tee out in front of the plate. Middle: even with your front foot. Outside: tee a little deeper on the outside corner.', 'Take 4 swings from each spot, then mix them up.', 'Say where the ball should go before you swing.'],
        reps: '3 rounds of 12 (4 per spot)', cue: 'Inside out front, outside let it travel.',
        check: 'Inside goes pull, middle goes middle, outside goes oppo.',
        mistake: 'Same contact point no matter where the tee is.' },
      { id: 'cp-high-low', name: 'High-Low Tee', minutes: 10, feeder: 'none', equip: 'Tee',
        steps: ['Set the tee at the top of the zone: 8 swings, stay on top of it, line drives.', 'Drop it to the knees: 8 swings, keep the barrel above your hands as long as you can.', 'Alternate high and low.'],
        reps: '3 rounds of 8', cue: 'Match the plane of the pitch.',
        check: 'No pop-ups off the high tee, no ground balls off the low tee.',
        mistake: 'Dropping the back shoulder on the high pitch.' },
      { id: 'cp-front-toss', name: 'Front Toss Zones', minutes: 12, feeder: 'tosser', equip: 'L-screen, bucket of balls',
        steps: ['Partner front tosses from behind the L-screen, about 20 feet away.', 'They call the zone before each toss: in, middle or out.', 'Drive it to the matching field.'],
        reps: '3 rounds of 10', cue: 'See the zone, match the field.',
        check: '7 of 10 go to the right field each round.',
        mistake: 'Pulling everything, even the outside toss.' }
    ]
  },
  {
    id: 'bat-speed', name: 'Bat Speed & Intent', pillar: 'SPEED',
    why: 'Swing with intent. Every rep is a game rep: fast, on purpose, and on balance. Quality over quantity.',
    drills: [
      { id: 'bs-recoil', name: 'Recoil Swings', minutes: 10, feeder: 'none', equip: 'Bat, tee',
        steps: ['Tee middle-middle. Swing with full intent.', 'Stay through the ball toward the middle of the field, then snap the barrel straight back (recoil) right after contact instead of finishing all the way around.', 'Feel the body create the energy and deliver the barrel. The barrel gets up to speed fast and stays on line to the ball.'],
        reps: '3 rounds of 6, rest between rounds', cue: 'Create energy. Transfer it. Stay through.',
        check: 'The barrel stays on line through contact and snaps back under control without you falling off balance.',
        mistake: 'Cutting the swing off before contact, or letting the barrel wrap around the body instead of staying through the ball.',
        video: { url: 'https://www.instagram.com/reels/Dd8-WhzsMZd/', label: 'Recoil swings (@okswings)' } },
      { id: 'bs-max', name: 'Max-Intent Rounds', minutes: 12, feeder: 'none', equip: 'Tee',
        steps: ['Tee middle, belt high.', 'Take 5 swings as hard as you can while staying on balance. Rest 30 seconds between rounds.', 'Every swing counts. No lazy swings.'],
        reps: '5 rounds of 5 swings, 30 sec rest', cue: 'Swing it like you mean it, finish on balance.',
        check: 'Ball jumps off the bat and you hold your finish every time.',
        mistake: 'Swinging hard but falling over. Balance first.' },
      { id: 'bs-rapid', name: 'Rapid Fire Soft Toss', minutes: 10, feeder: 'tosser', equip: 'Soft toss balls',
        steps: ['Partner soft tosses from the side, one ball right after the other.', 'Reload quickly and swing at each one.', 'Stay short and quick. Do not muscle it.'],
        reps: '4 rounds of 8, rest between', cue: 'Quick hands, quick reload.',
        check: 'You stay ready for the next toss without stepping out of your stance.',
        mistake: 'Getting long and slow as you get tired. Stop the round if form breaks.' },
      { id: 'bs-line', name: 'Line Drive Targets', minutes: 10, feeder: 'tosser', equip: 'L-screen, a target on the back net',
        steps: ['Pick a target on the back net about chest high.', 'Front toss or tee. Try to hit the target hard.', 'Hard and on a line beats high and far.'],
        reps: '3 rounds of 10', cue: 'Hard on a line, through the target.',
        check: '5 of 10 hit near the target each round.',
        mistake: 'Uppercutting to try to hit it far.' }
    ]
  },
  {
    id: 'all-fields', name: 'All Fields / Oppo', pillar: 'PRECISION',
    why: 'Good hitters use the whole field. Letting the outside pitch travel and driving it the other way keeps you from rolling over.',
    drills: [
      { id: 'af-outside-tee', name: 'Outside Tee Oppo', minutes: 12, feeder: 'none', equip: 'Tee',
        steps: ['Tee on the outside corner, even with the back of the plate.', 'Let the ball get deep and drive it to the opposite field gap.', 'Keep your front shoulder closed until contact.'],
        reps: '3 rounds of 8', cue: 'Let it travel, drive it oppo.',
        check: '6 of 8 go oppo on a line.',
        mistake: 'Pulling off with the front shoulder and rolling over.' },
      { id: 'af-round', name: 'Pull-Middle-Oppo Round', minutes: 10, feeder: 'tosser', equip: 'L-screen, balls',
        steps: ['Front toss. Hit 3 to the pull side, then 3 up the middle, then 3 oppo.', 'Partner adjusts the toss location to help: in, middle, away.', 'Miss your field and that set starts over.'],
        reps: '3 rounds', cue: 'Choose the field, own the field.',
        check: 'You finish all three sets in a round.', bench: { kind: 'yesno', prompt: 'Did you finish all three sets in one round?' },
        mistake: 'Changing your swing instead of your contact point.' },
      { id: 'af-backside', name: 'Backside Drive', minutes: 10, feeder: 'tosser', equip: 'L-screen, balls',
        steps: ['Front toss middle to away.', 'Drive everything to center or the opposite gap.', 'Count how many of 10 go center or oppo.'],
        reps: '3 rounds of 10', cue: 'Stay through it to the backside.',
        check: '5 of 10 or better to center or oppo.',
        mistake: 'Cutting the swing off early.' }
    ]
  },
  {
    id: 'two-strike', name: 'Two-Strike Approach', pillar: 'RELENTLESSNESS',
    why: 'With two strikes you battle. Shorten up, widen out, protect the plate. Put it in play or foul it off. No easy outs.',
    drills: [
      { id: 'ts-choke', name: 'Choke & Battle Tee', minutes: 10, feeder: 'none', equip: 'Tee',
        steps: ['Choke up an inch and widen your stance a little.', 'Move the tee around the zone after every 3 swings.', 'Short, compact swings. Contact every time.'],
        reps: '3 rounds of 9', cue: 'Shorten up, see it, hit it.',
        check: 'Solid contact on every swing, wherever the tee is.',
        mistake: 'Taking your full big swing with two strikes.' },
      { id: 'ts-front', name: 'Two-Strike Front Toss', minutes: 12, feeder: 'tosser', equip: 'L-screen, balls',
        steps: ['Partner front tosses all over the zone, mixing speeds.', 'You are always at two strikes: anything close, you swing.', 'Foul it off or put it in play. A swing and miss ends the round.'],
        reps: '3 rounds of 10', cue: 'Protect the plate, compete every pitch.',
        check: 'A full round of 10 with zero misses.', bench: { kind: 'count', target: 10, of: 10, prompt: 'Best round: balls fouled off or in play' },
        mistake: 'Taking a close one. With two strikes, close is a strike.' },
      { id: 'ts-foul', name: 'Foul-Off Game', minutes: 10, feeder: 'tosser', equip: 'L-screen, balls',
        steps: ['Partner tosses a tough pitch on the edge (corners, high, low).', 'Your job: stay alive. Foul it back or hit it hard.', 'Count your longest streak without a miss.'],
        reps: 'Play for 8 minutes, beat your streak', cue: 'Stay alive.',
        check: 'Beat your best streak from last session.', bench: { kind: 'yesno', prompt: 'Did you beat your best streak?' },
        mistake: 'Giving up on the pitch. Battle every one.' }
    ]
  },
  {
    id: 'timing', name: 'Timing & Load Series', pillar: 'SPEED', series: true,
    why: 'Three phases, one at a time: LOAD (hinge into the hips like you are about to sit in a chair), GATHER (pick the front foot up and get deeper into the hinge), then STRIDE (force stays on the back foot, spine straight, shoulders downhill). Force always goes straight down under your feet, never to the sides.',
    drills: [
      { id: 'tl-hinge', name: 'Hip Hinge Prep', minutes: 2, feeder: 'none', equip: 'Bat',
        detail: 'Hinge at the hips, not the back.',
        steps: ['Hold the bat behind you along your spine: one hand at your neck, one at your lower back.', 'Push your hips back like you are sitting in a chair. The bat stays touching your head, upper back, and tailbone.', 'Stand back up by pushing the ground away.'],
        reps: '2 sets of 8 slow hinges', cue: 'Sit in the chair.',
        check: 'The bat never leaves your back, so your spine stays straight.',
        mistake: 'Bending over at the waist or rounding the back.' },
      { id: 'tl-load', name: 'Chair Load Hold', minutes: 3, feeder: 'none', equip: 'None (bat in hand)',
        detail: 'Belly button to your belt, force in the middle of the foot.',
        steps: ['Get in your stance with the bat.', 'Load by hinging your hips: think of moving your belly button toward your belt, like you are loading up to sit in a chair.', 'Press into the MIDDLE of your feet and hold for 3 seconds.'],
        reps: '2 sets of 5 holds, 3 seconds each', cue: 'Belly button to your belt.',
        check: 'You feel pressure in the middle of both feet, not the toes or heels.',
        mistake: 'Squatting straight down instead of hinging the hips back.',
        video: { url: 'https://www.instagram.com/p/DcwmidTzF9k/', label: 'How to load (watch the movement)' } },
      { id: 'tl-direction', name: 'Direction of Force Check', minutes: 2, feeder: 'none', equip: 'None',
        detail: 'Force goes straight down under your feet, not to the sides.',
        steps: ['From your load, look down at your ankles.', 'Push straight down into the ground. Your ankles stay tall, not rolling in or out.', 'Rock slightly front to back until the pressure sits in the middle of the foot, then hold.'],
        reps: '5 checks', cue: 'Force under your feet, not to the sides.',
        check: 'Ankles stay straight and you could not be pushed over sideways.',
        mistake: 'Rolling the ankles or pushing out to the edges of the feet.' },
      { id: 'tl-band', name: 'Band Forward Pull: Hold the Hinge', minutes: 4, feeder: 'none', equip: 'Resistance band, tee',
        detail: 'The band pulls you forward. Stay in your hinge.',
        steps: ['Loop a resistance band around your hips, anchored out in front of you (toward the pitcher) so it pulls you forward.', 'Get in your stance and load into your hip hinge. Feel the band trying to pull you out of it. Do not let it.', 'Hold the hinge and keep the lower half stable, then take swings off a tee (or soft toss) with the band still on.'],
        reps: '5 hinge holds of 3 seconds, then 2 rounds of 6 swings', cue: 'Feel the pull. Stay in your hinge.',
        check: 'The band never pulls you forward out of your load, and your lower half stays still until you swing.',
        mistake: 'Letting the band drag you forward onto your front side before the swing.',
        video: { url: 'https://www.instagram.com/p/DdIO8uRtlAa/', label: 'Forward pull band drill (Joey Cunha, The Farm System)' } },
      { id: 'tl-gather', name: 'Gather Hold', minutes: 3, feeder: 'none', equip: 'None (bat in hand)',
        detail: 'Pick the front foot up and sink deeper into the hinge.',
        steps: ['Start in your chair load.', 'Pick your front foot up off the ground. As it comes up, sink a little deeper into your hip hinge.', 'Keep pushing the back foot into the ground. Hold 2 seconds on one leg, balanced.'],
        reps: '2 sets of 5 gathers', cue: 'Pick it up, sink deeper.',
        check: 'You can balance on the back leg without tipping, and the hinge gets deeper, not taller.',
        mistake: 'Standing up tall when the foot comes up.' },
      { id: 'tl-stride', name: 'Stride and Freeze', minutes: 3, feeder: 'none', equip: 'None (bat in hand)',
        detail: 'Stride with force on the back foot. Spine straight, shoulders downhill.',
        steps: ['Load, gather, then stride forward.', 'Keep the force on your back foot as you stride. Do not fall back.', 'Freeze when the front foot lands: spine straight, shoulders tilted downhill.'],
        reps: '2 sets of 5 strides', cue: 'Spine straight, shoulders downhill.',
        check: 'At landing your weight is still back and your shoulders are downhill, not level or leaning back.',
        mistake: 'Falling back in posture or lunging forward onto the front foot.' },
      { id: 'tl-rhythm', name: 'Load, Gather, Stride, Swing', minutes: 3, feeder: 'none', equip: 'Bat',
        detail: 'Link the three phases into one rhythm.',
        steps: ['Say it out loud: "load... gather... stride... swing."', 'Dry swings at half speed, hitting every phase.', 'Speed it up only when every phase is clean.'],
        reps: '2 sets of 6 dry swings', cue: 'Load, gather, stride, then let it go.',
        check: 'Each phase looks the same as when you did it on its own.',
        mistake: 'Skipping the gather once you speed up.' },
      { id: 'tl-tee', name: 'Transfer to the Tee', minutes: 4, feeder: 'none', equip: 'Tee',
        detail: 'Same three phases, now hitting a ball.',
        steps: ['Tee middle-middle.', 'Load, gather, stride, then swing.', 'Hold your finish. Line drives only.'],
        reps: '2 rounds of 6 swings', cue: 'Sit in the chair, pick it up, stride downhill.',
        check: 'You hit every phase and the ball comes off on a line.',
        mistake: 'Rushing the load because there is a ball now.' },
      { id: 'tl-toss', name: 'Rhythm Soft Toss', minutes: 4, feeder: 'tosser', equip: 'Soft toss balls',
        detail: 'Time the load and gather to the toss.',
        steps: ['Partner says "load" as they show the ball, then tosses.', 'Load on "load," gather as the ball comes up, stride and swing.', 'Find the same rhythm every rep.'],
        reps: '2 rounds of 8', cue: 'Early load, on time.',
        check: 'You are never rushing. The swing feels smooth, not jumpy.',
        mistake: 'Waiting to load until the ball is already on the way.' }
    ]
  },
  {
    id: 'zone', name: 'Zone Discipline', pillar: 'RELENTLESSNESS',
    why: 'Swing at strikes, take balls. Know the zone and hunt your pitch. This is how you get quality at-bats.',
    drills: [
      { id: 'zn-call', name: 'Ball or Strike Call', minutes: 10, feeder: 'tosser', equip: 'L-screen, balls',
        steps: ['Partner front tosses some strikes and some balls.', 'Swing only at strikes. On every take, call "ball" out loud.', 'Partner tells you if you were right.'],
        reps: '3 rounds of 10', cue: 'Know the zone, swing at yours.',
        check: '8 of 10 right decisions each round.',
        mistake: 'Chasing the high ball.' },
      { id: 'zn-hunt', name: 'Hunt Your Pitch', minutes: 12, feeder: 'tosser', equip: 'L-screen, balls',
        steps: ['Pick ONE zone you hunt (for example, middle-in).', 'Swing hard at that zone only. Take everything else, even strikes.', 'Next round, pick a new zone.'],
        reps: '3 rounds of 10', cue: 'Hunt it, do damage.',
        check: 'You only swing at your zone and drive it hard.',
        mistake: 'Swinging at strikes outside your zone.' },
      { id: 'zn-colors', name: 'Color Ball Recognition', minutes: 10, feeder: 'tosser', equip: 'Two colors of balls (or numbered balls)',
        steps: ['Partner mixes two colors of balls.', 'Swing at one color, take the other.', 'Decide as early as you can.'],
        reps: '3 rounds of 10', cue: 'See it early, decide early.',
        check: 'No swings at the take color.',
        mistake: 'Deciding late and checking your swing.' }
    ]
  }
];

const CAGE_FINISHER = {
  id: 'finisher', name: 'Quality At-Bat Round', minutes: 6,
  steps: [
    'Finish with a live round: 10 front tosses or machine pitches.',
    'Each pitch is a game at-bat. Partner calls the count and situation (runner on 2nd, 2 strikes, etc.).',
    'Count your quality at-bats: hard contact, right decision, or move the runner.'
  ],
  cue: 'Every rep is a game rep.',
  check: '7 of 10 quality at-bats.',
  bench: { kind: 'count', target: 7, of: 10, prompt: 'Quality at-bats out of 10' }
};

// Builds a cage session from a player's assigned focus areas (1-3).
// Series run every step in order (small details, prep to tee).
// If more than one series is assigned, ONE series runs per session and they rotate.
// Regular focus areas add drills that rotate each session.
function buildCageSession(focusIds, sessionNumber) {
  const focuses = focusIds.map(id => CAGE_FOCUS.find(f => f.id === id)).filter(Boolean);
  if (!focuses.length) return null;
  const n = sessionNumber || 0;
  const series = focuses.filter(f => f.series);
  const regular = focuses.filter(f => !f.series);
  const pick = (f, k) => f.drills[(n + k) % f.drills.length];
  const blocks = [];
  let todaySeries = null;
  if (series.length) {
    todaySeries = series[n % series.length];
    todaySeries.drills.forEach((d, i) => blocks.push({ focus: todaySeries, drill: d, step: i + 1, of: todaySeries.drills.length }));
    regular.forEach(f => blocks.push({ focus: f, drill: pick(f, 0) }));
  } else if (regular.length === 1) {
    for (let k = 0; k < 3; k++) blocks.push({ focus: regular[0], drill: pick(regular[0], k) });
  } else if (regular.length === 2) {
    blocks.push({ focus: regular[0], drill: pick(regular[0], 0) });
    blocks.push({ focus: regular[1], drill: pick(regular[1], 0) });
    blocks.push({ focus: regular[0], drill: pick(regular[0], 1) });
  } else {
    regular.forEach(f => blocks.push({ focus: f, drill: pick(f, 0) }));
  }
  const minutes = CAGE_WARMUP.minutes + CAGE_FINISHER.minutes + blocks.reduce((t, b) => t + b.drill.minutes, 0);
  return { warmup: CAGE_WARMUP, blocks, finisher: CAGE_FINISHER, minutes, todaySeries, seriesCount: series.length };
}

// Longest session in the rotation, plus the rotation order, for the coach sheet.
function cageRotationInfo(focusIds) {
  const first = buildCageSession(focusIds, 0);
  if (!first) return { maxMinutes: 0, rotation: [] };
  const count = Math.max(1, first.seriesCount);
  const rotation = [];
  for (let i = 0; i < count; i++) {
    const s = buildCageSession(focusIds, i);
    rotation.push({ name: s.todaySeries ? s.todaySeries.name : 'Hitting drills', minutes: s.minutes });
  }
  return { maxMinutes: Math.max(...rotation.map(r => r.minutes)), rotation };
}

function estimateCageMinutes(focusIds) {
  return cageRotationInfo(focusIds).maxMinutes;
}

// Benchmark for a drill: how a player knows he hit it.
// Score drills use their "N of M" target; feel drills become "4 of your last 5 reps".
function getBenchmark(d) {
  if (!d) return null;
  if (d.bench) return { label: d.check, ...d.bench };
  const m = (d.check || '').match(/(\d+) of (\d+)/);
  if (m) return { kind: 'count', target: +m[1], of: +m[2], label: d.check, prompt: 'Your best round' };
  return { kind: 'count', target: 4, of: 5, label: '4 of your last 5 reps: ' + d.check, prompt: 'Of your last 5 reps, how many?' };
}
function benchHit(b, v) {
  if (v == null) return null;
  return b.kind === 'yesno' ? v === true : v >= b.target;
}
// Session result from benchmarks: all hit = mastered, half or more = getting there, less = struggled.
function sessionResult(hit, total) {
  if (!total) return 'getting';
  if (hit === total) return 'nailed';
  return hit / total >= 0.5 ? 'getting' : 'struggled';
}
const SERIES_MASTERY_STREAK = 2;
