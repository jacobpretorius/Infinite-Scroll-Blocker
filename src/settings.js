var allowedSites = [];

const save_options = () => {
  let reminderMessage = document.getElementById("reminderTextInput").value;

  chrome.storage.sync.set(
    {
      reminderMessage,
      allowedSites
    },
    () => {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.classList.remove("hidden");
      setTimeout(function () {
        status.classList.add("hidden");
      }, 3000);
    }
  );
};

// Restores state using the preferences
// stored in chrome.storage.
const restore_options = () => {
  chrome.storage.sync.get(
    {
      reminderMessage: "Should I be doing this?",
      allowedSites: [],
    },
    (items) => {
      document.getElementById("reminderTextInput").value = items.reminderMessage;
      allowedSites = items.allowedSites;
    }
  );
};

document.addEventListener("DOMContentLoaded", restore_options);
document.addEventListener("load", restore_options);
document.getElementById("save").addEventListener("click", save_options);

$(document).ready(function () {
  const deleteRow = (event) => {
    console.log('delete');
    allowedSites = allowedSites.filter((value) => value !== event.target.dataset.row);
    drawTable();
    save_options();
  };

  const drawTable = (_) => {
    table.clear().draw();
    allowedSites.forEach((site) => {
      table.row
        .add([
          site,
          `<span id="deleteRowBtn" data-row="${site}" class="delete-site">Delete</span>`,
        ])
        .draw();
    });

    let rows = document.querySelectorAll("#deleteRowBtn");
    rows.forEach((row) => {
      row.addEventListener("click", deleteRow);
    });
  };

  var table = $("#allowedTable").DataTable({
    columns: [{ title: "Website domain" }, { title: "Remove" }],
  });

  drawTable();

  $("#addRow").on("click", function () {
    var site = document.getElementById("addSiteName").value;
    if (site.length < 3) {
      document.getElementById("addSiteName").value = "";
      return;
    }

    if (site.startsWith("http://")) {
      site = site.replace('http://', '');
    }

    if (site.startsWith("https://")) {
      site = site.replace('https://', '');
    }

    if (site.startsWith("www.")) {
      site = site.replace('www.', '');
    }

    if (site.endsWith("/")) {
      site = site.substr(0, site.length - 1);
    }

    if (allowedSites.some((x) => x === site)) {
      document.getElementById("addSiteName").value = "";
      return;
    }

    table.row
      .add([site, `<span id="deleteRowBtn" data-row="${site}" class="delete-site">Delete</span>`])
      .draw();

    allowedSites.push(site);
    document.getElementById("addSiteName").value = "";
    save_options();
    drawTable();
  });
});