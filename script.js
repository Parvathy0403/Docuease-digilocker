const documents = [
  { id: 1, name: "Semester Marksheet", category: "Academic", status: "Available", description: "Your semester marksheet is ready to view in this demo.", steps: ["Select this document in the sharing form.", "Enter the recipient's email address.", "Choose the purpose and prepare the request."] },
  { id: 2, name: "Degree Certificate", category: "Academic", status: "Available", description: "Your degree certificate is shown as available in this demo.", steps: ["Confirm that this is the correct certificate.", "Choose the recipient and purpose.", "Prepare the simulated sharing request."] },
  { id: 3, name: "Transfer Certificate", category: "Academic", status: "Pending", description: "This sample document is pending. Check with the issuing institution before sharing.", steps: ["Contact the issuing institution for an update.", "Wait until the document is available.", "Then select it in the sharing form."] },
  { id: 4, name: "Identity Proof", category: "Identity", status: "Available", description: "A sample identity document for demonstrating the document workflow.", steps: ["Check that the document is appropriate for the recipient.", "Select the document in the sharing form.", "Prepare a simulated sharing request."] }
];

const documentList = document.getElementById("documentList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter");
const emptyMessage = document.getElementById("emptyMessage");
const shareDocument = document.getElementById("shareDocument");
let activeFilter = "All";
let selectedId = null;

function updateCounts() {
  document.getElementById("totalCount").textContent = documents.length;
  document.getElementById("availableCount").textContent = documents.filter(doc => doc.status === "Available").length;
  document.getElementById("pendingCount").textContent = documents.filter(doc => doc.status === "Pending").length;
}

function renderDocuments() {
  const searchText = searchInput.value.trim().toLowerCase();
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchText) || doc.category.toLowerCase().includes(searchText);
    const matchesFilter = activeFilter === "All" || doc.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  documentList.innerHTML = "";
  filteredDocuments.forEach(doc => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "document-card" + (selectedId === doc.id ? " selected" : "");
    card.innerHTML = `<span class="file-icon">▤</span>
      <span class="document-info"><strong>${doc.name}</strong><small>${doc.category}</small></span>
      <span class="status ${doc.status.toLowerCase()}">${doc.status}</span>`;
    card.addEventListener("click", () => selectDocument(doc.id));
    documentList.appendChild(card);
  });
  emptyMessage.hidden = filteredDocuments.length !== 0;
}

function selectDocument(id) {
  selectedId = id;
  const doc = documents.find(item => item.id === id);
  document.getElementById("detailTitle").textContent = doc.name;
  document.getElementById("detailDescription").textContent = doc.description;
  const status = document.getElementById("detailStatus");
  status.textContent = doc.status;
  status.className = "status " + doc.status.toLowerCase();
  const steps = document.getElementById("nextSteps");
  steps.innerHTML = "";
  doc.steps.forEach(step => {
    const item = document.createElement("li");
    item.textContent = step;
    steps.appendChild(item);
  });
  shareDocument.value = String(id);
  renderDocuments();
}

function populateShareOptions() {
  documents.forEach(doc => {
    const option = document.createElement("option");
    option.value = String(doc.id);
    option.textContent = doc.name + (doc.status === "Pending" ? " (Pending)" : "");
    shareDocument.appendChild(option);
  });
}

searchInput.addEventListener("input", renderDocuments);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderDocuments();
  });
});

document.getElementById("shareForm").addEventListener("submit", event => {
  event.preventDefault();
  const selectedDocument = documents.find(doc => doc.id === Number(shareDocument.value));
  const recipient = document.getElementById("recipient").value.trim();
  const purpose = document.getElementById("purpose").value;
  const message = document.getElementById("formMessage");
  message.className = "form-message";
  message.textContent = "";

  if (!selectedDocument || !recipient || !purpose) {
    message.textContent = "Please complete all fields before continuing.";
    message.classList.add("error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    message.textContent = "Please enter a valid email address.";
    message.classList.add("error");
    return;
  }

  if (selectedDocument.status !== "Available") {
    message.textContent = "This document is pending. Select an available document before sharing.";
    message.classList.add("error");
    return;
  }

  message.textContent = `Demo request prepared for ${selectedDocument.name} to ${recipient} for ${purpose}. No document was actually sent.`;
  message.classList.add("success");
});

populateShareOptions();
updateCounts();
renderDocuments();
