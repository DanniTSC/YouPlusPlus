// Script pentru popularea colecției nutritionplans din MongoDB cu preseturi de planuri
require('dotenv').config();
const mongoose = require('mongoose');
const NutritionPlan = require('./models/NutritionPlan');

const MONGO_URI = process.env.MONGO_URI;

const seedData = [
{
  goal: "slăbit",
  level: "începător",
  sex: "feminin",
  calories: 1400,
  meals: [
    "Mic dejun: Smoothie cu spanac, lapte vegetal, 1 banană și 1 lingură de unt de arahide",
    "Prânz: Somon la cuptor + quinoa + broccoli",
    "Cină: Salată cu ton, avocado, roșii și ou fiert",
    "Snack: Iaurt grecesc 2% + scorțișoară"
  ],
  workouts: [
    "30 min mers rapid zilnic (în ritm susținut)",
    "Circuit ușor (2 runde): 30 sec jumping jacks, 30 sec genuflexiuni, 30 sec ridicări de bazin, 30 sec flotări în genunchi",
    "Stretching activ + respirație 5 min",
    "Yoga pentru ardere calorică (15 min video ghidat)"
  ],
  tips: [
    "Bea un pahar de apă înainte de fiecare masă",
    "Consumă legume în fiecare masă principală",
    "Evita zahărul lichid (sucuri, băuturi îndulcite)",
    "Ține un jurnal alimentar 3 zile pe săptămână",
    "Încearcă să mănânci ultima masă cu 2-3h înainte de culcare"
  ]
},
{
  goal: "masă",
  level: "începător",
  sex: "feminin",
  calories: 2000,
  meals: [
    "Mic dejun: Fulgi de ovăz cu lapte, 1 banană, 1 lingură de semințe de in",
    "Prânz: Piept de pui + cartofi dulci + legume la abur",
    "Cină: Orez cu linte și ouă fierte + salată verde",
    "Snack: Brânză cottage + biscuiți integrali",
    "Snack 2: Smoothie cu banană, unt de arahide și lapte"
  ],
  workouts: [
    "Antrenament full-body cu greutatea corpului: 2 runde x 10 genuflexiuni, 10 ridicări bazin, 10 flotări în genunchi, 20 sec plank",
    "Cardio moderat: bicicletă sau mers în pantă 20 min",
    "Mini elastic band circuit (pentru fesieri, umeri, spate)",
    "Stretching ușor 5-10 min"
  ],
  tips: [
    "Include proteine în fiecare masă principală",
    "Adaugă uleiuri sănătoase (măsline, avocado, cocos)",
    "Crește porțiile treptat dacă nu vezi progres",
    "Odihnește-te suficient – somnul susține creșterea",
    "Fă 2-3 mese consistente + 2 gustări zilnic"
  ]
},
{
  goal: "menținere",
  level: "începător",
  sex: "feminin",
  calories: 1700,
  meals: [
    "Mic dejun: Ouă fierte (2) + 1 felie pâine integrală + castraveți",
    "Prânz: Tocăniță de curcan cu legume + orez brun",
    "Cină: Salată de ton cu avocado și fasole roșie",
    "Snack: Nuci + fructe uscate (în cantitate controlată)"
  ],
  workouts: [
    "20 min mers alert + 10 min exerciții funcționale acasă",
    "1 zi/zi: antrenament ușor cu greutatea corpului",
    "Stretching general 10 min (picioare, trunchi, umeri)",
    "Dans cardio (Zumba / video follow-along 15 min)"
  ],
  tips: [
    "Menține un orar regulat al meselor",
    "Hidratează-te cu minim 6-8 pahare apă pe zi",
    "Evită excesele – 80/20 e regula",
    "Fii activă zilnic, chiar și cu pași sau trepte",
    "Gătește simplu, dar variat – menținerea cere diversitate"
  ]
},
{
  goal: "slăbit",
  level: "intermediar",
  sex: "feminin",
  calories: 1500,
  meals: [
    "Mic dejun: Smoothie cu zmeură, spanac, pudră proteică vegetală, lapte de migdale",
    "Prânz: Piept de curcan cu fasole verde și orez integral",
    "Cină: Supă cremă de legume + hummus cu bețișoare de morcov",
    "Snack: Iaurt grecesc cu afine și scorțișoară"
  ],
  workouts: [
    "HIIT 20 min: 30 sec on / 30 sec off (burpees, mountain climbers, squat jumps)",
    "Antrenament full body cu benzi elastice – 2 runde",
    "Stretching activ + mobilitate șolduri (10 min)",
    "Yoga flow pentru detox și postură (15 min)"
  ],
  tips: [
    "Controlează porțiile, dar nu elimina complet carbohidrații",
    "Consumă 25-30g fibre zilnic din legume și semințe",
    "Nu lăsa pauze >5h între mese",
    "Evită alcoolul și gustările nesănătoase seara",
    "Creează o rutină fixă de masă + hidratare"
  ]
},
{
  goal: "masă",
  level: "intermediar",
  sex: "feminin",
  calories: 2200,
  meals: [
    "Mic dejun: Omletă cu 3 ouă + legume + pâine integrală",
    "Prânz: File de somon + cartofi dulci + broccoli",
    "Cină: Paste integrale cu linte și parmezan ras",
    "Snack 1: Shake cu banană, unt de migdale, lapte, scorțișoară",
    "Snack 2: Brânză ricotta cu nuci și miere"
  ],
  workouts: [
    "Antrenament forță (gantere sau sală): 3 x 10 per grupă",
    "Zi cardio ușor + core: bicicletă 15 min + plank, flutter kicks",
    "Upper body + glute day (alternativ)",
    "Stretching + foam rolling (10 min) după antrenament"
  ],
  tips: [
    "Crește aportul caloric gradual (100-150 kcal/săpt)",
    "Fă stretching activ – ajută la asimilarea nutrienților",
    "Prioritizează mese solide, nu doar shake-uri",
    "Monitorizează progresul (circumferințe + forță)",
    "Include surse de grăsimi bune: ulei de măsline, semințe, avocado"
  ]
},
{
  goal: "menținere",
  level: "intermediar",
  sex: "feminin",
  calories: 1800,
  meals: [
    "Mic dejun: Overnight oats cu fulgi de ovăz, lapte, iaurt, semințe de chia și fructe de pădure",
    "Prânz: Tocană de legume + carne slabă (curcan/pui)",
    "Cină: Salată grecească cu brânză feta și ulei de măsline",
    "Snack: Morcovi + hummus / 1 baton proteic"
  ],
  workouts: [
    "Alternare zile: Luni – tren superior, Miercuri – tren inferior, Vineri – circuit full body",
    "Cardio moderat: 25-30 min alergare ușoară sau bandă",
    "Yoga de întreținere și stretching: 15-20 min/săpt",
    "1 zi pauză activă: mers lung + mobilitate"
  ],
  tips: [
    "Păstrează un echilibru între carbohidrați, proteine și grăsimi",
    "Mesele pot fi variate, dar menține orarul fix",
    "Continuă să fii activă 4-5 zile/săptămână",
    "Nu elimina complet gustările – doar fă-le inteligente",
    "Bea apă constant – e ușor să uiți când nu mai slăbești"
  ]
}, 
{
  goal: "slăbit",
  level: "avansat",
  sex: "feminin",
  calories: 1450,
  meals: [
    "Mic dejun: Smoothie proteic cu spanac, afine, pudră proteică, semințe de in, apă",
    "Prânz: Pui la grătar cu salată verde, avocado și dressing cu iaurt",
    "Cină: Supă cremă de broccoli + crackers proteici",
    "Snack: Iaurt grecesc + scorțișoară + 5 migdale"
  ],
  workouts: [
    "HIIT avansat 25 min: 45 sec on / 15 sec off (lunges săritoare, burpees, plank jacks, squat jumps)",
    "Greutăți – push/pull split: 3-4 seturi x 8-10 reps / exercițiu",
    "Cardio în post: 20-30 min mers rapid dimineața",
    "Stretching + foam rolling 15 min după fiecare antrenament"
  ],
  tips: [
    "Fă meal prep săptămânal pentru control caloric strict",
    "Fără ronțăieli târzii – ultima masă înainte de 20:00",
    "Păstrează aport proteic ridicat (>100g/zi)",
    "Include legume la fiecare masă",
    "Bea apă înainte de fiecare masă – reduce senzația de foame falsă"
  ]
},
{
  goal: "masă",
  level: "avansat",
  sex: "feminin",
  calories: 2300,
  meals: [
    "Mic dejun: Omletă cu 3 ouă, ciuperci, spanac, brânză light + 1 felie pâine integrală",
    "Prânz: Vită slabă + orez brun + dovlecei la grătar",
    "Cină: Paste integrale cu linte și parmezan + salată de sfeclă",
    "Snack 1: Shake cu lapte + unt de migdale + ovăz + banana",
    "Snack 2: Cottage cheese cu semințe de chia"
  ],
  workouts: [
    "5 antrenamente/zi: split push/pull/legs/core/glutes (sala sau gantere grele)",
    "Cardio minim 2x/săptămână (bicicletă + HIIT 15-20 min)",
    "Foam rolling după fiecare sesiune",
    "Stabilizare posturală: face pulls, banded Y raises, plank walks"
  ],
  tips: [
    "Crește progresiv greutățile în sală",
    "Aport proteic zilnic: 1.8-2g/kg corp",
    "Fă stretching post-antrenament pentru recuperare optimă",
    "Nu sari peste mese – afectează sinteza proteică",
    "Somnul este critic – minim 7h/noapte pentru creștere reală"
  ]
},
{
  goal: "menținere",
  level: "avansat",
  sex: "feminin",
  calories: 1800,
  meals: [
    "Mic dejun: Iaurt proteic + mix de fructe de pădure + granola low sugar",
    "Prânz: Pui stir-fry cu legume asiatice și orez basmati",
    "Cină: Salată cu ou fiert, hummus și crutoane integrale",
    "Snack: Baton proteic homemade sau 1 shake"
  ],
  workouts: [
    "4 sesiuni forță/săptămână: 2 tren superior, 2 tren inferior",
    "Cardio light 1-2x: alergare ușoară 20-25 min",
    "Zumba sau dans de întreținere (opțional)",
    "Mobilitate + stretching 15-20 min post-antrenament"
  ],
  tips: [
    "Monitorizează-ți greutatea săptămânal, nu zilnic",
    "Menține 3 mese + 1-2 gustări echilibrate/zi",
    "Evită perioadele lungi de sedentarism (>2h fără mișcare)",
    "Fă sport constant – schimbările bruște influențează metabolismul",
    "Include mese sociale 1x/săpt pentru echilibru psihologic"
  ]
},
{
  goal: "slăbit",
  level: "începător",
  sex: "masculin",
  calories: 1800,
  meals: [
    "Mic dejun: 2 ouă fierte + 1 felie pâine integrală + roșii",
    "Prânz: Piept de pui + broccoli + orez brun",
    "Cină: Supă de linte + salată cu ulei de măsline",
    "Snack: Iaurt grecesc simplu + 1 măr"
  ],
  workouts: [
    "Cardio moderat: 30 min mers rapid sau bicicletă",
    "Circuit: genuflexiuni, flotări, plank, jumping jacks – 2 runde x 30 sec fiecare",
    "Stretching 10 min pentru mobilitate",
    "1 zi yoga sau pilates pentru relaxare și întindere"
  ],
  tips: [
    "Redu porțiile de carbohidrați după ora 18",
    "Bea apă înainte de mese pentru sațietate",
    "Gătește acasă 80% din timp",
    "Fă minim 7000 de pași zilnic",
    "Evită băuturile cu zahăr"
  ]
},
{
  goal: "menținere",
  level: "începător",
  sex: "masculin",
  calories: 2200,
  meals: [
    "Mic dejun: Ovăz cu lapte + 1 banană + scorțișoară",
    "Prânz: Pui stir-fry cu legume și orez",
    "Cină: Salată cu ton, fasole roșie, avocado",
    "Snack: 2 felii de pâine integrală cu brânză light",
    "Snack 2: Mână de nuci + fruct uscat"
  ],
  workouts: [
    "Full body de bază: 2 seturi de flotări, genuflexiuni, ridicări bazin",
    "20 min cardio (mers în pantă, alergare ușoară)",
    "1 antrenament funcțional tip circuit/HIIT ușor pe săptămână",
    "Stretching + respirație ghidată (5-10 min)"
  ],
  tips: [
    "Mănâncă la ore regulate, nu sări peste mese",
    "Consumă 25-30g fibre/zi",
    "Evită mâncatul în fața ecranelor",
    "Fă 3-4 sesiuni de mișcare/săptămână",
    "Monitorizează greutatea 1x/săptămână"
  ]
},
{
  goal: "masă",
  level: "începător",
  sex: "masculin",
  calories: 2600,
  meals: [
    "Mic dejun: Omletă cu 3 ouă + 2 felii pâine integrală + avocado",
    "Prânz: Carne de vită slabă + cartofi dulci + salată",
    "Cină: Paste integrale cu pui și sos de roșii",
    "Snack 1: Shake cu lapte + banană + unt de arahide",
    "Snack 2: Iaurt gras + miere + nuci"
  ],
  workouts: [
    "Antrenament forță full body: flotări, genuflexiuni, ramat gantere – 3 seturi fiecare",
    "Zi cardio light: mers 20 min + 5 sprinturi scurte",
    "1 zi izolare brațe și core cu greutăți ușoare",
    "Foam rolling + stretching (10-15 min)"
  ],
  tips: [
    "Fă 3 mese principale + 2 gustări zilnic",
    "Aport proteic: min. 1.6g/kg corp",
    "Crește progresiv greutățile la antrenament",
    "Monitorizează și greutatea și circumferințele",
    "Evită perioadele lungi de repaus între mese"
  ]
},
{
  goal: "slăbit",
  level: "intermediar",
  sex: "masculin",
  calories: 1900,
  meals: [
    "Mic dejun: Iaurt grecesc cu ovăz, semințe și fructe de pădure",
    "Prânz: Piept de curcan la grătar + quinoa + salată verde",
    "Cină: Tocană de legume cu linte",
    "Snack: Smoothie cu lapte vegetal, pudră proteică și spanac"
  ],
  workouts: [
    "Cardio intens (25 min HIIT): 40 sec on / 20 sec off – sprint, jumping lunges, mountain climbers",
    "Forță 3 zile/săptămână – split superior/inferior",
    "Mobilitate și stretching după fiecare sesiune (10 min)",
    "1 zi yoga sau pilates"
  ],
  tips: [
    "Evită gustările inutile după antrenament",
    "Menține deficit caloric dar păstrează proteinele ridicate",
    "Prioritizează mesele cu alimente neprocesate",
    "Fă mișcare zilnică, chiar și ușoară în zilele de pauză",
    "Hidratează-te cu minimum 2.5L apă/zi"
  ]
},
{
  goal: "menținere",
  level: "intermediar",
  sex: "masculin",
  calories: 2400,
  meals: [
    "Mic dejun: 3 ouă omletă + pâine integrală + castraveți",
    "Prânz: Pește la cuptor + orez + legume sotate",
    "Cină: Supă de pui + cartofi natur + salată",
    "Snack 1: Brânză cottage + biscuiți integrali",
    "Snack 2: Shake cu lapte, banană și ovăz"
  ],
  workouts: [
    "4 sesiuni de forță pe săptămână (upper/lower split)",
    "Cardio de întreținere: 2x/ săptămână alergare ușoară 25 min",
    "Exerciții funcționale și core 2x/ săptămână",
    "Stretching și mobilitate 10 min post-antrenament"
  ],
  tips: [
    "Menține proporția: 40% carbs / 30% protein / 30% fat",
    "Creează o rutină stabilă de somn",
    "Include mese sociale în plan (fără excese)",
    "Monitorizează nivelul de energie, nu doar greutatea",
    "Nu schimba alimentația brusc – menținerea cere echilibru"
  ]
},
{
  goal: "masă",
  level: "intermediar",
  sex: "masculin",
  calories: 2800,
  meals: [
    "Mic dejun: Ovăz cu lapte, unt de arahide și banană",
    "Prânz: Pulpe de pui + orez cu legume + avocado",
    "Cină: Paste integrale cu carne tocată slabă și parmezan",
    "Snack 1: Shake cu lapte, pudră proteică, unt de migdale",
    "Snack 2: Nuci + fructe uscate + baton proteic"
  ],
  workouts: [
    "Program forță 5x/săptămână: push/pull/legs/core/upper",
    "1 zi cardio ușor pentru recuperare activă",
    "Post-antrenament: 20g proteine + 40g carbo",
    "Stretching + foam rolling în fiecare seară (10 min)"
  ],
  tips: [
    "Adaugă 100-200 kcal/săptămână dacă nu crești în greutate",
    "Fă 4-5 mese/zi cu surse variate de proteine",
    "Menține progresul în sală: jurnal de greutăți și reps",
    "Recuperarea contează la fel de mult ca antrenamentul",
    "Folosește aplicații pentru a urmări macronutrienții"
  ]
},
{
  goal: "slăbit",
  level: "avansat",
  sex: "masculin",
  calories: 2000,
  meals: [
    "Mic dejun: Smoothie cu spanac, afine, proteină izolat, semințe de in",
    "Prânz: Piept de pui + orez basmati + sparanghel la abur",
    "Cină: Supă de linte + salată cu avocado și tofu",
    "Snack 1: Iaurt grecesc + 1 linguriță semințe de chia",
    "Snack 2: Baton proteic low-carb"
  ],
  workouts: [
    "Forță 5x/săptămână: push/pull/legs/core/upper",
    "HIIT 2x/săptămână: 30 min sprinturi, burpees, jump squats",
    "Cardio în post: 20 min mers pe bandă înclinat dimineața",
    "Stretching + mobilitate 15 min după antrenamente"
  ],
  tips: [
    "Micșorează carbohidrații seara (prioritizează proteina)",
    "Păstrează aportul proteic ≥ 2g/kg",
    "Ferește-te de 'cheat meals' regulate",
    "Fă poză săptămânal pentru progres vizual",
    "Fără gustări spontane – planifică totul"
  ]
},
{
  goal: "menținere",
  level: "avansat",
  sex: "masculin",
  calories: 2500,
  meals: [
    "Mic dejun: 3 ouă + avocado + pâine integrală",
    "Prânz: Friptură slabă (vită/pui) + cartofi dulci + legume",
    "Cină: Pește gras (somon) + salată de quinoa + legume crude",
    "Snack 1: Smoothie proteic cu ovăz și lapte de migdale",
    "Snack 2: Nuci crude + brânză slabă"
  ],
  workouts: [
    "Forță 4x/săptămână (cu cicluri de progresie)",
    "1 zi HIIT ușor sau sprinturi scurte",
    "1 zi sport liber: înot, box, baschet etc.",
    "Recuperare activă și stretching 15-20 min"
  ],
  tips: [
    "Ține-ți porțiile sub control – menținerea cere disciplină",
    "Mănâncă conștient – fără ecrane",
    "Progresul nu trebuie să însemne schimbări majore vizuale",
    "Respectă orele de somn",
    "Fă post ocazional (14-16h/1x pe săpt)"
  ]
},
{
  goal: "masă",
  level: "avansat",
  sex: "masculin",
  calories: 3100,
  meals: [
    "Mic dejun: Ovăz cu lapte + fructe + unt de arahide",
    "Prânz: Carne de vită slabă + orez + broccoli",
    "Cină: Paste integrale + pui + parmezan + ulei de măsline",
    "Snack 1: Shake post-antrenament: proteină + banană + lapte + ovăz",
    "Snack 2: Brânză cottage + biscuiți integrali"
  ],
  workouts: [
    "Program forță 6x/săpt cu focus pe hipertrofie (RPE 8-9)",
    "Zi 7: Pauză activă sau mobilitate",
    "Cardio 1x/săpt (bandă sau bicicleta 20 min)",
    "Post-antrenament: proteine + carbohidrați rapid absorbabili"
  ],
  tips: [
    "Creează un surplus controlat de 200-300 kcal/zi",
    "Ajustează progresiv greutățile săptămânal",
    "Nu neglija somnul – min. 7h/noapte",
    "Consistența e cheia – nu schimba frecvent rutina",
    "Fă jurnal alimentar pentru fine-tuning"
  ]
}


];

async function seed() {
  try {
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    await NutritionPlan.deleteMany({});
    console.log('Existing NutritionPlan documents removed');

    await NutritionPlan.insertMany(seedData);
    console.log('NutritionPlan seed completed');
  } catch (err) {
    console.error('Error seeding NutritionPlan:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
