const username = "YOUR_GITHUB_USERNAME";
const repo = "NDUB-DOC";
const branch = "main";  // change if needed
let currentPath = "";

const fileContainer = document.getElementById("file-container");
const backBtn = document.getElementById("backBtn");
const currentPathDisplay = document.getElementById("current-path");

async function loadFiles(path = "") {
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  fileContainer.innerHTML = "";
  currentPath = path;
  currentPathDisplay.textContent = path || "Root Directory";

  data.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("file");

    if (item.type === "dir") {
      div.innerHTML = `<img src="folder-icon.png"><br>${item.name}`;
      div.onclick = () => loadFiles(item.path);
    } else {
      div.innerHTML = `<img src="file-icon.png"><br>${item.name}`;
      div.onclick = () => window.open(item.download_url, "_blank");
    }

    fileContainer.appendChild(div);
  });
}

backBtn.onclick = () => {
  if (!currentPath) return;
  const parts = currentPath.split("/");
  parts.pop();
  loadFiles(parts.join("/"));
};

loadFiles();
