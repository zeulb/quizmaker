/**
 * Created by zeulb on 8/10/15.
 */

function newLineNode() {
  return document.createElement("br");
}

function newTextNode(text) {
  return document.createTextNode(text);
}

function addOption(event) {
  var parent = event.parentNode;

  var questionNumber = parent.getElementsByTagName("input")[0].getAttribute("name");
  var questionOptionName = questionNumber+"-option";

  var currentNumberOfOption = (parent.getElementsByTagName("input").length-1)/2;

  var newNumberOfOption = currentNumberOfOption+1;
  var newOptionName = questionOptionName+"-"+newNumberOfOption;

  var newOptionNode = document.createElement("input");
  newOptionNode.setAttribute("type", "radio");
  newOptionNode.setAttribute("name", questionOptionName);
  newOptionNode.setAttribute("value", newOptionName);
  console.log(newOptionNode);

  var newOptionTextNode = document.createElement("input");
  newOptionTextNode.setAttribute("type", "text");
  newOptionTextNode.setAttribute("name", newOptionName+"-text");
  newOptionTextNode.setAttribute("placeholder", "Type option "+newNumberOfOption+"!");
  newOptionTextNode.setAttribute("class", "option-text");
  console.log(newOptionTextNode);


  parent.insertBefore(newOptionNode, event);
  parent.insertBefore(newTextNode(" "), event);
  parent.insertBefore(newOptionTextNode, event);
  parent.insertBefore(newLineNode(), event);

}

function addQuestion(event) {
  var parent = event.parentNode.parentNode.parentNode;
  var parentChild = event.parentNode.parentNode;

  var currentNumberOfQuestion = parent.getElementsByTagName("tr").length-1;
  console.log(parent);

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

  console.log(newRow);

  parent.insertBefore(newRow, parentChild);

  addOption(newAddOptionNode);


}