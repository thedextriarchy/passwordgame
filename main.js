// Password game

// MANAGEMENT VARIABLES

let currentRule;
let question = 0;
let score;
let passwordChecker;
let passwordGood;

// Final stats
let finalPassword;
let finalChoices = [];

let rulePassed = 0;

let longEnough;

let currentRuleDescription = []; //test
let filterList = []; // test

//const totalQuestions = 30;

let timePlayed = 0;
let timeClock;

//let testvar = 'test';

let dice;
const diceRoll = (array) => {
    let i = Math.floor(Math.random() * array.length);
    return i;
};

//let currentBranch = 'a';
let pruneBranch;

// GAMESTATE

let gameState = {
    pickMirrors: false,
    pickWheel: false,
    takeArtifact: false,
    leaveArtifact: false,
    surrenderPolice: false,
    resistPolice: false,
    visitLake: false,
    visitStore: false,
    viewArtifact: false,
    rejectArtifact: false,
    stopDriving: false,
    keepDriving: false,
    stayOutside: false,
    goInside: false,
    manEyes: 'PLACEHOLDER',
    womanDress: ''
};

let gameResults = {
    pickMirrors: 'You chose the hall of mirrors.',
    pickWheel: 'You chose the ferris wheel.',
    takeMirror: 'You took the mirror shard.',
    leaveMirror: 'You left the mirror shard.',
    takeBox: 'You took the unlabeled box.',
    leaveBox: 'You left the unlabeled box.',
    surrenderPolice: 'You surrendered to the police.',
    viewMirror: 'You looked in the mirror.',
    rejectMirror: 'You rejected the mirror.',
    viewBox: 'You opened the box.',
    rejectBox: 'You rejected the box.',
    stopBox: 'You stopped to close the box.',
    driveBox: 'You ignored the opening box.',
    stopMirror: 'You stopped to save the officer.',
    driveMirror: 'You drove away with the mirror.',
    resistPolice: 'You resisted the police.',
    visitLake: 'You stopped at the deep lake.',
    diveLake: 'You dove into the lake.',
    watchLake: 'You stared into the lake.',
    visitLot: 'You stopped at the unfamiliar store.',
    enterStore: 'You entered the store.',
    outsideStore: 'You fell asleep in the parking lot.'
};

let secretCode = {
    viewMirror: 'E1:1/0',
    rejectMirror: 'E2:asks:',
    viewMirror: 'E3:The',
    rejectMirror: 'E4:air',
    stopBox: 'E5:doesn\'t',
    driveBox: 'E6:taste',
    stopMirror: 'E7:like',
    driveMirror: 'E8:it,',
    diveLake: 'E9:used',
    watchLake: 'E10:to,',
    enterStore: 'E11:does',
    outsideStore: 'E12:it?'
};

testVar = 'test';



// Add a series of objects for the different levels of challenge

const questionLevel = [
{
    rank: 1,
    min: 4,
    max: 46,
},
{
    rank: 2,
    min: 8,
    max: 16,
},
{
    rank: 3,
    min: 8,
    max: 16,
},
{
    rank: 4,
    min: 8,
    max: 16,
},
{
    rank: 5,
    min: 8,
    max: 16,
},
{
    rank: 6,
    min: 8,
    max: 16,
},
{
    rank: 7,
    min: 8,
    max: 16,
},
{
    rank: 8,
    min: 8,
    max: 16,
},
{
    rank: 9,
    min: 8,
    max: 16,
},
{
    rank: 10,
    min: 8,
    max: 16,
},

/*{
    name: 'medium',
    rank: 2,
    min: 12,
    max: 16,
    timer:60
},
{
    name: 'hard',
    rank: 3,
    min: 14,
    max: 18,
    timer:60
},
{
    name: 'nightmare',
    rank: 4,
    min: 24,
    max: 28,
    timer:60
}*/
];

