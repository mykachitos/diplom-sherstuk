import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CART_KEY,
  COOKIE_CONSENT_KEY,
  NAV_PAGES,
  TOKEN_KEY,
} from "./constants/data";
import { css } from "./constants/styles";
import { getFromStorage, setToStorage } from "./utils/storage";
import {
  addFavorite,
  createOrder,
  deleteAdminProduct,
  deleteAdminUser,
  fetchAdminDashboard,
  fetchCategories,
  fetchCurrentUser,
  fetchFavorites,
  fetchOrders,
  fetchProducts,
  logoutUser,
  removeFavorite,
  saveAdminProduct,
  saveAdminUser,
  updateAdminOrderStatus,
  updateProfile,
} from "./utils/api";

import AboutPage from "./components/AboutPage";
import AccountPage from "./components/AccountPage";
import AdminPage from "./components/AdminPage";
import AuthPage from "./components/AuthPage";
import CartPage from "./components/CartPage";
import CatalogPage from "./components/CatalogPage";
import HomePage from "./components/HomePage";

function sortByDiscount(products) {
  return [...products].sort((left, right) => {
    if (right.discountPercent !== left.discountPercent) {
      return right.discountPercent - left.discountPercent;
    }
    return left.price - right.price;
  });
}

export default function SweetHandApp() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState(() => getFromStorage(CART_KEY, []));
  const [token, setToken] = useState(() => getFromStorage(TOKEN_KEY, null));
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminDashboard, setAdminDashboard] = useState(null);
  const [catalogCategory, setCatalogCategory] = useState("all");
  const [cookieConsentAccepted, setCookieConsentAccepted] = useState(() =>
    getFromStorage(COOKIE_CONSENT_KEY, false)
  );
  const [toast, setToast] = useState({ msg: "", type: "", show: false });
  const [addedIds, setAddedIds] = useState({});
  const [accountTab, setAccountTab] = useState("orders");
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [privateLoading, setPrivateLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    setToStorage(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    setToStorage(TOKEN_KEY, token);
  }, [token]);

  useEffect(() => {
    setToStorage(COOKIE_CONSENT_KEY, cookieConsentAccepted);
  }, [cookieConsentAccepted]);

  useEffect(() => {
    const pageTitles = {
      home: "SweetHand",
      catalog: "SweetHand | Каталог",
      about: "SweetHand | О нас",
      cart: "SweetHand | Корзина",
      account: "SweetHand | Кабинет",
      auth: "SweetHand | Вход",
      admin: "SweetHand | Админка",
    };

    document.title = pageTitles[page] || "SweetHand";
  }, [page]);

  const showToast = useCallback((msg, type = "") => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(current => ({ ...current, show: false })), 2600);
  }, []);

  const loadPublicData = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const [categoryData, productData] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);
      setCategories(categoryData);
      setProducts(productData);
    } catch (error) {
      showToast(error.message || "Не удалось загрузить каталог.");
    } finally {
      setCatalogLoading(false);
    }
  }, [showToast]);

  const handleLogout = useCallback(
    async (withRequest = true) => {
      if (withRequest && token) {
        try {
          await logoutUser(token);
        } catch (_error) {
          // Local logout is still enough.
        }
      }

      setToken(null);
      setUser(null);
      setFavorites([]);
      setOrders([]);
      setAdminDashboard(null);
      setAccountTab("orders");
      setPage("home");
    },
    [token]
  );

  const loadPrivateData = useCallback(
    async currentToken => {
      if (!currentToken) {
        setUser(null);
        setFavorites([]);
        setOrders([]);
        return;
      }

      setPrivateLoading(true);
      try {
        const [currentUser, favoriteProducts, userOrders] = await Promise.all([
          fetchCurrentUser(currentToken),
          fetchFavorites(currentToken),
          fetchOrders(currentToken),
        ]);
        setUser(currentUser);
        setFavorites(favoriteProducts);
        setOrders(userOrders);
      } catch (error) {
        await handleLogout(false);
        showToast(error.message || "Сессия истекла. Войдите снова.");
      } finally {
        setPrivateLoading(false);
      }
    },
    [handleLogout, showToast]
  );

  const loadAdminData = useCallback(
    async currentToken => {
      if (!currentToken) {
        setAdminDashboard(null);
        return;
      }

      setAdminLoading(true);
      try {
        const dashboard = await fetchAdminDashboard(currentToken);
        setAdminDashboard(dashboard);
      } catch (error) {
        setAdminDashboard(null);
        showToast(error.message || "Не удалось загрузить админку.");
      } finally {
        setAdminLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setFavorites([]);
      setOrders([]);
      setAdminDashboard(null);
      return;
    }
    loadPrivateData(token);
  }, [loadPrivateData, token]);

  useEffect(() => {
    if (token && user?.isAdmin) {
      loadAdminData(token);
      return;
    }
    setAdminDashboard(null);
    if (page === "admin") {
      setPage("account");
    }
  }, [loadAdminData, page, token, user?.isAdmin]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map(product => product.id)),
    [favorites]
  );

  const featuredProducts = useMemo(
    () => products.filter(product => product.badge).slice(0, 8),
    [products]
  );
  const discountedProducts = useMemo(
    () => sortByDiscount(products.filter(product => product.hasDiscount)).slice(0, 8),
    [products]
  );
  const monthProducts = useMemo(
    () => products.filter(product => product.isMonthPick).slice(0, 4),
    [products]
  );
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );
  const cartOriginalTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (item.originalPrice || item.price) * item.qty,
        0
      ),
    [cart]
  );
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const addToCart = product => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 1200);
    showToast(`${product.name} добавлен в корзину`, "success");
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const toggleFavorite = async product => {
    if (!token) {
      showToast("Войдите, чтобы сохранять товары в избранное.");
      setPage("auth");
      return;
    }

    try {
      if (favoriteIds.has(product.id)) {
        await removeFavorite(token, product.id);
        setFavorites(prev => prev.filter(item => item.id !== product.id));
        showToast(`${product.name} удален из избранного`, "success");
      } else {
        const favoriteProduct = await addFavorite(token, product.id);
        setFavorites(prev => [
          favoriteProduct,
          ...prev.filter(item => item.id !== favoriteProduct.id),
        ]);
        showToast(`${product.name} добавлен в избранное`, "success");
      }
    } catch (error) {
      showToast(error.message || "Не удалось обновить избранное.");
    }
  };

  const handleOrderSubmit = async form => {
    if (!token) {
      showToast("Войдите, чтобы оформить заказ.");
      setPage("auth");
      return { ok: false };
    }

    try {
      const order = await createOrder(token, {
        contact_name: form.name,
        phone: form.phone,
        delivery_method: form.deliveryMethod,
        address: form.address,
        comment: form.comment,
        personal_data_consent: form.consent,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.qty,
        })),
      });
      setOrders(prev => [order, ...prev]);
      setOrderSuccess(order);
      setCart([]);
      if (user?.isAdmin) {
        loadAdminData(token);
      }
      showToast(`Заказ ${order.number} оформлен`, "success");
      return { ok: true, order };
    } catch (error) {
      showToast(error.message || "Не удалось оформить заказ.");
      return { ok: false, error };
    }
  };

  const handleProfileSave = async values => {
    if (!token) {
      return;
    }

    try {
      const updatedUser = await updateProfile(token, values);
      setUser(updatedUser);
      if (updatedUser.isAdmin) {
        loadAdminData(token);
      }
      showToast("Профиль обновлен", "success");
    } catch (error) {
      showToast(error.message || "Не удалось обновить профиль.");
    }
  };

  const handleAdminRefresh = useCallback(async () => {
    await loadPublicData();
    if (token) {
      await loadPrivateData(token);
      if (user?.isAdmin) {
        await loadAdminData(token);
      }
    }
  }, [loadAdminData, loadPrivateData, loadPublicData, token, user?.isAdmin]);

  const handleAdminSaveProduct = async values => {
    if (!token) {
      return null;
    }

    const saved = await saveAdminProduct(token, values);
    await handleAdminRefresh();
    showToast(`Товар ${saved.name} сохранен`, "success");
    return saved;
  };

  const handleAdminDeleteProduct = async productId => {
    if (!token) {
      return;
    }

    await deleteAdminProduct(token, productId);
    setCart(prev => prev.filter(item => item.id !== productId));
    await handleAdminRefresh();
    showToast("Товар удален", "success");
  };

  const handleAdminSaveUser = async values => {
    if (!token) {
      return;
    }

    await saveAdminUser(token, values);
    await handleAdminRefresh();
    showToast("Пользователь обновлен", "success");
  };

  const handleAdminDeleteUser = async userId => {
    if (!token) {
      return;
    }

    await deleteAdminUser(token, userId);
    await handleAdminRefresh();
    showToast("Пользователь удален", "success");
  };

  const handleAdminUpdateOrderStatus = async (userId, orderId, status) => {
    if (!token) {
      return;
    }

    await updateAdminOrderStatus(token, userId, orderId, status);
    await handleAdminRefresh();
    showToast("Статус заказа обновлен", "success");
  };

  const goToCatalog = categorySlug => {
    setCatalogCategory(categorySlug || "all");
    setPage("catalog");
  };

  const goToFeedback = () => {
    const scrollToFeedback = () => {
      document.getElementById("feedback")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    if (page === "home") {
      scrollToFeedback();
      return;
    }

    setPage("home");
    setTimeout(scrollToFeedback, 100);
  };

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">
        <nav className="nav">
          <div className="nav-inner">
            <button className="nav-logo" onClick={() => setPage("home")}>
              Sweet<span>Hand</span>
            </button>

            <div className="nav-links">
              {NAV_PAGES.map(([key, label]) => (
                <button
                  key={key}
                  className={`nav-btn ${page === key ? "active" : ""}`}
                  onClick={() => setPage(key)}
                >
                  {label}
                </button>
              ))}
              {user?.isAdmin && (
                <button
                  className={`nav-btn ${page === "admin" ? "active" : ""}`}
                  onClick={() => setPage("admin")}
                >
                  Админка
                </button>
              )}
            </div>

            <div className="nav-actions">
              <button className="nav-icon-btn" onClick={goToFeedback}>
                Связаться
              </button>
              <button className="nav-icon-btn" onClick={() => setPage("cart")}>
                Корзина {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              {user ? (
                <button className="nav-icon-btn" onClick={() => setPage("account")}>
                  {user.name.split(" ")[0]}
                </button>
              ) : (
                <button className="nav-icon-btn primary" onClick={() => setPage("auth")}>
                  Войти
                </button>
              )}
            </div>
          </div>
        </nav>

        {page === "home" && (
          <HomePage
            categories={categories}
            featuredProducts={featuredProducts}
            discountedProducts={discountedProducts}
            monthProducts={monthProducts}
            favoriteIds={favoriteIds}
            addToCart={addToCart}
            toggleFavorite={toggleFavorite}
            addedIds={addedIds}
            user={user}
            onOpenCatalog={goToCatalog}
            onGoToAuth={() => setPage("auth")}
            feedbackSent={feedbackSent}
            setFeedbackSent={setFeedbackSent}
            showToast={showToast}
          />
        )}

        {page === "catalog" && (
          <CatalogPage
            categories={categories}
            products={products}
            favoriteIds={favoriteIds}
            addToCart={addToCart}
            toggleFavorite={toggleFavorite}
            addedIds={addedIds}
            loading={catalogLoading}
            initialCategory={catalogCategory}
            onRequireAuth={() => setPage("auth")}
            user={user}
          />
        )}

        {page === "about" && <AboutPage onOpenCatalog={goToCatalog} />}

        {page === "cart" && (
          <CartPage
            cart={cart}
            cartTotal={cartTotal}
            cartOriginalTotal={cartOriginalTotal}
            updateQty={updateQty}
            setPage={setPage}
            user={user}
            onSubmitOrder={handleOrderSubmit}
            orderSuccess={orderSuccess}
            setOrderSuccess={setOrderSuccess}
          />
        )}

        {page === "account" && (
          <AccountPage
            user={user}
            orders={orders}
            favoriteProducts={favorites}
            accountTab={accountTab}
            setAccountTab={setAccountTab}
            onLogout={handleLogout}
            setPage={setPage}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
            addedIds={addedIds}
            onSaveProfile={handleProfileSave}
            loading={privateLoading}
          />
        )}

        {page === "admin" && (
          <AdminPage
            user={user}
            dashboard={adminDashboard}
            loading={adminLoading}
            onRefresh={handleAdminRefresh}
            onSaveProduct={handleAdminSaveProduct}
            onDeleteProduct={handleAdminDeleteProduct}
            onSaveUser={handleAdminSaveUser}
            onDeleteUser={handleAdminDeleteUser}
            onUpdateOrderStatus={handleAdminUpdateOrderStatus}
          />
        )}

        {page === "auth" && (
          <AuthPage
            setUser={setUser}
            setToken={setToken}
            setPage={setPage}
            showToast={showToast}
          />
        )}

        <footer className="footer">
          <div className="footer-inner">
            <div>
              <div className="footer-logo">Sweet<span>Hand</span></div>
              <p className="footer-copy">
                Авторские десерты ручной работы во Владивостоке: торты, пирожные,
                печенье и шоколадные коллекции.
              </p>
            </div>
            <div className="footer-meta">
              <strong>Контакты</strong>
              <span>г. Владивосток, ул. Пушкинская, 14</span>
              <span>+7 (423) 200-00-00</span>
              <span>hello@sweethand.ru</span>
            </div>
            <div className="footer-meta">
              <strong>Режим работы</strong>
              <span>Ежедневно</span>
              <span>09:00 - 21:00</span>
              <span>Самовывоз и доставка по городу</span>
            </div>
          </div>
        </footer>

        <div className={`toast ${toast.type} ${toast.show ? "show" : ""}`}>{toast.msg}</div>

        {!cookieConsentAccepted && (
          <div className="cookie-banner">
            <div className="cookie-banner-text">
              Мы используем cookies для корректной работы сайта и запрашиваем
              согласие на обработку персональных данных в формах и заказах.
            </div>
            <button
              className="cookie-banner-btn"
              onClick={() => setCookieConsentAccepted(true)}
            >
              Принять
            </button>
          </div>
        )}
      </div>
    </>
  );
}
