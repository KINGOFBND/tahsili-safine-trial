+document.addEventListener("DOMContentLoaded", function () {
  setupLogin();
  setupUserNames();
  setupTabs();
  setupQuickNavigation();
  setupLogout();
  setupStudentTicketModal();
  setupAdminUsers();
  setupDemoActions();
});

/* =========================
   Login (Demo)
========================= */
function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username")?.value.trim() || "";
    const password = document.getElementById("password")?.value.trim() || "";
    const role = document.getElementById("role")?.value || "";

    if (!username) return alert("لطفاً نام کاربری را وارد کنید.");
    if (!password) return alert("لطفاً رمز عبور را وارد کنید.");
    if (!role) return alert("لطفاً نقش کاربر را انتخاب کنید.");

    localStorage.setItem("safinehUser", username);
    localStorage.setItem("safinehRole", role);

    if (role === "student") window.location.href = "student.html";
    if (role === "teacher") window.location.href = "teacher.html";
    if (role === "admin") window.location.href = "admin.html";
  });
}

/* =========================
   Show User Names
========================= */
function setupUserNames() {
  const username = localStorage.getItem("safinehUser") || "کاربر مهمان";

  const studentName = document.getElementById("studentName");
  const teacherName = document.getElementById("teacherName");
  const adminName = document.getElementById("adminName");

  if (studentName) studentName.textContent = username;
  if (teacherName) teacherName.textContent = username;
  if (adminName) adminName.textContent = username;
}

/* =========================
   Tabs
========================= */
function setupTabs() {
  const sideLinks = document.querySelectorAll(".side-link");
  if (!sideLinks.length) return;

  sideLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const targetId = this.getAttribute("data-tab");
      const parentDash = this.closest(".dash");
      if (!parentDash || !targetId) return;

      const localLinks = parentDash.querySelectorAll(".side-link");
      const localPanels = parentDash.querySelectorAll(".tab-panel");

      localLinks.forEach((item) => item.classList.remove("active"));
      localPanels.forEach((panel) => panel.classList.remove("active"));

      this.classList.add("active");

      const targetPanel = parentDash.querySelector(`#${targetId}`);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });
}

/* =========================
   Quick Navigation Buttons
========================= */
function setupQuickNavigation() {
  const openButtons = document.querySelectorAll("[data-open]");
  if (!openButtons.length) return;

  openButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-open");
      if (!targetId) return;

      const dash = this.closest(".dash");
      if (!dash) return;

      const sideLink = dash.querySelector(`.side-link[data-tab="${targetId}"]`);
      const panel = dash.querySelector(`#${targetId}`);
      if (!panel) return;

      dash.querySelectorAll(".side-link").forEach((item) => item.classList.remove("active"));
      dash.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("active"));

      if (sideLink) sideLink.classList.add("active");
      panel.classList.add("active");

      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* =========================
   Logout
========================= */
function setupLogout() {
  const logoutButtons = [
    document.getElementById("logoutBtnStudent"),
    document.getElementById("logoutBtnTeacher"),
    document.getElementById("logoutBtnAdmin"),
  ].filter(Boolean);

  logoutButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const confirmExit = confirm("آیا مطمئن هستید که می‌خواهید خارج شوید؟");
      if (!confirmExit) return;

      localStorage.removeItem("safinehUser");
      localStorage.removeItem("safinehRole");

      window.location.href = "login.html";
    });
  });
}

/* =========================
   Student Ticket Modal (Demo)
========================= */
function setupStudentTicketModal() {
  const openBtn = document.getElementById("stuNewTicketBtn");
  const modal = document.getElementById("stuTicketModal");
  const closeBtn = document.getElementById("stuCloseTicketModal");
  const submitBtn = document.getElementById("stuSubmitTicket");

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener("click", function () {
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    });
  }

  const closeModal = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const type = document.getElementById("stuTicketType")?.value || "";
      const subject = document.getElementById("stuTicketSubject")?.value.trim() || "";
      const message = document.getElementById("stuTicketMessage")?.value.trim() || "";
      const ticketTable = document.getElementById("stuTicketTable");

      if (!subject) return alert("لطفاً موضوع تیکت را وارد کنید.");
      if (!message) return alert("لطفاً متن تیکت را وارد کنید.");

      if (ticketTable) {
        const row = document.createElement("div");
        row.className = "trow";
        row.innerHTML = `
          <div>${escapeHtml(subject)}</div>
          <div>${escapeHtml(type)}</div>
          <div><span class="pill warn">باز</span></div>
          <div>همین حالا</div>
        `;
        ticketTable.appendChild(row);
      }

      alert("تیکت با موفقیت ثبت شد. (نسخه نمایشی)");

      const subj = document.getElementById("stuTicketSubject");
      const msg = document.getElementById("stuTicketMessage");
      const ty = document.getElementById("stuTicketType");

      if (subj) subj.value = "";
      if (msg) msg.value = "";
      if (ty) ty.value = "درسی";

      closeModal();
    });
  }
}