/* RULES for different password levels
    Length
    Must contain x of y character types
    Must contain x specific character at position y
    Must contain single digits that add up to x
    Must contain the first name of a member of the Beatles
    Must contain none of x letters/numbers/symbols
    Must contain a palindrome: https://www.freecodecamp.org/news/two-ways-to-check-for-palindromes-in-javascript-64fea8191fd7/
    Must contain a US president's surname
    Must include the US state with the best (regional fair|fleamarket|roadside attraction)
    Must begin with the freeway where your car breaks down
    Must contain the number of eyes of the service station clerk
    Must include the dollar value of the unlabeled box
    Must end with whether he will sell the box
    (if yes) Must decide whether you will steal the box
    Must decide whether to open the box
    (if not) Must include the date the box is stolen
    (if so) Must include the order you pull the 5 nails
    Must begin with the 
    Must contain the date of your death
    Must include whether you will see the sky burn
    Must end with the last ocean to drain
    Must contain the year of the final darkness
*/

const ruleReq = {
    name: 'Includes at least one uppercase letter, lowercase letter, number, and special character',
    //name: 'Begins with a US interstate highway',
    rank: 0,
    exp: "(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-\])",
    //exp:'^[i](nterstate)?[-]?[1-9].*$',
    cased: true
    //cased: false
};

const ruleGeneric = [
{
    name: 'Includes an exclamation point',
    rank: 1,
    exp: "!",
    cased:false
},
{
    name: 'Contains the letter \'E\'',
    rank: 1,
    exp: 'e',
    cased: false
},
{
    name: 'Contains a Zodiac sign',
    rank: 2,
    exp: "aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces",
    cased:false
},
{
    name: 'Includes a presidential surname',
    rank: 2,
    exp: "adams|arthur|biden|buchanan|bush|carter|cleveland|clinton|coolidge",
    cased: false
},
{
    name: 'Must contain a palindrome',
    rank: 4,
    exp: "tk",
    cased:false
},
{
    name: 'Contains the first name of a Beatle',
    rank: 3,
    exp: "john|paul|george|ringo",
    cased: false
}
];

// STORY RULES

