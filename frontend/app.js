const API_BASE = window.API_BASE || window.location.origin;
const TOKEN_KEY = "oficina_token";
const ROLE_KEY = "oficina_role";
const NAME_KEY = "oficina_name";

const modules = {
  clients: {
    title: "Clientes",
    subtitle: "Gestao completa da base de clientes.",
    caption: "Lista de clientes cadastrados.",
    endpoint: "/clients",
    fields: [
      { name: "name", label: "Nome", type: "text", placeholder: "Ex: Joao Silva", required: true },
      { name: "cpf", label: "CPF", type: "text", placeholder: "000.000.000-00" },
      { name: "phone", label: "Telefone", type: "text", placeholder: "(11) 99999-9999" },
      { name: "email", label: "Email", type: "email", placeholder: "cliente@email.com" },
      { name: "address.street", label: "Endereco", type: "text", placeholder: "Rua Exemplo" },
      { name: "address.number", label: "Numero", type: "text", placeholder: "123" },
      { name: "address.city", label: "Cidade", type: "text", placeholder: "Sao Paulo" },
      { name: "address.state", label: "UF", type: "text", placeholder: "SP" },
      { name: "address.zipcode", label: "CEP", type: "text", placeholder: "00000-000" }
    ],
    columns: ["ID", "Nome", "CPF", "Telefone", "Cidade", "UF"]
  },
  vehicles: {
    title: "Veiculos",
    subtitle: "Controle de frota e historico por cliente.",
    caption: "Veiculos registrados.",
    endpoint: "/vehicles",
    fields: [
      { name: "client_id", label: "Cliente ID", type: "number", placeholder: "2026", required: true },
      { name: "model", label: "Modelo", type: "text", placeholder: "Onix", required: true },
      { name: "brand", label: "Marca", type: "text", placeholder: "Chevrolet", required: true },
      { name: "plate", label: "Placa", type: "text", placeholder: "ABC-1234", required: true },
      { name: "year", label: "Ano", type: "text", placeholder: "2020" },
      { name: "km_current", label: "KM", type: "number", placeholder: "45000" },
      { name: "color", label: "Cor", type: "text", placeholder: "Prata" },
      { name: "fuel_type", label: "Combustivel", type: "text", placeholder: "Flex" }
    ],
    columns: ["ID", "Cliente", "Marca", "Modelo", "Placa", "Ano", "Acoes"]
  },
  providers: {
    title: "Fornecedores",
    subtitle: "Parceiros estrategicos e catalogo de compras.",
    caption: "Fornecedores ativos.",
    endpoint: "/providers",
    fields: [
      { name: "name", label: "Nome", type: "text", placeholder: "Fornecedor X", required: true },
      { name: "cnpj", label: "CNPJ", type: "text", placeholder: "00.000.000/0000-00" },
      { name: "phone", label: "Telefone", type: "text", placeholder: "(11) 3000-0000" },
      { name: "email", label: "Email", type: "email", placeholder: "contato@fornecedor.com" },
      { name: "website", label: "Site", type: "text", placeholder: "https://fornecedor.com" },
      { name: "address.street", label: "Endereco", type: "text", placeholder: "Rua Exemplo" },
      { name: "address.number", label: "Numero", type: "text", placeholder: "500" },
      { name: "address.city", label: "Cidade", type: "text", placeholder: "Rio de Janeiro" },
      { name: "address.state", label: "UF", type: "text", placeholder: "RJ" },
      { name: "address.zipcode", label: "CEP", type: "text", placeholder: "00000-000" }
    ],
    columns: ["ID", "Nome", "CNPJ", "Telefone", "Cidade", "UF"]
  },
  products: {
    title: "Produtos",
    subtitle: "Inventario com precos e estoque.",
    caption: "Produtos cadastrados.",
    endpoint: "/products",
    fields: [
      { name: "provider_id", label: "Fornecedor ID", type: "number", placeholder: "2026" },
      { name: "name", label: "Nome", type: "text", placeholder: "Filtro de oleo", required: true },
      { name: "category", label: "Categoria", type: "text", placeholder: "Motor" },
      { name: "price", label: "Preco", type: "number", placeholder: "99.90" },
      { name: "barcode", label: "Codigo", type: "text", placeholder: "7890000000000" },
      { name: "stock_qty", label: "Estoque", type: "number", placeholder: "10" },
      { name: "description", label: "Descricao", type: "text", placeholder: "Descricao do produto" }
    ],
    columns: ["ID", "Nome", "Categoria", "Preco", "Estoque"]
  },
  services: {
    title: "Servicos",
    subtitle: "Catalogo de manutencoes e pacotes.",
    caption: "Servicos principais.",
    endpoint: "/services",
    fields: [
      { name: "name", label: "Nome", type: "text", placeholder: "Troca de oleo", required: true },
      { name: "base_price", label: "Preco base", type: "number", placeholder: "150.00" },
      { name: "description", label: "Descricao", type: "text", placeholder: "Descricao do servico" }
    ],
    columns: ["ID", "Nome", "Preco base"]
  },
  orders: {
    title: "Ordens",
    subtitle: "Fluxo operacional com itens e status.",
    caption: "Ordens abertas e finalizadas.",
    endpoint: "/orders",
    fields: [
      { name: "client_id", label: "Cliente ID", type: "number", placeholder: "2026", required: true },
      { name: "vehicle_id", label: "Veiculo ID", type: "number", placeholder: "2026" },
      { name: "status", label: "Status", type: "text", placeholder: "Aberto" },
      { name: "payment_method", label: "Pagamento", type: "text", placeholder: "Credito" },
      { name: "observation", label: "Observacao", type: "text", placeholder: "Observacoes gerais" }
    ],
    columns: ["ID", "Cliente", "Veiculo", "Status", "Total"]
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
      { name: "description", label: "Descricao", type: "text", placeholder: "Entrada de caixa", required: true },
      { name: "category", label: "Categoria", type: "text", placeholder: "Servicos" },
      { name: "amount", label: "Valor", type: "number", placeholder: "250.00", required: true },
      { name: "reference_order_id", label: "Ordem ID", type: "number", placeholder: "2026" }
    ],
    columns: ["ID", "Tipo", "Descricao", "Valor", "Categoria"]
  },
  checklists: {
    title: "Checklists",
    subtitle: "Inspecoes com observacoes e registro fotografico.",
    caption: "Checklists recentes de veiculos.",
    endpoint: "/checklists",
    fields: [
      { name: "vehicle_id", label: "Veiculo ID", type: "number", placeholder: "2026", required: true },
      { name: "incident", label: "Houve sinistro?", type: "checkbox" },
      { name: "notes", label: "Observacoes", type: "text", placeholder: "Detalhes do check" }
    ],
    columns: ["ID", "Veiculo", "Sinistro", "Criado em"]
  },
  admin: {
    title: "Administracao",
    subtitle: "Gerencie acessos e permissões.",
    caption: "Usuarios cadastrados.",
    endpoint: "/users",
    fields: [
      { name: "name", label: "Nome", type: "text", placeholder: "Usuario Admin", required: true },
      { name: "username", label: "Usuario", type: "text", placeholder: "admin", required: true },
      {
        name: "role",
        label: "Perfil",
        type: "select",
        options: [
          { value: "admin", label: "Admin" },
          { value: "supervisor", label: "Supervisor" },
          { value: "operator", label: "Operador" }
        ],
        required: true
      },
      { name: "email", label: "Email", type: "email", placeholder: "admin@email.com" },
      { name: "phone", label: "Telefone", type: "text", placeholder: "(11) 90000-0000" },
      { name: "is_active", label: "Ativo", type: "checkbox" },
      { name: "password", label: "Senha", type: "password", placeholder: "Senha forte", required: true }
    ],
    columns: ["ID", "Nome", "Usuario", "Perfil", "Ativo", "Acoes"]
  }
};

