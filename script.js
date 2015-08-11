/**
 * Created by zeulb on 8/10/15.
 */

var currentQuestion = -1;
var numberOfQuestion = 0;
var numberOfOptionList = [];

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
  optionTextNode.setAttribute("size", "84");
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

  console.log(trNode);
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
  questionTextNode.setAttribute("size", "90");
  questionTextNode.setAttribute("class", "form-control input-lg");

  tdNode.appendChild(questionTextNode);
  trNode.appendChild(tdNode);
  tbodyNode.appendChild(trNode);

  return tbodyNode;
}

function hideCurrentQuestion() {
  if (currentQuestion === -1)
    return;
  var currentQuestionNode = document.getElementById("question-"+currentQuestion+"-section");
  currentQuestionNode.setAttribute("hidden", "");
}

function addOption() {
  var tbodyNode = document.getElementById("question-"+currentQuestion+"-section");
  var newOptionId = numberOfOptionList[currentQuestion]++;
  tbodyNode.appendChild(createOptionNode(currentQuestion, newOptionId));
}

function addQuestion() {
  var controlNode = document.getElementById("quiz-control");
  var tableNode = controlNode.parentNode;
  var newQuestionId = numberOfQuestion++;

  hideCurrentQuestion();

  numberOfOptionList.push(0);
  currentQuestion = newQuestionId;

  tableNode.insertBefore(createQuestionNode(newQuestionId), controlNode);

  // Add three options
  addOption();
  addOption();
  addOption();

  // change current question title
  document.getElementById("current-question-title").innerHTML = "Question "+(currentQuestion+1);
}

function removeOption(target) {
  var optionNode = target.parentNode.parentNode;
  var parentNode = optionNode.parentNode;
  parentNode.removeChild(optionNode);
}

addQuestion();