/* =========================================================
   Admin Users + Permissions (Advanced)
========================================================= */

function setupAdminUsers() {
  const table = document.getElementById("adminUsersTable");
  if (!table) return;

  seedDBIfNeeded();
  renderAdminUsersTable();
  updateAdminStats();

  const addBtn = document.getElementById("adminAddUserBtn");
  const modal = document.getElementById("adminAddUserModal");
  const closeBtn = document.getElementById("adminCloseAddUserModal");
  const cancelBtn = document.getElementById("adminCancelAddUser");
  const submitBtn = document.getElementById("adminSubmitAddUser");
  const roleEl = document.getElementById("adminNewRole");

  const resetRoleBtn = document.getElementById("adminPermResetRole");
  const selectAllBtn = document.getElementById("adminPermSelectAll");
  const clearAllBtn = document.getElementById("adminPermClearAll");

  let permMode = "role";

  function openModal() {
    if (!modal) return;

    clearAdminAddUserForm();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    const role = roleEl ? roleEl.value : "student";
    permMode = "role";
    applyPermissionsToForm(defaultPermissionsByRole(role));
    setPermissionsInputsLockedByRole(role);
    setPermModeHint("role");
    syncBulkButtons(role);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function syncBulkButtons(role) {
    const allowed = allowedPermissionsByRole(role);
    const anyAllowed = Object.values(allowed).some(Boolean);

    if (selectAllBtn) selectAllBtn.disabled = !anyAllowed;
    if (clearAllBtn) clearAllBtn.disabled = !anyAllowed;
  }

  if (addBtn) addBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", function (e) {
      const target = e.target;
      if (target === modal || target?.matches?.(".modal-backdrop,[data-close='true']")) {
        closeModal();
      }
    });
  }

  if (roleEl) {
    roleEl.addEventListener("change", function () {
      const role = this.value || "student";
      permMode = "role";
      applyPermissionsToForm(defaultPermissionsByRole(role));
      setPermissionsInputsLockedByRole(role);
      setPermModeHint("role");
      syncBulkButtons(role);
    });
  }

  const permInputIds = [
    "permContentRead",
    "permContentManage",
    "permQuizManage",
    "permTicketRead",
    "permTicketReply",
    "permUserManage",
  ];

  permInputIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("change", function () {
      const role = roleEl ? roleEl.value : "student";
      const current = collectPermissionsFromForm();
      const defaults = defaultPermissionsByRole(role);

      if (permissionsEqual(current, defaults)) {
        permMode = "role";
        setPermModeHint("role");
      } else {
        permMode = "custom";
        setPermModeHint("custom");
      }
    });
  });

  if (resetRoleBtn) {
    resetRoleBtn.addEventListener("click", function () {
      const role = roleEl ? roleEl.value : "student";
      permMode = "role";
      applyPermissionsToForm(defaultPermissionsByRole(role));
      setPermissionsInputsLockedByRole(role);
      setPermModeHint("role");
    });
  }

  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", function () {
      const role = roleEl ? roleEl.value : "student";
      const allowed = allowedPermissionsByRole(role);

      const map = {
        permContentRead: "contentRead",
        permContentManage: "contentManage",
        permQuizManage: "quizManage",
        permTicketRead: "ticketRead",
        permTicketReply: "ticketReply",
        permUserManage: "userManage",
      };

      Object.entries(map).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (!el || el.disabled) return;
        if (allowed[key]) el.checked = true;
      });

      const current = collectPermissionsFromForm();
      const defaults = defaultPermissionsByRole(role);

      if (permissionsEqual(current, defaults)) {
        permMode = "role";
        setPermModeHint("role");
      } else {
        permMode = "custom";
        setPermModeHint("custom");
      }
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", function () {
      permInputIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el || el.disabled) return;
        el.checked = false;
      });

      const role = roleEl ? roleEl.value : "student";
      const current = collectPermissionsFromForm();
      const defaults = defaultPermissionsByRole(role);

      if (permissionsEqual(current, defaults)) {
        permMode = "role";
        setPermModeHint("role");
      } else {
        permMode = "custom";
        setPermModeHint("custom");
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const name = document.getElementById("adminNewName")?.value.trim() || "";
      const username = document.getElementById("adminNewUsername")?.value.trim() || "";
      const password = document.getElementById("adminNewPassword")?.value.trim() || "";
      const role = roleEl ? roleEl.value : "student";

      if (!name) return alert("نام و نام خانوادگی را وارد کنید.");
      if (!username) return alert("نام کاربری را وارد کنید.");
      if (!password) return alert("رمز عبور را وارد کنید.");
      if (password.length < 4) return alert("رمز عبور باید حداقل 4 کاراکتر باشد.");

      const db = getDB();
      const exists = db.users.some((u) => (u.username || "").toLowerCase() === username.toLowerCase());
      if (exists) return alert("این نام کاربری قبلاً ثبت شده است.");

      const allowed = allowedPermissionsByRole(role);
      const formPerms = collectPermissionsFromForm();

      const finalPermissions = {
        contentRead: allowed.contentRead ? !!formPerms.contentRead : false,
        contentManage: allowed.contentManage ? !!formPerms.contentManage : false,
        quizManage: allowed.quizManage ? !!formPerms.quizManage : false,
        ticketRead: allowed.ticketRead ? !!formPerms.ticketRead : false,
        ticketReply: allowed.ticketReply ? !!formPerms.ticketReply : false,
        userManage: allowed.userManage ? !!formPerms.userManage : false,
      };

      db.users.push({
        id: cryptoId("u"),
        name,
        username,
        password,
        role,
        permissions: finalPermissions,
        permMode,
        createdAt: Date.now(),
      });

      setDB(db);
      renderAdminUsersTable();
      updateAdminStats();
      closeModal();
      clearAdminAddUserForm();

      alert("کاربر با موفقیت اضافه شد.");
    });
  }

  table.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const row = btn.closest(".trow");
    const userId = row?.getAttribute("data-id");

    if (!userId) return;

    if (action === "deleteUser") {
      const db = getDB();
      const user = db.users.find((u) => u.id === userId);
      if (!user) return;

      const protectedUsernames = ["admin"];
      if (protectedUsernames.includes((user.username || "").toLowerCase())) {
        alert("حذف این کاربر پیش‌فرض مجاز نیست.");
        return;
      }

      const confirmDel = confirm("کاربر حذف شود؟");
      if (!confirmDel) return;

      db.users = db.users.filter((u) => u.id !== userId);
      setDB(db);

      renderAdminUsersTable();
      updateAdminStats();
    }
  });
}