const state = {
  active: "clients",
  data: {},
  filtered: [],
  token: localStorage.getItem(TOKEN_KEY) || "",
  role: localStorage.getItem(ROLE_KEY) || "",
  name: localStorage.getItem(NAME_KEY) || "",
  editing: null,
  activeVehicleId: null
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
  loginError: document.getElementById("login-error"),
  loginCancel: document.getElementById("login-cancel"),
  loginRecover: document.getElementById("login-recover"),
  photoModal: document.getElementById("photo-modal"),
  photoModalTitle: document.getElementById("photo-modal-title"),
  photoModalClose: document.getElementById("photo-close"),
  vehiclePhotosInput: document.getElementById("vehicle-photos-input"),
  vehiclePhotosCaptions: document.getElementById("vehicle-photos-captions"),
  vehiclePhotosUpload: document.getElementById("vehicle-photos-upload"),
  vehiclePhotosList: document.getElementById("vehicle-photos-list"),
  profileButton: document.getElementById("profile"),
  profileModal: document.getElementById("profile-modal"),
  profileClose: document.getElementById("profile-close"),
  profileForm: document.getElementById("profile-form"),
  profileSave: document.getElementById("profile-save"),
  profilePhoto: document.getElementById("profile-photo"),
  profilePhotoUpload: document.getElementById("profile-photo-upload"),
  sessionInfo: document.getElementById("session-info"),
  sessionName: document.getElementById("session-name"),
  sessionRole: document.getElementById("session-role"),
  loginButton: document.getElementById("login-button"),
  logoutButton: document.getElementById("logout-button"),
  userMenu: document.getElementById("user-menu"),
  userMenuTrigger: document.getElementById("user-menu-trigger"),
  userMenuDropdown: document.getElementById("user-menu-dropdown"),
  profileSettings: document.getElementById("profile-settings"),
  profilePageButton: document.getElementById("profile-page"),
  profilePageSection: document.getElementById("profile-page-section"),
  profileName: document.getElementById("profile-name"),
  profileUsername: document.getElementById("profile-username"),
  profileEmail: document.getElementById("profile-email"),
  profilePhone: document.getElementById("profile-phone"),
  profileRole: document.getElementById("profile-role"),
  profilePageForm: document.getElementById("profile-page-form"),
  profilePageSave: document.getElementById("profile-page-save"),
  profilePagePhoto: document.getElementById("profile-page-photo"),
  tablePanel: document.getElementById("table-panel")
};

