let posts = JSON.parse(localStorage.getItem("posts")) || [];
let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = localStorage.getItem("currentUser");

window.onload = function () {
  if (currentUser && users[currentUser]) {
    showApp();
  }
  renderFeed();
};

function login() {
  let username = document.getElementById("usernameInput").value.trim();
  let avatar = document.getElementById("avatarInput").value.trim();
  if (!username || !avatar) return;

  users[username] = avatar;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", username);
  currentUser = username;
  showApp();
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

function showApp() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("profile").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("currentUser").innerText = currentUser;
  document.getElementById("userAvatar").src = users[currentUser];
}

function addPost() {
  let text = document.getElementById("postText").value;
  if (!text) return;

  let postData = {
    user: currentUser,
    text: text,
    likes: []
  };

  posts.unshift(postData);
  savePosts();
  renderFeed();

  document.getElementById("postText").value = "";
}

function toggleLike(index) {
  let post = posts[index];

  if (post.likes.includes(currentUser)) {
    post.likes = post.likes.filter(u => u !== currentUser);
  } else {
    post.likes.push(currentUser);
  }

  savePosts();
  renderFeed();
}

function renderFeed() {
  let feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach((p, i) => {
    let liked = p.likes.includes(currentUser);

    let post = document.createElement("div");
    post.className = "post";
    post.innerHTML = `
      <img class="avatar" src="${users[p.user]}" onclick="openProfile('${p.user}')">
      <b onclick="openProfile('${p.user}')" style="cursor:pointer;">${p.user}</b>
      <p>${p.text}</p>
      <button onclick="toggleLike(${i})">
        ${liked ? "❤️" : "🤍"} ${p.likes.length}
      </button>
    `;
    feed.appendChild(post);
  });
}

function openProfile(username) {
  document.getElementById("app").style.display = "none";
  document.getElementById("profile").style.display = "block";

  document.getElementById("profileName").innerText = username;
  document.getElementById("profileAvatar").src = users[username];

  let container = document.getElementById("profilePosts");
  container.innerHTML = "";

  posts
    .map((p, i) => ({ ...p, index: i }))
    .filter(p => p.user === username)
    .forEach(p => {
      let liked = p.likes.includes(currentUser);

      let div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <p>${p.text}</p>
        <button onclick="toggleLike(${p.index})">
          ${liked ? "❤️" : "🤍"} ${p.likes.length}
        </button>
      `;
      container.appendChild(div);
    });
}

function backToFeed() {
  document.getElementById("profile").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}
