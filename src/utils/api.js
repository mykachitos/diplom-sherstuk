import { API_BASE_URL } from "../constants/data";
import { LOCAL_CATEGORIES, LOCAL_PRODUCTS } from "../constants/localCatalog";
import { resolveProductImage } from "./productImages";
import { getFromStorage, setToStorage } from "./storage";

const USE_REMOTE_API = process.env.REACT_APP_USE_REMOTE_API === "true";

const PRODUCTS_KEY = "sweethand_products";
const USERS_KEY = "sweethand_users";
const SESSIONS_KEY = "sweethand_sessions";
const FEEDBACK_KEY = "sweethand_feedback";

const DEMO_ADMIN = {
  id: 1,
  name: "Администратор SweetHand",
  email: "admin@sweethand.local",
  phone: "+7 (999) 000-00-01",
  password: "admin123",
  isAdmin: true,
  date_joined: "2026-06-01T10:00:00.000Z",
  favoriteIds: [],
  orders: [],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function wait(ms = 120) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });
}

function buildUrl(path, params) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== false) {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

async function request(path, { method = "GET", token, body, params } = {}) {
  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const detail =
      data?.detail ||
      data?.non_field_errors?.[0] ||
      Object.values(data || {}).flat()[0] ||
      "Не удалось выполнить запрос.";
    throw new Error(detail);
  }

  return data;
}

function normalizeProduct(item) {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    originalPrice: item.original_price ? Number(item.original_price) : item.originalPrice || null,
    weight: item.weight,
    imageUrl: resolveProductImage(item),
    badge: item.badge || "",
    badgeLabel: item.badge_label || item.badgeLabel || "",
    allergens: item.allergens,
    isMonthPick: item.is_month_pick ?? item.isMonthPick ?? false,
    discountPercent: item.discount_percent ?? item.discountPercent ?? 0,
    hasDiscount: item.has_discount ?? item.hasDiscount ?? false,
    isFavorite: item.is_favorite ?? item.isFavorite ?? false,
    category: item.category,
  };
}

