const jsonReq = new XMLHttpRequest();
//  create Element
const textQNum = document.querySelector(".q-numbers span");
const questionErea = document.querySelector(".question-erea");
const answersErea = document.querySelector(".answers");
const nextQBTN = document.querySelector(".nquestion");
const bullets = document.querySelectorAll(".span span");
const submitBtn = document.querySelector(".submit");
const btnErea = document.querySelector(".buttons");
let counter = document.querySelector(".counter");
let qnum = 0;
let rightAnswers = 0;
let countdownInterval;
jsonReq.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    // create answers element
    let answersRadio = document.getElementsByName("answer");

    // make questions Data
    const questionsData = JSON.parse(this.responseText);
    const qCount = questionsData.length;
    // num of questions
    const numQuestions = questionsData.length;
    // display num of question
    textQNum.textContent = `${qnum + 1} of ${numQuestions}`;
    // display question
    countdown(30, qCount);
    displayQuestion(questionsData, qnum);
    // display Answers
    displayAnswers(questionsData, qnum);

    // submit button
    submitBtn.addEventListener("click", () => {
      // turn on next question button
      nextQBTN.style.pointerEvents = "all";
      // create img and label element
      let imgs = document.querySelectorAll(".answer .imgs .img");
      let answerslabel = document.querySelectorAll(".answers .answer");
      imgs.forEach((img) => {
        img.style.visibility = "visible";
      });
      // make answer dont change
      answersErea.style.pointerEvents = "none";
      answersRadio.forEach((answer, i) => {
        if (answer.dataset.set === questionsData[qnum]["right_answer"]) {
          imgs[i].src = "imgs/true.png";
          answerslabel[i].style.backgroundColor = "#009635ad";
        }
        if (answer.checked) {
          if (answer.dataset.set === questionsData[qnum]["right_answer"]) {
            bullets[qnum].classList.add("right");
            document.getElementById("success").play();
            rightAnswers++;
          } else {
            bullets[qnum].classList.add("wrong");
            document.getElementById("fail").play();
          }
        }
      });
      // end quiz
      if (qnum >= 8) {
        answersErea.innerHTML = "";
        questionErea.innerHTML = "";
        btnErea.innerHTML = `You finished The Quiz, You Answered ${rightAnswers} of ${
          qnum + 1
        } Questions True `;
      }
    });
    // next Question
    nextQBTN.addEventListener("click", () => {
      answersErea.style.pointerEvents = "all";
      if (qnum >= 8) {
        nextQBTN.style.pointerEvents = "none";
      } else {
        // increase num of question
        qnum++;
        // update num of qusetion
        textQNum.textContent = `${qnum + 1} of ${numQuestions}`;
        // clear Q&A Erea
        questionErea.innerHTML = "";
        answersErea.innerHTML = "";
        // bullets now class
        bullets[qnum].classList.add("now");
        bullets[qnum - 1].classList.remove("now");
        displayQuestion(questionsData, qnum);
        // display Answers
        displayAnswers(questionsData, qnum);
        // reset count down
        clearInterval(countdownInterval);
        countdown(30, qCount);

        // check the first choice
        answersRadio[0].checked = true;
      }
    });
    // check the first choice
    answersRadio[0].checked = true;
  }
};
jsonReq.open("GET", "questionsData.json", true);
jsonReq.send();
// displayQuestion function
function displayQuestion(data, qNum) {
  // lock next question btn
  nextQBTN.style.pointerEvents = "none";
  // displayQuestion function
  let questionB = document.createElement("p");
  let questionBText = document.createTextNode(data[qNum].question);
  questionB.appendChild(questionBText);
  questionErea.appendChild(questionB);
}
// displayAnswers function
function displayAnswers(questionsData, qnum) {
  for (let i = 4; i > 0; i--) {
    let answer = questionsData[qnum][i];
    let html = `<div class="answer">
      <input id="answer_${i}" data-set="${answer}" name="answer" type="radio" />
      <label for="answer_${i}">${answer}</label>
      <div class="imgs"><img class="img" src="imgs/wrong.png" alt="" /></div>
    </div>`;
    answersErea.insertAdjacentHTML("afterbegin", html);
  }
}
// countdown interval
function countdown(duration, count) {
  if (qnum < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      counter.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
        nextQBTN.click();
      }
    }, 1000);
  }
}