const ruleStory = [
{
    name: 'Includes an exclamation point',
    rank: 1,
    exp: "!",
    cased:false,
    active: true,
    requires: [],
    timeline:'a'
},
{
    name: 'Includes the state with the best regional fair',
    rank: 2,
    exp: "alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|newhampshire|newjersey|newmexico|newyork|northcarolina|northdakota|ohio|oklahoma|oregon|pennsylvania|rhodeisland|southcarolina|southdakota|tennessee|texas|utah|vermont|virginia|washington|westvirginia|wisconsin|wyoming",
    cased: false,
    active: true,
    requires: [],
    timeline:'a'
},
{
    name: 'Starts with the price of a fairgrounds ticket',
    rank: 3,
    exp: "^[\$][0-9]+.*$",
    cased: false,
    active: true,
    requires: [],
    timeline:'a'
},
{
    name: 'Includes the superior attraction: ferris wheel or hall of mirrors',
    rank: 3,
    exp: "ferriswheel|hallofmirrors",
    cased: false,
    active: true,
    requires: [],
    timeline:'a'
},

// Q4 WHEEL BRANCH

{
    name: 'Contains the height (in feet) where the wheel stops',
    rank: 4,
    exp: "[1-9]{1}[0-9]{1,2}",
    cased: false,
    active: true,
    requires: ['pickWheel'],
    timeline:'b'
},
{
    name: 'Contains the eye color of the strange man beside you',
    rank: 4,
    exp: "blue|black|green|hazel|white|brown|gold|red",
    cased: false,
    active: true,
    requires: ['pickWheel'],
    variable: 'manEyes'
},
{
    name: 'Contains the shape of the box he leaves',
    rank: 5,
    exp: "rectangular|rectangle|square|round|circle|rhomboid|rhombus|triangle|triangular|spherical|sphere",
    cased: false,
    active: true,
    requires: ['pickWheel'],
    timeline:'b'
},
{
    name: 'Ends with whether you take the box',
    rank: 5,
    exp: "^.*yes|no$",
    cased: false,
    active: true,
    requires: ['pickWheel'],
    timeline:'b'
},

// Q4 MIRROR BRANCH
{
    name: 'Contains the dress color of the woman who joins you',
    rank: 4,
    exp: "red|green|blue|purple|black|white|silver|gold|orange|pink|violet|yellow|brown",
    cased: false,
    active: true,
    requires: ['pickMirrors'],
    variable: 'womanDress'
},
{
    name: 'Contains the room number where she smashes the glass',
    rank: 4,
    exp: "[0-9]+",
    cased: false,
    active: true,
    requires: ['pickMirrors'],
    timeline:'c'
},
{
    name: 'Contains the length (in inches) of the fresh cut on your finger',
    rank: 5,
    exp: "[1-4]",
    cased: false,
    active: true,
    requires: ['pickMirrors'],
    timeline:'c'
},
{
    name: 'Ends with whether you take the shard',
    rank: 5,
    exp: "^.*yes|no$",
    cased: false,
    active: true,
    requires: ['pickMirrors'],
    timeline: 'c'
},
// BACK TO A
{
    name: 'Includes the time you run back to your car',
    rank: 6,
    exp: "tk",
    cased: false,
    active: true,
    requires: [],
    timeline: 'a'
},
{
    name: 'Includes how many miles over the speed limit you\'re driving',
    rank: 6,
    exp: "[1-7][0-9]",
    cased: false,
    active: true,
    requires: [],
    timeline: 'a'
},
{
    name: 'Contains the interstate where the sirens start',
    rank: 6,
    exp: "[i](nterstate)?[-]?[1-9]",
    cased: false,
    active: true,
    requires: [],
    timeline: 'a'
},

// COMBINATORIAL EXPLOSION STARTS

{
    name: 'Starts with the minutes until the officer sees the stolen box',
    rank: 7,
    exp: "^[1-9].*$",
    cased: false,
    active: true,
    requires: ['pickWheel','takeArtifact'],
    timeline: 'bd'
},
{
    name: 'Includes whether you resist or surrender',
    rank: 7,
    exp: "resist|surrender",
    cased: false,
    active: true,
    requires: ['pickWheel','takeArtifact'],
    timeline: 'bd'
},
{
    name: 'Starts with the minutes until the officer sees the bloody mirror',
    rank: 7,
    exp: "^[1-9].*$",
    cased: false,
    active: true,
    requires: ['pickMirrors','takeArtifact'],
    timeline: 'ce'
},
{
    name: 'Includes whether you resist or surrender',
    rank: 7,
    exp: "resist|surrender",
    cased: false,
    active: true,
    requires: ['pickMirrors','takeArtifact'],
    timeline: 'ce'
},
{
    name: 'Includes the amount of your speeding ticket',
    rank: 7,
    exp: "[\$][1-9][0-9]",
    cased: false,
    active: true,
    requires: ['leaveArtifact'],
    timeline: 'f'
},
{
    name: 'Includes the rate of your beating heart',
    rank: 7,
    exp: "[1-2][0-9]{2}",
    cased: false,
    active: true,
    requires: ['leaveArtifact'],
    timeline: 'f'
},
{
    name: 'Ends where you stop to rest: deep lake or parking lot',
    rank: 7,
    exp: "^.*[deeplake|parkinglot]$",
    cased: false,
    active: true,
    requires: ['leaveArtifact'],
    timeline: 'f'
},
// QUESTION 8
// Go with officer and box/mirror
{
    name: 'Contains the time you enter the holding cell',
    rank: 8,
    exp: "tk",
    cased: false,
    active: true,
    requires: ['takeArtifact','surrenderPolice'],
    timeline: 'bdg'
},
{
    name: function() {
        return 'Contains the number of teeth in the ' + gameState.manEyes + '-eyed man\'s smile'
   },
    rank: 8,
    exp: "[2-3][0-9]",
    cased: false,
    active: true,
    requires: ['pickWheel','takeArtifact','surrenderPolice'],
    timeline: 'bdg'
},
{
    name: 'Ends with his invitation: open the box?',
    rank: 8,
    exp: "^.*yes|no$",
    cased: false,
    active: true,
    requires: ['pickWheel','takeArtifact','surrenderPolice'],
    timeline: 'bdg'
},
{
    name: 'Contains the number of teeth in the BLUE-clad woman\'s smile',
    rank: 8,
    exp: "[2-3][0-9]",
    cased: false,
    active: true,
    requires: ['pickMirrors','takeArtifact','surrenderPolice'],
    timeline: 'ceg'
},
{
    name: 'Ends with her command: look in the mirror shard?',
    rank: 8,
    exp: "^.*yes|no$",
    cased: false,
    active: true,
    requires: ['pickMirrors','takeArtifact','surrenderPolice'],
    timeline: 'ceg'
},
// Resist officer with box/mirror
{
    name: 'Contains the foot you use to hit the gas',
    rank: 8,
    exp: "left|right",
    cased: false,
    active: true,
    requires: ['pickWheel','takeArtifact','resistPolice'],
    timeline: 'ceg'
},
{
    name: 'Includes the time the box flies from the seat',
    rank: 8,
    exp: "tk",
    cased: false,
    active: true,
    requires: ['pickWheel','takeArtifact','resistPolice'],
    timeline: 'ceg'
},
{
    name: 'Ends with a conundrum: close the box or drive?',
    rank: 8,
    exp: "^.*close|drive$",
    cased: false,
    active: true,
    requires: ['pickWheel','takeArtifact','resistPolice'],
    timeline: 'ceg'
},
// Resist officer with mirror
{
    name: 'Contains the hand you use to grab the mirror',
    rank: 8,
    exp: "left|right",
    cased: false,
    active: true,
    requires: ['pickMirrors','takeArtifact','resistPolice'],
    timeline: 'ceg'
},
{
    name: 'Contains the angle the shard hits flesh',
    rank: 8,
    exp: "[1-2]?[1-9][0-9]",
    cased: false,
    active: true,
    requires: ['pickMirrors','takeArtifact','resistPolice'],
    timeline: 'ceg'
},
{
    name: 'Ends with a thought: do you regret it?',
    rank: 8,
    exp: "^.*yes|no$",
    cased: false,
    active: true,
    requires: ['pickMirrors','takeArtifact','resistPolice'],
    timeline: 'ceg'
},
// Get speeding ticket and visit lake/lot
{
    name: 'Starts with the color of the lake',
    rank: 8,
    exp: "^[blue|brown|black|white|clear|red|green|navy|teal].*$",
    cased: false,
    active: true,
    requires: ['leaveArtifact','visitLake'],
    timeline: 'ceg'
},
{
    name: 'Contains its greatest attribute: a clear mirror or a great depth',
    rank: 8,
    exp: "mirror|depth",
    cased: false,
    active: true,
    requires: ['leaveArtifact','visitLake'],
    timeline: 'ceg'
},
{
    name: 'Contains the height of the boxy store beyond the lot',
    rank: 8,
    exp: "[1-9][0-9][feet|ft|meters|m]",
    cased: false,
    active: true,
    requires: ['leaveArtifact','visitLot'],
    timeline: 'ceg'
},
{
    name: 'Contains the number of its glass doors that are broken',
    rank: 8,
    exp: "[1-9]",
    cased: false,
    active: true,
    requires: ['leaveArtifact','visitLot'],
    timeline: 'ceg'
},
{
    name: 'Ends with a decision: go inside?',
    rank: 8,
    exp: "^.*yes|no$",
    cased: false,
    active: true,
    requires: ['leaveArtifact','visitLot'],
    timeline: 'ceg'
},

// QUESTIONS 9/10
// Look into the box
{
    name: 'Begins with the seconds it takes to snap the latch',
    rank: 9,
    exp: "^[1-3].*$",
    cased: false,
    active: true,
    requires: ['takeArtifact','viewArtifact','pickWheel'],
    timeline: 'ceg'
},
{
    name: 'Includes the color of the emptiness inside',
    rank: 9,
    exp: "black|blue|void|nothing|white|clear",
    cased: false,
    active: true,
    requires: ['takeArtifact','viewArtifact','pickWheel'],
    timeline: 'ceg'
},
{
    name: 'Ends with the time the man says: \"Don\'t worry. You\'ll know soon.\"',
    rank: 9,
    exp: "tk",
    cased: false,
    active: true,
    requires: ['takeArtifact','viewArtifact','pickWheel'],
    timeline: 'ceg'
},
{
    name: 'Enter the date the first stars burn out. It\'s sooner than you think.',
    rank: 10,
    exp: "tk",
    cased: false,
    active: true,
    requires: ['takeArtifact','viewArtifact','pickWheel'],
    timeline: 'ceg'
},
// Resist the box
{
    name: 'Begins with the number of pinpricks the box leaves on your hand',
    rank: 9,
    exp: "^[1-5]$",
    cased: false,
    active: true,
    requires: ['takeArtifact','rejectArtifact','pickWheel'],
    timeline: 'ceg'
},
{
    name: 'Contains the sound of the man clearing his throat',
    rank: 9,
    exp: "hem|ahem",
    cased: false,
    active: true,
    requires: ['takeArtifact','rejectArtifact','pickWheel'],
    timeline: 'ceg'
},
{
    name: 'Ends with the time the man says: \"Hm. I\'m sure the next vessel will cooperate.\"',
    rank: 9,
    exp: "tk",
    cased: false,
    active: true,
    requires: ['takeArtifact','rejectArtifact','pickWheel'],
    timeline: 'ceg'
},
{
    name: 'Enter the length of your prison term. It\'s a very, very long time.',
    rank: 10,
    exp: "[1-9][0-9][years]",
    cased: false,
    active: true,
    requires: ['takeArtifact','rejectArtifact','pickWheel'],
    timeline: 'ceg'
},
// Look into the mirror
{
    name: 'Begins with the seconds it takes to raise the mirror',
    rank: 9,
    cased: false,
    active: true,
    requires: ['takeArtifact','viewArtifact','pickMirrors'],
    timeline: 'ceg'
},
{
    name: 'Includes the sound of a',
    rank: 9,
    exp: "tk",
    cased: false,
    active: true,
    requires: ['takeArtifact','viewArtifact','pickMirrors'],
    timeline: 'ceg'
},

// Resist the mirror
// Stop to close the box
// Ignore the box and keep driving
// Stop to help the officer
// Ignore the officer and keep driving
// Look into the lake
// Wade into the lake
// Enter the store
// Waiting in the parking lot






{
    name: 'Includes the date of the end of the world',
    rank: 1,
    exp: "[1-9][0-9]{3}",
    cased: false,
    active: true,
    requires: [],
},
{
    name: 'Includes whether you were there to see it',
    rank: 1,
    exp: "[1-9][0-9]{3}",
    cased: false,
    active: true,
    requires: [],
}
];

