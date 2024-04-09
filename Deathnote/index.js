var typed = '';
var word = '';
var nextWord = '';
var score = 0;
var character = '';
var start;
var combo = 1;
var wordSequence = 0;
var sus = 0;
var lastFace = 0;
var agents = [
    "soichiro yagami",
    "shuichi aizawa",
    "kanzo mogi",
    "touta matsuda",
    "hideki ide",
    "hirokazu ukita",
    "quillsh wammy",
    "raye penber",
    "toors denote",
    "haley belle",
    "lian zapack",
    "arire weekwood",
    "ale funderrem",
    "freddi guntair",
    "knick staek",
    "bess skelletd",
    "frigde copen",
    "girela sevenster",
    "nikola nasberg"
] // the investigation team + FBI agents
var l_dead;
var threshold;
var kills = 0;
var high_score = Number(getCookie("high_score"));
var last_score = 0;
var randomIndex = [];
var ryukOpen = false;
var apples = 0;
var apple_modifier = 1;

// THIS IS ALMOST DONE
var audioFiles = [
    "Deathnote/sfx/combo2.mp3",
    "Deathnote/sfx/combo3.mp3",
    "Deathnote/sfx/combo4.mp3",
    "Deathnote/sfx/combo5.mp3",
    "Deathnote/sfx/combo6.mp3"
]

var audioFilesMistakes = [
    "Deathnote/sfx/mistake1.mp3",
    "Deathnote/sfx/mistake2.mp3",
    "Deathnote/sfx/mistake3.mp3",
    "Deathnote/sfx/mistake4.mp3",
]

var audioFilesBoom = [
    "Deathnote/sfx/Heartbeat.mp3",
    "Deathnote/sfx/kill.wav"
]

var comboMusicPlayer = new Audio();
for (var i in audioFiles) {
    preloadAudio(comboMusicPlayer, audioFiles[i]);
}

comboMusicPlayer.volume = 0.6;

var mistakeMusicPlayer = new Audio();
for (var i in audioFilesMistakes) {
    preloadAudio(mistakeMusicPlayer, audioFilesMistakes[i]);
}

var boomMusicPlayer = new Audio();

for (var i in audioFilesBoom) {
    preloadAudio(boomMusicPlayer, audioFilesBoom[i]);
}


var bgMusicPlayer = new Audio();
preloadAudio(bgMusicPlayer, "Deathnote/sfx/bg-music.m4a");
bgMusicPlayer.volume = 0.15;

var ryukMusicPlayer = new Audio()
preloadAudio(ryukMusicPlayer, "Deathnote/sfx/RyukHipShop.m4a");
ryukMusicPlayer.volume = 0.15;

function kill_L() {
    if (apples > 49) {
        l_dead = true;
        apples -= 50;
        var applesText = document.getElementById("applesText");
        applesText.innerHTML = "&nbsp" + apples;
    }
}

function moreApples() {
    if (apples > 0) {
        apple_modifier += 1;
        apples -= 1;
        var applesText = document.getElementById("applesText");
        applesText.innerHTML = "&nbsp" + apples;
    }    
}

function potatoChip() {
    if (apples > 0) {
        sus = 0;
        var susText = document.getElementById("susText");
        susText.innerHTML = "&nbsp" + sus + "%";
        apples -= 1;
        var applesText = document.getElementById("applesText");
        applesText.innerHTML = "&nbsp" + apples;
    }    
}

function preloadAudio(player, url) {
    // once this file loads, it will call loadedAudio()
    // the file will be kept by the browser as cache
    player.addEventListener('canplaythrough', loadedAudio, false);
    player.src = url;
}

var loaded = 0;
function loadedAudio() {
    // this will be called every time an audio file is loaded
    // we keep track of the loaded files vs the requested files
    loaded++;
    if (loaded == audioFiles.length){
    	// all have loaded
    	console.log("loaded audio")
    }
}

function hover_light(element) {
    element.setAttribute('src', 'Deathnote/images/light_select_hover.png');
}

