var typed = '';
var word = '';
var nextWord = '';
var score = 0;
var character = '';
var start;
var combo = 1;
var wordSequence = 0;
var sus = 0;
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

function typing(e) {
    key = String.fromCharCode(e.which);

    var pre = document.getElementById("preWord");
    var post = document.getElementById("postWord");
    var score_element = document.getElementById("score");
    var comboText = document.getElementById("combo");
    var susText = document.getElementById("sus");
    
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
        } else {
            word = random()
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
    }

    if (typed.length === word.length) {
        if (agents.includes(word) && !l_dead) {
            sus += 50;
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
        } else {
            word = random()
        }        
        pre.innerHTML = "";
        post.innerHTML = word;
        score += 100 * combo;
        score_element.innerHTML = ": " + score;
    }
    comboText.style.width = ((combo-1) * 20) + "%";
    susText.style.width = sus + "%";
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
    var snd = new Audio('kill.wav')//wav is also supported
    snd.play()//plays the sound
}

function startTime() {
    var delta = Date.now() - start; // milliseconds elapsed since start
    currentSecs = Math.floor(delta / 1000); // in seconds
    
    if (character === "Light") {
        document.getElementById('seconds').innerHTML = "Time: " + Number(60 - currentSecs);
        if (currentSecs >= 60) {
            endGame(); 
        }
    } else if(character === "Misa") {
        document.getElementById('seconds').innerHTML = "Time: " + Number(45 - currentSecs);
        if(currentSecs >= 45) {
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

    sus = 0;
    var susText = document.getElementById("sus");
    var susContainer = document.getElementById("susContainer");
    susContainer.style.display = "block";
    susText.style.display = "block";
    susText.style.width = sus + "%";

    combo = 1;
    var comboText = document.getElementById("combo");
    var comboContainer = document.getElementById("comboContainer");
    comboContainer.style.display = "block";
    comboText.style.display = "block";
    comboText.style.width = combo + "%";

    var postGame = document.getElementById("postGame");
    postGame.style.display = "none";

    word = random();
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
    }

    var x = document.getElementById("preGame");
    var y = document.getElementById("inGame");
    var comboText = document.getElementById("combo");
    comboText.style.width = ((combo-1)*20) + "%";

    x.style.display = "none";
    y.style.display = "block";    

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