import { useEffect, useMemo, useState } from "react";
import { ORDER_STATUS_LABELS, PRODUCT_BADGE_LABELS } from "../constants/data";
import { formatDate, formatMoney } from "../utils/format";

const EMPTY_PRODUCT = {
  id: null,
  name: "",
  slug: "",
  description: "",
  price: "",
  originalPrice: "",
  weight: "",
  imageUrl: "",
  badge: "",
  badgeLabel: "",
  allergens: "",
  isMonthPick: false,
  categorySlug: "cakes",
};

const EMPTY_USER = {
  id: null,
  name: "",
  email: "",
  phone: "",
  isAdmin: false,
};

function buildProductForm(product) {
  if (!product) {
    return EMPTY_PRODUCT;
  }

  return {
    id: product.id,
    name: product.name || "",
    slug: product.slug || "",
    description: product.description || "",
    price: product.price || "",
    originalPrice: product.originalPrice || "",
    weight: product.weight || "",
    imageUrl: product.imageUrl || "",
    badge: product.badge || "",
    badgeLabel: product.badgeLabel || "",
    allergens: product.allergens || "",
    isMonthPick: Boolean(product.isMonthPick),
    categorySlug: product.category?.slug || "cakes",
  };
}

function buildUserForm(user) {
  if (!user) {
    return EMPTY_USER;
  }

  return {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    isAdmin: Boolean(user.isAdmin),
  };
}

