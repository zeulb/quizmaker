/**
 * Created by zeulb on 8/10/15.
 */

var currentQuestion = -1;
var numberOfQuestion = 0;
var numberOfOptionList = [];
var statusClass = {
  "current": "btn btn-warning btn-sm",
  "valid": "btn btn-success btn-sm",
  "invalid": "btn btn-danger btn-sm"
};

function storeToStorage(obj) {
  localStorage.clear();
  for (var prop in obj) {
    localStorage.setItem(prop, obj[prop]);
  }
}

function createNewLineNode() {
  return document.createElement("br");
}

function createOptionNode(questionId, optionId) {
  /*
    HTML Format :
     <tr>
       <td colspan="2">
         <div class="radio">
           <label class="radio-inline">
             <input type="radio" name="question-{questionId}-option" value="option-{optionId}" checked>
             &nbsp;&nbsp;
             <input type="text" placeholder="Type option text!" size="84" class="form-control input-lg">
             <br/>
           </label>
         </div>
         &nbsp;<span class="glyphicon glyphicon-remove" aria-hidden="true" onclick="removeOption(this)"></span>
       </td>
     </tr>
   */

  // create <tr>
  var trNode = document.createElement("tr");

  // create <td colspan="2">
  var tdNode = document.createElement("td");
  tdNode.setAttribute("colspan", "2");

  // create <div class="radio">
  var divNode = document.createElement("div");
  divNode.setAttribute("class", "radio");

  // create <label class="radio-inline">
  var labelNode = document.createElement("label");
  labelNode.setAttribute("class", "radio-inline");

  // create radio button node
  var radioNode = document.createElement("input");
  radioNode.setAttribute("type", "radio");
  radioNode.setAttribute("name", "question-"+questionId+"-option");
  radioNode.setAttribute("value", "option-"+optionId);

  // create option text node
  var optionTextNode = document.createElement("input");
  optionTextNode.setAttribute("type", "text");
  optionTextNode.setAttribute("placeholder", "Type option text!");
  optionTextNode.setAttribute("size", "95");
  optionTextNode.setAttribute("class", "form-control input-lg");

  // create remove option node
  var removeOptionNode = document.createElement("span");
  removeOptionNode.setAttribute("class", "glyphicon glyphicon-remove");
  removeOptionNode.setAttribute("aria-hidden", "true");
  removeOptionNode.setAttribute("onclick", "removeOption(this)");

  // attach to labelNode
  labelNode.appendChild(radioNode);
  labelNode.appendChild(document.createTextNode("\u00A0\u00A0"));
  labelNode.appendChild(optionTextNode);
  labelNode.appendChild(createNewLineNode());

  // attach to divNode
  divNode.appendChild(labelNode);

  // attach to tdNode
  tdNode.appendChild(divNode);
  tdNode.appendChild(document.createTextNode("\u00A0"));
  tdNode.appendChild(removeOptionNode);

  // attach to trNode
  trNode.appendChild(tdNode);

  document.body.appendChild(trNode);

  return trNode;
}

function createQuestionNode(questionId) {
  /*
    HTML Format :
    <tbody id="question-0-section">
      <tr>
        <td colspan="2">
          <input type="text" name="question-{questionId}-text" placeholder="Type your question here!" size="90" class="form-control input-lg"> <br/>
        </td>
      </tr>
    </tbody>
   */

  // create tbody node
  var tbodyNode = document.createElement("tbody");
  tbodyNode.setAttribute("id", "question-"+questionId+"-section");

  // create tr node
  var trNode = document.createElement("tr");

  // create td node
  var tdNode = document.createElement("td");
  tdNode.setAttribute("colspan", "2");

  // create question text node
  var questionTextNode = document.createElement("input");
  questionTextNode.setAttribute("type", "text");
  questionTextNode.setAttribute("name", "question-"+questionId+"-text");
  questionTextNode.setAttribute("placeholder", "Type your question here!");
  questionTextNode.setAttribute("size", "100");
  questionTextNode.setAttribute("class", "form-control input-lg");

  tdNode.appendChild(questionTextNode);
  trNode.appendChild(tdNode);
  tbodyNode.appendChild(trNode);

  return tbodyNode;
}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function getQuestionTextNode(questionId) {
  return document.querySelector("#question-"+questionId+"-section > tr:nth-child(1) > td > input");
}

function getOptionTextNodes(questionId) {
  return document.querySelectorAll("#question-"+questionId+"-section > tr > td > div > label > input.form-control.input-lg");
}

function getOptionRadioNodes(questionId) {
  return document.querySelectorAll("#question-"+questionId+"-section > tr > td > div > label > input[type=\"radio\"]:nth-child(1)");
}

