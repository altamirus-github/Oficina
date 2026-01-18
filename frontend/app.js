const API_BASE = window.API_BASE || window.location.origin;
const TOKEN_KEY = "oficina_token";

const modules = {
  clients: {
    title: "Clientes",
    subtitle: "Gestao completa da base de clientes.",
    caption: "Lista de clientes cadastrados.",
    endpoint: "/clients",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "cpf", label: "CPF", type: "text" },
      { name: "phone", label: "Telefone", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "address.street", label: "Endereco", type: "text" },
      { name: "address.number", label: "Numero", type: "text" },
      { name: "address.city", label: "Cidade", type: "text" },
      { name: "address.state", label: "UF", type: "text" },
      { name: "address.zipcode", label: "CEP", type: "text" }
    ],
    columns: ["id", "name", "cpf", "phone", "city", "state"]
  },
  vehicles: {
    title: "Veiculos",
    subtitle: "Controle de frota e historico por cliente.",
    caption: "Veiculos registrados.",
    endpoint: "/vehicles",
    fields: [
      { name: "client_id", label: "Cliente ID", type: "number", required: true },
      { name: "model", label: "Modelo", type: "text", required: true },
      { name: "brand", label: "Marca", type: "text", required: true },
      { name: "plate", label: "Placa", type: "text", required: true },
      { name: "year", label: "Ano", type: "text" },
      { name: "km_current", label: "KM", type: "number" },
      { name: "color", label: "Cor", type: "text" },
      { name: "fuel_type", label: "Combustivel", type: "text" }
    ],
    columns: ["id", "client_id", "brand", "model", "plate", "year"]
  },
  providers: {
    title: "Fornecedores",
    subtitle: "Parceiros estrategicos e catalogo de compras.",
    caption: "Fornecedores ativos.",
    endpoint: "/providers",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "cnpj", label: "CNPJ", type: "text" },
      { name: "phone", label: "Telefone", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "website", label: "Site", type: "text" },
      { name: "address.street", label: "Endereco", type: "text" },
      { name: "address.number", label: "Numero", type: "text" },
      { name: "address.city", label: "Cidade", type: "text" },
      { name: "address.state", label: "UF", type: "text" },
      { name: "address.zipcode", label: "CEP", type: "text" }
    ],
    columns: ["id", "name", "cnpj", "phone", "city", "state"]
  },
  products: {
    title: "Produtos",
    subtitle: "Inventario com precos e estoque.",
    caption: "Produtos cadastrados.",
    endpoint: "/products",
    fields: [
      { name: "provider_id", label: "Fornecedor ID", type: "number" },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "category", label: "Categoria", type: "text" },
      { name: "price", label: "Preco", type: "number" },
      { name: "barcode", label: "Codigo", type: "text" },
      { name: "stock_qty", label: "Estoque", type: "number" },
      { name: "description", label: "Descricao", type: "text" }
    ],
    columns: ["id", "name", "category", "price", "stock_qty"]
  },
  services: {
    title: "Servicos",
    subtitle: "Catalogo de manutencoes e pacotes.",
    caption: "Servicos principais.",
    endpoint: "/services",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "base_price", label: "Preco base", type: "number" },
      { name: "description", label: "Descricao", type: "text" }
    ],
    columns: ["id", "name", "base_price"]
  },
  orders: {
    title: "Ordens",
    subtitle: "Fluxo operacional com itens e status.",
    caption: "Ordens abertas e finalizadas.",
    endpoint: "/orders",
    fields: [
      { name: "client_id", label: "Cliente ID", type: "number", required: true },
      { name: "vehicle_id", label: "Veiculo ID", type: "number" },
      { name: "status", label: "Status", type: "text" },
      { name: "payment_method", label: "Pagamento", type: "text" },
      { name: "observation", label: "Observacao", type: "text" }
    ],
    columns: ["id", "client_id", "vehicle_id", "status", "total"]
  },
  finance: {
    title: "Financeiro",
    subtitle: "Entradas e saidas para controle de caixa.",
    caption: "Lancamentos financeiros recentes.",
    endpoint: "/finance",
    fields: [
      {
        name: "entry_type",
        label: "Tipo",
        type: "select",
        options: [
          { value: "income", label: "Receita" },
          { value: "expense", label: "Despesa" }
        ],
        required: true
      },
      { name: "description", label: "Descricao", type: "text", required: true },
      { name: "category", label: "Categoria", type: "text" },
      { name: "amount", label: "Valor", type: "number", required: true },
      { name: "reference_order_id", label: "Ordem ID", type: "number" }
    ],
    columns: ["id", "entry_type", "description", "amount", "category"]
  },
  checklists: {
    title: "Checklists",
    subtitle: "Inspecoes com observacoes e registro fotografico.",
    caption: "Checklists recentes de veiculos.",
    endpoint: "/checklists",
    fields: [
      { name: "vehicle_id", label: "Veiculo ID", type: "number", required: true },
      { name: "incident", label: "Houve sinistro?", type: "checkbox" },
      { name: "notes", label: "Observacoes", type: "text" }
    ],
    columns: ["id", "vehicle_id", "incident", "created_at"]
  }
};