function unhover_light(element) {
    element.setAttribute('src', 'Deathnote/images/light_select.png');
}

function hover_misa(element) {
    element.setAttribute('src', 'Deathnote/images/misa_select_hover.png');
}

function unhover_misa(element) {
    element.setAttribute('src', 'Deathnote/images/misa_select.png');
}

const inputHandler = function(e) {
    result.innerText = e.target.value;
}

function random() {
    if (randomIndex.length == 0) {
        for (var i = 0; i < names.length-1; i++) {
            randomIndex[i] = i;
        }
    }
    n = randomIndex.splice(Math.floor(Math.random()*randomIndex.length), 1);
    return names[n].toLowerCase()
}

function showGame() {
    var x = document.getElementById("welcomeMessage");
    x.style.display = "none";
    var y = document.getElementById("gameElements");
    y.style.display = "block";

    var lastScore = document.getElementById("lastScore");
    var highScore = document.getElementById("highScore");

    high_score = Number(getCookie("high_score"));

    last_score = score;
    if (last_score > high_score) {
        document.cookie = "high_score=" + last_score + ";";
        highScore.innerHTML = last_score;
    } else {
        highScore.innerHTML = high_score;
    }

    lastScore.innerHTML = last_score;
}

function stopShake() {
    wordStuff.classList.remove('horizTranslate');
}

function newFace() {
    var face = document.getElementById("face").getContext("2d");
    const image = new Image();
    image.onload = () => {
        // Draw the image into the canvas
        face.clearRect(0, 0, face.canvas.width, face.canvas.height);
        face.drawImage(image, 0, 0);
    };
    file = randomFace();
    image.src = file
}

function newCrime() {
    var n = Math.floor(Math.random() * crimes.length);
    return crimes[n];
}

function setNewCrime() {
    var crime = document.getElementById("crime");
    if (word === "l lawliet") {
        crime.innerHTML = "crime: L"
    } else if (agents.includes(word)) {
        crime.innerHTML = "crime: Investigating Kira"
    } else {
        crime.innerHTML = "crime: " + newCrime();
    }
}

function randomFace() {
    var n = Math.floor(Math.random() * 78)+1;
    while (n === lastFace) {
        n = Math.floor(Math.random() * 78)+1;
    }
    if (n < 10) {
        var file = "Deathnote/portrait-files/tile00" + String(n)
    } else {
        var file = "Deathnote/portrait-files/tile0" + String(n)
    }
    lastFace = n;
    return file + ".png"    
}

function susGraph() {
    var dps = []; // dataPoints
    var chart = new CanvasJS.Chart("chartContainer", {
        data: [{
            type: "line",
            dataPoints: dps,
            lineColor: "red",
            markerColor: "#FF0000",
            markerSize: 1,
        }],
        axisY:{
            maximum: 100,
            minimum: 0,
            gridThickness: 1, 
            tickLength: 0,
            lineThickness: 0
        },
        axisX: {
            gridThickness: 0, 
            tickLength: 0,
            lineThickness: 1
        },
        interactivityEnabled: false,
        backgroundColor: "#00000"
    });
    
    var xVal = 0;
    var yVal = 100; 
    var updateInterval = 1000;
    var dataLength = 10; // number of dataPoints visible at any point
    
    var updateChart = function (count) {
        count = count || 1;
    
        for (var j = 0; j < count; j++) {
            yVal = sus + Math.round(5 + Math.random() *(-5-5));
            if (yVal < 0){
                yVal = 0
            }
            dps.push({
                x: xVal,
                y: yVal
            });
            xVal++;
        }
    
        if (dps.length > dataLength) {
            dps.shift();
        }
        chart.render();
    };
    var susText = document.getElementById("susText");
    susText.innerHTML = "&nbsp" + sus + "%";
    
    updateChart(dataLength);
    setInterval(function(){updateChart()}, updateInterval);
}

