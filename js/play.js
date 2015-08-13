/**
 * Created by zeulb on 8/12/15.
 */

var currentQuestion = -1;
var numberOfQuestions = 0;
var answerKey = [];
var statusClass = {
  "current": "btn btn-warning btn-sm",
  "valid": "btn btn-success btn-sm",
  "invalid": "btn btn-danger btn-sm"
};

var statusBar = [];
/*


 <!--
 <tbody id="question-0-section">
 <tr>
 <td colspan="2">
 <blockquote>
 <p class="lead">Budi Anduk sukanya makan apa cabe sambil tiduran?</p>
 </blockquote>
 </td>
 </tr>
 <tr>
 <td colspan="2">
 <p class="text-lg"><input type="radio" name="question-{questionId}-option" value="option-{optionId}" checked> Makan Cabe</p>
 </td>
 </tr>
 <tr>
 <td colspan="2">
 <p class="text-lg"><input type="radio" name="question-{questionId}-option" value="option-{optionId}" checked> Makan Cabe</p>
 </td>
 </tr>
 <tr>
 <td colspan="2">
 <p class="text-lg"><input type="radio" name="question-{questionId}-option" value="option-{optionId}" checked> Makan Cabe</p>
 </td>
 </tr>
 </tbody> -->

 */

function getOptionRadioNodes(questionId) {
  return document.querySelectorAll("#question-"+questionId+"-section > tr > td > p > input[type=\"radio\"]");
}

function updateStatus(questionId, status) {
  var statusNode = document.getElementById("status-"+questionId);
  statusNode.setAttribute("class", statusClass[status]);
}

function addToStatusBar(questionId) {
  statusBar.push("valid");
  var statusContainerNode = document.getElementById("question-status");
  var statusNode = document.createElement("button");
  statusNode.setAttribute("type", "button");
  statusNode.setAttribute("class", statusClass["valid"]);
  statusNode.setAttribute("id", "status-"+questionId);
  statusNode.setAttribute("onclick", "changeQuestionTo(this)");
  statusNode.innerHTML = (questionId===numberOfQuestions)?"Result":((questionId+1).toString());
  statusContainerNode.appendChild(statusNode);
  statusContainerNode.appendChild(document.createTextNode("\u00A0"));
}

function createSymbolNode(type) {
  var symbolNode = document.createElement("span");
  symbolNode.setAttribute("class", "glyphicon glyphicon-"+type);
  symbolNode.setAttribute("aria-hidden", "true");
  symbolNode.innerHTML = " ";
  return symbolNode;
}

function createQuestionTextNode(questionText) {

  // create tr node
  var rowNode = document.createElement("tr");

  // create td node
  var tdNode = document.createElement("td");
  tdNode.setAttribute("colspan", "2");

  // create blockquote node
  var blockQuoteNode = document.createElement("blockquote");

  // create question text node
  var questionTextNode = document.createElement("p");
  questionTextNode.setAttribute("class", "lead");
  questionTextNode.innerHTML = questionText;

  // build block
  blockQuoteNode.appendChild(questionTextNode);
  tdNode.appendChild(blockQuoteNode);
  rowNode.appendChild(tdNode);

  return rowNode;
}

function createOptionNode(questionId, optionId, optionText) {
  // create tr node
  var rowNode = document.createElement("tr");

  // create td node
  var tdNode = document.createElement("td");
  tdNode.setAttribute("colspan", "2");

  // create option block node
  var optionBlockNode = document.createElement("p");
  optionBlockNode.setAttribute("class", "text-lg");

  // create radio node
  var radioNode = document.createElement("input");
  radioNode.setAttribute("type", "radio");
  radioNode.setAttribute("name", "question-"+questionId+"-option");
  radioNode.setAttribute("value", "option-"+optionId);

  // attach all
  optionBlockNode.appendChild(radioNode);
  optionBlockNode.appendChild(document.createTextNode(" "+optionText));

  tdNode.appendChild(optionBlockNode);
  rowNode.appendChild(tdNode);

  return rowNode;
}

function renderQuestion(questionId, questionData) {
  var text = questionData["question"];
  var options = questionData["options"];

  var controlNode = document.getElementById("quiz-control");
  var tableNode = controlNode.parentNode;

  // Create tbody
  var sectionNode = document.createElement("tbody");
  sectionNode.setAttribute("id", "question-"+questionId+"-section");
  sectionNode.setAttribute("hidden", "");
  sectionNode.appendChild(createQuestionTextNode(text));
  for (var optionId = 0; optionId<options.length; optionId++) {
    var optionText = options[optionId];
    sectionNode.appendChild(createOptionNode(questionId, optionId, optionText));
  }

  // attach before control node
  tableNode.insertBefore(sectionNode, controlNode);
}

