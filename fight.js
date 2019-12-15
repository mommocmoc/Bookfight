//http://data4library.kr/api/srchDtlList?authKey=aec2972736d2fddc06da29cead7a5251c924f514671befb9ce02ee7f51dd9df9&isbn13=9788936433598&loaninfoYN=Y&displayInfo=gender&format=json

let authKey =
  "aec2972736d2fddc06da29cead7a5251c924f514671befb9ce02ee7f51dd9df9";

let isbn1, isbn2, canvas, boxSprite1, boxSprite2;
let loanCntA = 0;
let loanCntB = 0;
let loanTargetA = 0;
let loanTargetB = 0;
let loanInfo = [];
let effectSoundA, effectSoundB;
let trigger = true;
let triggerB = true;
function preload() {
  effectSoundA = loadSound("./roll.mp3");
  effectSoundB = loadSound("./fin.mp3");
}
function setup() {
  canvas = createCanvas(1000, 500);
  canvas.parent('sketch');
  button = select("#submitD");
  inputA = select("#isbnA");
  inputB = select("#isbnB");
  button.mousePressed(fight);
  noStroke();
  frameRate(30);
}

function draw() {
  background(211, 211, 211);
  fill(255, 125, 0);
  rect(400, 100, 70, loanCntA / 10);
  fill(0, 125, 225);
  rect(600, 100, 70, loanCntB / 10);
  
  if (loanInfo.length > 1) {
    console.log(loanCntA, loanCntB, loanTargetA, loanTargetB);
    loanTargetA= parseInt(loanInfo[0].loanCnt, 0);
    loanTargetB = parseInt(loanInfo[1].loanCnt, 0);
    if(isNaN(loanTargetA)){

    }else{
      loanCntA += 10;  
    }
    if(isNaN(loanTargetB)){

    }else{
      loanCntB += 10;  
    }
    
    

    if(trigger){
      effectSoundA.loop();
      trigger = false;
    }
    
    if (loanCntA > loanTargetA) {
      loanCntA = loanTargetA
    }
    if (loanCntB > loanTargetB) {
      loanCntB = loanTargetB
      effectSoundA.stop()
      if(triggerB){
        effectSoundB.play();
        triggerB = false;
      }
      
    }
    let bookTitleA = loanInfo[0].bookTitle;
    let bookTitleB = loanInfo[1].bookTitle;
    fill(0);
    textAlign(CENTER);
    text(bookTitleA, 500 - 100, 250);
    text(loanCntA, 500 - 100, 200);
    text(loanCntB, 500 + 100, 200);
    text(bookTitleB, 500 + 100, 250);
  }
}


function fight() {
  dataHandler();
}

function dataHandler() {
  isbn1 = inputA.value();
  isbn2 = inputB.value();
  loadJSON(
    `http://data4library.kr/api/srchDtlList?authKey=${authKey}&isbn13=${isbn1}&loaninfoYN=Y&displayInfo=gender&format=json`,
    loanCounterA,
    "jsonp"
  );
  loadJSON(
    `http://data4library.kr/api/srchDtlList?authKey=${authKey}&isbn13=${isbn2}&loaninfoYN=Y&displayInfo=gender&format=json`,
    loanCounterB,
    "jsonp"
  );
}

function loanCounterA(data) {
  console.log("A", data);
  const loanCnt = data.response.loanInfo[0].Total.loanCnt;
  const bookTitle = data.response.detail[0].book.bookname;
  const ranking = data.response.loanInfo[0].Total.ranking;
  const infoObj = {
    bookTitle: bookTitle,
    loanCnt: loanCnt,
    ranking: ranking
  };
  loanInfo.push(infoObj);
}

function loanCounterB(data) {
  console.log("B", data);
  const loanCnt = data.response.loanInfo[0].Total.loanCnt;
  const bookTitle = data.response.detail[0].book.bookname;
  const ranking = data.response.loanInfo[0].Total.ranking;
  const infoObj = {
    bookTitle: bookTitle,
    loanCnt: loanCnt,
    ranking: ranking
  };
  loanInfo.push(infoObj);
}