function typing(e) {
    key = String.fromCharCode(e.which);

    var pre = document.getElementById("preWord");
    var post = document.getElementById("postWord");
    var score_element = document.getElementById("score");
    var comboText = document.getElementById("combo");
    var susText = document.getElementById("susText");
    var killText = document.getElementById("killText");
    var comboImage = document.getElementById("comboImage");
    var inGame = document.getElementById("inGame");
    var ryukShop = document.getElementById("ryukShop");
    var inGameElements = document.getElementById("inGameElements");
    var applesText = document.getElementById("applesText"); 

    if (inGame.style.display === "none") {
        return;
    }

    if (ryukOpen) {
        if (e.which === 27) {
            ryukOpen = false;
            ryukShop.style.display = "none";
            inGameElements.style.display = "block";
            bgMusicPlayer.play();
            ryukMusicPlayer.pause();
            ryukMusicPlayer.currentTime = 0;
        }
        return;
    }
    
    if ((typed+key).toLowerCase() === word.slice(0, typed.length+1).toLowerCase()) {
        typed += key;
        pre.innerHTML = typed.toLowerCase();
        post.innerHTML = word.slice(typed.length, word.length+1);
    } else if(e.which === 13) {
        if (!agents.includes(word)) {
            if (score > 0) {
                score -= 1000;
            } 
        }
        typed = "";
        if (character === "Misa") {
            var nextWord_element = document.getElementById("nextWord");
            word = nextWord;
            nextWord = random();
            nextWord_element.innerHTML = nextWord;
            newFace();
            setNewCrime();
        } else {
            word = random()
            newFace();
            setNewCrime();
        }        
        pre.innerHTML = "";
        post.innerHTML = word;
    } else if(e.which === 8) {
        bgMusicPlayer.pause();
        ryukMusicPlayer.play();
        applesText.innerHTML = "&nbsp" + apples;
        ryukShop.style.display = "block";
        inGameElements.style.display = "none";
        ryukOpen = true;
    } else {
        if (!l_dead) {
            if (character === "Light") {
                sus += 20;
            } else {
                sus += 40;
            }
    
            if (sus >= 100) {
                endGame();
            }
        }        
        inGame.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1)), url('Deathnote/images/particle-fire-header-ani.gif')";
        comboImage.src = "Deathnote/images/combo1_light.png"
        if (combo > 1) {
            randomMistakeSound();
        } 
        combo = 1;
        var wordStuff = document.getElementById("wordStuff");
        wordStuff.classList.add('horizTranslate');
        setTimeout(stopShake, 350);
        wordSequence = 0;
    }

    if (typed.length === word.length) {
        kills += 1;
        if (agents.includes(word) && !l_dead) {
            sus += 50;

            if (sus >= 100) {
                endGame();
            }
        }

        if (word === "l lawliet") {
            endGame();
        }

        wordSequence = wordSequence + 1;

        if (wordSequence === 5) {
            wordSequence = 0;
            combo += 1;
            apples += apple_modifier;
            boomMusicPlayer.volume = 1;
            boomMusicPlayer.src = audioFilesBoom[1];
            boomMusicPlayer.play();
            if (combo >= 6) {
                comboImage.src = "Deathnote/images/combo5_light.png"
                combo = 6;
                sound(combo);
                inGame.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('Deathnote/images/particle-fire-header-ani.gif')";
            } else {
                comboImage.src = "Deathnote/images/combo" + combo + "_light.png"
                sound(combo);
                var opac = 1 - (combo/100);
                inGame.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, " + opac + "), rgba(0, 0, 0, " + opac + ")), url('Deathnote/images/particle-fire-header-ani.gif')"; 
            }            
            
            rounded = Math.round(score/100)*100
            // threshold += 10 - Math.round((Math.round(sus/10) + (rounded/1000)));
            threshold += Math.ceil(combo * 1.5);
            var delta = Date.now() - start; // milliseconds elapsed since start
            currentSecs = Math.floor(delta / 1000); // in seconds
            document.getElementById('seconds').innerHTML = "Time: " + Number(threshold - currentSecs);
        } else {
            boomMusicPlayer.volume = 0.5;
            boomMusicPlayer.src = audioFilesBoom[0];
            boomMusicPlayer.play();
        }

        if (!l_dead) {
            if (sus >= 1) {
                sus -= 5;
            } else {
                sus = 0;
            }
        }        

        typed = "";
        newFace();
        
        if (character === "Misa") {
            var nextWord_element = document.getElementById("nextWord");
            word = nextWord;
            nextWord = random();
            nextWord_element.innerHTML = nextWord;
            setNewCrime();
        } else {
            word = random();
            setNewCrime();
        }        
        pre.innerHTML = "";
        post.innerHTML = word;
        score += 1000 * combo;
    }
    score_element.innerHTML = ": " + score;
    comboText.style.width = ((combo-1) * 20) + "%";
    susText.innerHTML = "&nbsp" + sus + "%";
    killText.innerHTML = "&nbsp" + kills;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function endGame() {
    bgMusicPlayer.pause();
    bgMusicPlayer.currentTime = 0;

    var x = document.getElementById("inGame");
    var y = document.getElementById("preGame");
    var ryukShop = document.getElementById("ryukShop");
    var inGameElements = document.getElementById("inGameElements");
    var lastScore = document.getElementById("lastScore");
    var highScore = document.getElementById("highScore");

    var nextWord_element = document.getElementById("nextWord");
    nextWord_element.innerHTML = '';

    high_score = Number(getCookie("high_score"));

    console.log(getCookie("high_score"));

    last_score = score;
    if (score > high_score) {
        document.cookie = "high_score=" + last_score + ";";
        highScore.innerHTML = last_score;
    } else {
        highScore.innerHTML = high_score;
    }

    lastScore.innerHTML = last_score;

    ryukShop.style.display = "none";
    inGameElements.style.display = "block";
    x.style.display = "none";
    y.style.display = "block";    
}

