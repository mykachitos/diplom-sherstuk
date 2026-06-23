import { useState } from "react";
import { loginUser, registerUser } from "../utils/api";

export default function AuthPage({ setUser, setToken, setPage, showToast }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async event => {
    event.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await loginUser({ email, password: pass });
      setToken(data.token);
      setUser(data.user);
      showToast(`С возвращением, ${data.user.name}!`, "success");
      setPage("home");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async event => {
    event.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await registerUser({
        name,
        phone,
        email,
        password: pass,
      });
      setToken(data.token);
      setUser(data.user);
      showToast(`Аккаунт создан. Добро пожаловать, ${data.user.name}!`, "success");
      setPage("home");
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel auth-cover">
        <div className="auth-cover-content">
          <span className="eyebrow">SweetHand</span>
          <h1>Заказывайте десерты, сохраняйте избранное и управляйте покупками в одном кабинете.</h1>
          <p>
            После входа сайт запомнит ваш профиль, избранные позиции, историю заказов
            и даст доступ к локальной админке, если вы авторизуетесь под демо-админом.
          </p>
        </div>
      </div>

      <div className="auth-panel auth-form-panel">
        <div className="auth-card">
          <div className="auth-logo">Sweet<span>Hand</span></div>
          <div className="auth-subtitle">Кондитерская ручной работы</div>
          <div className="auth-demo-note">
            Демо-админ: <strong>admin@sweethand.local</strong> / <strong>admin123</strong>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => {
                setTab("login");
                setErr("");
              }}
            >
              Войти
            </button>
            <button
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => {
                setTab("register");
                setErr("");
              }}
            >
              Регистрация
            </button>
          </div>

          {tab === "login" ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Пароль</label>
                <input
                  type="password"
                  value={pass}
                  onChange={event => setPass(event.target.value)}
                  placeholder="Минимум 6 символов"
                  required
                />
              </div>
              {err && <div className="auth-err">{err}</div>}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Проверяем..." : "Войти"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label>Имя</label>
                <input
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="Как к вам обращаться"
                  required
                />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Пароль</label>
                <input
                  type="password"
                  value={pass}
                  onChange={event => setPass(event.target.value)}
                  placeholder="Минимум 6 символов"
                  required
                />
              </div>
              {err && <div className="auth-err">{err}</div>}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Создаем..." : "Создать аккаунт"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