function renderAdminUsersTable() {
  const table = document.getElementById("adminUsersTable");
  if (!table) return;

  const db = getDB();
  const users = db.users || [];

  const head = `
    <div class="trow thead">
      <div>نام</div>
      <div>نام کاربری</div>
      <div>نقش</div>
      <div>دسترسی‌ها</div>
      <div>عملیات</div>
    </div>
  `;

  const rows = users.map((u) => {
    const p = normalizePermissionsObject(u.permissions);
    const labels = permissionLabelsFromObject(p);
    const preview = labels.slice(0, 2).map((label) => `<span class="pill">${escapeHtml(label)}</span>`).join("");
    const extra = labels.length > 2 ? `<span class="pill warn">+${labels.length - 2}</span>` : `<span class="pill">${labels.length ? "فعال" : "ندارد"}</span>`;

    return `
      <div class="trow" data-id="${escapeHtml(u.id)}">
        <div>${escapeHtml(u.name)}</div>
        <div>${escapeHtml(u.username)}</div>
        <div>${escapeHtml(roleLabel(u.role))}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">${preview}${extra}</div>
        <div class="actions">
          <button class="btn btn-sm btn-secondary" data-action="deleteUser">حذف</button>
        </div>
      </div>
    `;
  }).join("");

  table.innerHTML = head + rows;
}

