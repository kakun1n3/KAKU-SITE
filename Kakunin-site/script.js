document.addEventListener("mousemove", (e) => {
  document.body.style.setProperty("--x", `${e.clientX}px`);
  document.body.style.setProperty("--y", `${e.clientY}px`);
});

// Twitchフォロワー表示
const followerCount = document.getElementById("followerCount");

if (followerCount) {
  async function loadTwitchFollowers() {
  const followerCount = document.getElementById("followerCount");
  if (!followerCount) return;

  try {
    const res = await fetch("/.netlify/functions/twitch-followers");
    const data = await res.json();

    if (typeof data.total === "number") {
      followerCount.textContent = data.total.toLocaleString();
    } else {
      followerCount.textContent = SITE_DATA.twitch.followerDisplay;
    }
  } catch (error) {
    followerCount.textContent = SITE_DATA.twitch.followerDisplay;
  }
}

loadTwitchFollowers();
}

// スケジュール表示
const scheduleList = document.getElementById("scheduleList");

if (scheduleList) {
  scheduleList.innerHTML = "";

  SITE_DATA.schedule.forEach((item) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <span>${item.date}</span>
      <b>${item.time}</b>
      <p>${item.title}</p>
    `;
    scheduleList.appendChild(row);
  });
}

// コンテンツ表示
const contentList = document.getElementById("contentList");

if (contentList) {
  contentList.innerHTML = "";

  SITE_DATA.contents.forEach((item) => {
    const card = document.createElement("a");
    card.className = "content-card";
    card.href = item.url || "#";

    card.innerHTML = `
      <span>${item.icon}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    `;

    contentList.appendChild(card);
  });
}

// NEWS表示
const newsList = document.getElementById("newsList");

if (newsList) {
  newsList.innerHTML = "";

  SITE_DATA.news.forEach((item) => {
    const row = document.createElement("div");
    row.className = "news-row";

    row.innerHTML = `
      <time>${item.date}</time>
      <em class="${item.type === "info" ? "info" : ""}">${item.label}</em>
      <p>${item.text}</p>
    `;

    newsList.appendChild(row);
  });
}

// 各リンク反映
document.querySelectorAll("[data-link]").forEach((link) => {
  const key = link.dataset.link;

  if (SITE_DATA.links[key]) {
    link.href = SITE_DATA.links[key];
  }
});

// KAKU//SYSTEMリンク反映
document.querySelectorAll("[data-system-link]").forEach((link) => {
  link.href = SITE_DATA.systemUrl;
});

// ギャラリーNO IMAGE処理
document.querySelectorAll(".gallery-item").forEach((item) => {
  const image = item.style.backgroundImage;

  if (!image || image === "none") {
    item.classList.add("no-image");
    item.textContent = "NO IMAGE";
  }
});

async function loadTwitchStatus() {
  const liveStatus = document.getElementById("liveStatus");
  const liveGame = document.getElementById("liveGame");
  const liveBadge = document.getElementById("liveBadge");
  const liveTitle = document.getElementById("liveTitle");
  const liveViewers = document.getElementById("liveViewers");

  try {
    const res = await fetch("/.netlify/functions/twitch-status");
    const data = await res.json();

    if (data.isLive) {
      if (liveStatus) liveStatus.textContent = "LIVE NOW";
      if (liveGame) liveGame.textContent = data.game || "配信中";

      if (liveBadge) {
        liveBadge.textContent = "● LIVE NOW";
        liveBadge.classList.add("is-live");
      }

      if (liveTitle) liveTitle.textContent = data.title || "配信中";

      if (liveViewers) {
        liveViewers.textContent = `${Number(data.viewerCount).toLocaleString()} viewers`;
      }
    } else {
      if (liveStatus) liveStatus.textContent = "OFFLINE";
      if (liveGame) liveGame.textContent = "OFFLINE";

      if (liveBadge) {
        liveBadge.textContent = "○ OFFLINE";
        liveBadge.classList.remove("is-live");
      }

      if (liveTitle) liveTitle.textContent = "現在はオフラインです";
      if (liveViewers) liveViewers.textContent = "次回配信をお待ちください";
    }
  } catch (error) {
    if (liveStatus) liveStatus.textContent = "ERROR";
    if (liveGame) liveGame.textContent = "---";
    if (liveBadge) liveBadge.textContent = "ERROR";
    if (liveTitle) liveTitle.textContent = "配信情報を取得できませんでした";
    if (liveViewers) liveViewers.textContent = "---";
  }
}

loadTwitchStatus();
