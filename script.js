/**
 * Created by zeulb on 8/10/15.
 */

function newLineNode() {
  return document.createElement("br");
}

function newTextNode(text) {
  return document.createTextNode(text);
}

function addOption(target) {
  var parent = target.parentNode;

  var questionNumber = parent.getElementsByTagName("input")[0].getAttribute("name");
  var questionOptionName = questionNumber+"-option";

  var currentNumberOfOption = (parent.getElementsByTagName("input").length-1)/2;

  var newNumberOfOption = currentNumberOfOption+1;
  var newOptionName = questionOptionName+"-"+newNumberOfOption;

  var newOptionNode = document.createElement("input");
  newOptionNode.setAttribute("type", "radio");
  newOptionNode.setAttribute("name", questionOptionName);
  newOptionNode.setAttribute("value", newOptionName);
  if (currentNumberOfOption === 0) {
    newOptionNode.setAttribute("checked", "");
  }

  var newOptionTextNode = document.createElement("input");
  newOptionTextNode.setAttribute("type", "text");
  newOptionTextNode.setAttribute("name", newOptionName+"-text");
  newOptionTextNode.setAttribute("placeholder", "Type option "+newNumberOfOption+"!");
  newOptionTextNode.setAttribute("class", "option-text");


  parent.insertBefore(newOptionNode, target);
  parent.insertBefore(newTextNode(" "), target);
  parent.insertBefore(newOptionTextNode, target);
  parent.insertBefore(newLineNode(), target);

}

function addQuestion(target) {
  var parent = target.parentNode.parentNode.parentNode;
  var parentChild = target.parentNode.parentNode;

  var currentNumberOfQuestion = parent.getElementsByTagName("tr").length-1;

  var newNumberOfQuestion = currentNumberOfQuestion+1;
  var questionName = "question-"+newNumberOfQuestion;

  var newRow = document.createElement("tr");

  var numberNode = document.createElement("td");
  numberNode.innerHTML = newNumberOfQuestion.toString()+".";

  newRow.appendChild(numberNode);

  var newQuestionNode = document.createElement("td");

  var newQuestionTextNode = document.createElement("input");
  newQuestionTextNode.setAttribute("type", "text");
  newQuestionTextNode.setAttribute("name", questionName);
  newQuestionTextNode.setAttribute("placeholder", "Type your quiz here!");
  newQuestionTextNode.setAttribute("class", "question-text");

  var newAddOptionNode = document.createElement("a");
  newAddOptionNode.setAttribute("href", "#");
  newAddOptionNode.setAttribute("onclick", "addOption(this)");
  newAddOptionNode.innerHTML = "+ Add more option";

  newQuestionNode.appendChild(newQuestionTextNode);
  newQuestionNode.appendChild(newLineNode());
  newQuestionNode.appendChild(newAddOptionNode);
  newQuestionNode.appendChild(newLineNode());


  newRow.appendChild(newQuestionNode);

  parent.insertBefore(newRow, parentChild);

  addOption(newAddOptionNode);


}

var answerKey;

function collectQuestions() {
  var inputData = document.getElementsByTagName("input");
  var correctData = [];
  for (var index = 0; index < inputData.length; index++) {
    node = inputData[index];
    if (node.getAttribute("type") === "radio") {
      if (node.checked) {
        correctData.push(node.getAttribute("value"));
      }
    }
  }
  return correctData;
}

function transformInput() {
  var inputData = document.getElementsByTagName("input");
  for (var index = inputData.length-1; index >= 0; index--) {
    var node = inputData[index];
    if (node.getAttribute("type") === "submit") {
      node.setAttribute("onclick", "checkAnswer(event)");
    }
    else if (node.getAttribute("type") === "radio") {
      if (!!node.checked) {
        node.checked = false;
      }
    }
    else {
      parent = node.parentNode;
      parent.replaceChild(newTextNode(node.value), node);
    }
  }
}

function removeAddOptionAndQuestion() {
  var linkElements = document.getElementsByTagName("a");
  for(var index = linkElements.length-1; index >= 0; index--) {
    var node = linkElements[index];
    node.parentNode.removeChild(node);
  }
}

function generateQuiz(event) {
  event.preventDefault();
  answerKey = collectQuestions();
  transformInput();
  removeAddOptionAndQuestion();
}

function checkAnswer(event) {
  console.log(answerKey);
  event.preventDefault();
  var inputData = Array.prototype.slice.call(document.getElementsByTagName("input"));
  var correctCount = 0;
  var submitNode;
  for (var index = 0; index < inputData.length; index++) {
    node = inputData[index];
    if (node.getAttribute("type") === "radio") {
      if (!!node.checked) {
        if (answerKey.indexOf(node.getAttribute("value")) >= 0) {
          correctCount++;
          parent = node.parentNode;
          parent.replaceChild(newTextNode("\u2714"), node);
        }
        else {
          parent = node.parentNode;
          parent.replaceChild(newTextNode("\u2716"), node);
        }
      }
      else {
        parent = node.parentNode;
        parent.replaceChild(newTextNode("\u2750"), node);
      }
    }
    else if (node.getAttribute("type") === "submit") {
      submitNode = node;
    }
  }
  parent = submitNode.parentNode;
  parent.replaceChild(newTextNode("You got "+correctCount+" answer correct!"), submitNode);
}