function updateAdminStats() {
  const db = getDB();
  const users = db.users || [];
  const tickets = db.tickets || [];

  const totalUsers = document.getElementById("adminStatUsers");
  const totalStaff = document.getElementById("adminStatStaff");
  const totalTickets = document.getElementById("adminStatTickets");

  const staffCount = users.filter((u) => ["admin", "content", "support"].includes(u.role)).length;

  if (totalUsers) totalUsers.textContent = String(users.length);
  if (totalStaff) totalStaff.textContent = String(staffCount);
  if (totalTickets) totalTickets.textContent = String(tickets.length);
}

function clearAdminAddUserForm() {
  const ids = ["adminNewName", "adminNewUsername", "adminNewPassword"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  const roleEl = document.getElementById("adminNewRole");
  if (roleEl) roleEl.value = "student";

  applyPermissionsToForm(defaultPermissionsByRole("student"));
  setPermissionsInputsLockedByRole("student");
  setPermModeHint("role");
}

function defaultPermissionsByRole(role) {
  switch (role) {
    case "admin":
      return {
        contentRead: true,
        contentManage: true,
        quizManage: true,
        ticketRead: true,
        ticketReply: true,
        userManage: true,
      };
    case "content":
      return {
        contentRead: true,
        contentManage: true,
        quizManage: true,
        ticketRead: false,
        ticketReply: false,
        userManage: false,
      };
    case "support":
      return {
        contentRead: false,
        contentManage: false,
        quizManage: false,
        ticketRead: true,
        ticketReply: true,
        userManage: false,
      };
    default:
      return {
        contentRead: false,
        contentManage: false,
        quizManage: false,
        ticketRead: false,
        ticketReply: false,
        userManage: false,
      };
  }
}

function allowedPermissionsByRole(role) {
  if (role === "student") {
    return {
      contentRead: false,
      contentManage: false,
      quizManage: false,
      ticketRead: false,
      ticketReply: false,
      userManage: false,
    };
  }

  if (role === "support") {
    return {
      contentRead: false,
      contentManage: false,
      quizManage: false,
      ticketRead: true,
      ticketReply: true,
      userManage: false,
    };
  }

  if (role === "content") {
    return {
      contentRead: true,
      contentManage: true,
      quizManage: true,
      ticketRead: false,
      ticketReply: false,
      userManage: false,
    };
  }

  return {
    contentRead: true,
    contentManage: true,
    quizManage: true,
    ticketRead: true,
    ticketReply: true,
    userManage: true,
  };
}

function collectPermissionsFromForm() {
  const g = (id) => document.getElementById(id);
  return {
    contentRead: !!g("permContentRead")?.checked,
    contentManage: !!g("permContentManage")?.checked,
    quizManage: !!g("permQuizManage")?.checked,
    ticketRead: !!g("permTicketRead")?.checked,
    ticketReply: !!g("permTicketReply")?.checked,
    userManage: !!g("permUserManage")?.checked,
  };
}

function applyPermissionsToForm(perms) {
  const map = {
    permContentRead: perms.contentRead,
    permContentManage: perms.contentManage,
    permQuizManage: perms.quizManage,
    permTicketRead: perms.ticketRead,
    permTicketReply: perms.ticketReply,
    permUserManage: perms.userManage,
  };

  Object.entries(map).forEach(([id, checked]) => {
    const el = document.getElementById(id);
    if (el) el.checked = !!checked;
  });
}

function setPermissionsInputsLockedByRole(role) {
  const allowed = allowedPermissionsByRole(role);

  const map = {
    permContentRead: "contentRead",
    permContentManage: "contentManage",
    permQuizManage: "quizManage",
    permTicketRead: "ticketRead",
    permTicketReply: "ticketReply",
    permUserManage: "userManage",
  };

  Object.entries(map).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (!input) return;

    const canUse = !!allowed[key];
    input.disabled = !canUse;

    const card = input.closest(".perm-card");
    if (card) card.classList.toggle("is-locked", !canUse);

    if (!canUse) input.checked = false;
  });
}

function permissionsEqual(a, b) {
  const keys = ["contentRead", "contentManage", "quizManage", "ticketRead", "ticketReply", "userManage"];
  return keys.every((k) => !!a?.[k] === !!b?.[k]);
}

function setPermModeHint(mode) {
  const hint = document.getElementById("adminPermModeHint");
  if (!hint) return;

  if (mode === "role") {
    hint.innerHTML = `<span class="badge ok">حالت: پیش‌فرض نقش</span>`;
  } else {
    hint.innerHTML = `<span class="badge warn">حالت: شخصی‌سازی شده</span>`;
  }
}