function normalizeOrder(order) {
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    deliveryMethod: order.delivery_method || order.deliveryMethod,
    contactName: order.contact_name || order.contactName,
    phone: order.phone,
    address: order.address,
    comment: order.comment,
    subtotal: Number(order.subtotal),
    deliveryPrice: Number(order.delivery_price || order.deliveryPrice || 0),
    total: Number(order.total),
    personalDataConsent: order.personal_data_consent ?? order.personalDataConsent,
    createdAt: order.created_at || order.createdAt,
    items: order.items.map(item => ({
      id: item.id,
      productId: item.product || item.productId,
      name: item.product_name || item.name,
      price: Number(item.product_price || item.price),
      weight: item.product_weight || item.weight,
      imageUrl: resolveProductImage(item),
      qty: item.quantity || item.qty,
    })),
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function createToken() {
  if (window.crypto?.randomUUID) {
    return `local-${window.crypto.randomUUID()}`;
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function buildOrderNumber(orderId) {
  return `SH-${String(orderId).padStart(4, "0")}`;
}

function categoryMap() {
  return new Map(LOCAL_CATEGORIES.map(category => [category.slug, category]));
}

function computeProductShape(item) {
  const categoriesBySlug = categoryMap();
  const categorySlug = item.category?.slug || item.categorySlug || "cakes";
  const category = categoriesBySlug.get(categorySlug) || LOCAL_CATEGORIES[0];
  const price = Number(item.price) || 0;
  const originalPrice = Number(item.originalPrice || item.original_price) || 0;
  const discountPercent =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return {
    id: item.id,
    slug: item.slug || slugify(item.name) || `product-${item.id}`,
    name: item.name,
    description: item.description || "",
    price,
    originalPrice: originalPrice > 0 ? originalPrice : null,
    weight: item.weight || "",
    imageUrl: item.imageUrl || item.image_url || "",
    badge: item.badge || "",
    badgeLabel:
      item.badgeLabel ||
      item.badge_label ||
      (item.badge === "hit" ? "Хит" : item.badge === "new" ? "Новинка" : ""),
    allergens: item.allergens || "",
    isMonthPick: Boolean(item.isMonthPick ?? item.is_month_pick),
    discountPercent,
    hasDiscount: discountPercent > 0,
    isFavorite: false,
    category,
  };
}

function getProducts() {
  const stored = getFromStorage(PRODUCTS_KEY, null);
  if (!stored?.length) {
    const seeded = LOCAL_PRODUCTS.map(product => computeProductShape(product));
    setToStorage(PRODUCTS_KEY, seeded);
    return seeded;
  }
  return stored.map(product => computeProductShape(product));
}

function saveProducts(products) {
  setToStorage(
    PRODUCTS_KEY,
    products.map(product => computeProductShape(product))
  );
}

function getCategoriesWithCounts(products = getProducts()) {
  const counts = products.reduce((acc, product) => {
    const slug = product.category?.slug;
    acc[slug] = (acc[slug] || 0) + 1;
    return acc;
  }, {});

  return LOCAL_CATEGORIES.map(category => ({
    ...category,
    product_count: counts[category.slug] || 0,
  }));
}

function getUsers() {
  const stored = getFromStorage(USERS_KEY, null);
  if (!stored?.length) {
    setToStorage(USERS_KEY, [DEMO_ADMIN]);
    return [clone(DEMO_ADMIN)];
  }

  const hasAdmin = stored.some(user => user.isAdmin);
  if (hasAdmin) {
    return stored;
  }

  const nextUsers = [clone(DEMO_ADMIN), ...stored.map(user => ({ ...user, id: user.id + 1 }))];
  setToStorage(USERS_KEY, nextUsers);
  return nextUsers;
}

function saveUsers(users) {
  setToStorage(USERS_KEY, users);
}

function getSessions() {
  return getFromStorage(SESSIONS_KEY, {});
}

function saveSessions(sessions) {
  setToStorage(SESSIONS_KEY, sessions);
}

function getFeedbackMessages() {
  return getFromStorage(FEEDBACK_KEY, []);
}

function saveFeedbackMessages(messages) {
  setToStorage(FEEDBACK_KEY, messages);
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    date_joined: user.date_joined,
    isAdmin: Boolean(user.isAdmin),
  };
}

function replaceUser(nextUser) {
  const users = getUsers();
  saveUsers(users.map(user => (user.id === nextUser.id ? nextUser : user)));
}

function requireUserByToken(token) {
  if (!token) {
    throw new Error("Войдите в аккаунт, чтобы продолжить.");
  }

  const sessions = getSessions();
  const userId = sessions[token];
  if (!userId) {
    throw new Error("Сессия истекла. Войдите снова.");
  }

  const user = getUsers().find(item => item.id === userId);
  if (!user) {
    throw new Error("Пользователь не найден.");
  }

  return user;
}

function requireAdminByToken(token) {
  const user = requireUserByToken(token);
  if (!user.isAdmin) {
    throw new Error("Только администратор может открывать эту страницу.");
  }
  return user;
}

function allOrdersWithUsers() {
  return getUsers()
    .flatMap(user =>
      (user.orders || []).map(order => ({
        ...clone(order),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      }))
    )
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

async function localFetchCategories() {
  await wait();
  return getCategoriesWithCounts();
}

async function localFetchProducts(params) {
  await wait();

  let products = getProducts();
  if (params?.category) {
    products = products.filter(product => product.category?.slug === params.category);
  }

  return products.map(product => ({ ...product, imageUrl: resolveProductImage(product) }));
}

async function localRegisterUser(payload) {
  await wait();

  const email = normalizeEmail(payload.email);
  const users = getUsers();

  if (!payload.name?.trim()) {
    throw new Error("Укажите имя.");
  }
  if (!email) {
    throw new Error("Укажите email.");
  }
  if ((payload.password || "").length < 6) {
    throw new Error("Пароль должен содержать минимум 6 символов.");
  }
  if (users.some(user => normalizeEmail(user.email) === email)) {
    throw new Error("Пользователь с таким email уже зарегистрирован.");
  }

  const user = {
    id: nextId(users),
    name: payload.name.trim(),
    phone: String(payload.phone || "").trim(),
    email,
    password: payload.password,
    date_joined: new Date().toISOString(),
    favoriteIds: [],
    orders: [],
    isAdmin: false,
  };

  const token = createToken();
  saveUsers([...users, user]);
  saveSessions({ ...getSessions(), [token]: user.id });

  return { token, user: sanitizeUser(user) };
}

async function localLoginUser(payload) {
  await wait();

  const email = normalizeEmail(payload.email);
  const user = getUsers().find(
    item => normalizeEmail(item.email) === email && item.password === payload.password
  );

  if (!user) {
    throw new Error("Неверный email или пароль.");
  }

  const token = createToken();
  saveSessions({ ...getSessions(), [token]: user.id });

  return { token, user: sanitizeUser(user) };
}

async function localLogoutUser(token) {
  await wait(80);
  const sessions = getSessions();
  if (!sessions[token]) {
    return { ok: true };
  }

  const nextSessions = { ...sessions };
  delete nextSessions[token];
  saveSessions(nextSessions);
  return { ok: true };
}

async function localFetchCurrentUser(token) {
  await wait();
  return sanitizeUser(requireUserByToken(token));
}

async function localUpdateProfile(token, payload) {
  await wait();

  const user = requireUserByToken(token);
  const nextUser = {
    ...user,
    name: String(payload.name || "").trim() || user.name,
    phone: String(payload.phone || "").trim(),
  };

  replaceUser(nextUser);
  return sanitizeUser(nextUser);
}

async function localFetchFavorites(token) {
  await wait();

  const user = requireUserByToken(token);
  const productMap = new Map(getProducts().map(product => [product.id, product]));

  return user.favoriteIds
    .map(productId => productMap.get(productId))
    .filter(Boolean)
    .map(product => ({ ...product, imageUrl: resolveProductImage(product) }));
}

async function localAddFavorite(token, productId) {
  await wait(80);

  const user = requireUserByToken(token);
  const product = getProducts().find(item => item.id === productId);

  if (!product) {
    throw new Error("Товар не найден.");
  }

  if (!user.favoriteIds.includes(productId)) {
    replaceUser({
      ...user,
      favoriteIds: [productId, ...user.favoriteIds],
    });
  }

  return { ...product, imageUrl: resolveProductImage(product) };
}

async function localRemoveFavorite(token, productId) {
  await wait(80);

  const user = requireUserByToken(token);
  replaceUser({
    ...user,
    favoriteIds: user.favoriteIds.filter(id => id !== productId),
  });

  return { ok: true };
}

async function localFetchOrders(token) {
  await wait();

  const user = requireUserByToken(token);
  return clone(user.orders).sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

async function localCreateOrder(token, payload) {
  await wait(150);

  const user = requireUserByToken(token);
  const productMap = new Map(getProducts().map(product => [product.id, product]));
  const requestedItems = payload.items || [];

  if (!requestedItems.length) {
    throw new Error("Корзина пуста.");
  }

  const items = requestedItems.map((item, index) => {
    const product = productMap.get(item.product_id);
    if (!product) {
      throw new Error("Один из товаров больше недоступен.");
    }

    return {
      id: Date.now() + index,
      productId: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      imageUrl: resolveProductImage(product),
      qty: item.quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryPrice = payload.delivery_method === "delivery" ? 300 : 0;
  const total = subtotal + deliveryPrice;
  const orderId = nextId(user.orders);

  const order = {
    id: orderId,
    number: buildOrderNumber(orderId),
    status: "new",
    deliveryMethod: payload.delivery_method,
    contactName: payload.contact_name,
    phone: payload.phone,
    address: payload.address || "",
    comment: payload.comment || "",
    subtotal,
    deliveryPrice,
    total,
    personalDataConsent: Boolean(payload.personal_data_consent),
    createdAt: new Date().toISOString(),
    items,
  };

  replaceUser({
    ...user,
    orders: [order, ...user.orders],
  });

  return clone(order);
}

async function localSendFeedback(payload) {
  await wait(120);

  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    throw new Error("Заполните форму полностью.");
  }
  if (!payload.personal_data_consent) {
    throw new Error("Нужно согласие на обработку персональных данных.");
  }

  const currentMessages = getFeedbackMessages();
  const message = {
    id: nextId(currentMessages),
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: String(payload.phone || "").trim(),
    message: payload.message.trim(),
    personal_data_consent: true,
    created_at: new Date().toISOString(),
  };

  saveFeedbackMessages([message, ...currentMessages]);
  return { ok: true };
}

async function localFetchAdminDashboard(token) {
  await wait(120);
  requireAdminByToken(token);

  const products = getProducts().map(product => ({
    ...product,
    imageUrl: resolveProductImage(product),
  }));
  const users = getUsers().map(user => ({
    ...sanitizeUser(user),
    favoritesCount: user.favoriteIds.length,
    ordersCount: user.orders.length,
    totalSpent: user.orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
  }));
  const orders = allOrdersWithUsers();
  const feedback = getFeedbackMessages().sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  );

  return {
    categories: getCategoriesWithCounts(products),
    products,
    users,
    orders,
    feedback,
  };
}

async function localSaveAdminProduct(token, payload) {
  await wait(120);
  requireAdminByToken(token);

  if (!payload.name?.trim()) {
    throw new Error("Укажите название товара.");
  }

  const products = getProducts();
  const currentId = payload.id ? Number(payload.id) : nextId(products);
  const category = LOCAL_CATEGORIES.find(item => item.slug === payload.categorySlug) || LOCAL_CATEGORIES[0];
  const nextProduct = computeProductShape({
    id: currentId,
    slug: payload.slug || slugify(payload.name) || `product-${currentId}`,
    name: payload.name.trim(),
    description: payload.description?.trim() || "",
    price: payload.price,
    originalPrice: payload.originalPrice,
    weight: payload.weight?.trim() || "",
    imageUrl: payload.imageUrl?.trim() || "",
    badge: payload.badge || "",
    badgeLabel:
      payload.badgeLabel?.trim() ||
      (payload.badge === "hit" ? "Хит" : payload.badge === "new" ? "Новинка" : ""),
    allergens: payload.allergens?.trim() || "",
    isMonthPick: payload.isMonthPick,
    category,
  });

  const nextProducts = payload.id
    ? products.map(product => (product.id === currentId ? nextProduct : product))
    : [nextProduct, ...products];

  saveProducts(nextProducts);
  return { ...nextProduct, imageUrl: resolveProductImage(nextProduct) };
}

async function localDeleteAdminProduct(token, productId) {
  await wait(100);
  requireAdminByToken(token);

  const nextProducts = getProducts().filter(product => product.id !== productId);
  saveProducts(nextProducts);

  const cleanedUsers = getUsers().map(user => ({
    ...user,
    favoriteIds: user.favoriteIds.filter(id => id !== productId),
  }));
  saveUsers(cleanedUsers);

  return { ok: true };
}

async function localSaveAdminUser(token, payload) {
  const adminUser = requireAdminByToken(token);
  await wait(120);

  const users = getUsers();
  const target = users.find(user => user.id === payload.id);
  if (!target) {
    throw new Error("Пользователь не найден.");
  }

  const email = normalizeEmail(payload.email);
  if (!payload.name?.trim()) {
    throw new Error("Укажите имя пользователя.");
  }
  if (!email) {
    throw new Error("Укажите email пользователя.");
  }
  if (users.some(user => user.id !== target.id && normalizeEmail(user.email) === email)) {
    throw new Error("Такой email уже используется.");
  }

  const nextUser = {
    ...target,
    name: payload.name.trim(),
    phone: String(payload.phone || "").trim(),
    email,
    isAdmin: Boolean(payload.isAdmin),
  };

  if (target.id === adminUser.id && !nextUser.isAdmin) {
    throw new Error("Нельзя снять роль администратора у текущего аккаунта.");
  }

  replaceUser(nextUser);
  return sanitizeUser(nextUser);
}

async function localDeleteAdminUser(token, userId) {
  const adminUser = requireAdminByToken(token);
  await wait(100);

  if (adminUser.id === userId) {
    throw new Error("Нельзя удалить текущего администратора.");
  }

  const users = getUsers();
  const nextUsers = users.filter(user => user.id !== userId);
  saveUsers(nextUsers);

  const sessions = getSessions();
  const nextSessions = Object.fromEntries(
    Object.entries(sessions).filter(([, sessionUserId]) => sessionUserId !== userId)
  );
  saveSessions(nextSessions);

  return { ok: true };
}

async function localUpdateAdminOrderStatus(token, userId, orderId, status) {
  await wait(80);
  requireAdminByToken(token);

  const users = getUsers();
  const user = users.find(item => item.id === userId);
  if (!user) {
    throw new Error("Пользователь заказа не найден.");
  }

  const nextOrders = user.orders.map(order =>
    order.id === orderId ? { ...order, status } : order
  );
  replaceUser({ ...user, orders: nextOrders });
  return { ok: true };
}

function remoteAdminUnavailable() {
  throw new Error("Фейк-админка доступна только в локальном режиме без backend.");
}

export async function fetchCategories() {
  if (USE_REMOTE_API) {
    return request("/catalog/categories/");
  }
  return localFetchCategories();
}

export async function fetchProducts(params) {
  if (USE_REMOTE_API) {
    const products = await request("/catalog/products/", { params });
    return products.map(normalizeProduct);
  }
  return localFetchProducts(params);
}

export async function registerUser(payload) {
  if (USE_REMOTE_API) {
    const data = await request("/auth/register/", { method: "POST", body: payload });
    return { token: data.token, user: data.user };
  }
  return localRegisterUser(payload);
}

export async function loginUser(payload) {
  if (USE_REMOTE_API) {
    const data = await request("/auth/login/", { method: "POST", body: payload });
    return { token: data.token, user: data.user };
  }
  return localLoginUser(payload);
}

export async function logoutUser(token) {
  if (USE_REMOTE_API) {
    return request("/auth/logout/", { method: "POST", token });
  }
  return localLogoutUser(token);
}

export async function fetchCurrentUser(token) {
  if (USE_REMOTE_API) {
    return request("/auth/me/", { token });
  }
  return localFetchCurrentUser(token);
}

export async function updateProfile(token, payload) {
  if (USE_REMOTE_API) {
    return request("/auth/me/", { method: "PATCH", token, body: payload });
  }
  return localUpdateProfile(token, payload);
}

export async function fetchFavorites(token) {
  if (USE_REMOTE_API) {
    const favorites = await request("/catalog/favorites/", { token });
    return favorites.map(item => normalizeProduct(item.product));
  }
  return localFetchFavorites(token);
}

export async function addFavorite(token, productId) {
  if (USE_REMOTE_API) {
    const favorite = await request("/catalog/favorites/", {
      method: "POST",
      token,
      body: { product_id: productId },
    });
    return normalizeProduct(favorite.product);
  }
  return localAddFavorite(token, productId);
}

export async function removeFavorite(token, productId) {
  if (USE_REMOTE_API) {
    return request(`/catalog/favorites/${productId}/`, { method: "DELETE", token });
  }
  return localRemoveFavorite(token, productId);
}

export async function fetchOrders(token) {
  if (USE_REMOTE_API) {
    const orders = await request("/orders/", { token });
    return orders.map(normalizeOrder);
  }
  return localFetchOrders(token);
}

export async function createOrder(token, payload) {
  if (USE_REMOTE_API) {
    const order = await request("/orders/", { method: "POST", token, body: payload });
    return normalizeOrder(order);
  }
  return localCreateOrder(token, payload);
}

export async function sendFeedback(payload) {
  if (USE_REMOTE_API) {
    return request("/feedback/", { method: "POST", body: payload });
  }
  return localSendFeedback(payload);
}

export async function fetchAdminDashboard(token) {
  if (USE_REMOTE_API) {
    return remoteAdminUnavailable();
  }
  return localFetchAdminDashboard(token);
}

export async function saveAdminProduct(token, payload) {
  if (USE_REMOTE_API) {
    return remoteAdminUnavailable();
  }
  return localSaveAdminProduct(token, payload);
}

export async function deleteAdminProduct(token, productId) {
  if (USE_REMOTE_API) {
    return remoteAdminUnavailable();
  }
  return localDeleteAdminProduct(token, productId);
}

export async function saveAdminUser(token, payload) {
  if (USE_REMOTE_API) {
    return remoteAdminUnavailable();
  }
  return localSaveAdminUser(token, payload);
}

export async function deleteAdminUser(token, userId) {
  if (USE_REMOTE_API) {
    return remoteAdminUnavailable();
  }
  return localDeleteAdminUser(token, userId);
}

export async function updateAdminOrderStatus(token, userId, orderId, status) {
  if (USE_REMOTE_API) {
    return remoteAdminUnavailable();
  }
  return localUpdateAdminOrderStatus(token, userId, orderId, status);
}