/* TIMELINE KEY:
A: Beginning
B: Visit the ferris wheel
C: Visit the hall of mirrors
D: Take the box
E: Take the mirror
F: Leave box and mirror
G: Willingly go with police officer
H: Resist police officer
I: Drive to lake
J: Drive to parking lot
K: Accept sinister offer
L: Resist sinister offer
M: Stop driving
N: Keep driving
*/

// Generate a rules parameter

class Rule {
    constructor(level) {
        this.number = question;
        this.level = level;
        this.timer = level.timer;
        this.rules = pickRules(this.level); // changed
    };
};

const pickRules = (level) => {
    let rules = [];
    //rules.push(ruleLength);
    rules.push(ruleReq);
    if (question < 2){
        let filter = ruleGeneric.filter(rule => rule.rank === level.rank); // changed
        dice = diceRoll(filter);
        rules.push(filter[dice]);
    };
    if (question > 1) {
        let filter = ruleStory.filter(rule => rule.rank === question);
        for (let i = 0; i < filter.length; i++){
            if (filter[i].active === true){
            rules.push(filter[i]);
            };
        };
        
    };
    return rules;
};

// Start game and generate a set of parameters

const startGame = () => {
    timePlayed = 0;
    document.getElementById('introduction-rules').style.display = 'none';
    document.getElementById('play-box').style.display = 'block';
    generateClock(document.getElementById('timer'));
    document.getElementById('timer').innerHTML = timeClock;
    nextQuestion();
    //Object.getOwnPropertyNames(currentRule.rules[0]) / Object.keys(currentRule.rules[0]) 
};