function checkValidity(questionId) {


  // assert question text not blank
  var questionTextNode = getQuestionTextNode(questionId);
  if (isBlank(questionTextNode.value)) {
    return "invalid";
  }

  var index;
  // assert all option text not blank
  var optionNodes = getOptionTextNodes(questionId);
  for(index = 0; index < optionNodes.length; index++) {
    var optionNode = optionNodes[index];
    if (isBlank(optionNode.value)) {
      return "invalid";
    }
  }

  // iterate over all radio button
  var countChecked = 0;
  var radioOptionNodes = getOptionRadioNodes(questionId);
  for(index = 0; index < radioOptionNodes.length; index++) {
    var radioOptionNode = radioOptionNodes[index];
    if (radioOptionNode.checked) {
      countChecked++;
    }
  }

  // assert exactly one checked
  return (countChecked===1)?"valid":"invalid";
}

function updateStatus(questionId, status) {
  var statusNode = document.getElementById("status-"+questionId);
  statusNode.setAttribute("class", statusClass[status]);
}

function setCurrentQuestionTo(questionId) {
  if (currentQuestion !== -1) {
    // Update status bar
    updateStatus(currentQuestion, checkValidity(currentQuestion));
    // Hide current question
    var currentQuestionNode = document.getElementById("question-"+currentQuestion+"-section");
    currentQuestionNode.setAttribute("hidden", "");
  }

  // Change current question
  currentQuestion = questionId;
  // Update title with current question
  document.getElementById("current-question-title").innerHTML = "Question "+(currentQuestion+1);
  // Remove hidden attribute from current question
  var newCurrentQuestionNode = document.getElementById("question-"+currentQuestion+"-section");
  newCurrentQuestionNode.removeAttribute("hidden");

  updateStatus(questionId, "current");
}

function changeQuestionTo(target) {
  var questionId = parseInt(target.innerHTML)-1;
  setCurrentQuestionTo(questionId);
}

function addToStatusBar(questionId) {
  var statusContainerNode = document.getElementById("question-status");
  var statusNode = document.createElement("button");
  statusNode.setAttribute("type", "button");
  statusNode.setAttribute("class", statusClass["current"]);
  statusNode.setAttribute("id", "status-"+questionId);
  statusNode.setAttribute("onclick", "changeQuestionTo(this)");
  statusNode.innerHTML = (questionId+1).toString();
  statusContainerNode.appendChild(statusNode);
  statusContainerNode.appendChild(document.createTextNode("\u00A0"));
}

function addOption() {
  var tbodyNode = document.getElementById("question-"+currentQuestion+"-section");
  var newOptionId = numberOfOptionList[currentQuestion]++;
  tbodyNode.appendChild(createOptionNode(currentQuestion, newOptionId));
}

function addQuestion() {
  if (numberOfQuestion >= 25) return;
  var controlNode = document.getElementById("quiz-control");
  var tableNode = controlNode.parentNode;
  var newQuestionId = numberOfQuestion++;

  numberOfOptionList.push(0);

  tableNode.insertBefore(createQuestionNode(newQuestionId), controlNode);
  addToStatusBar(newQuestionId);

  setCurrentQuestionTo(newQuestionId);

  // Add three options
  addOption();
  addOption();
  addOption();

  if (numberOfQuestion === 25) {
    document.querySelector("#quiz-control > tr > td.text-right > button.btn.btn-warning.btn-lg").setAttribute("disabled", "");
  }
}

function removeOption(target) {
  var optionNode = target.parentNode.parentNode;
  var parentNode = optionNode.parentNode;
  parentNode.removeChild(optionNode);
}

addQuestion();


function saveQuiz() {
  var questionId;
  var questionsData = [];
  // Iterate over all questions
  for(questionId=0; questionId<numberOfQuestion; questionId++) {
    // Check if valid
    if (checkValidity(questionId) === "invalid") {
      alert("Some questions not valid");
      return false;
    }
    var questionText = getQuestionTextNode(questionId).value;
    var optionsText = [];
    var correctOption = -1;

    var optionTextNodes = getOptionTextNodes(questionId);
    var index = 0;
    for(index=0; index<optionTextNodes.length; index++) {
      var optionTextNode = optionTextNodes[index];
      optionsText.push(optionTextNode.value);
    }

    var optionRadioNodes = getOptionRadioNodes(questionId);
    for(index=0; index<optionRadioNodes.length; index++) {
      var optionRadioNode = optionRadioNodes[index];
      if (optionRadioNode.checked) {
        correctOption = index;
      }
    }

    questionsData.push({
        "question": questionText,
        "options": optionsText,
        "correct-option": correctOption
      }
    )
  }

  // store this to local storage
  storeToStorage({"quiz": JSON.stringify(questionsData)});
  return true;
}

function redirectToPlay() {
  window.location.replace("play.html");
}