function normalizePermissionsObject(permissions) {
  if (!permissions) return defaultPermissionsByRole("student");

  if (Array.isArray(permissions)) {
    return {
      contentRead: permissions.includes("content:read"),
      contentManage: permissions.includes("content:manage"),
      quizManage: permissions.includes("quiz:manage"),
      ticketRead: permissions.includes("ticket:read"),
      ticketReply: permissions.includes("ticket:reply"),
      userManage: permissions.includes("user:manage"),
    };
  }

  return {
    contentRead: !!permissions.contentRead,
    contentManage: !!permissions.contentManage,
    quizManage: !!permissions.quizManage,
    ticketRead: !!permissions.ticketRead,
    ticketReply: !!permissions.ticketReply,
    userManage: !!permissions.userManage,
  };
}

function permissionLabelsFromObject(p) {
  const labels = [];
  if (p.contentRead) labels.push("مشاهده محتوا");
  if (p.contentManage) labels.push("مدیریت محتوا");
  if (p.quizManage) labels.push("مدیریت آزمون‌ها");
  if (p.ticketRead) labels.push("مشاهده تیکت‌ها");
  if (p.ticketReply) labels.push("پاسخ به تیکت‌ها");
  if (p.userManage) labels.push("مدیریت کاربران");
  return labels;
}

function roleLabel(role) {
  if (role === "admin") return "مدیر کل";
  if (role === "content") return "مدیر محتوا";
  if (role === "support") return "پشتیبان";
  if (role === "teacher") return "همکار آموزشی";
  return "دانش‌آموز";
}

function cryptoId(prefix = "id") {
  if (window.crypto && crypto.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  return prefix + "_" + Math.random().toString(16).slice(2) + "_" + Date.now();
}

function getDB() {
  const raw = localStorage.getItem("safinehDB");
  if (!raw) return { users: [], tickets: [], news: [], lessons: [] };

  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
      news: Array.isArray(parsed.news) ? parsed.news : [],
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
    };
  } catch {
    return { users: [], tickets: [], news: [], lessons: [] };
  }
}

function setDB(db) {
  localStorage.setItem("safinehDB", JSON.stringify(db));
}

function seedDBIfNeeded() {
  const db = getDB();
  if (db.users.length) return;

  db.users = [
    {
      id: cryptoId("u"),
      name: "مدیر سیستم",
      username: "admin",
      password: "admin",
      role: "admin",
      permissions: defaultPermissionsByRole("admin"),
      createdAt: Date.now(),
    },
    {
      id: cryptoId("u"),
      name: "مدیر محتوای نمونه",
      username: "content",
      password: "content",
      role: "content",
      permissions: defaultPermissionsByRole("content"),
      createdAt: Date.now(),
    },
    {
      id: cryptoId("u"),
      name: "پشتیبان نمونه",
      username: "support",
      password: "support",
      role: "support",
      permissions: defaultPermissionsByRole("support"),
      createdAt: Date.now(),
    },
    {
      id: cryptoId("u"),
      name: "دانش‌آموز نمونه",
      username: "student",
      password: "student",
      role: "student",
      permissions: defaultPermissionsByRole("student"),
      createdAt: Date.now(),
    },
  ];

  setDB(db);
}

/* =========================
   Demo Actions
========================= */
function setupDemoActions() {
  const watchButtons = document.querySelectorAll('[data-action="watch"]');
  const quizButtons = document.querySelectorAll('[data-action="start-quiz"]');
  const replyButtons = document.querySelectorAll('[data-action="reply-ticket"]');

  watchButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      alert("در نسخه بعدی، ویدیو این درس باز می‌شود.");
    });
  });

  quizButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      alert("در مرحله بعدی، آزمون واقعی با سوال و نمره‌دهی خودکار ساخته می‌شود.");
    });
  });

  replyButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      alert("در مرحله بعدی، پاسخ‌دهی واقعی به تیکت فعال می‌شود.");
    });
  });

  const addButtons = [
    document.getElementById("tAddLessonBtn"),
    document.getElementById("tAddQuizBtn"),
    document.getElementById("adminAddNewsBtn"),
  ].filter(Boolean);

  addButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      alert("این قابلیت در مرحله بعدی به‌صورت کامل و ذخیره‌شونده پیاده‌سازی می‌شود.");
    });
  });
}

/* =========================
   Helpers
========================= */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = String(text ?? "");
  return div.innerHTML;
}
