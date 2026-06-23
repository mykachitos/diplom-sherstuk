import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function CatalogPage({
  categories,
  products,
  favoriteIds,
  addToCart,
  toggleFavorite,
  addedIds,
  loading,
  initialCategory,
  onRequireAuth,
  user,
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState(initialCategory || "all");
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [monthOnly, setMonthOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setCategory(initialCategory || "all");
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter(product => product.category?.slug === category);
    }

    if (search.trim()) {
      const value = search.trim().toLowerCase();
      result = result.filter(product =>
        [product.name, product.description, product.category?.name]
          .filter(Boolean)
          .some(field => field.toLowerCase().includes(value))
      );
    }

    if (discountedOnly) {
      result = result.filter(product => product.hasDiscount);
    }

    if (monthOnly) {
      result = result.filter(product => product.isMonthPick);
    }

    if (favoritesOnly) {
      result = result.filter(product => favoriteIds.has(product.id));
    }

    if (minPrice) {
      result = result.filter(product => product.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter(product => product.price <= Number(maxPrice));
    }

    switch (sort) {
      case "price_asc":
        result.sort((left, right) => left.price - right.price);
        break;
      case "price_desc":
        result.sort((left, right) => right.price - left.price);
        break;
      case "discount":
        result.sort((left, right) => right.discountPercent - left.discountPercent);
        break;
      case "name":
        result.sort((left, right) => left.name.localeCompare(right.name, "ru"));
        break;
      default:
        result.sort((left, right) => {
          if (right.isMonthPick !== left.isMonthPick) {
            return Number(right.isMonthPick) - Number(left.isMonthPick);
          }
          if (right.hasDiscount !== left.hasDiscount) {
            return Number(right.hasDiscount) - Number(left.hasDiscount);
          }
          return left.name.localeCompare(right.name, "ru");
        });
    }

    return result;
  }, [
    category,
    discountedOnly,
    favoriteIds,
    favoritesOnly,
    maxPrice,
    minPrice,
    monthOnly,
    products,
    search,
    sort,
  ]);

  const resetFilters = () => {
    setSearch("");
    setSort("popular");
    setCategory(initialCategory || "all");
    setDiscountedOnly(false);
    setMonthOnly(false);
    setFavoritesOnly(false);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="page">
      <section className="catalog-hero">
        <div>
          <span className="eyebrow">Каталог SweetHand</span>
          <h1 className="page-title">Весь ассортимент в одном месте</h1>
          <p className="page-subtitle">
            Живой каталог с фотографиями, поиском, подборками месяца и гибкими
            фильтрами. Все покупки и данные профиля сохраняются прямо в браузере.
          </p>
        </div>
        {!user ? (
          <div className="catalog-auth-note">
            <strong>Избранное и история заказов доступны после входа.</strong>
            <button className="inline-link" onClick={onRequireAuth}>
              Авторизоваться
            </button>
          </div>
        ) : (
          <div className="catalog-auth-note">
            <strong>Привет, {user.name.split(" ")[0]}.</strong>
            <span>Сохраняйте десерты в избранное и оформляйте заказы без потери корзины.</span>
          </div>
        )}
      </section>

      <section className="catalog-filters-panel">
        <div className="catalog-toolbar">
          <input
            className="catalog-search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Поиск по названию, категории или описанию"
          />

          <select
            className="catalog-sort"
            value={sort}
            onChange={event => setSort(event.target.value)}
          >
            <option value="popular">Сначала рекомендуемые</option>
            <option value="discount">Сначала скидки</option>
            <option value="price_asc">Цена по возрастанию</option>
            <option value="price_desc">Цена по убыванию</option>
            <option value="name">По названию</option>
          </select>
        </div>

        <div className="catalog-price-row">
          <div className="form-group">
            <label>Цена от</label>
            <input
              className="catalog-search"
              type="number"
              min="0"
              value={minPrice}
              onChange={event => setMinPrice(event.target.value)}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Цена до</label>
            <input
              className="catalog-search"
              type="number"
              min="0"
              value={maxPrice}
              onChange={event => setMaxPrice(event.target.value)}
              placeholder="5000"
            />
          </div>
          <button className="btn-secondary admin-secondary-btn" onClick={resetFilters}>
            Сбросить фильтры
          </button>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-chip ${category === "all" ? "active" : ""}`}
            onClick={() => setCategory("all")}
          >
            Все
          </button>
          {categories.map(item => (
            <button
              key={item.id}
              className={`filter-chip ${category === item.slug ? "active" : ""}`}
              onClick={() => setCategory(item.slug)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="toggle-row">
          <button
            className={`toggle-chip ${discountedOnly ? "active" : ""}`}
            onClick={() => setDiscountedOnly(value => !value)}
          >
            Только скидки
          </button>
          <button
            className={`toggle-chip ${monthOnly ? "active" : ""}`}
            onClick={() => setMonthOnly(value => !value)}
          >
            Товары месяца
          </button>
          {user && (
            <button
              className={`toggle-chip ${favoritesOnly ? "active" : ""}`}
              onClick={() => setFavoritesOnly(value => !value)}
            >
              Только избранное
            </button>
          )}
          <span className="catalog-meta">{filteredProducts.length} позиций</span>
        </div>
      </section>

      {loading ? (
        <div className="empty-state small">
          <p>Загружаем каталог...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">○</div>
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить фильтры или снять ограничения по цене и категории.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addToCart}
              added={!!addedIds[product.id]}
              isFavorite={favoriteIds.has(product.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