function authHeaders() {
  if (!state.token) {
    return {};
  }
  return { Authorization: `Bearer ${state.token}` };
}

function setSessionUI() {
  const loggedIn = Boolean(state.token);
  elements.sessionName.textContent = loggedIn ? state.name || "Usuario" : "Visitante";
  elements.sessionRole.textContent = loggedIn ? state.role || "usuario" : "offline";
  elements.logoutButton.style.display = loggedIn ? "" : "none";
  elements.profileButton.style.display = loggedIn ? "" : "none";
  elements.loginButton.style.display = loggedIn ? "none" : "";
  elements.userMenu.style.display = loggedIn ? "" : "none";
}

function forceLogout(message) {
  if (message) {
    alert(message);
  }
  state.token = "";
  state.role = "";
  state.name = "";
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
  showLogin();
  setSessionUI();
  elements.userMenuDropdown.classList.remove("active");
}

async function fetchModuleData(moduleKey) {
  const module = modules[moduleKey];
  const response = await fetch(`${API_BASE}${module.endpoint}`, {
    headers: authHeaders()
  });
  if (response.status === 401) {
    forceLogout("Sessao expirada. Faca login novamente.");
    throw new Error("Sessao expirada");
  }
  if (!response.ok) {
    throw new Error("Falha ao carregar dados");
  }
  const data = await response.json();
  state.data[moduleKey] = data;
  return data;
}