const state = {
  active: "clients",
  data: {},
  filtered: [],
  token: localStorage.getItem(TOKEN_KEY) || ""
};

const elements = {
  moduleTitle: document.getElementById("module-title"),
  moduleSubtitle: document.getElementById("module-subtitle"),
  tableTitle: document.getElementById("table-title"),
  tableCaption: document.getElementById("table-caption"),
  table: document.getElementById("table"),
  search: document.getElementById("search"),
  refresh: document.getElementById("refresh"),
  create: document.getElementById("create"),
  navItems: document.querySelectorAll(".nav__item"),
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modal-title"),
  form: document.getElementById("form"),
  save: document.getElementById("save"),
  close: document.getElementById("close"),
  cancel: document.getElementById("cancel"),
  stats: {
    clients: document.getElementById("stat-clients"),
    vehicles: document.getElementById("stat-vehicles"),
    orders: document.getElementById("stat-orders"),
    products: document.getElementById("stat-products")
  },
  login: document.getElementById("login"),
  loginForm: document.getElementById("login-form"),
  loginError: document.getElementById("login-error")
};

function authHeaders() {
  if (!state.token) {
    return {};
  }
  return { Authorization: `Bearer ${state.token}` };
}

async function fetchModuleData(moduleKey) {
  const module = modules[moduleKey];
  const response = await fetch(`${API_BASE}${module.endpoint}`, {
    headers: authHeaders()
  });
  if (!response.ok) {
    throw new Error("Falha ao carregar dados");
  }
  const data = await response.json();
  state.data[moduleKey] = data;
  return data;
}

function normalizeValue(item, key) {
  if (key === "city" || key === "state") {
    return item.address ? item.address[key] : "";
  }
  return item[key] ?? "";
}

function renderTable(moduleKey, data) {
  const module = modules[moduleKey];
  const columns = module.columns;

  const headerRow = `<div class="table__row header">${columns
    .map((col) => `<div class="table__cell">${col}</div>`)
    .join("")}</div>`;

  const rows = data
    .map((item) => {
      const cells = columns
        .map((col) => `<div class="table__cell">${normalizeValue(item, col)}</div>`)
        .join("");
      return `<div class="table__row data">${cells}</div>`;
    })
    .join("");

  elements.table.innerHTML = headerRow + rows;
}

function setHeader(moduleKey) {
  const module = modules[moduleKey];
  elements.moduleTitle.textContent = module.title;
  elements.moduleSubtitle.textContent = module.subtitle;
  elements.tableTitle.textContent = `Lista de ${module.title}`;
  elements.tableCaption.textContent = module.caption;
}

function updateStats() {
  const clients = state.data.clients || [];
  const vehicles = state.data.vehicles || [];
  const orders = state.data.orders || [];
  const products = state.data.products || [];

  elements.stats.clients.textContent = clients.length;
  elements.stats.vehicles.textContent = vehicles.length;
  elements.stats.orders.textContent = orders.length;
  elements.stats.products.textContent = products.length;
}

function buildForm(moduleKey) {
  const module = modules[moduleKey];
  elements.form.innerHTML = "";

  module.fields.forEach((field) => {
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = field.label;
    let input;
    if (field.type === "select") {
      input = document.createElement("select");
      field.options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.label;
        input.appendChild(opt);
      });
    } else if (field.type === "checkbox") {
      input = document.createElement("input");
      input.type = "checkbox";
    } else if (field.name === "observation" || field.name === "description" || field.name === "notes") {
      input = document.createElement("textarea");
    } else {
      input = document.createElement("input");
      input.type = field.type;
    }
    input.name = field.name;
    if (field.required) {
      input.required = true;
    }
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    elements.form.appendChild(wrapper);
  });

  if (moduleKey === "checklists") {
    const wrapper = document.createElement("div");
    wrapper.classList.add("form__full");
    const label = document.createElement("label");
    label.textContent = "Fotos do checklist";
    const input = document.createElement("input");
    input.type = "file";
    input.name = "photos";
    input.multiple = true;
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    elements.form.appendChild(wrapper);
  }
}

