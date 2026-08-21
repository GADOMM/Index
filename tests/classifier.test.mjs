import assert from "node:assert/strict";
import test from "node:test";
import {
  PERFUME_CLASSIFIER_VERSION,
  classifyPerfumeProduct,
  isPerfumeProduct,
} from "../scripts/perfume-classifier.mjs";

test("classifier accepts perfume names and structured perfume categories", () => {
  assert.equal(PERFUME_CLASSIFIER_VERSION, "perfume-v1");
  assert.deepEqual(classifyPerfumeProduct({ name: "Aelia Eau de Parfum 50 ml" }), {
    accepted: true,
    reason: "name_signal",
  });
  assert.deepEqual(classifyPerfumeProduct({
    name: "Nazwa zapachu 100 ml",
    categories: [{ name: "Perfumy damskie" }],
  }), {
    accepted: true,
    reason: "category_signal",
  });
  assert.equal(isPerfumeProduct({ name: "Woda toaletowa dla mężczyzn 100 ml" }), true);
});

test("classifier excludes sets, samples, cosmetics and description-only mentions", () => {
  const rejected = [
    { name: "Eau de Parfum zestaw prezentowy" },
    { name: "Perfumy tester 100 ml" },
    { name: "Perfumowana mgiełka do ciała", categories: [{ name: "Perfumy" }] },
    { name: "Balsam do ciała", description: "Pasuje do perfum tej samej marki" },
    { name: "Świeca zapachowa", categories: [{ name: "Home fragrance" }] },
  ];
  for (const product of rejected) assert.equal(isPerfumeProduct(product), false);
  assert.equal(classifyPerfumeProduct({ name: "Balsam do ciała" }).reason, "excluded_product_type");
  assert.equal(classifyPerfumeProduct({ name: "Kosmetyk pielęgnacyjny" }).reason, "no_perfume_signal");
});
