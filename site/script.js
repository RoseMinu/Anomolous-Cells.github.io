document.addEventListener("DOMContentLoaded", async () => {
  async function inject(targetId, file) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const res = await fetch(file);
    const html = await res.text();
    target.innerHTML = html;
  }

  // 1) Inject shared header, sidebar, footer
  await Promise.all([
    inject("site-header-placeholder", "header.html"),
    inject("sidebar-placeholder", "sidebar.html"),
    inject("footer-placeholder", "footer.html"),
  ]);

  const body = document.body;
  const currentPage = body.dataset.page || "";
  const crumb = body.dataset.crumb || "";

  // 2) Set breadcrumb
  const crumbSpan = document.querySelector(".crumb-section");
  if (crumbSpan) crumbSpan.textContent = crumb;

  // 3) Highlight current page in sidebar
  document.querySelectorAll("#sidebar a[data-page]").forEach((a) => {
    if (a.dataset.page === currentPage) a.classList.add("active");
  });

  // 4) Sidebar toggle
  const sidebarBtn = document.getElementById("sidebar-toggle");
  if (sidebarBtn) {
    sidebarBtn.addEventListener("click", () => {
      body.classList.toggle("sidebar-open");
    });
  }

  // 5) Dark / light theme
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("theme-dark");
      body.classList.remove("theme-light");
      if (themeToggle) themeToggle.textContent = "☀️";
    } else {
      body.classList.add("theme-light");
      body.classList.remove("theme-dark");
      if (themeToggle) themeToggle.textContent = "🌙";
    }
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const newTheme = body.classList.contains("theme-dark") ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  }

  // 6) Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 7) Auto "On this page" from h2 headings
  const tocList = document.getElementById("toc-list");
  if (tocList) {
    const headings = document.querySelectorAll("#content h2");
    headings.forEach((h) => {
      let id = h.id;
      if (!id) {
        id = h.textContent.trim().toLowerCase().replace(/[^\w]+/g, "-");
        h.id = id;
      }
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + id;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
    });
  }
});