const ruleLengthBox = document.getElementById('password-length-rule');
const ruleLengthCheck = document.getElementById('password-length-check');

const continueGame = () => {
    nextQuestion();
    document.getElementById('results-box').style.display = 'none';
    document.getElementById('play-box').style.display = 'block';
    generateClock(document.getElementById('timer'));
    document.getElementById('timer').innerHTML = timeClock;
};

const nextQuestion = () => {
    document.getElementById('password-input').value = '';
    question++;
    generateRule();
    timer = setInterval(timeCountup,1000);
    document.getElementById('password-number').innerHTML = currentRule.number;
    // Populate a list with the rules
    /*ruleLengthBox.style.color = '#ff0000';
    ruleLengthBox.innerHTML = 'Between ' + currentRule.level.min + ' and ' + currentRule.level.max + ' characters';
    ruleLengthCheck.innerHTML = 'X ';*/
    document.getElementById('password-rule-list').textContent = '';
    let node = document.createElement('div');
    let textnode = document.createTextNode('Between ' + currentRule.level.min + ' and ' + currentRule.level.max + ' characters - X');
    node.appendChild(textnode);
    node.style.color = '#ff0000';
    document.getElementById('password-rule-list').appendChild(node);
    for (let i = 0; i < currentRule.rules.length; i++){
        let node = document.createElement('div');
        let textnode = document.createTextNode(currentRule.rules[i].name + ' - X');
        node.appendChild(textnode);
        node.style.color = '#ff0000';
        document.getElementById('password-rule-list').appendChild(node);
        };
};

