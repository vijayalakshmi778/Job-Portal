const jobs = [
  {id:1, company:"Northstar Labs", title:"Junior Data Analyst", logo:"N", logoClass:"logo-green", location:"Chennai, India", type:"Hybrid", experience:"Fresher", salary:"₹3.5–5 LPA", category:"Data & Analytics", description:"Turn business questions into clear insights with SQL, spreadsheets, and dashboards.", tags:["SQL","Excel","Power BI"]},
  {id:2, company:"Pixel & Co.", title:"Product Designer", logo:"P", logoClass:"logo-purple", location:"Remote · India", type:"Remote", experience:"0–2 years", salary:"₹5–8 LPA", category:"Design", description:"Help shape thoughtful digital experiences from early concepts to polished interfaces.", tags:["Figma","UI/UX","Prototyping"]},
  {id:3, company:"Orbit Systems", title:"Associate Software Engineer", logo:"O", logoClass:"logo-orange", location:"Bengaluru, India", type:"On-site", experience:"Fresher", salary:"₹4–6 LPA", category:"Technology", description:"Work with a supportive engineering team to build and improve customer-facing tools.", tags:["JavaScript","Git","APIs"]},
  {id:4, company:"Verde Finance", title:"Business Analyst Intern", logo:"V", logoClass:"logo-green", location:"Remote · India", type:"Remote", experience:"Fresher", salary:"₹18k–25k / month", category:"Business", description:"Connect data, people, and process to help teams make better decisions.", tags:["Excel","Reporting","Research"]},
  {id:5, company:"BluePeak Digital", title:"Data Analyst", logo:"B", logoClass:"logo-blue", location:"Hyderabad, India", type:"Hybrid", experience:"0–2 years", salary:"₹4–7 LPA", category:"Data & Analytics", description:"Build reliable reports, investigate trends, and communicate useful findings.", tags:["Python","SQL","Tableau"]},
  {id:6, company:"Studio Form", title:"Visual Design Associate", logo:"S", logoClass:"logo-pink", location:"Mumbai, India", type:"On-site", experience:"0–2 years", salary:"₹3–5 LPA", category:"Design", description:"Bring brand stories to life through clean, considered visual design.", tags:["Visual Design","Branding","Adobe"]},
  {id:7, company:"Northstar Labs", title:"Frontend Developer", logo:"N", logoClass:"logo-dark", location:"Remote · India", type:"Remote", experience:"3–5 years", salary:"₹10–16 LPA", category:"Technology", description:"Create accessible, responsive product experiences with a collaborative team.", tags:["React","CSS","TypeScript"]},
  {id:8, company:"MarketSpring", title:"Marketing Associate", logo:"M", logoClass:"logo-orange", location:"Chennai, India", type:"Hybrid", experience:"0–2 years", salary:"₹3–5 LPA", category:"Marketing", description:"Support campaigns, learn from performance data, and grow audience engagement.", tags:["SEO","Analytics","Content"]}
];
const jobList = document.getElementById("jobList");
const keywordInput = document.getElementById("keywordInput");
const locationInput = document.getElementById("locationInput");
const experienceFilter = document.getElementById("experienceFilter");
const workTypeFilter = document.getElementById("workTypeFilter");
const resultsNote = document.getElementById("resultsNote");
const emptyState = document.getElementById("emptyState");
const showAllBtn = document.getElementById("showAllBtn");
const profileDialog = document.getElementById("profileDialog");
const toast = document.getElementById("toast");
let showAll = false;
let selectedCategory = "";
let savedJobs = new Set();
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}
function getFilteredJobs() {
  const keyword = keywordInput.value.trim().toLowerCase();
  const location = locationInput.value.trim().toLowerCase();
  return jobs.filter(job => {
    const searchable = [job.title, job.company, job.category, job.description, ...job.tags].join(" ").toLowerCase();
    const keywordMatch = !keyword || searchable.includes(keyword);
    const locationMatch = !location || job.location.toLowerCase().includes(location) || (location.includes("remote") && job.type === "Remote");
    const experienceMatch = experienceFilter.value === "all" || job.experience === experienceFilter.value || (experienceFilter.value === "0–2 years" && job.experience === "Fresher");
    const typeMatch = workTypeFilter.value === "all" || job.type === workTypeFilter.value;
    const categoryMatch = !selectedCategory || job.category === selectedCategory;
    return keywordMatch && locationMatch && experienceMatch && typeMatch && categoryMatch;
  });
}
function renderJobs() {
  const filtered = getFilteredJobs();
  const visible = showAll ? filtered : filtered.slice(0, 4);
  jobList.innerHTML = visible.map(job => `
    <article class="job-card">
      <div class="job-top">
        <div class="company-logo ${job.logoClass}">${job.logo}</div>
        <div><div class="job-company">${job.company}</div><h3 class="job-title">${job.title}</h3></div>
        <button class="save-btn ${savedJobs.has(job.id) ? "saved" : ""}" data-save="${job.id}" aria-label="${savedJobs.has(job.id) ? "Unsave" : "Save"} ${job.title}" title="${savedJobs.has(job.id) ? "Saved" : "Save job"}">${savedJobs.has(job.id) ? "♥" : "♡"}</button>
      </div>
      <div class="job-meta"><span>⌖ ${job.location}</span><span>${job.experience}</span><span>${job.type}</span></div>
      <p class="job-description">${job.description}</p>
      <div class="job-meta">${job.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
      <div class="job-bottom"><div class="salary">${job.salary}<small>Indicative package</small></div><div class="job-actions"><span class="job-type">${job.type}</span><button class="btn btn-dark apply-btn" data-apply="${job.id}">View role ↗</button></div></div>
    </article>`).join("");
  emptyState.hidden = filtered.length !== 0;
  jobList.hidden = filtered.length === 0;
  showAllBtn.hidden = filtered.length <= 4;
  showAllBtn.innerHTML = showAll ? 'Show fewer roles <span>↑</span>' : 'Show all opportunities <span>→</span>';
  resultsNote.innerHTML = `Showing <strong>${visible.length}</strong> of <strong>${filtered.length}</strong> matching opportunities <span>•</span> Demo listings`;
}
function clearFilters() {
  keywordInput.value = "";
  locationInput.value = "";
  experienceFilter.value = "all";
  workTypeFilter.value = "all";
  selectedCategory = "";
  showAll = false;
  document.querySelectorAll(".category-card").forEach(card => card.classList.remove("active"));
  renderJobs();
}
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault(); showAll = true; renderJobs();
  document.getElementById("jobs").scrollIntoView({behavior:"smooth"});
});
document.querySelectorAll(".keyword-chip").forEach(chip => chip.addEventListener("click", () => {
  keywordInput.value = chip.dataset.keyword; selectedCategory = ""; showAll = true;
  document.querySelectorAll(".category-card").forEach(card => card.classList.remove("active"));
  renderJobs(); document.getElementById("jobs").scrollIntoView({behavior:"smooth"});
}));
document.querySelectorAll(".category-card").forEach(card => card.addEventListener("click", () => {
  const category = card.dataset.category;
  selectedCategory = selectedCategory === category ? "" : category;
  keywordInput.value = "";
  document.querySelectorAll(".category-card").forEach(item => item.classList.toggle("active", item.dataset.category === selectedCategory));
  showAll = true; renderJobs(); document.getElementById("jobs").scrollIntoView({behavior:"smooth"});
}));
[experienceFilter, workTypeFilter].forEach(control => control.addEventListener("change", () => {showAll = true; renderJobs();}));
showAllBtn.addEventListener("click", () => {showAll = !showAll; renderJobs();});
document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);
jobList.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  const applyButton = event.target.closest("[data-apply]");
  if (saveButton) {
    const id = Number(saveButton.dataset.save);
    if (savedJobs.has(id)) { savedJobs.delete(id); notify("Job removed from your saved list."); }
    else { savedJobs.add(id); notify("Job saved! Create a profile to keep track of applications."); }
    renderJobs();
  }
  if (applyButton) {
    const job = jobs.find(item => item.id === Number(applyButton.dataset.apply));
    notify(`${job.title} at ${job.company} — demo listing. Connect a real application link to apply.`);
  }
});
function openProfile(mode) {
  document.getElementById("dialogTitle").textContent = mode === "signin" ? "Welcome back" : "Create your profile";
  document.getElementById("dialogDescription").textContent = mode === "signin" ? "Enter your details to preview the sign-in flow." : "A few details to help you take the next step.";
  document.getElementById("profileSubmit").innerHTML = mode === "signin" ? "Continue <span>→</span>" : "Create demo profile <span>→</span>";
  profileDialog.showModal();
}
document.getElementById("createProfileBtn").addEventListener("click", () => openProfile("create"));
document.getElementById("signInBtn").addEventListener("click", () => openProfile("signin"));
document.getElementById("profileForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("profileName").value.trim();
  profileDialog.close();
  notify(`Thanks${name ? ", " + name : ""}! Demo profile preview complete — no data was sent.`);
  event.target.reset();
});
document.getElementById("ctaBrowseBtn").addEventListener("click", () => document.getElementById("jobs").scrollIntoView({behavior:"smooth"}));
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(link => link.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open")));
renderJobs();