function sound(index) {
    index -= 2;
    comboMusicPlayer.src = audioFiles[index];
    comboMusicPlayer.play();
}

function randomMistakeSound() {
    index =  Math.floor(Math.random() * (4 - 1 + 1) + 1) - 1;
    mistakeMusicPlayer.src = audioFilesMistakes[index];
    mistakeMusicPlayer.play();
}

function startTime() {
    var delta = Date.now() - start; // milliseconds elapsed since start
    currentSecs = Math.floor(delta / 1000); // in seconds

    document.getElementById('seconds').innerHTML = "Time: " + Number(threshold - currentSecs);
    if (currentSecs >= threshold) {
        endGame(); 
    } else {
        setTimeout(startTime, 1000);
    }    
}

function gameStart(str) {
    randomIndex = [];
    score = 0;
    wordSequence = 0;
    kills = 0;
    sus = 0;
    combo = 1;
    typed = "";
    ryukOpen = false;
    apples = 0;
    apple_modifier = 1;
    l_dead = false;

    var score_element = document.getElementById("score");
    var score_text = document.getElementById("scoreText");
    score_element.style.display = "inline-block";
    score_text.style.display = "inline-block"
    score_element.innerHTML = ": " + score;
    
    var susText = document.getElementById("susText");
    var suspicion = document.getElementById("suspicion");
    var preKill = document.getElementById("kills");
    var susText = document.getElementById("susText");
    var ryukShop = document.getElementById("ryukShop");

    susText.style.display = "inline-block";
    susText.innerHTML = "&nbsp" + sus + "%";
    suspicion.style.display = "inline-block";
    preKill.style.display = "inline-block"
    killText.style.display = "inline-block"
    killText.innerHTML = "&nbsp" + kills;
    ryukShop.style.display = "none";
    
    var comboPercent = document.getElementById("combo");
    var comboContainer = document.getElementById("comboContainer");
    var comboText = document.getElementById("comboText");
    comboContainer.style.display = "block";
    comboPercent.style.display = "block";
    comboText.style.display = "block";
    comboPercent.style.width = combo + "%";

    var opac = 1;
    var inGame = document.getElementById("inGame");
    inGame.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, " + opac + "), rgba(0, 0, 0, " + opac + ")), url('Deathnote/images/particle-fire-header-ani.gif')"; 


    var comboImage = document.getElementById("comboImage");

    comboImage.src = "Deathnote/images/combo1_light.png"

    var postGame = document.getElementById("postGame");
    postGame.style.display = "none";

    var crime = document.getElementById("crime");
    crime.style.display = "block";

    var face = document.getElementById("face");
    face.style.display = "inline-block";

    word = random();
    newFace();
    setNewCrime();

    bgMusicPlayer.play();

    var post = document.getElementById("postWord");
    var pre = document.getElementById("preWord");
    pre.innerHTML = "";
    post.innerHTML = word;

    character = str;
    var nextWord_element = document.getElementById("nextWord");
    if (character === "Misa") {
        nextWord = random();
        nextWord_element.innerHTML = nextWord;
        threshold = 45;
    } else {
        threshold = 60;
    }

    var x = document.getElementById("preGame");
    var y = document.getElementById("inGame");
    var comboText = document.getElementById("combo");
    comboText.style.width = ((combo-1)*20) + "%";

    x.style.display = "none";
    y.style.display = "block";

    susGraph();

    document.addEventListener("keydown", typing, false);

    start = Date.now();
    startTime();
}