const generateRule = () => {
    level = questionLevel[question-1];
    /*if (question <= 3){
        level = questionLevel[0];
    } else if (question <= 6){
        level = questionLevel[1];
    } else if (question <= 9){
        level = questionLevel[2];
    } else if (question > 9){
        level = questionLevel[3];
    };*/
    currentRule = new Rule(level);
};

// Check password when user types a key


const checkPassword = () => {
    password = document.getElementById('password-input').value;
    failReason = [];
    // Evaluate the validity of the password
    if (password.length > 0){
        // Is the password long enough?
        longEnough = evaluatePasswordLength(password);
        document.getElementById('password-rule-list').textContent = '';
        let node = document.createElement('div');
        let textnode = document.createTextNode('Between ' + currentRule.level.min + ' and ' + currentRule.level.max + ' characters - X');
        node.appendChild(textnode);
        if (longEnough === true){
            node.style.color = '#00cc00';
        } else {
            node.style.color = '#ff0000';
        };
        document.getElementById('password-rule-list').appendChild(node);
        rulePassed = 0;
        for (let i = 0; i < currentRule.rules.length; i++){
            evaluateRule(currentRule.rules[i],password);
        };
        if (longEnough === true && rulePassed === currentRule.rules.length){
            passwordGood = true;
        } else {
            passwordGood = false;
        };
    } else {
        document.getElementById('warning-box').innerHTML = '';
    };
    if (passwordGood === true){
        submitButton.disabled = false;
        document.getElementById('warning-box').style.color = "#33cc33";
        document.getElementById('warning-box').innerHTML = 'Password is good';
    } else {
        submitButton.disabled = true;
        document.getElementById('warning-box').style.color = "#ff0000";
        /*let list = document.createElement('ul');
        for (let i = 0; i < failReason.length; i++){
            //let item = document.createItem('li');
            //item.appendChild(document.createTextNode(failReason[i]));
            //list.appendChild(item);
        };*/
        document.getElementById('warning-box').innerHTML = failReason.join('/');
        //document.getElementById('warning-box').appendChild(list);
        
    };
};

// Filter input to remove spaces

/*const filterInput = () => {
    str = document.getElementById('password-input').value;
    const whiteSpace = new RegExp("\\s+");
    let clean = str.replace(whiteSpace,'');
    document.getElementById('password-input').value = clean;
};*/

