let data = []; // Don't define it with initial values here

loadDataFromLocal();  // Load saved entries (if any)
if (data.length === 0) {
  // Provide initial default entries if nothing is saved yet
  data = [ 
    {
      status: "DONE",
      priority: "High",
      id: "P001",
      description: "Missing Information on Piers",
      refId: "D331",
      createdOn: "03.05.2025",
      createdBy: "YLiu",
      dueDate: "01.06.2025",
      assignedTo: "MSchmidt",
      comment: "Request max. pier height"
    },
    {
      status: "OPEN",
      priority: "High",
      id: "P002",
      description: "Utility clash with NE Pier Foundation",
      refId: "M424",
      createdOn: "03.05.2025",
      createdBy: "YLiu",
      dueDate: "07.06.2025",
      assignedTo: "MSchmidt",
      comment: "Piers needs to be adjusted"
    },
    {
      status: "OPEN",
      priority: "Low",
      id: "P003",
      description: "Noise Barrier Height is missing",
      refId: "D120",
      createdOn: "06.05.2025",
      createdBy: "ADiab",
      dueDate: "15.06.2025",
      assignedTo: "MSchmidt",
      comment: "Request height in meters"
    },
    {
      status: "OPEN",
      priority: "High",
      id: "P004",
      description: "Missing Information on Piers",
      refId: "F343",
      createdOn: "06.05.2025",
      createdBy: "ADiab",
      dueDate: "07.06.2025",
      assignedTo: "MSchmidt",
      comment: "Request further clarification"
    }
  ];
    // Save the initial data to local storage
saveDataToLocal();
}

renderTable();

// Render the data in a table
function renderTable() {
const tableBody = document.querySelector("#rfiTable tbody");
tableBody.innerHTML = ""; // Clear before re-rendering

data.forEach((entry, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td><span class="status-badge ${entry.status.toLowerCase()}">${entry.status}</span></td>
        <td contenteditable="false">${entry.priority}</td>
        <td contenteditable="false">${entry.id}</td>
        <td contenteditable="false">${entry.description}</td>
        <td contenteditable="false">${entry.refId}</td>
        <td contenteditable="false">${entry.createdOn}</td>
        <td contenteditable="false">${entry.createdBy}</td>
        <td contenteditable="false">${entry.dueDate}</td>
        <td contenteditable="false">${entry.assignedTo}</td>
        <td contenteditable="false">${entry.comment}</td>
        <td>
            <div class="dropdown-wrapper">
            <button class="dropdown-toggle">⋮</button>
            <div class="dropdown-menu">
                <div class="dropdown-item" data-action="edit" data-index="${index}">Modify</div>
                <div class="dropdown-item" data-action="delete" data-index="${index}">Delete</div>
            </div>
            </div>
        </td>
        `;

        tableBody.appendChild(row);
    });

    attachModifyHandlers();

    // Save data to local storage after any modification
    saveDataToLocal();
}


// Attach event handlers for dropdown actions
function attachModifyHandlers() {

    document.querySelectorAll(".dropdown-toggle").forEach(button => {
        button.addEventListener("click", (e) => {
        const menu = button.nextElementSibling;
        document.querySelectorAll(".dropdown-menu").forEach(m => m.style.display = "none"); // close others
        menu.style.display = menu.style.display === "block" ? "none" : "block";
        e.stopPropagation();
        });
    });
    
    document.addEventListener("click", () => {
        document.querySelectorAll(".dropdown-menu").forEach(m => m.style.display = "none");
    });
    
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", (e) => {
        const index = item.dataset.index;
        const action = item.dataset.action;
        if (action === "edit") enableEditing(index);
        else if (action === "delete") {
            data.splice(index, 1);
            renderTable();
        }
        });
    });
    
    // Save data to local storage after any modification
    saveDataToLocal();
}
    


// Enable editing for a specific row
function enableEditing(index) {
    const row = document.querySelectorAll("#rfiTable tbody tr")[index];
    const cells = row.querySelectorAll("td");
    
    // Make editable (except for ID/status/modify column)
    for (let i = 1; i <= 9; i++) {
        cells[i].setAttribute("contenteditable", "true");
        cells[i].style.backgroundColor = "#fffbd6";
    }
    
    // Replace dropdown with Save button
    const modifyCell = cells[10];
    modifyCell.innerHTML = `<button class="save-btn">Save</button>`;
    
    modifyCell.querySelector("button").addEventListener("click", () => {
        const updated = {
        status: data[index].status, // unchanged
        priority: cells[1].innerText,
        id: data[index].id,
        description: cells[3].innerText,
        refId: cells[4].innerText,
        createdOn: data[index].createdOn,
        createdBy: cells[6].innerText,
        dueDate: cells[7].innerText,
        assignedTo: cells[8].innerText,
        comment: cells[9].innerText
        };
        data[index] = updated;
        renderTable();
    });
    // Save data to local storage after any modification
    saveDataToLocal();
}

      
function exportToCSV() {
    const csvHeader = [
        "Status", "Priority", "ID", "Description", "Ref. ID", 
        "Created on", "Created by", "Due Date", "Assigned to", "Comment"
    ];
    
    const csvRows = [csvHeader.join(",")];
    
    data.forEach(entry => {
        const row = [
        entry.status,
        entry.priority,
        entry.id,
        entry.description,
        entry.refId,
        entry.createdOn,
        entry.createdBy,
        entry.dueDate,
        entry.assignedTo,
        entry.comment
        ];
        csvRows.push(row.map(field => `"${field.replace(/"/g, '""')}"`).join(","));
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "rfi_data_export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
      

function saveDataToLocal() {
    localStorage.setItem("rfiData", JSON.stringify(data));
  }

  
  function loadDataFromLocal() {
    const stored = localStorage.getItem("rfiData");
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse local data:", e);
      }
    }
  }

  

