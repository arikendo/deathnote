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

const inputHandler = function(e) {
    result.innerText = e.target.value;
}

function random() {
    max = names.length;
    var n = Math.floor(Math.random() * max);
    return names[n].toLowerCase()
}

function showGame() {
    var x = document.getElementById("welcomeMessage");
    x.style.display = "none";
    var y = document.getElementById("gameElements");
    y.style.display = "block";
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
        crime.innerHTML = "crime: challenging God"
    } else if (agents.includes(word)) {
        crime.innerHTML = "crime: stopping justice"
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
    var suspicion = document.getElementById("suspicion")
    var susText = document.getElementById("susText");
    var crime = document.getElementById("crime");
    
    if ((typed+key).toLowerCase() === word.slice(0, typed.length+1).toLowerCase()) {
        typed += key;
        pre.innerHTML = typed.toLowerCase();
        post.innerHTML = word.slice(typed.length, word.length+1);
    } else if(e.which === 13) {
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
    } else {
        if (!l_dead) {
            if (character === "Light") {
                sus += 20;
            } else {
                sus += 34
            }
    
            if (sus >= 100) {
                endGame();
            }
        }        

        combo = 1;
        var wordStuff = document.getElementById("wordStuff");
        wordStuff.classList.add('horizTranslate');
        setTimeout(stopShake, 350);
        wordSequence = 0;
    }

    if (typed.length === word.length) {
        if (agents.includes(word) && !l_dead) {
            sus += 20;

            if (sus >= 100) {
                endGame();
            }
        }

        if (word === "l lawliet") {
            l_dead = true;
        }

        wordSequence = wordSequence + 1;

        if (wordSequence === 5) {
            wordSequence = 0;
            combo += 1;
            if (combo >= 6) {
                combo = 6
            }            
            sound();
            rounded = Math.round(score/100)*100
            // threshold += 10 - Math.round((Math.round(sus/10) + (rounded/1000)));
            threshold += 10 - (Math.round(sus/10));
            var delta = Date.now() - start; // milliseconds elapsed since start
            currentSecs = Math.floor(delta / 1000); // in seconds
            document.getElementById('seconds').innerHTML = "Time: " + Number(threshold - currentSecs);
        }
        if (!l_dead) {
            if (sus >= 5) {
                sus -= 5;
            } else {
                sus = 0;
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
            word = random();
            newFace();
            setNewCrime();
        }        
        pre.innerHTML = "";
        post.innerHTML = word;
        score += 100 * combo;
        score_element.innerHTML = ": " + score;
    }
    comboText.style.width = ((combo-1) * 20) + "%";
    susText.innerHTML = "&nbsp" + sus + "%";
}


function endGame() {
    var x = document.getElementById("inGame");
    var y = document.getElementById("postGame");
    var scoreText = document.getElementById("postScore");

    x.style.display = "none";
    y.style.display = "block";
    scoreText.innerHTML = ": " + score;
}

function sound() {
    var snd = new Audio('Deathnote/kill.wav')//wav is also supported
    snd.play()//plays the sound
}

function startTime() {
    var delta = Date.now() - start; // milliseconds elapsed since start
    currentSecs = Math.floor(delta / 1000); // in seconds
    
    if (character === "Light") {
        document.getElementById('seconds').innerHTML = "Time: " + Number(threshold - currentSecs);
        if (currentSecs >= threshold) {
            endGame(); 
        }
    } else if(character === "Misa") {
        document.getElementById('seconds').innerHTML = "Time: " + Number(threshold - currentSecs);
        if(currentSecs >= threshold) {
            endGame();
        }
    }
    
    setTimeout(startTime, 1000);
}

function gameStart(str) {
    var score_element = document.getElementById("score");
    var score_text = document.getElementById("scoreText");
    score_element.style.display = "inline-block";
    score_text.style.display = "inline-block"
    score_element.innerHTML = ": " + score;
    score = 0;
    wordSequence = 0;

    sus = 0;
    // var susPercent = document.getElementById("sus");
    // var susContainer = document.getElementById("susContainer");
    var susText = document.getElementById("susText");
    var suspicion = document.getElementById("suspicion");
    // susContainer.style.display = "block";
    // susPercent.style.display = "block";
    susText.style.display = "inline-block";
    susText.innerHTML = "&nbsp" + sus + "%";
    suspicion.style.display = "inline-block";

    combo = 1;
    var comboPercent = document.getElementById("combo");
    var comboContainer = document.getElementById("comboContainer");
    var comboText = document.getElementById("comboText");
    comboContainer.style.display = "block";
    comboPercent.style.display = "block";
    comboText.style.display = "block";
    comboPercent.style.width = combo + "%";

    var postGame = document.getElementById("postGame");
    postGame.style.display = "none";

    var crime = document.getElementById("crime");
    crime.style.display = "block";

    var face = document.getElementById("face");
    face.style.display = "inline-block";

    word = random();
    newFace();
    setNewCrime();
    

    typed = "";
    var post = document.getElementById("postWord");
    var pre = document.getElementById("preWord");
    pre.innerHTML = "";
    post.innerHTML = word;

    l_dead = false;

    character = str;
    if (character === "Misa") {
        var nextWord_element = document.getElementById("nextWord");
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

function gameEnd() {
    var y = document.getElementById("inGame");
    var z = document.getElementById("postGame");

    y.style.display = "none"
    z.style.display = "block"
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
    "Gao Lian"
]