const avoidSpace = (event) => {
    let k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
    str = document.getElementById('password-input').value;
    const whiteSpace = new RegExp("\\s+");
    let clean = str.replace(whiteSpace,'');
    document.getElementById('password-input').value = clean;
};

const input = document.querySelector('input');
//input.addEventListener('keydown',avoidSpace);
input.addEventListener('keyup',checkPassword);

// Submit password

const submitPassword = (password) => {
    clearInterval(timer);
    document.getElementById('play-box').style.display = 'none';
    document.getElementById('warning-box').innerHTML = '';
    document.getElementById('results-box').style.display = 'block';
    document.getElementById('password-results').innerHTML = 'success: ' + password;
    document.getElementById('time-stopwatch').innerHTML = timeClock;
    // Add the password to your final password
    finalPassword += password;
    // Systems for choice branching
    password = password.toLowerCase();
    if (question === 3){
        if (/hallofmirrors/.test(password) === true){
            //currentBranch = 'c';
            //pruneBranch = 'b';
            //pickMirrors = true;
            gameState.pickMirrors = true;
            pruneBranch = 'pickWheel';
            finalChoices.push(gameResults.pickMirrors);
        } else if (/ferriswheel/.test(password) === true){
            //currentBranch = 'b';
            //pruneBranch = 'c';
            //pickWheel = true;
            gameState.pickWheel = true;
            pruneBranch = 'pickMirrors';
            finalChoices.push(gameResults.pickWheel);
        };
        /*for (let i = 0; i < ruleStory.length; i++){
            if (ruleStory[i].requires.includes(pruneBranch)){
            //if (ruleStory[i].timeline.includes(pruneBranch)){
            //if (ruleStory[i].timeline === pruneBranch){
                //ruleStory[i].rank = 1;
                ruleStory[i].active = false;
            };
        };*/
    } else if (question === 5){
        if (/yes/.test(password) === true){
            gameState.takeArtifact = true;
            pruneBranch = 'leaveArtifact';
            if (gameState.pickMirrors === true){
                finalChoices.push(gameResults.takeMirror);
            } else if (gameState.pickWheel === true){
                finalChoices.push(gameResults.takeBox);
            };
        } else {
            gameState.leaveArtifact = true;
            pruneBranch = 'takeArtifact';
            if (gameState.pickMirrors === true){
                finalChoices.push(gameResults.leaveMirror);
            } else if (gameState.pickWheel === true){
                finalChoices.push(gameResults.leaveBox);
            };
        };
        //currentBranch = 'a';
    } else if (question === 7){
        if (gameState.takeArtifact === true){
            if (/resist/.test(password) === true){
                gameState.resistPolice = true;
                pruneBranch = 'surrenderPolice';
                finalChoices.push(gameResults.resistPolice);
            } else if (/surrender/.test(password) === true){
                gameState.surrenderPolice = true;
                pruneBranch = 'resistPolice';
                finalChoices.push(gameResults.surrenderPolice);
            };
        } else if (gameState.leaveArtifact === true){
            if (/deeplake/.test(password) === true){
                gameState.visitLake = true;
                pruneBranch = 'visitLot';
                finalChoices.push(gameResults.visitLake);
            } else if (/parkinglot/.test(password) === true){
                gameState.parkingLot = true;
                pruneBranch = 'visitlake';
                finalChoices.push(gameResults.visitLot);
            };
        };
    } else if (question === 8){
        if (gameState.resistPolice === true && gameState.takeArtifact === true){
            if (gameState.pickWheel === true){
                if (/close/.test(password) === true){
                    gameState.stopDriving = true;
                    pruneBranch = 'keepDriving';
                } else if (/drive/.test(password) === true){
                    gameState.keepDriving = true;
                    pruneBranch = 'stopDriving';
                };
            } else if (gameState.pickMirrors === true){
                if (/yes/.test(password) === true){
                    gameState.stopDriving = true;
                    pruneBranch = 'keepDriving';
                } else if (/no/.test(password) === true){
                    gameState.keepDriving = true;
                    pruneBranch = 'stopDriving';
                };
            };
        } else if (gameState.surrenderPolice === true && gameState.takeArtifact === true){
            if (/yes/.test(password) === true){
                gameState.viewArtifact = true;
                pruneBranch = 'rejectArtifact';
            } else if (/no/.test(password) === true){
                gameState.rejectArtifact = true;
                pruneBranch = 'viewArtifact';
            };
        } else if (gameState.visitLake === true){
            if (/depth/.test(password) === true){
                gameState.goInside = true;
                pruneBranch = 'stayOutside';
            } else if (/mirror/.test(password) === true){
                gameState.stayOutside = true;
                pruneBranch = 'goInside';
            };
        } else if (gameState.visitLot === true){
            if (/yes/.test(password) === true){
                gameState.goInside = true;
                pruneBranch = 'stayOutside';
            } else if (/no/.test(password) === true){
                gameState.stayOutside = true;
                pruneBranch = 'goInside';
            };
        };
    } else if (question === 10){
        endGame();
    };
    if (pruneBranch !== ''){
        for (let i = 0; i < ruleStory.length; i++){
            if (ruleStory[i].requires.includes(pruneBranch)){
        //if (ruleStory[i].timeline.includes(pruneBranch)){
        //if (ruleStory[i].timeline === pruneBranch){
            //ruleStory[i].rank = 1;
                ruleStory[i].active = false;
            };
        };
        prunebranch = '';
    };
    console.log('Choices: ' + finalChoices.join(','));
};