function parseFormData(form) {
  const data = {};
  const address = {};
  let hasAddress = false;

  const formData = new FormData(form);
  formData.forEach((value, key) => {
    if (key.startsWith("address.")) {
      const field = key.replace("address.", "");
      if (value) {
        address[field] = value;
        hasAddress = true;
      }
    } else if (key !== "photos" && value !== "") {
      data[key] = value;
    }
  });

  Array.from(form.elements).forEach((element) => {
    if (element.type === "checkbox") {
      data[element.name] = element.checked;
    }
  });

  if (hasAddress) {
    data.address = address;
  }

  return data;
}

async function createRecord(moduleKey, payload) {
  const response = await fetch(`${API_BASE}${modules[moduleKey].endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Falha ao salvar registro");
  }
  return response.json();
}

async function uploadChecklistPhotos(checklistId, files) {
  const uploads = Array.from(files || []);
  if (!uploads.length) {
    return;
  }
  for (const file of uploads) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE}/checklists/${checklistId}/photos`, {
      method: "POST",
      headers: authHeaders(),
      body: formData
    });
    if (!response.ok) {
      throw new Error("Falha ao enviar foto");
    }
  }
}

async function login(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha no login");
  }
  const data = await response.json();
  state.token = data.access_token;
  localStorage.setItem(TOKEN_KEY, state.token);
  return data;
}

function showLogin() {
  elements.login.classList.remove("hidden");
}

function hideLogin() {
  elements.login.classList.add("hidden");
}

async function loadModule(moduleKey) {
  state.active = moduleKey;
  elements.search.value = "";
  setHeader(moduleKey);
  const data = await fetchModuleData(moduleKey);
  state.filtered = data;
  renderTable(moduleKey, data);
  updateStats();
}

function openModal() {
  elements.modal.classList.add("active");
  elements.modalTitle.textContent = `Novo ${modules[state.active].title}`;
  buildForm(state.active);
}

function closeModal() {
  elements.modal.classList.remove("active");
  elements.form.reset();
}

function filterTable(query) {
  const source = state.data[state.active] || [];
  if (!query) {
    state.filtered = source;
  } else {
    const lower = query.toLowerCase();
    state.filtered = source.filter((item) =>
      Object.values(item).some((value) => String(value).toLowerCase().includes(lower))
    );
  }
  renderTable(state.active, state.filtered);
}

function bindEvents() {
  elements.navItems.forEach((item) => {
    item.addEventListener("click", async () => {
      elements.navItems.forEach((node) => node.classList.remove("active"));
      item.classList.add("active");
      await loadModule(item.dataset.module);
    });
  });

  elements.refresh.addEventListener("click", () => loadModule(state.active));
  elements.create.addEventListener("click", openModal);
  elements.close.addEventListener("click", closeModal);
  elements.cancel.addEventListener("click", closeModal);
  elements.search.addEventListener("input", (event) => filterTable(event.target.value));

  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const payload = parseFormData(elements.form);
      if (state.active === "orders") {
        payload.items = [];
      }
      const created = await createRecord(state.active, payload);
      if (state.active === "checklists") {
        const photosInput = elements.form.querySelector("input[name='photos']");
        await uploadChecklistPhotos(created.id, photosInput?.files);
      }
      closeModal();
      await loadModule(state.active);
    } catch (error) {
      alert(error.message);
    }
  });

  elements.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    elements.loginError.textContent = "";
    const formData = new FormData(elements.loginForm);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      await login(username, password);
      hideLogin();
      await boot();
    } catch (error) {
      elements.loginError.textContent = error.message;
    }
  });
}

async function boot() {
  if (!state.token) {
    showLogin();
    return;
  }
  hideLogin();
  await Promise.all([
    fetchModuleData("clients"),
    fetchModuleData("vehicles"),
    fetchModuleData("orders"),
    fetchModuleData("products")
  ]).catch(() => null);
  updateStats();
  await loadModule(state.active);
}

bindEvents();
boot();