let crimes = [
    "homicide",
    "sex trafficking",
    "statutory rape",
    "rape",
    "assault",
    "battery",
    "embezzlement",
    "tax evasion",
    "driving under the influence",
    "drug possession",
    "insurance fraud",
    "vandalism",
    "theft"
]

let names = [
    "L Lawliet",
    "Soichiro Yagami",
    "Shuichi Aizawa",
    "Kanzo Mogi",
    "Touta Matsuda",
    "Hideki Ide",
    "Hirokazu Ukita",
    "Quillsh Wammy",
    "Raye Penber",
    "Toors Denote",
    "Haley Belle",
    "Lian Zapack",
    "Arire Weekwood",
    "Ale Funderrem",
    "Freddi Guntair",
    "Knick Staek",
    "Bess Skelletd",
    "Frigde Copen",
    "Girela Sevenster",
    "Nikola Nasberg",
    "Samon Tatsukichi",
    "Ida Tokugawa",
    "Suga Ogai",
    "Wakayama Toshikuni",
    "Hayabusa Junichiro",
    "Ando Mushanokoji",
    "Kikuchi Soseki",
    "Kurokawa Matsusuke",
    "Nakatomi Toyokazu",
    "Yamaha Nampo",
    "Baisho Kiyonaga",
    "Yonezawa Hachemon",
    "Saiki Kokei",
    "Sekino Shun",
    "Tamatsuki Hiro",
    "Mihara Maro",
    "Tsuruoka Nobuhiko",
    "Maeda Mareo",
    "Hamada Inari",
    "Mitsugu Ryu",
    "Mura Shoko",
    "Takamaru Yuri",
    "Ouji Isaki",
    "Utsunomiya Chise",
    "Kazato Juria",
    "Taguchi Kiwa",
    "Sakurai Yone",
    "Inoshishi Mari",
    "Matsumura Kazu",
    "Yoichi Tamaki",
    "Matsuno Hiyori",
    "Nakahara Kaname",
    "Okuda Tomo",
    "Sakane Itsuki",
    "Dokite Akiho",
    "Ikeda Tomoe",
    "Iseri Midori",
    "Nakatani Hatsu",
    "Rikimaru Haruichi",
    "Taniuchi Sora",
    "Hatsu Shinobu",
    "Kuroba Anri",
    "Nakama Rin",
    "Yashima Sakae",
    "Junko Rui",
    "Morita Ryuko",
    "Nishihara Rei",
    "Tsutsumi Riku",
    "David Williamson",
    "Dominic Cooke",
    "Owen Gray",
    "James Berry",
    "Archie Wells",
    "Chaim Chen",
    "Preston Fitzpatrick",
    "Casen Mccarty",
    "Kaleb Lane",
    "Jon Ruiz",
    "Matthew Hunter",
    "Jenson Smith",
    "Ewan Parry",
    "Jonathan Mason",
    "Henry Patel",
    "Kendrick Horton",
    "Marlon Floyd",
    "Zeke Kelley",
    "Angelo Mcneil",
    "London Chang",
    "Jodie Sutton",
    "Lydia Chapman",
    "Bella Wells",
    "Amelie Hart",
    "Martha Cox",
    "Jaliyah West",
    "Victoria Knox",
    "Isla Houston",
    "Selah Wyatt",
    "Emery Pittman",
    "Xue Shui",
    "Zhu Zexian",
    "Kang Zhong",
    "Zhang Kang",
    "Mao Shi",
    "Cheng Jiang",
    "Gu Wuying",
    "Luo Xieren",
    "Yao Lei",
    "Peng Feng",
    "Tian Zhen",
    "Xiong Cai",
    "Zhao Fu",
    "Yan Su",
    "Su Wei",
    "Chang Jingyi",
    "Zhang Xieren",
    "Geng Liang",
    "Ma Jiahao",
    "Yang Yi",
    "Han Zheng",
    "Duan Delan",
    "Yao Wuying",
    "Lai Ming",
    "Zhan Jian",
    "Ye Xuegang",
    "Lu Wei",
    "Huo Xinyue",
    "Liao Cui",
    "Gao Lian",
    "Donald Trump",
    "Joe Biden",
    "Elon Musk",
    "David Berkowitz",
    "Ted Bundy",
    "Jeffrey Dahmer",
    "John Gacy",
    "Ed Gein",
    "Herman Mudgett",
    "Marc Dutroux",
    "Luis Garavito",
    "Harold Shipman",
    "William Burke",
    "Javed Iqbal",
    "Tony Ables",
    "Henry Lucas",
    "Samuel Little",
    "Blake Marshall",
    "Sean Wallace",
    "Anthony Barnes",
    "Roberto Buckner",
    "Emilia Cunningham",
    "Olivia Spencer",
    "Blake Kelly",
    "Amy West",
    "Lizbeth Cooper",
    "Michael Shaffer",
    "Patrick Maloney",
    "Everett Joseph",
    "Hubert Brock",
    "Beatrice Thomson",
    "Max Dale",
    "Saira Miller",
    "Rebecca Gay",
    "Dillan Vaughn",
    "Peter Scott",
    "Eddie Sears",
    "Rhea Mayo",
    "Malaika Stephens",
    "Edwin Gilbert",
    "Maxine Wade",
    "Rosalie Francis",
    "June Carpenter",
    "Irving Fuller",
    "Carlos Pierce",
    "Gail Garza",
    "Theodore Sullivan",
    "Jody Buchanan",
    "Delores Hogan",
    "Elizabeth Diaz",
    "Terry Rodriguez",
    "Jane Johnson",
    "Jean Miller",
    "Chris Edwards",
    "Jimmy King",
    "Barbara Peterson",
    "Louis Mitchell",
    "Steven Simmons",
    "Edward Allen",
    "Mark Price",
    "Brandon Moore",
    "Clarence Wright",
    "Ann Hall",
    "Daniel Wood",
    "Katherine Watson",
    "Richard Baker",
    "Mary James",
    "Bobby Sanchez",
    "Nicole Ramirez",
    "Ashley Jenkins",
    "Mildred Torres",
    "Pamela Washington",
    "Sarah Adams",
    "Jason Bell",
    "Steve Williams",
    "Sandra Bryant",
    "Stephen Roberts",
    "Lisa Jackson",
    "Lillian Sanchez",
    "Keith Gonzalez",
    "Betty Jenkins",
    "Louise Martin",
    "Nicholas Powell",
    "Carlos Sanchez",
    "Randy Cox",
    "Chris Young",
    "Gregory Bennett",
    "Arthur Diaz",
    "Joe Hall"
]