/*
function openForm() {
  document.getElementById("popupForm").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function closeForm() {
  document.getElementById("popupForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

document.getElementById("rfiEntryForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const newEntry = {
    status: "OPEN",
    priority: document.getElementById("priority").value,
    id: `P${(data.length + 1).toString().padStart(3, '0')}`,
    description: document.getElementById("description").value,
    refId: "N/A", // or auto-generate
    createdOn: new Date().toLocaleDateString('en-GB'),
    createdBy: document.getElementById("createdBy").value,
    dueDate: document.getElementById("dueDate").value,
    assignedTo: document.getElementById("assignedTo").value,
    comment: document.getElementById("comment").value
  };

  data.push(newEntry);
  renderTable();
  closeForm();
});

*/



// ✅ Call it after DOM is ready
document.addEventListener("DOMContentLoaded", renderTable);


// --------------------------------
// Event Listeners for Popup Form
// --------------------------------
// Show the popup form when the "Add" button is clicked
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
  
    const addButton = document.querySelector(".add-button");
    const overlay = document.getElementById("overlay");
    const popupForm = document.getElementById("popupForm");
    const cancelBtn = document.getElementById("cancelBtn");
    const rfiForm = document.getElementById("rfiForm");
  
    addButton.addEventListener("click", () => {
      popupForm.style.display = "block";
      overlay.style.display = "block";
    });
  
    cancelBtn.addEventListener("click", () => {
      popupForm.style.display = "none";
      overlay.style.display = "none";
      rfiForm.reset();
    });
  
    rfiForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const newEntry = {
        status: "OPEN",
        priority: document.getElementById("priority").value,
        id: `P${String(data.length + 1).padStart(3, "0")}`,
        description: document.getElementById("description").value,
        refId: "-", // You can change this to allow user input
        createdOn: new Date().toLocaleDateString("de-DE"), // e.g., 06.05.2025
        createdBy: document.getElementById("createdBy").value,
        dueDate: document.getElementById("dueDate").value,
        assignedTo: document.getElementById("assignedTo").value,
        comment: document.getElementById("comment").value
      };
  
      data.push(newEntry);
      renderTable();
  
      popupForm.style.display = "none";
      overlay.style.display = "none";
      rfiForm.reset();
    });
  });
  
  document.getElementById("exportBtn").addEventListener("click", exportToCSV);


  