const COLUMN_MAP = {
  ID: "id",
  Nome: "name",
  CPF: "cpf",
  Telefone: "phone",
  Cidade: "city",
  UF: "state",
  Cliente: "client_id",
  Marca: "brand",
  Modelo: "model",
  Placa: "plate",
  Ano: "year",
  CNPJ: "cnpj",
  Categoria: "category",
  Preco: "price",
  Estoque: "stock_qty",
  "Preco base": "base_price",
  Veiculo: "vehicle_id",
  Status: "status",
  Total: "total",
  Tipo: "entry_type",
  Descricao: "description",
  Valor: "amount",
  "Criado em": "created_at",
  Usuario: "username",
  Perfil: "role",
  Ativo: "is_active",
  Acoes: "actions"
};

function normalizeValue(item, key) {
  const mappedKey = COLUMN_MAP[key] || key;
  if (mappedKey === "city" || mappedKey === "state") {
    return item.address ? item.address[mappedKey] : "";
  }
  if (mappedKey === "actions") {
    return "";
  }
  return item[mappedKey] ?? "";
}

function renderTable(moduleKey, data) {
  const module = modules[moduleKey];
  const columns = module.columns;
  const showActions = moduleKey === "vehicles" ? state.role !== "operator" : true;

  const headerRow = `<div class="table__row header">${columns
    .map((col) => `<div class="table__cell">${col}</div>`)
    .join("")}</div>`;

  const rows = data
    .map((item) => {
      const cells = columns
        .map((col) => {
          if (COLUMN_MAP[col] === "actions") {
            if (!showActions) {
              return `<div class="table__cell"></div>`;
            }
            return `<div class="table__cell">
              <div class="table-actions">
                <button class="ghost action-edit" data-id="${item.id}">Editar</button>
                ${moduleKey === "vehicles" ? `<button class="ghost action-photos" data-id="${item.id}">Fotos</button>` : ""}
                <button class="ghost danger action-delete" data-id="${item.id}">Excluir</button>
              </div>
            </div>`;
          }
          return `<div class="table__cell">${normalizeValue(item, col)}</div>`;
        })
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

function showProfilePage(profile) {
  elements.profilePageSection.classList.add("active");
  elements.profileName.textContent = profile.name || "-";
  elements.profileUsername.textContent = profile.username || "-";
  elements.profileEmail.textContent = profile.email || "-";
  elements.profilePhone.textContent = profile.phone || "-";
  elements.profileRole.textContent = profile.role || "-";
  elements.profilePageForm.querySelector("[name='name']").value = profile.name || "";
  elements.profilePageForm.querySelector("[name='email']").value = profile.email || "";
  elements.profilePageForm.querySelector("[name='phone']").value = profile.phone || "";
  elements.profilePageForm.querySelector("[name='new_password']").value = "";
}

function hideProfilePage() {
  elements.profilePageSection.classList.remove("active");
}

function applyPermissions() {
  elements.navItems.forEach((item) => {
    if (item.dataset.module === "admin" && state.role !== "admin") {
      item.style.display = "none";
    }
  });

  const createDisabled = state.active === "vehicles" && state.role === "operator";
  elements.create.style.display = createDisabled ? "none" : "";
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
    if (field.placeholder) {
      input.placeholder = field.placeholder;
    }
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

  if (moduleKey === "vehicles") {
    const wrapper = document.createElement("div");
    wrapper.classList.add("form__full");
    const label = document.createElement("label");
    label.textContent = "Fotos do veiculo (min 4, max 10)";
    const input = document.createElement("input");
    input.type = "file";
    input.name = "vehicle_photos";
    input.accept = "image/*";
    input.multiple = true;
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    const captions = document.createElement("div");
    captions.classList.add("photo-captions");
    wrapper.appendChild(captions);
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
    } else if (key !== "photos" && key !== "vehicle_photos" && value !== "") {
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
  const response = await fetch(`${API_BASE}${modules[moduleKey].endpoint}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    forceLogout("Sessao expirada. Faca login novamente.");
    throw new Error("Sessao expirada");
  }
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

async function uploadVehiclePhotos(vehicleId, files, captions) {
  const uploads = Array.from(files || []);
  if (!uploads.length) {
    return;
  }
  const formData = new FormData();
  uploads.forEach((file) => formData.append("files", file));
  captions.forEach((caption) => formData.append("captions", caption));
  const response = await fetch(`${API_BASE}/vehicles/${vehicleId}/photos`, {
    method: "POST",
    headers: authHeaders(),
    body: formData
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao enviar fotos do veiculo");
  }
}

async function updateRecord(moduleKey, id, payload) {
  const response = await fetch(`${API_BASE}${modules[moduleKey].endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Falha ao atualizar registro");
  }
  return response.json();
}

async function deleteRecord(moduleKey, id) {
  const response = await fetch(`${API_BASE}${modules[moduleKey].endpoint}/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao excluir registro");
  }
}

async function fetchProfile() {
  const response = await fetch(`${API_BASE}/users/me`, {
    headers: authHeaders()
  });
  if (response.status === 401) {
    forceLogout("Sessao expirada. Faca login novamente.");
    throw new Error("Sessao expirada");
  }
  if (!response.ok) {
    throw new Error("Falha ao carregar perfil");
  }
  const data = await response.json();
  state.name = data.name || data.username || "";
  state.role = data.role || state.role;
  localStorage.setItem(NAME_KEY, state.name);
  localStorage.setItem(ROLE_KEY, state.role);
  setSessionUI();
  return data;
}

async function updateProfile(payload) {
  const response = await fetch(`${API_BASE}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao atualizar perfil");
  }
  return response.json();
}

async function uploadProfilePhoto(file) {
  if (!file) {
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE}/users/me/photo`, {
    method: "POST",
    headers: authHeaders(),
    body: formData
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao enviar foto do perfil");
  }
  return response.json();
}

function fillForm(values) {
  Object.entries(values).forEach(([key, value]) => {
    const input = elements.form.querySelector(`[name="${key}"]`);
    if (!input) {
      return;
    }
    if (input.type === "checkbox") {
      input.checked = Boolean(value);
    } else {
      input.value = value ?? "";
    }
  });
}

async function fetchVehiclePhotos(vehicleId) {
  const response = await fetch(`${API_BASE}/vehicles/${vehicleId}/photos`, {
    headers: authHeaders()
  });
  if (!response.ok) {
    throw new Error("Falha ao carregar fotos do veiculo");
  }
  return response.json();
}

async function updateVehiclePhoto(photoId, caption) {
  const response = await fetch(`${API_BASE}/vehicles/photos/${photoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ caption })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao atualizar foto");
  }
}

async function deleteVehiclePhoto(photoId) {
  const response = await fetch(`${API_BASE}/vehicles/photos/${photoId}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Falha ao excluir foto");
  }
}

async function openVehiclePhotos(vehicleId) {
  state.activeVehicleId = vehicleId;
  elements.photoModal.classList.add("active");
  elements.photoModalTitle.textContent = `Fotos do veiculo #${vehicleId}`;
  await refreshVehiclePhotos();
}

function closeVehiclePhotos() {
  elements.photoModal.classList.remove("active");
  elements.vehiclePhotosInput.value = "";
  elements.vehiclePhotosCaptions.innerHTML = "";
  elements.vehiclePhotosList.innerHTML = "";
  state.activeVehicleId = null;
}

async function refreshVehiclePhotos() {
  if (!state.activeVehicleId) {
    return;
  }
  const photos = await fetchVehiclePhotos(state.activeVehicleId);
  elements.vehiclePhotosList.innerHTML = photos
    .map(
      (photo) => `
        <div class="photo-item" data-photo-id="${photo.id}">
          <img src="${API_BASE}${photo.file_path}" alt="foto do veiculo" />
          <div>
            <label>Descricao</label>
            <input type="text" value="${photo.caption || ""}" />
            <div class="photo-actions">
              <button class="ghost action-photo-save">Atualizar</button>
              <button class="ghost danger action-photo-delete">Excluir</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");
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
  localStorage.setItem(ROLE_KEY, data.role || "");
  localStorage.setItem(NAME_KEY, data.name || data.username || "");
  state.name = data.name || data.username || "";
  return data;
}

function openProfileModal() {
  elements.profileModal.classList.add("active");
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
  if (moduleKey === "admin" && state.role !== "admin") {
    alert("Acesso restrito ao administrador.");
    return;
  }
  if (moduleKey === "profile") {
    elements.moduleTitle.textContent = "Perfil";
    elements.moduleSubtitle.textContent = "Dados da sessao e configuracoes do usuario.";
    elements.tableTitle.textContent = "";
    elements.tableCaption.textContent = "";
    const profile = await fetchProfile();
    showProfilePage(profile);
    elements.table.innerHTML = "";
    elements.search.value = "";
    elements.tablePanel.style.display = "none";
    return;
  }
  elements.tablePanel.style.display = "";
  hideProfilePage();
  setHeader(moduleKey);
  const data = await fetchModuleData(moduleKey);
  state.filtered = data;
  renderTable(moduleKey, data);
  applyPermissions();
  updateStats();
}

function openModal() {
  elements.modal.classList.add("active");
  elements.modalTitle.textContent = state.editing
    ? `Editar ${modules[state.active].title}`
    : `Novo ${modules[state.active].title}`;
  buildForm(state.active);

  if (state.active === "admin" && state.editing) {
    const passwordInput = elements.form.querySelector("input[name='password']");
    if (passwordInput) {
      passwordInput.parentElement.remove();
    }
  }
}

function closeModal() {
  elements.modal.classList.remove("active");
  elements.form.reset();
  state.editing = null;
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

  applyPermissions();

  elements.refresh.addEventListener("click", () => loadModule(state.active));
  elements.create.addEventListener("click", openModal);
  elements.close.addEventListener("click", closeModal);
  elements.cancel.addEventListener("click", closeModal);
  elements.search.addEventListener("input", (event) => filterTable(event.target.value));

  elements.table.addEventListener("click", async (event) => {
    const editBtn = event.target.closest(".action-edit");
    const deleteBtn = event.target.closest(".action-delete");
    const photosBtn = event.target.closest(".action-photos");
    if (!editBtn && !deleteBtn && !photosBtn) {
      return;
    }
    const id = Number((editBtn || deleteBtn || photosBtn).dataset.id);
    if (!id) {
      return;
    }
    if (photosBtn) {
      if (state.active === "vehicles") {
        await openVehiclePhotos(id);
      }
      return;
    }
    if (deleteBtn) {
      if (!confirm("Deseja excluir este registro?")) {
        return;
      }
      try {
        await deleteRecord(state.active, id);
        await loadModule(state.active);
      } catch (error) {
        alert(error.message);
      }
      return;
    }
    if (editBtn) {
      const current = (state.data[state.active] || []).find((item) => item.id === id);
      if (!current) {
        return;
      }
      state.editing = id;
      openModal();
      const editable = { ...current };
      delete editable.id;
      fillForm(editable);
    }
  });

  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const payload = parseFormData(elements.form);
      if (state.active === "orders") {
        payload.items = [];
      }
      if (state.active === "vehicles" && !state.editing) {
        const photosInput = elements.form.querySelector("input[name='vehicle_photos']");
        const count = photosInput?.files?.length || 0;
        if (count < 4 || count > 10) {
          alert("Envie entre 4 e 10 fotos do veiculo.");
          return;
        }
      }
      let record;
  if (state.editing) {
        if (state.active === "admin") {
          const passwordField = payload.password;
          delete payload.password;
          if (passwordField) {
            payload.new_password = passwordField;
          }
        }
        record = await updateRecord(state.active, state.editing, payload);
      } else {
        record = await createRecord(state.active, payload);
      }
      if (!state.editing && state.active === "checklists") {
        const photosInput = elements.form.querySelector("input[name='photos']");
        await uploadChecklistPhotos(record.id, photosInput?.files);
      }
      if (!state.editing && state.active === "vehicles") {
        const photosInput = elements.form.querySelector("input[name='vehicle_photos']");
        const captions = Array.from(elements.form.querySelectorAll("[data-caption-index]")).map(
          (input) => input.value
        );
        await uploadVehiclePhotos(record.id, photosInput?.files, captions);
      }
      closeModal();
      await loadModule(state.active);
    } catch (error) {
      alert(error.message);
    }
  });

  elements.form.addEventListener("change", (event) => {
    if (event.target?.name !== "vehicle_photos") {
      return;
    }
    const container = elements.form.querySelector(".photo-captions");
    if (!container) {
      return;
    }
    container.innerHTML = "";
    const files = Array.from(event.target.files || []).slice(0, 10);
    files.forEach((file, index) => {
      const group = document.createElement("div");
      group.classList.add("photo-caption");
      const label = document.createElement("label");
      label.textContent = `Descricao da foto ${index + 1} (${file.name})`;
      const input = document.createElement("input");
      input.type = "text";
      input.dataset.captionIndex = String(index);
      group.appendChild(label);
      group.appendChild(input);
      container.appendChild(group);
    });
  });

  elements.photoModalClose.addEventListener("click", closeVehiclePhotos);

  elements.vehiclePhotosInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []).slice(0, 10);
    elements.vehiclePhotosCaptions.innerHTML = "";
    files.forEach((file, index) => {
      const group = document.createElement("div");
      group.classList.add("photo-caption");
      const label = document.createElement("label");
      label.textContent = `Descricao da foto ${index + 1} (${file.name})`;
      const input = document.createElement("input");
      input.type = "text";
      input.dataset.captionIndex = String(index);
      group.appendChild(label);
      group.appendChild(input);
      elements.vehiclePhotosCaptions.appendChild(group);
    });
  });

  elements.vehiclePhotosUpload.addEventListener("click", async () => {
    if (!state.activeVehicleId) {
      return;
    }
    const files = elements.vehiclePhotosInput.files;
    const captions = Array.from(elements.vehiclePhotosCaptions.querySelectorAll("[data-caption-index]")).map(
      (input) => input.value
    );
    try {
      await uploadVehiclePhotos(state.activeVehicleId, files, captions);
      elements.vehiclePhotosInput.value = "";
      elements.vehiclePhotosCaptions.innerHTML = "";
      await refreshVehiclePhotos();
    } catch (error) {
      alert(error.message);
    }
  });

  elements.vehiclePhotosList.addEventListener("click", async (event) => {
    const saveBtn = event.target.closest(".action-photo-save");
    const deleteBtn = event.target.closest(".action-photo-delete");
    if (!saveBtn && !deleteBtn) {
      return;
    }
    const item = event.target.closest(".photo-item");
    const photoId = Number(item?.dataset.photoId);
    if (!photoId) {
      return;
    }
    try {
      if (saveBtn) {
        const caption = item.querySelector("input")?.value || "";
        await updateVehiclePhoto(photoId, caption);
      }
      if (deleteBtn) {
        if (!confirm("Deseja excluir esta foto?")) {
          return;
        }
        await deleteVehiclePhoto(photoId);
      }
      await refreshVehiclePhotos();
    } catch (error) {
      alert(error.message);
    }
  });

  elements.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    elements.loginError.textContent = "";
    const formData = new FormData(elements.loginForm);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const data = await login(username, password);
      state.role = data.role;
      state.name = data.name || data.username || "";
      localStorage.setItem(ROLE_KEY, data.role);
      localStorage.setItem(NAME_KEY, state.name);
      hideLogin();
      setSessionUI();
      await boot();
    } catch (error) {
      elements.loginError.textContent = error.message;
    }
  });

  elements.loginCancel.addEventListener("click", () => {
    elements.login.classList.add("hidden");
  });

  elements.loginRecover.addEventListener("click", () => {
    alert("Recuperacao de senha: contate o administrador para redefinir sua senha.");
  });

  elements.loginButton.addEventListener("click", showLogin);

  elements.logoutButton.addEventListener("click", async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: authHeaders()
      });
    } catch (error) {
      // ignore
    } finally {
      forceLogout();
    }
  });

  elements.userMenuTrigger.addEventListener("click", () => {
    elements.userMenuDropdown.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (!elements.userMenu.contains(event.target)) {
      elements.userMenuDropdown.classList.remove("active");
    }
  });

  elements.profileButton.addEventListener("click", async () => {
    try {
      const profile = await fetchProfile();
      const form = elements.profileForm;
      form.querySelector("[name='name']").value = profile.name || "";
      form.querySelector("[name='email']").value = profile.email || "";
      form.querySelector("[name='phone']").value = profile.phone || "";
      form.querySelector("[name='new_password']").value = "";
      openProfileModal();
    } catch (error) {
      alert(error.message);
    }
  });

  elements.profileSettings.addEventListener("click", async () => {
    elements.userMenuDropdown.classList.remove("active");
    try {
      const profile = await fetchProfile();
      const form = elements.profileForm;
      form.querySelector("[name='name']").value = profile.name || "";
      form.querySelector("[name='email']").value = profile.email || "";
      form.querySelector("[name='phone']").value = profile.phone || "";
      form.querySelector("[name='new_password']").value = "";
      openProfileModal();
    } catch (error) {
      alert(error.message);
    }
  });

  elements.profilePageButton.addEventListener("click", async () => {
    try {
      await loadModule("profile");
      elements.userMenuDropdown.classList.remove("active");
    } catch (error) {
      alert(error.message);
    }
  });

  elements.profileClose.addEventListener("click", () => {
    elements.profileModal.classList.remove("active");
  });

  elements.profileSave.addEventListener("click", async () => {
    const formData = new FormData(elements.profileForm);
    const payload = Object.fromEntries(formData.entries());
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") {
        delete payload[key];
      }
    });
    try {
      await updateProfile(payload);
      elements.profileModal.classList.remove("active");
    } catch (error) {
      alert(error.message);
    }
  });

  elements.profilePageSave.addEventListener("click", async () => {
    const formData = new FormData(elements.profilePageForm);
    const payload = Object.fromEntries(formData.entries());
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") {
        delete payload[key];
      }
    });
    try {
      const profile = await updateProfile(payload);
      showProfilePage(profile);
    } catch (error) {
      alert(error.message);
    }
  });

  elements.profilePagePhoto.addEventListener("click", () => {
    elements.profileModal.classList.add("active");
  });

  elements.profilePhotoUpload.addEventListener("click", async () => {
    try {
      const file = elements.profilePhoto.files?.[0];
      const profile = await uploadProfilePhoto(file);
      showProfilePage(profile);
      alert("Foto atualizada");
    } catch (error) {
      alert(error.message);
    }
  });
}

async function boot() {
  if (!state.token) {
    showLogin();
    setSessionUI();
    return;
  }
  if (!state.role) {
    state.role = localStorage.getItem(ROLE_KEY) || "";
  }
  if (!state.name) {
    state.name = localStorage.getItem(NAME_KEY) || "";
  }
  hideLogin();
  applyPermissions();
  setSessionUI();
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
