export const PERFUME_CLASSIFIER_VERSION = "perfume-v1";

const normalize = (value) => String(value ?? "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[łŁ]/g, "l")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const POSITIVE_PRODUCT = /(?:^| )(?:eau de (?:parfum|toilette|cologne)|extrait de parfum|woda (?:perfumowana|toaletowa|kolonska)|perfumy?|parfum|perfume|fragrance|edp|edt|edc)(?: |$)/;
const POSITIVE_CATEGORY = /(?:^| )(?:perfumy?|parfum|perfume|fragrance|zapachy)(?: |$)/;
const EXCLUDED_PRODUCT = /(?:^| )(?:zestaw|set|coffret|gift set|tester|probka|sample|miniatura|decant|odlewka|refill|uzupelnienie|dezodorant|deodorant|antyperspirant|balsam|lotion|krem|cream|szampon|shampoo|odzywka|conditioner|mydlo|soap|zel pod prysznic|shower gel|olejek do ciala|body oil|mgielka|body mist|hair mist|body spray|after shave|aftershave|swieca|candle|dyfuzor|diffuser|home fragrance)(?: |$)/;

const categoryTexts = (product) => {
  const values = [];
  const categories = Array.isArray(product?.categories) ? product.categories : [];
  for (const category of categories) {
    if (typeof category === "string") {
      values.push(category);
      continue;
    }
    if (!category || typeof category !== "object" || Array.isArray(category)) continue;
    values.push(category.name, category.tdCategoryName, category.path, category.label);
  }
  values.push(
    product?.category,
    product?.categoryName,
    product?.merchantCategory,
    product?.productType,
    product?.type,
  );
  return values.filter((value) => typeof value === "string").map(normalize).filter(Boolean);
};

export const classifyPerfumeProduct = (product) => {
  if (!product || typeof product !== "object" || Array.isArray(product)) {
    return { accepted: false, reason: "invalid_product" };
  }
  const name = normalize(product.name);
  if (!name) return { accepted: false, reason: "missing_name" };
  const categories = categoryTexts(product);
  const structuredText = [name, ...categories].join(" ");
  if (EXCLUDED_PRODUCT.test(structuredText)) {
    return { accepted: false, reason: "excluded_product_type" };
  }
  if (POSITIVE_PRODUCT.test(name)) {
    return { accepted: true, reason: "name_signal" };
  }
  if (categories.some((category) => POSITIVE_PRODUCT.test(category) || POSITIVE_CATEGORY.test(category))) {
    return { accepted: true, reason: "category_signal" };
  }
  return { accepted: false, reason: "no_perfume_signal" };
};

export const isPerfumeProduct = (product) => classifyPerfumeProduct(product).accepted;