const evaluatePasswordLength = (password) => {
    if (password.length >= currentRule.level.min && password.length <= currentRule.level.max) {
        return true;
    } else {
        return false;
    };
};

//TESTING!

const evaluateRule = (rule,password) => {
    let regex = new RegExp(rule.exp);
    let node = document.createElement('div');
    let textnode = document.createTextNode(rule.name + ' - ');
    node.appendChild(textnode);
    if (rule.cased === false) {
        password = password.toLowerCase();
    };
    if (regex.test(password)){
        node.style.color = '#00cc00';
        let check = document.createTextNode('O');
        node.appendChild(check);
        rulePassed++;
        if (rule.variable === 'manEyes'){
            gameState.manEyes = password.match(regex);
            console.log('Set man\'s eyes to ' + gameState.manEyes + '.');
        };
    } else {
        node.style.color = '#ff0000';
        let check = document.createTextNode('X');
        node.appendChild(check);
    };
    document.getElementById('password-rule-list').appendChild(node);
};

// Set a timer

const generateClock = (clock) => {
    var date = new Date(null);
    date.setSeconds(timePlayed); // specify value for SECONDS here
    var ret = date.toISOString().substr(11, 8);
    timeClock = ret;
    clock.innerHTML = timeClock;
};

const timeCountup = () => {
    timePlayed++;
    generateClock(document.getElementById('timer'));
};

// End the game after Question 10

const endGame = () => {
    document.getElementById('results-box').style.display = 'none';
    document.getElementById('final-box').style.display = 'block';
    document.getElementById('final-time').innerHTML = timeClock;
    document.getElementById('final-password').innerHTML = finalPassword;
    let gameChoices = document.getElementById('game-choices');
    let l = document.createElement('ul');
    for (let i = 0; i < finalChoices.length; i++){
        let node = document.createElement('li');
        let textnode = document.createTextNode(finalChoices[i]);
        node.appendChild(textnode);
        l.appendChild(node);
    };
    gameChoices.appendChild(l);
}; 

// Lose game if timer hits 0

/*const loseTimer = () => {
    clearInterval(timer);
    setRedo = true;
    document.getElementById('play-box').style.display = 'none';
    document.getElementById('warning-box').innerHTML = '';
    document.getElementById('results-box').style.display = 'block';
    document.getElementById('password-results').innerHTML = 'fail';
};*/

// UI

const startButton = document.getElementById('start-button');
startButton.addEventListener('click',startGame);

const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click',function(){
    password = document.getElementById('password-input').value;
    submitPassword(password);
});
submitButton.disabled = true;

const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click',continueGame);