function extractQuestionsData(questionsData) {
  for (var index=0; index<questionsData.length; index++) {
    var questionData = questionsData[index];
    renderQuestion(index, questionData);
    answerKey.push(questionData["correct-option"]);
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

function setCurrentQuestionTo(questionId) {
  if (currentQuestion !== -1) {
    // Update status bar
    updateStatus(currentQuestion, statusBar[currentQuestion]);
    // Hide current question
    var currentQuestionNode = document.getElementById("question-"+currentQuestion+"-section")||document.getElementById("result-section");
    currentQuestionNode.setAttribute("hidden", "");
  }

  // Change current question
  currentQuestion = questionId;
  // Update title with current question
  document.getElementById("current-question-title").innerHTML = (currentQuestion===numberOfQuestions)?"Result":"Question "+(currentQuestion+1);
  // Remove hidden attribute from current question
  var newCurrentQuestionNode = document.getElementById("question-"+currentQuestion+"-section")||document.getElementById("result-section");
  newCurrentQuestionNode.removeAttribute("hidden");

  updateStatus(questionId, "current");

  var nextButtonNode = document.querySelector("#quiz-control > tr > td > button.btn.btn-primary.btn-lg");
  if (questionId >= numberOfQuestions-1) {
    nextButtonNode.setAttribute("disabled", "");
  }
  else {
    nextButtonNode.removeAttribute("disabled");
  }
}

function renderStatus() {
  for(var questionId=0;questionId<numberOfQuestions;questionId++) {
    addToStatusBar(questionId);
  }
}

function changeQuestionTo(target) {
  var questionId = (target.innerHTML!=="Result")?(parseInt(target.innerHTML)-1):numberOfQuestions;
  setCurrentQuestionTo(questionId);
}

function nextQuestion() {
  setCurrentQuestionTo(currentQuestion+1);
}

function getQuestionsDataFromCookies() {
  var questionsData = JSON.parse(getCookie("quiz"));
  console.log(questionsData);
  numberOfQuestions = questionsData.length;

  // extract and render all questions and options
  extractQuestionsData(questionsData);


  // Render status questions
  renderStatus(numberOfQuestions);

  setCurrentQuestionTo(0);
}

function checkAnswers(update) {

  var numberOfCorrectQuestions = 0;
  for(var questionId=0; questionId<numberOfQuestions; questionId++) {

    var chosenOption = -1;

    var optionRadioNodes = getOptionRadioNodes(questionId);
    for(var index=0; index<optionRadioNodes.length; index++) {
      var optionRadioNode = optionRadioNodes[index];
      if (optionRadioNode.checked) {
        chosenOption = index;
      }
    }

    if (chosenOption === answerKey[questionId]) {
      numberOfCorrectQuestions++;
      statusBar[questionId] = "valid";
    }
    else {
      statusBar[questionId] = "invalid";
    }
  }

  return numberOfCorrectQuestions;
}

function disableQuestions() {
  for(var questionId=0; questionId<numberOfQuestions; questionId++) {

    var optionRadioNodes = getOptionRadioNodes(questionId);
    for(var index=0; index<optionRadioNodes.length; index++) {
      var optionRadioNode = optionRadioNodes[index];
      optionRadioNode.setAttribute("disabled", "");
    }
  }
}

function displayCorrectAnswer() {
  for(var questionId=0; questionId<numberOfQuestions; questionId++) {
    var cssPathToCorrectOptionText = "#question-" + questionId + "-section > tr:nth-child(" + (answerKey[questionId]+2) + ") > td > p";
    console.log(cssPathToCorrectOptionText);
    var correctOptionNode = document.querySelector(cssPathToCorrectOptionText);
    console.log(correctOptionNode);
    correctOptionNode.appendChild(createSymbolNode("ok"));
  }
}

function updateAllStatus() {
  for(var questionId=0; questionId<numberOfQuestions; questionId++) {
    updateStatus(questionId, statusBar[questionId]);
  }
}

function displayResult() {
  var controlNode = document.getElementById("quiz-control");
  var tableNode = controlNode.parentNode;
  var numberOfCorrectQuestions = checkAnswers();

  // Add result section
  var sectionNode = document.createElement("tbody");
  sectionNode.setAttribute("id", "result-section");
  sectionNode.setAttribute("hidden", "");
  sectionNode.appendChild(createQuestionTextNode("You got "+numberOfCorrectQuestions+" correct out of "+numberOfQuestions+" questions!"));

  tableNode.insertBefore(sectionNode, controlNode);

  // Add to status bar
  addToStatusBar(numberOfQuestions);
  setCurrentQuestionTo(numberOfQuestions);

  updateAllStatus();

  // Disable all options
  disableQuestions();
  displayCorrectAnswer();

  // Disable finisih options
  document.querySelector("#quiz-control > tr > td > button.btn.btn-success.btn-lg").setAttribute("disabled", "");

}

getQuestionsDataFromCookies();