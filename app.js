const items = [
  { title: "城市夜景精选合集", category: "hot", tag: "热门", views: 892000, duration: 1320, date: "2026-05-21", poster: "linear-gradient(135deg,#ff3d67,#2d3142)" },
  { title: "旅行记录短片 Vol.12", category: "new", tag: "最新", views: 182000, duration: 640, date: "2026-05-20", poster: "linear-gradient(135deg,#22c55e,#0f172a)" },
  { title: "亚洲风格专题", category: "asia", tag: "亚洲", views: 543000, duration: 980, date: "2026-05-18", poster: "linear-gradient(135deg,#f5b942,#462b5d)" },
  { title: "欧美精选片段", category: "europe", tag: "欧美", views: 471000, duration: 1180, date: "2026-05-17", poster: "linear-gradient(135deg,#38bdf8,#312e81)" },
  { title: "一分钟快看系列", category: "short", tag: "短片", views: 335000, duration: 75, date: "2026-05-16", poster: "linear-gradient(135deg,#fb7185,#f59e0b)" },
  { title: "编辑推荐精选", category: "hot", tag: "推荐", views: 778000, duration: 1500, date: "2026-05-15", poster: "linear-gradient(135deg,#a3e635,#164e63)" },
  { title: "周末更新合集", category: "new", tag: "更新", views: 219000, duration: 860, date: "2026-05-14", poster: "linear-gradient(135deg,#c084fc,#111827)" },
  { title: "短片精选第二辑", category: "short", tag: "短片", views: 301000, duration: 116, date: "2026-05-13", poster: "linear-gradient(135deg,#f97316,#1f2937)" }
];

const state = {
  category: "all",
  query: "",
  sort: "popular"
};

const grid = document.querySelector("#videoGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const filters = document.querySelector("#filters");
const modal = document.querySelector("#modal");

function formatViews(value) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return String(value);
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function getFilteredItems() {
  const query = state.query.trim().toLowerCase();
  let result = items.filter((item) => {
    const categoryMatch = state.category === "all" || item.category === state.category;
    const queryMatch = !query || `${item.title} ${item.tag} ${item.category}`.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  });

  result = [...result].sort((a, b) => {
    if (state.sort === "newest") return b.date.localeCompare(a.date);
    if (state.sort === "longest") return b.duration - a.duration;
    return b.views - a.views;
  });

  return result;
}

function render() {
  const result = getFilteredItems();
  grid.innerHTML = result.map((item) => `
    <article class="card">
      <div class="thumb" style="--poster:${item.poster}">
        <span class="duration">${formatDuration(item.duration)}</span>
      </div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <div class="meta">
          <span class="tag">${item.tag}</span>
          <span>${formatViews(item.views)} 次观看</span>
        </div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = result.length > 0;
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  state.category = button.dataset.category;
  filters.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  render();
});

document.querySelector("#searchButton").addEventListener("click", () => {
  state.query = searchInput.value;
  render();
});

searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  render();
});

sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  render();
});

document.querySelector("#themeButton").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

document.querySelectorAll(".copy-link").forEach((button) => {
  button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(button.dataset.copy);
    const oldText = button.textContent;
    button.textContent = "已复制";
    window.setTimeout(() => {
      button.textContent = oldText;
    }, 1200);
  });
});

document.querySelector("#noticeButton").addEventListener("click", () => {
  modal.hidden = false;
});

document.querySelector("#closeModal").addEventListener("click", () => {
  modal.hidden = true;
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.hidden = true;
});

render();
