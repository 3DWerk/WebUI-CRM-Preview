/* Later on the server will provide the file list dynamically:
// Dynamically fetch file list from "assetsFiles/" directory
async function fetchDocumentFiles() {
    try {
        const response = await fetch('./assetsFiles'); // Assuming a backend endpoint that lists files
        if (!response.ok) throw new Error('Failed to fetch document files');
        const files = await response.json();
        return files;
    } catch (err) {
        console.error(err);
        alert('Error fetching document files');
        return [];
    }
}

let documentFiles = [];
fetchDocumentFiles().then(files => {
    documentFiles = files;
    const groupedDocs = groupByBaseName(documentFiles);
    renderTable(groupedDocs);
});

*/


// Simulated document files (to be replaced with actual fetch)
const documentFiles = [
    "024_Foundations Details_v01_20250319.pdf",
    "024_Foundations Details_v02_20250322.pdf",

    "024_Foundations_v01_20250319.dwg",
    "024_Foundations_v02_20250320.dwg",
    "024_Foundations_v03_20250321.dwg",

    "025_Foundations 3D Model_v01_20250325.dwg",
    "025_Foundations 3D Model_v02_20250328.dwg",
        
    "025_Foundations and Plate 3D_v01_20250328.pdf",
    "025_Foundations and Plate 3D_v02_20250409.pdf",


    "026_Foundations and plate 3D Model_v01_20250331.dwg",
    "026_Foundations and plate 3D Model_v02_20250405.dwg",
    "026_Foundations and plate 3D Model_v03_20250406.dwg"
];



  // Function to toggle accordion content  
  // Group documents by base name
  function groupByBaseName(files) {
    const map = {};
    files.forEach(file => {
      const match = file.match(/(.*)_v(\d+)_([\d]+)\.(\w+)/);
      if (match) {
        const [_, base, version, date, ext] = match;
        const key = `${base}.${ext}`;
        if (!map[key]) map[key] = [];
        map[key].push({
          fileName: file,
          version: `v${version}`,
          createdOn: `${date.slice(6)}.${date.slice(4,6)}.${date.slice(0,4)}`,
          versionNumber: parseInt(version)
        });
      }
    });
  
    // Sort each group descending by version
    Object.values(map).forEach(arr => arr.sort((a, b) => b.versionNumber - a.versionNumber));
    return map;
  }
  
  // Render the table
  function renderTable(dataMap) {
    const tbody = document.getElementById("docTableBody");
    tbody.innerHTML = "";
  
    Object.entries(dataMap).forEach(([key, versions]) => {
      const latest = versions[0];
      const tr = document.createElement("tr");
  
      const nameTd = document.createElement("td");
      nameTd.innerText = key;
      tr.appendChild(nameTd);
  
      const versionTd = document.createElement("td");
      const versionSelect = document.createElement("select");
      versions.forEach(ver => {
        const opt = document.createElement("option");
        opt.value = ver.fileName;
        opt.text = ver.version;
        versionSelect.appendChild(opt);
      });
      versionSelect.onchange = function () {
        const selected = versions.find(v => v.fileName === versionSelect.value);
        createdOnTd.innerText = selected.createdOn;
        openBtn.disabled = false;
        openBtn.onclick = () => window.open(`assetsFiles/${selected.fileName}`, "_blank");
      };
      versionTd.appendChild(versionSelect);
      tr.appendChild(versionTd);
  
      const createdOnTd = document.createElement("td");
      createdOnTd.innerText = latest.createdOn;
      tr.appendChild(createdOnTd);
  
      const creatorTd = document.createElement("td");
      creatorTd.innerText = "YLiu (3Dwerk)";
      tr.appendChild(creatorTd);
  
      const openTd = document.createElement("td");
      const openBtn = document.createElement("button");
      openBtn.className = "open-btn";
      openBtn.innerText = "Open";
      openBtn.onclick = () => window.open(`assetsFiles/${latest.fileName}`, "_blank");
      openTd.appendChild(openBtn);
      tr.appendChild(openTd);
  
      tbody.appendChild(tr);
    });
  }
  
  /*function downloadAll() {
    const zip = new JSZip();
    const filesToDownload = [];
  
    const selects = document.querySelectorAll("select");
    selects.forEach(sel => {
      const fileName = sel.value;
      filesToDownload.push(fileName);
    });
  
    // Simulated zip creation (normally needs file blobs or fetch requests)
    alert("Preparing download: " + filesToDownload.join(", "));
    // For real usage, fetch each file and use JSZip, then trigger download
  }
*/

    // Download all selected files as a zip
async function downloadAll() {
    const zip = new JSZip();
    const folder = zip.folder("BridgeBauer_Documents");
    const selects = document.querySelectorAll("select");
    const total = selects.length;
  
    const container = document.getElementById("downloadProgressContainer");
    const bar = document.getElementById("downloadProgressBar");
    const text = document.getElementById("downloadProgressText");
  
    container.style.display = "block";
    bar.style.width = "0%";
    text.innerText = `Preparing download: 0 / ${total} files...`;
  
    let completed = 0;
  
    for (const sel of selects) {
      const fileName = sel.value;
      const fileUrl = `assets/${fileName}`;
  
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);
        const blob = await response.blob();
        folder.file(fileName, blob);
      } catch (err) {
        console.error(err);
        alert(`Error downloading file: ${fileName}`);
      }
  
      completed++;
      const percent = Math.round((completed / total) * 100);
      bar.style.width = `${percent}%`;
      text.innerText = `Preparing download: ${completed} / ${total} files...`;
    }
  
    text.innerText = `Compressing files...`;
  
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "BridgeBauer_Documents.zip");
      bar.style.width = `100%`;
      text.innerText = "Download ready!";
    });
  }
  
  

  
  
  // Init
  const groupedDocs = groupByBaseName(documentFiles);
  renderTable(groupedDocs);
  