export default function AdminPage({
  user,
  dashboard,
  loading,
  onRefresh,
  onSaveProduct,
  onDeleteProduct,
  onSaveUser,
  onDeleteUser,
  onUpdateOrderStatus,
}) {
  const [tab, setTab] = useState("products");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userForm, setUserForm] = useState(EMPTY_USER);
  const [busyKey, setBusyKey] = useState("");

  const products = useMemo(() => dashboard?.products || [], [dashboard]);
  const users = useMemo(() => dashboard?.users || [], [dashboard]);
  const orders = useMemo(() => dashboard?.orders || [], [dashboard]);
  const feedback = useMemo(() => dashboard?.feedback || [], [dashboard]);
  const categories = useMemo(() => dashboard?.categories || [], [dashboard]);

  const stats = useMemo(
    () => [
      ["Товаров", products.length],
      ["Пользователей", users.length],
      ["Заказов", orders.length],
      ["Заявок", feedback.length],
    ],
    [feedback.length, orders.length, products.length, users.length]
  );

  useEffect(() => {
    if (!products.length) {
      setSelectedProductId(null);
      setProductForm(EMPTY_PRODUCT);
      return;
    }

    const selected = products.find(product => product.id === selectedProductId) || products[0];
    setSelectedProductId(selected.id);
    setProductForm(buildProductForm(selected));
  }, [products, selectedProductId]);

  useEffect(() => {
    if (!users.length) {
      setSelectedUserId(null);
      setUserForm(EMPTY_USER);
      return;
    }

    const selected = users.find(item => item.id === selectedUserId) || users[0];
    setSelectedUserId(selected.id);
    setUserForm(buildUserForm(selected));
  }, [selectedUserId, users]);

  if (!user?.isAdmin) {
    return (
      <div className="page page-narrow">
        <div className="empty-state">
          <div className="empty-state-icon">!</div>
          <h3>Доступ только для администратора</h3>
          <p>Войдите под демо-админом, чтобы управлять товарами, пользователями и заказами.</p>
        </div>
      </div>
    );
  }

  if (loading && !dashboard) {
    return (
      <div className="page page-narrow">
        <div className="empty-state small">
          <p>Загружаем локальную админку...</p>
        </div>
      </div>
    );
  }

  const handleProductSubmit = async event => {
    event.preventDefault();
    setBusyKey("product-save");
    try {
      const saved = await onSaveProduct(productForm);
      setSelectedProductId(saved.id);
    } finally {
      setBusyKey("");
    }
  };

  const handleProductDelete = async () => {
    if (!productForm.id) {
      setProductForm(EMPTY_PRODUCT);
      return;
    }

    setBusyKey(`product-delete-${productForm.id}`);
    try {
      await onDeleteProduct(productForm.id);
      setSelectedProductId(null);
      setProductForm(EMPTY_PRODUCT);
    } finally {
      setBusyKey("");
    }
  };

  const handleUserSubmit = async event => {
    event.preventDefault();
    if (!userForm.id) {
      return;
    }

    setBusyKey(`user-save-${userForm.id}`);
    try {
      await onSaveUser(userForm);
    } finally {
      setBusyKey("");
    }
  };

  const handleUserDelete = async () => {
    if (!userForm.id) {
      return;
    }

    setBusyKey(`user-delete-${userForm.id}`);
    try {
      await onDeleteUser(userForm.id);
      setSelectedUserId(null);
      setUserForm(EMPTY_USER);
    } finally {
      setBusyKey("");
    }
  };

  return (
    <div className="page">
      <section className="admin-hero">
        <div>
          <span className="eyebrow">Локальная админка</span>
          <h1 className="page-title">Управление витриной SweetHand</h1>
          <p className="page-subtitle">
            Меняйте ассортимент, редактируйте пользователей, отслеживайте заказы и
            просматривайте заявки прямо в браузере без backend.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={onRefresh} disabled={loading}>
              {loading ? "Обновляем..." : "Обновить данные"}
            </button>
          </div>
        </div>
        <div className="admin-stats-grid">
          {stats.map(([label, value]) => (
            <div className="admin-stat-card" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-tabs">
        {[
          ["products", "Товары"],
          ["users", "Пользователи"],
          ["orders", "Заказы"],
          ["feedback", "Заявки"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`filter-chip ${tab === key ? "active" : ""}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="admin-layout">
          <aside className="admin-list-panel">
            <div className="admin-list-head">
              <h3>Товары каталога</h3>
              <button
                className="btn-secondary admin-secondary-btn"
                onClick={() => {
                  setSelectedProductId(null);
                  setProductForm(EMPTY_PRODUCT);
                }}
              >
                Новый товар
              </button>
            </div>

            <div className="admin-list">
              {products.map(product => (
                <button
                  key={product.id}
                  className={`admin-list-item ${selectedProductId === product.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedProductId(product.id);
                    setProductForm(buildProductForm(product));
                  }}
                >
                  <img src={product.imageUrl} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>
                      {product.category?.name} · {formatMoney(product.price)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="admin-editor-panel">
            <div className="section-heading">
              <div>
                <h2>{productForm.id ? "Редактирование товара" : "Новый товар"}</h2>
                <p>Карточка сразу обновит каталог и домашние подборки.</p>
              </div>
            </div>

            <form className="admin-form" onSubmit={handleProductSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Название</label>
                  <input
                    value={productForm.name}
                    onChange={event =>
                      setProductForm(current => ({ ...current, name: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Категория</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={event =>
                      setProductForm(current => ({ ...current, categorySlug: event.target.value }))
                    }
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Цена</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.price}
                    onChange={event =>
                      setProductForm(current => ({ ...current, price: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Старая цена</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.originalPrice}
                    onChange={event =>
                      setProductForm(current => ({
                        ...current,
                        originalPrice: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Вес / количество</label>
                  <input
                    value={productForm.weight}
                    onChange={event =>
                      setProductForm(current => ({ ...current, weight: event.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Фото URL</label>
                  <input
                    value={productForm.imageUrl}
                    onChange={event =>
                      setProductForm(current => ({ ...current, imageUrl: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Бейдж</label>
                  <select
                    value={productForm.badge}
                    onChange={event =>
                      setProductForm(current => ({
                        ...current,
                        badge: event.target.value,
                        badgeLabel:
                          event.target.value === "hit"
                            ? PRODUCT_BADGE_LABELS.hit
                            : event.target.value === "new"
                              ? PRODUCT_BADGE_LABELS.new
                              : "",
                      }))
                    }
                  >
                    <option value="">Без бейджа</option>
                    <option value="hit">Хит</option>
                    <option value="new">Новинка</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Подпись бейджа</label>
                  <input
                    value={productForm.badgeLabel}
                    onChange={event =>
                      setProductForm(current => ({ ...current, badgeLabel: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={productForm.description}
                  onChange={event =>
                    setProductForm(current => ({ ...current, description: event.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Аллергены</label>
                <input
                  value={productForm.allergens}
                  onChange={event =>
                    setProductForm(current => ({ ...current, allergens: event.target.value }))
                  }
                />
              </div>

              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={productForm.isMonthPick}
                  onChange={event =>
                    setProductForm(current => ({
                      ...current,
                      isMonthPick: event.target.checked,
                    }))
                  }
                />
                <span>Показывать в подборке товара месяца</span>
              </label>

              <div className="admin-form-actions">
                <button className="btn-primary" type="submit" disabled={busyKey === "product-save"}>
                  {busyKey === "product-save" ? "Сохраняем..." : "Сохранить товар"}
                </button>
                <button className="btn-secondary admin-secondary-btn" type="button" onClick={handleProductDelete}>
                  {productForm.id ? "Удалить товар" : "Очистить форму"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {tab === "users" && (
        <div className="admin-layout">
          <aside className="admin-list-panel">
            <div className="admin-list-head">
              <h3>Пользователи</h3>
            </div>
            <div className="admin-list">
              {users.map(item => (
                <button
                  key={item.id}
                  className={`admin-list-item ${selectedUserId === item.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedUserId(item.id);
                    setUserForm(buildUserForm(item));
                  }}
                >
                  <div className="admin-user-pill">{item.name[0]}</div>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.isAdmin ? "Администратор" : "Клиент"} · {item.ordersCount} заказов
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="admin-editor-panel">
            <div className="section-heading">
              <div>
                <h2>Карточка пользователя</h2>
                <p>Здесь можно обновить профиль, роль и быстро удалить аккаунт.</p>
              </div>
            </div>

            <form className="admin-form" onSubmit={handleUserSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Имя</label>
                  <input
                    value={userForm.name}
                    onChange={event =>
                      setUserForm(current => ({ ...current, name: event.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input
                    value={userForm.phone}
                    onChange={event =>
                      setUserForm(current => ({ ...current, phone: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={event =>
                    setUserForm(current => ({ ...current, email: event.target.value }))
                  }
                />
              </div>

              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={userForm.isAdmin}
                  onChange={event =>
                    setUserForm(current => ({ ...current, isAdmin: event.target.checked }))
                  }
                />
                <span>Дать права администратора</span>
              </label>

              <div className="admin-form-actions">
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={busyKey === `user-save-${userForm.id}`}
                >
                  {busyKey === `user-save-${userForm.id}` ? "Сохраняем..." : "Сохранить пользователя"}
                </button>
                <button
                  className="btn-secondary admin-secondary-btn"
                  type="button"
                  onClick={handleUserDelete}
                  disabled={userForm.id === user.id}
                >
                  Удалить пользователя
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {tab === "orders" && (
        <section className="admin-section-card">
          <div className="section-heading">
            <div>
              <h2>Все заказы</h2>
              <p>Меняйте статусы и отслеживайте активность пользователей в одной ленте.</p>
            </div>
          </div>

          <div className="admin-order-grid">
            {orders.map(order => (
              <article className="order-card" key={`${order.userId}-${order.id}`}>
                <div className="order-header">
                  <div>
                    <div className="order-id">{order.number}</div>
                    <div className="order-date">
                      {order.userName} · {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <select
                    className="admin-status-select"
                    value={order.status}
                    onChange={event =>
                      onUpdateOrderStatus(order.userId, order.id, event.target.value)
                    }
                  >
                    {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="order-total">
                  {formatMoney(order.total)} · {order.deliveryMethod === "delivery" ? "Доставка" : "Самовывоз"}
                </div>
                <div className="admin-order-meta">
                  <span>{order.phone}</span>
                  {order.address ? <span>{order.address}</span> : null}
                  {order.comment ? <span>{order.comment}</span> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "feedback" && (
        <section className="admin-section-card">
          <div className="section-heading">
            <div>
              <h2>Сообщения с сайта</h2>
              <p>Все заявки из формы обратной связи хранятся локально и доступны здесь.</p>
            </div>
          </div>

          <div className="admin-feedback-grid">
            {feedback.map(item => (
              <article className="admin-feedback-card" key={item.id}>
                <strong>{item.name}</strong>
                <span>
                  {item.email}
                  {item.phone ? ` · ${item.phone}` : ""}
                </span>
                <p>{item.message}</p>
                <time>{formatDate(item.created_at)}</time>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
