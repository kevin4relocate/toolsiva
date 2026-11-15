import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

function unwrap(expression) {
  let node = expression;
  while (
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isParenthesizedExpression(node)
  ) {
    node = node.expression;
  }
  return node;
}

function variableArray(source, name, filename) {
  const parsed = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  if (parsed.parseDiagnostics.length > 0) {
    throw new Error(filename + ": TypeScript syntax errors while reading " + name);
  }
  for (const statement of parsed.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== name) continue;
      if (!declaration.initializer) break;
      const initial = unwrap(declaration.initializer);
      if (!ts.isArrayLiteralExpression(initial)) break;
      return [...initial.elements];
    }
  }
  throw new Error(filename + ": " + name + " must be a static array declaration.");
}

function textLiteral(expression, field) {
  const node = unwrap(expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  throw new Error(field + " must be a static string literal.");
}

function propertyValue(node, key, label) {
  if (!ts.isObjectLiteralExpression(node)) throw new Error(label + ": expected an object literal.");
  const property = node.properties.find((entry) =>
    ts.isPropertyAssignment(entry) &&
    (ts.isIdentifier(entry.name) || ts.isStringLiteral(entry.name)) &&
    entry.name.text === key
  );
  if (!property || !ts.isPropertyAssignment(property)) throw new Error(label + ": missing " + key + ".");
  return textLiteral(property.initializer, label + "." + key);
}

export function parseToolRegistry({ toolsSource, categoriesSource, typesSource }) {
  const categoryNames = variableArray(typesSource, "toolCategories", "src/types/tool.ts")
    .map((node) => textLiteral(node, "toolCategories"));
  const declaredCategories = variableArray(categoriesSource, "categories", "src/data/categories.ts")
    .map((node, index) => propertyValue(node, "slug", "categories[" + index + "]"));

  if (categoryNames.length === 0 || new Set(categoryNames).size !== categoryNames.length) {
    throw new Error("Tool categories are empty or duplicated.");
  }
  if (declaredCategories.length !== categoryNames.length ||
      categoryNames.some((name) => !declaredCategories.includes(name))) {
    throw new Error("Category definitions disagree with ToolCategory declarations.");
  }

  const validCategories = new Set(categoryNames);
  const catalog = variableArray(toolsSource, "toolCatalog", "src/data/tools.ts");
  if (catalog.length === 0) throw new Error("No tools found in toolCatalog.");

  const seenSlugs = new Set();
  const tools = catalog.map((node, index) => {
    const label = "toolCatalog[" + index + "]";
    const slug = propertyValue(node, "slug", label);
    const category = propertyValue(node, "category", label);
    const name = propertyValue(node, "name", label);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(label + ": invalid tool slug " + JSON.stringify(slug));
    }
    if (!validCategories.has(category)) {
      throw new Error(label + ": unknown category " + JSON.stringify(category));
    }
    if (seenSlugs.has(slug)) throw new Error(label + ": duplicate tool slug " + JSON.stringify(slug));
    if (!name.trim()) throw new Error(label + ": empty tool name.");
    seenSlugs.add(slug);
    return { slug, category, name, path: "/tools/" + category + "/" + slug };
  });

  const counts = Object.fromEntries(categoryNames.map((category) => [
    category, tools.filter((tool) => tool.category === category).length,
  ]));
  const paths = new Set(tools.map((tool) => tool.path));
  return { tools, paths, categories: categoryNames, counts };
}

export function readToolRegistry(root = process.cwd()) {
  const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
  return parseToolRegistry({
    toolsSource: read("src/data/tools.ts"),
    categoriesSource: read("src/data/categories.ts"),
    typesSource: read("src/types/tool.ts"),
  });
}
