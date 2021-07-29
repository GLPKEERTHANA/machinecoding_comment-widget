const mainComment = document.getElementById("comments");
const commentFlag = false;
// let data = [
//   {
//     id: 1,
//     value: "Comment 1",
//     children: [
//       { id: 1.1, value: "Comment 1.1" },
//       { id: 1.2, value: "Comment 1.2" },
//     ],
//   },
//   {
//     id: 2,
//     value: "Comment 2",
//     children: [
//       { id: 2.1, value: "Comment 2.1" },
//       { id: 2.2, value: "Comment 2.2" },
//     ],
//   },
// ];

let localData = localStorage.getItem("comment-data");
let data = localData ? [...JSON.parse(localData)] : [];
// Node.prototype.appendChildren = function () {
//   let children = [...arguments];
//   if (
//     children.length == 1 &&
//     Object.prototype.toString.call(children[0]) === "[object Array]"
//   ) {
//     children = children[0];
//   }
//   const documentFragment = document.createDocumentFragment();
//   children.forEach((c) => documentFragment.appendChild(c));
//   this.appendChild(documentFragment);
// };

function createHTMLElement(tag, className) {
  const htmlEle = document.createElement(tag);
  if (className) htmlEle.className;
  return htmlEle;
}

const stringToHtml = (str) =>
  document.createRange().createContextualFragment(str);

function getCommentBox() {
  return `<div id="comment-box" style="margin:10px;">
  <input type="text" id="comment-input" />
  <button id="comment-button"> Comment </button>
</div>`;
}

function getReplyBox() {
  return `<div id = "reply-box" style="margin:10px;">
    <input type="text" id="reply-input" />
    <button id="reply-button"> Reply </button>
  </div>`;
}

function getEditBox() {
  return `<div id = "edit-box" style="margin:10px;">
    <input type="text" id="edit-input" />
    <button id="edit-button"> Edit </button>
  </div>`;
}

function getId(parent) {
  const parentId = parent.getAttribute("id");
  const len = parent.childNodes.length;
  return `${parentId}.${len + 1}`;
}

function addNewComment() {
  const commentBox = document.getElementById("comment-box");
  const textEle = document.getElementById("comment-input");
  const id = mainComment.childNodes.length;
  if (textEle.value.trim() == "") return;
  data.push({ id: id, value: textEle.value });
  const curParent = stringToHtml(createComment(id, textEle.value));
  mainComment.appendChild(curParent);
  textEle.value = "";
  commentBox.remove();
  localStorage.setItem("comment-data", JSON.stringify(data));
}

function addComment() {
  if (document.getElementById("comment-box")) return;
  mainComment.insertBefore(
    stringToHtml(getCommentBox()),
    mainComment.childNodes[0]
  );
  const commentButton = document.getElementById("comment-button");
  commentButton.addEventListener("click", addNewComment);
}

function updateData(id, newObj, data) {
  console.log(id, data);
  const ans = [];
  data.forEach((d) => {
    if (d.id == id) {
      if (d.children) d.children = [...d.children, newObj];
      else d.children = [newObj];
    } else {
      if (d?.children) d.children = updateData(id, newObj, d?.children);
    }
    ans.push(d);
  });
  console.log(ans, "ans");
  return ans;
}

function addReplyHandler() {
  const replybutton = document.getElementById("reply-button");
  replybutton.addEventListener("click", () => {
    const replyText = document.getElementById("reply-input");
    if (replyText.value.trim() == "") return;
    const replyBox = document.getElementById("reply-box");
    const id = getId(replyBox.parentElement);
    replyBox.parentElement.appendChild(
      stringToHtml(createComment(id, replyText.value))
    );
    newObj = { id: id, value: replyText.value };
    const updatedData = updateData(replyBox.parentElement.id, newObj, data);
    localStorage.setItem("comment-data", JSON.stringify(updatedData));
    replyBox.remove();
  });
}

function handleCommentReply(event) {
  if (document.getElementById("reply-box")) return;
  const parentEle = event.currentTarget.parentElement;
  parentEle.appendChild(stringToHtml(getReplyBox()));
  addReplyHandler();
}

function handleCommentDelete(event) {
  event.currentTarget.parentElement.remove();
}

function getValue(parentId, data) {
  data.forEach((d) => {
    if (d.id == parentId) return true, d.value;
    let returnValue, flag;
    if (d?.children) {
      flag, (returnValue = showComments(d?.children, parent.lastChild));
      if (flag) return true, returnValue;
    }
  });
  return false, "";
}

// function handleCommentEdit(event) {
//   const parentElement = event.currentTarget.parentElement;
//   parentElement.innerHTML = "";
//   const parentId = parentElement.id;
//   getValue(parentId, data);
//   parentElement.appendChild(stringToHtml(getEditBox()));
//   const textEle = document.getElementById('')
// }

function createComment(id, text) {
  return `<div style="display: flex; flex-direction:column; padding: 40px; " id=${id}>
<p style="margin-bottom:10px;" class = "dataEditable" >
    ${text}
</p>

<button id="reply-button-comment" onclick="handleCommentReply(event)" style="margin-left:10px; margin-bottom:10px; width:30%"> Reply</button>
<button id="delete-button-comment" onclick="handleCommentDelete(event)" style="margin-left:10px; width:30%"> Delete</button>

</div>`;
}

function editData(event) {
  const ele = event.target;
  const input = document.createElement("input");
  input.setAttribute("value", ele.textContent);
  ele.replaceWith(input);
  function save() {
    // const previous = document.createElement(ele.tagName.toLowerCase());
    // previous.classList.add('dataEditable')
    // previous.onclick = editData;
    // previous.textContent = input.value;
    ele.textContent=input.value
    input.replaceWith(ele);
  }
  input.addEventListener("blur", save);
}
function showComments(data, parent) {
  data.forEach((d) => {
    const curParent = stringToHtml(createComment(d.id, d.value));
    parent.appendChild(curParent);
    d?.children && showComments(d?.children, parent.lastChild);
  });
  const ele = document.querySelectorAll(".dataEditable");
  ele.forEach((e) => {
    e.addEventListener("click", editData);
  });
}

showComments(data, mainComment);
