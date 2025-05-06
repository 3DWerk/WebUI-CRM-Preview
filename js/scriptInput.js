    // paste the same `data` array and JS from your inputParameters.html
    const data = [
      ["Guideline / Code", "#001", "Client Requirements (i.e. DB or RAB-Ing)", "String"],
      ["Global / Site Parameter", "#002", "Terrain / DGM", "3D"],
      ["Global / Site Parameter", "#003", "Pipe / Utilities", "2D"],
      ["Global / Site Parameter", "#004", "Adjacent Roads / Paths", "2D"],
      ["Global / Site Parameter", "#005", "Site-Boundary", "2D/3D"],
      ["Alignment", "#006", "XY Alignment", "LandXML"],
      ["Alignment", "#007", "Z Alignment", "LandXML"],
      ["Alignment", "#008", "Structural / Deck offsets", "Num/LandXML"],
      ["Cross-sectional Data", "#009", "Road / Track Width", "Num"],
      ["Cross-sectional Data", "#010", "Edge beam requirements", "2D (Reference DWG)"],
      ["Cross-sectional Data", "#011", "Structural depth and thicknesses", "PDF (Calc-Report)"],
      ["Longitudinal Data", "#012", "Main Spans length", "Num"],
      ["Longitudinal Data", "#013", "Kilometrierung", "Num"],
      ["Longitudinal Data", "#014", "Section Variation", "Num"],
      ["Components - Deck", "#015", "Material Data / System", "Str, Num"],
      ["Components - Deck", "#016", "Geometry", "2D Sketch"],
      ["Components - Deck", "#017", "Construction Stage", "XML, MS Project"],
      ["Components - Pier", "#018", "Material Data / System", "Str, Num"],
      ["Components - Pier", "#019", "Geometry", "2D Sketch"],
      ["Components - Pier", "#020", "Construction Stage", "XML, MS Project"],
      ["Components - Abutment", "#021", "Material Data / System", "Str, Num"],
      ["Components - Abutment", "#022", "Geometry", "2D Sketch"],
      ["Components - Abutment", "#023", "Construction Stage", "XML, MS Project"],
      ["Components - Bearing", "#024", "Material Data / System", "Str, Num"],
      ["Components - Bearing", "#025", "Geometry", "2D Sketch"],
      ["Components - Bearing", "#026", "Construction Stage", "XML, MS Project"],
      ["Components - OKO", "#027", "Material Data / System", "Str, Num"],
      ["Components - OKO", "#028", "Geometry", "2D Sketch"],
      ["Components - OKO", "#029", "Construction Stage", "XML, MS Project"],
      ["Geotechnical", "#030", "Soil Profile", "PDF (Soil Report)"],
      ["Geotechnical", "#031", "Retaining Structures", "2D"],
      ["Additional Structures", "#032", "Noise Barrier", "Str/Num/2D-Drawing"],
      ["Additional Structures", "#033", "Drainage", "Str/Num/2D-Drawing"],
      ["Additional Structures", "#034", "Powerline", "Str/Num/2D-Drawing"],
      ["Additional Structures", "#035", "Signage", "Str/Num/2D-Drawing"],
    ];
    
    const groupedData = {};
    data.forEach(item => {
      const [category, id, paramName, type] = item;
      if (!groupedData[category]) groupedData[category] = [];
      groupedData[category].push({ id, paramName, type });
    });
    
    const accordion = document.getElementById('accordion');
    
    for (const category in groupedData) {
      const section = document.createElement('div');
      section.innerHTML = `
        <h2 onclick="toggleContent(this)">${category}</h2>
        <div class="content">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Parameter Name</th>
                <th>Value</th>
                <th>Type</th>
                <th>Created on</th>
                <th>Upload</th>
                <th>Status</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              ${groupedData[category].map(item => `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.paramName}</td>
                  <td><span class="dot red"></span><input type="text" onchange="updateStatus(this)"></td>
                  <td>${item.type}</td>
                  <td>26/04/2025</td>
                  <td><span class="dot red"></span><input type="file" onchange="updateStatus(this)"></td>
                  <td class="status"><span class="status-missing">Missing</span></td>
                  <td><input type="text" placeholder="Insert comment"></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      accordion.appendChild(section);
    }
    
    function toggleContent(element) {
      const content = element.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
    }
    
    function updateStatus(input) {
      const cell = input.parentElement;
      const dot = cell.querySelector('.dot');
      if (input.value || (input.files && input.files.length > 0)) {
        dot.classList.remove('red');
        dot.classList.add('green');
      } else {
        dot.classList.remove('green');
        dot.classList.add('red');
      }
      checkRowCompletion(cell.parentElement);
    }
    
    function checkRowCompletion(row) {
      const dots = row.querySelectorAll('.dot');
      const status = row.querySelector('.status');
      if ([...dots].every(dot => dot.classList.contains('green'))) {
        status.innerHTML = '<span class="status-done">DONE</span>';
      } else {
        status.innerHTML = '<span class="status-missing">Missing</span>';
      }
    }
    
    function calculateCompletion() {
      const totalDots = document.querySelectorAll('.content .dot').length;
      const greenDots = document.querySelectorAll('.content .dot.green').length;
      const completion = totalDots ? (greenDots / totalDots) * 100 : 0;
      updateProgressCircle(completion);
      updateCategoryStatus();
    
    }
    
    function updateCategoryStatus() {
      const sections = document.querySelectorAll('#accordion > div');
    
      sections.forEach(section => {
        const header = section.querySelector('h2');
        const content = section.querySelector('.content');
        const dots = content.querySelectorAll('table tbody tr td:nth-child(3) .dot, table tbody tr td:nth-child(6) .dot');
        
        let missingCount = 0;
        dots.forEach(dot => {
          if (!dot.classList.contains('green')) {
            missingCount++;
          }
        });
    
        // Remove existing indicator if any
        const oldIndicator = header.querySelector('.indicator');
        if (oldIndicator) {
          oldIndicator.remove();
        }
    
        const indicator = document.createElement('span');
        indicator.classList.add('indicator');
        indicator.style.marginLeft = '10px';
        indicator.style.fontWeight = 'bold';
        indicator.style.borderRadius = '50%';
        indicator.style.padding = '5px 10px';
        indicator.style.color = 'white';
        indicator.style.fontSize = '14px';
        indicator.style.display = 'inline-flex';
        indicator.style.alignItems = 'center';
        indicator.style.justifyContent = 'center';
    
        if (missingCount > 0) {
          indicator.style.backgroundColor = 'red';
          indicator.textContent = missingCount;
        } else {
          indicator.style.backgroundColor = 'green';
          indicator.innerHTML = '&#10003;'; // Checkmark
        }
    
        header.appendChild(indicator);
      });
    }
    
    
    
    function updateProgressCircle(percentage) {
      const circle = document.querySelector('.progress-bar');
      const text = document.getElementById('progressText');
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percentage / 100) * circumference;
      circle.style.strokeDashoffset = offset;
      text.textContent = percentage.toFixed(2).replace('.', ',') + '%';
    }
      // Your existing JS from inputParameters.html goes here
      function getInputPage(page) {
        // document.getElementById('homePage').style.display = 'none';
        // document.getElementById('dashboardPage').style.display = 'none';
        // document.getElementById('inputPage').style.display = 'none';
        document.getElementById(page + 'Page').style.display = 'block';
      }
  /*
      function switchPage(page) {
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('dashboardPage').style.display = 'none';
        document.getElementById('inputPage').style.display = 'none';
        document.getElementById(page + 'Page').style.display = 'block';
      }
  */