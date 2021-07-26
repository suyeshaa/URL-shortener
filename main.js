const saveBtn = document.querySelector(".btn-3");
const inputField = document.querySelector("input");
const copyBtn = document.querySelector(".short-btn");
const err = document.querySelector("#dissect3 p");
const delBtn = document.querySelector(".del-btn");

const KEY = "65e32b09ed3c4e889c84e1544a979009";
var short;

var origLinks = [];
var newLinks = [];

async function show(link) {
  const res = await fetch("https://api.rebrandly.com/v1/links", {
    body: `{"destination": "${link}","domain":{"fullName":"rebrand.ly"}}`,
    headers: {
      Apikey: KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  let data = await res.json();

  if (data.code === "InvalidFormat") {
    error();
  } else {
    short = data.shortUrl;
    origLinks.push(inputField.value);
    newLinks.push(short);

    storeItems();

    // console.log(newLinks);
    // console.log(origLinks);
    weblink(short, inputField.value);
    inputField.value = "";
  }
}

// var value = inputField.value;

function weblink(short, value) {
  var shortLink = document.createElement("div");
  shortLink.innerHTML = `
  <div class="dissect2">
    <div class="orig-link">${value}</div>
    <div class="left-side">
      <div class="short-link"><a href="https://${short}" target="_blank" rel="noopener noreferrer">${short}</a></div>
      <button class="btn short-btn">Copy</button>
    </div>
  </div>
`;
  delBtn.style.display = "block";
  document.getElementById("dissection").appendChild(shortLink);
}

saveBtn.addEventListener("click", () => {
  show(inputField.value);
});

document.addEventListener("click", (e) => {
  if (e.target.className == "btn short-btn") {
    console.log(document.querySelectorAll(".dissect2"));
    document.querySelectorAll(".dissect2").forEach((el) => {
      console.log(el.children[1].children[1].textContent);
      el.children[1].children[1].textContent = "Copy";
      el.children[1].children[1].style.backgroundColor = "hsl(180, 66%, 49%)";
    });
    e.target.textContent = "Copied!";
    e.target.style.backgroundColor = " hsl(257, 27%, 26%)";
    let div = e.target.previousElementSibling;
    navigator.clipboard.writeText(div.innerText);
  }
});

function error() {
  inputField.style.border = "3px solid  hsl(0, 87%, 67%)";
  inputField.classList.add("placeholder-class");
  err.style.display = "block";
}

inputField.addEventListener("click", () => {
  inputField.style.border = "";
  inputField.classList.remove("placeholder-class");
  err.style.display = "none";
});

//localStorage

function storeItems() {
  localStorage.setItem("original", JSON.stringify(origLinks));
  localStorage.setItem("updated", JSON.stringify(newLinks));
}

function getItems() {
  var retrieveOrig = JSON.parse(localStorage.getItem("original"));
  var retrieveNew = JSON.parse(localStorage.getItem("updated"));

  origLinks = [...retrieveOrig];
  newLinks = [...retrieveNew];

  // console.log(origLinks[0][2]);

  retrieveOrig.forEach((el, idx) => {
    weblink(retrieveNew[idx], el);
  });
}

if (localStorage.getItem("original") != null) {
  getItems();
}

delBtn.addEventListener("click", () => {
  localStorage.clear();
  document.getElementById("dissection").remove();
  delBtn.style.display = "none";
});

document.querySelector(".ham").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "block";
});

document.querySelector(".modal").addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
});
