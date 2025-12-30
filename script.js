// Configuration
const username = "Istiaq-Alam";
const repo = "NDUB-DOC";
const branch = "main";

let currentPath = "";

const fileContainer = document.getElementById("file-container");
const backBtn = document.getElementById("backBtn");
const currentPathDisplay = document.getElementById("current-path");

// Fetch and display repository files
async function loadFiles(path = "") {
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}?ref=${branch}`;
  fileContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Clear existing items
    fileContainer.innerHTML = "";
    currentPath = path;
    currentPathDisplay.textContent = path || "Root Directory";

    if (data.length === 0) {
      fileContainer.innerHTML = "<p>No files found in this directory.</p>";
      return;
    }

    // Display files/folders
    data.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("file");

      // Choose an icon depending on type
      let icon = "file-icon.png";
      if (item.type === "dir") icon = "folder-icon.png";
      else if (item.name.endsWith(".pdf")) icon = "pdf-icon.png";
      else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)) icon = "image-icon.png";

      div.innerHTML = `
        <img src="${icon}" alt="${item.type}" width="64"><br>
        <span>${item.name}</span>
      `;

      // Folder click → load contents
      if (item.type === "dir") {
        div.onclick = () => loadFiles(item.path);
      }
      // File click → open or preview
      else {
        div.onclick = () => window.open(item.download_url, "_blank");
      }

      fileContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    fileContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Back button navigation
backBtn.onclick = () => {
  if (!currentPath) return;
  const parts = currentPath.split("/");
  parts.pop();
  loadFiles(parts.join("/"));
};

// Initialize
loadFiles();
