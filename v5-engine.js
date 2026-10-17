/* Winter Strong V5: deterministic local-only prescription and travel rules.
   Exposes pure helpers for regression testing. No network or AI dependence. */
(function(root){
'use strict';
const jump = name => /squat|romanian deadlift|hip thrust/i.test(name) && /barbell/i.test(name) ? 5 : /barbell|EZ-bar/i.test(name) ? 2.5 : /DB|dumbbell/i.test(name) ? 5 : 2.5;
const isRecovery = week => week%4===0 && week!==20;
const rirTarget = weekData => { const found=String(weekData.rir||'').match(/\d+/);return found?Number(found[0]):2; };
function hasLogged(s){return s && s.reps!=='' && s.reps!==undefined && s.reps!==null && Number(s.reps)>0;}
function prescribe(ex,week,prior,readiness,weekData){
 const isTime=ex.unit==='sec'; const targetRir=rirTarget(weekData);
 const recovery=isRecovery(week),benchmark=week===20;
 const low=Number(ex.low),high=Number(ex.high),n=Number(ex.sets);
 let weight='', targets=Array(n).fill(low), reason='First time logging this exercise. Choose a manageable load and establish a baseline with controlled technique.',status='baseline';
 if(prior){
   const ps=(prior.sets||[]).filter(hasLogged);
   const raw=ps.map(x=>String(x.weight||'BW').trim()||'BW');
   const same=raw.length>0 && raw.every(x=>x===raw[0]);
   weight=same?raw[0]:(raw[0]||'');
   const completed=ps.length>=Number(prior.ex.sets);
   const rp=ps.map(s=>Number(s.reps));
   const allTop=completed && rp.every(r=>r>=Number(prior.ex.high));
   const recoveryPrior=isRecovery(Number(prior.wi));
   const oldGoal=String(prior.e?.goal||'');
   if(recovery){status='recovery';reason='Recovery week: use a comfortable load with extra reps in reserve. No automatic increase.';}
   else if(benchmark){status='benchmark';reason='Week 20 benchmark: compare clean, controlled work. This is not a one-rep max test.';}
   else if(readiness==='pain'){status='hold';reason='Pain or a flare-up reported: do not chase progression. Stop aggravating movements and choose a pain-free alternative; seek clinical advice for ongoing symptoms.';}
   else if(readiness==='fatigued'){status='hold';reason='Fatigued today: keep the load conservative. Reduce volume or effort as needed.';}
   else if(!completed){status='repeat';reason='Your last session had missing sets. Repeat the load and work toward completing the planned sets.';}
   else if(!same){status='repeat';reason='Previous weights were mixed. Start with the first working-set load and adjust to keep technique solid.';}
   else if(allTop && !isTime && /^\d+(?:\.\d+)?$/.test(weight) && !recoveryPrior){
      const inc=jump(ex.name);weight=String(Number(weight)+inc);status='increase';reason=`All planned sets reached the top of the rep range at a consistent load. Suggested +${inc} lb. Increase only if technique stayed controlled and the jump feels manageable.`;
   }
   else if(allTop){status='hold';reason='Rep ceiling reached. Hold the load for time-based work or after a recovery week; progress conservatively.';}
   else {status='reps';reason='Keep the load and aim to add a clean rep where you fell short, staying within the current phase rep range.';}
   if(status==='increase')targets=Array(n).fill(low);
   else if(status==='reps'||status==='repeat')targets=Array.from({length:n},(_,i)=>Math.max(low,Math.min(high,Number(ps[Math.min(i,ps.length-1)]?.reps||low)+(status==='reps'?1:0))));
   else targets=Array(n).fill(low);
   if((recovery||benchmark)&&prior)weight=raw[0]||'';
   if(oldGoal && !ps.length)reason+=' Your previous free-text goal is retained in history.';
 } else if(readiness==='pain')reason='Pain reported. Choose only comfortable movement; do not use the planned load as a requirement.';
 return {weight,targets,targetRir,status,reason,display:`${weight?(weight.toUpperCase().startsWith('BW')?weight:weight+' lb'):'Choose load'} × ${targets.join(' / ')} ${isTime?'sec':'reps'}`};
}
const E=(name,sets,low,high,unit='reps')=>({name,sets,low,high,unit});
/* Only exercises in these tables are allowed into the travel workout. No hazardous improvised anchor rows. */
const T={
 hotelroom:{
 mon:[E('Bodyweight squat',3,12,20),E('Bodyweight split squat (each leg)',3,8,12),E('Glute bridge',3,12,20),E('Standing calf raise',2,15,25),E('Reverse crunch / pelvic curl',2,12,18),E('Side plank (sec/side)',2,20,40,'sec')],
 tue:[E('Push-up',3,6,15),E('Prone W raise',3,10,15),E('Pike push-up (gentle range)',2,6,10),E('Prone reverse snow angel',2,10,15),E('Dead bug (each side)',2,8,12),E('Side plank (sec/side)',2,20,40,'sec')],
 thu:[E('Bodyweight split squat (each leg)',3,10,15),E('Single-leg hip hinge (each leg)',3,8,12),E('Glute bridge',3,12,20),E('Standing calf raise',2,15,25),E('Dead bug (each side)',2,8,12),E('Reverse crunch / pelvic curl',2,12,18)],
 fri:[E('Push-up',3,6,15),E('Prone reverse snow angel',3,10,15),E('Pike push-up (gentle range)',2,6,10),E('Prone W raise',2,10,15),E('Reverse crunch / pelvic curl',2,12,18),E('Side plank (sec/side)',2,20,40,'sec')],
 sat:[E('Mountain climber (each side)',3,20,40),E('Dead bug (each side)',3,8,12),E('Reverse crunch / pelvic curl',2,12,18),E('Side plank (sec/side)',2,20,40,'sec')]
 },
 hotelgym:{
 mon:[E('Front / goblet squat',3,8,12),E('Barbell Romanian deadlift',3,8,12),E('DB Bulgarian split squat (each)',2,8,12),E('Standing calf raise',2,12,18),E('Reverse crunch / pelvic curl',2,12,18),E('Side plank (sec/side)',2,20,40,'sec')],
 tue:[E('Incline DB bench press',3,8,12),E('1-arm DB row (each)',3,8,12),E('DB overhead press',2,8,12),E('DB lateral raise',2,12,18),E('Hammer curl',2,10,15),E('DB triceps extension',2,10,15)],
 thu:[E('Front / goblet squat',3,8,12),E('DB reverse lunge (each leg)',3,8,12),E('Barbell Romanian deadlift',3,8,12),E('Calf raise',2,12,20),E('Suitcase carry (sec/side)',2,30,45,'sec'),E('Reverse crunch / pelvic curl',2,12,18)],
 fri:[E('DB bench / weighted vest push-up',3,8,12),E('Chest-supported DB row',3,8,12),E('Rear-delt DB fly',2,12,18),E('DB lateral raise',2,12,18),E('Cross-body hammer curl',2,10,15),E('DB triceps extension',2,10,15)],
 sat:[E('Suitcase carry (sec/side)',3,30,45,'sec'),E('Reverse crunch / pelvic curl',3,12,18),E('Side plank (sec/side)',2,20,40,'sec'),E('Dead bug (each side)',2,8,12)]
 }
};
/* Hotel gym requires selection of equipment actually available; no guaranteed barbell. */
T.hotelgym.mon[1]=E('Single-leg hip hinge (each leg)',3,8,12);
T.hotelgym.thu[2]=E('Single-leg hip hinge (each leg)',3,8,12);
function travelPlan(profile,day,minutes,original){
 if(profile==='fullgym')return (original||[]).map(x=>({...x})).slice(0,minutes===15?2:minutes===30?4:99).map(x=>({...x,sets:Math.min(x.sets,minutes===15?2:minutes===30?2:x.sets)}));
 const plan=T[profile]?.[day]||[];
 return plan.slice(0,minutes===15?3:minutes===30?4:99).map(x=>({...x,sets:Math.min(x.sets,minutes===15?2:minutes===30?2:x.sets)}));
}
const travelNew={
 'Bodyweight squat':['Stand hip-width with feet planted.','Sit between your hips and keep knees tracking with toes.','Stand tall without locking aggressively.','No equipment; controlled tempo.'],
 'Bodyweight split squat (each leg)':['Take a staggered stance with both feet grounded.','Bend both knees slowly to a comfortable depth.','Drive through the front foot to rise; switch sides.','Support yourself on a stable surface if needed.'],
 'Glute bridge':['Lie on your back with knees bent, feet flat.','Brace your abdomen and gently lift hips by squeezing glutes.','Pause without arching your low back, then lower slowly.','No equipment; avoid painful range.'],
 'Push-up':['Hands beneath or slightly wider than shoulders, body braced.','Lower chest between hands without shrugging shoulders.','Press back up with elbows angled comfortably.','Incline your hands on a stable bench to make it easier.'],
 'Prone W raise':['Lie face down with arms bent in a W shape.','Gently draw shoulder blades back without shrugging.','Lift hands a small distance; lower with control.','Very light movement, not a substitute for heavy pulling.'],
 'Pike push-up (gentle range)':['Start in a pike position with hips elevated.','Bend elbows slowly only through pain-free range.','Press away without forcing neck or shoulders.','Skip with any shoulder pinch; substitute incline push-ups.'],
 'Prone reverse snow angel':['Lie face down with arms beside your body.','Raise hands slightly, then sweep arms outward in a controlled arc.','Return slowly without forcing overhead range.','Keep neck relaxed; not equivalent to loaded rows.'],
 'Dead bug (each side)':['Lie face up with hips and knees at 90 degrees.','Brace lightly, lower opposite arm and leg slowly.','Return before low back arches; alternate sides.','Keep movement small and controlled.'],
 'Single-leg hip hinge (each leg)':['Stand on one leg with a soft knee, near a stable support.','Push hips backward and tip forward, keeping spine neutral.','Drive hips forward to stand; change legs.','Use bodyweight or one light dumbbell if available.'],
 'Mountain climber (each side)':['Start in a stable plank with hands under shoulders.','Drive one knee forward without bouncing your hips.','Return slowly and alternate; go at a comfortable pace.','Avoid if wrist or shoulder symptoms flare.']
};
root.WINTER_V5={prescribe,travelPlan,travelNew,isRecovery,rirTarget,hasLogged};
})(typeof window==='undefined'?globalThis:window);
