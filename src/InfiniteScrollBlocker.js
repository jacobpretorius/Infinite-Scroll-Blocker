var infiniteScrollBlockerWarningMessage = "Should I be doing this?";
var infiniteScrollBlockerAllowedSites;
var infiniteScrollBlockerEnabled = true;

// Create the notification
var notificationWrapper = document.createElement("div");
notificationWrapper.id = "infiniteScrollBlockerWarning";
notificationWrapper.style.top = "0";
notificationWrapper.style.right = "0";
notificationWrapper.style.bottom = "0";
notificationWrapper.style.left = "0";
notificationWrapper.style.height = "100%";
notificationWrapper.style.zIndex = "2147483635";
notificationWrapper.style.display = "none";
notificationWrapper.style.position = "fixed";
notificationWrapper.style.background = "white";
notificationWrapper.style.color = "black";

// Flexbox
var flex = document.createElement("div");
flex.style.display = "flex";
flex.style.justifyContent = "center";
flex.style.alignItems = "center";
flex.style.height = "100%";

notificationWrapper.appendChild(flex);

// Create the text
var warningText = document.createElement("p");
warningText.style.cursor = "pointer";
warningText.style.fontSize = "25px";
warningText.style.fontFamily = "Helvetica, sans-serif";
warningText.innerText = infiniteScrollBlockerWarningMessage;
warningText.addEventListener("click", infiniteScrollBlockerWarningYesClick);

flex.appendChild(warningText);

document.body.appendChild(notificationWrapper);

// Functions
function infiniteScrollBlockerWarningYesClick() {
  document.getElementById("infiniteScrollBlockerWarning").style.display =
    "none";
}

function showInfiniteScrollBlockerWarning(){
    document.getElementById("infiniteScrollBlockerWarning").style.display =
    "block";
}

const body = document.body,
html = document.documentElement;
let startingHeight = 0;
let carryHeight = 0;

// Blocker
setInterval(function() {
  let height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  if (startingHeight === 0){
    startingHeight = height;
    carryHeight = height;
  }

  if (height >= startingHeight + carryHeight && infiniteScrollBlockerEnabled){
    showInfiniteScrollBlockerWarning();
    carryHeight += startingHeight;
  }  
}, 2500);

const onValidUrl = (sites) => {
  let activeUrl = window.location.toString();

  if (!sites.length) {
    return true;
  }

  // Only run on these urls
  if (sites.some(site => activeUrl.includes(site))) {
    console.log("Infinite Scroll Blocker: Site on the allowed list, reminder disabled.");
    infiniteScrollBlockerEnabled = false;
    return false;
  }
  return true;
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};


// Startup
window.onload = async function () {
  console.log("Infinite Scroll Blocker is starting - v1.2");

  await sleep(100);
    chrome.storage.sync.get(
      {
        reminderMessage: "Should I be doing this?",
        allowedSites: [],
      },
      (items) => {
        if (onValidUrl(items.allowedSites)) {
          if (items.reminderMessage && items.reminderMessage.length){
            infiniteScrollBlockerWarningMessage = items.reminderMessage;
            infiniteScrollBlockerAllowedSites = items.allowedSites;
            warningText.innerText = infiniteScrollBlockerWarningMessage;
          }
        }
      }
    );
};