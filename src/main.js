import "./fonts/ys-display/fonts.css";
import "./style.css";

import { initPagination } from "./components/pagination.js";
import { initSearching } from "./components/searching.js";
import { initSorting } from "./components/sorting.js";
import { initTable } from "./components/table.js";
import { initData } from "./data.js";
import { data as sourceData } from "./data/dataset_1.js";
import { processFormData } from "./lib/utils.js";

const API = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Применяем поиск к query
 */
function applySearchingToQuery(query, state, action) {
  if (state.search) {
    query.search = state.search;
  }
  return query;
}

/**
 * Применяем сортировку к query
 */
function applySortingToQuery(query, state) {
  if (state.sortBy) {
    query.sortBy = state.sortBy;
    query.sortOrder = state.sortOrder || "asc";
  }
  return query;
}

/**
 * Сброс всех фильтров и сортировки
 */
function resetAllFilters() {
  // Сбрасываем все поля формы
  const form = sampleTable.container;
  form.reset();

  // Сбрасываем сортировку
  if (sampleTable.header.elements?.sortByDate) {
    sampleTable.header.elements.sortByDate.dataset.value = "none";
  }
  if (sampleTable.header.elements?.sortByTotal) {
    sampleTable.header.elements.sortByTotal.dataset.value = "none";
  }
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  try {
    // Обрабатываем кнопку сброса всех фильтров
    if (action && action.name === "reset") {
      resetAllFilters();
    }

    let state = collectState();
    let query = {};
    query = applySorting(query, state, action);
    query = applySearching(query, state, action);
    if (typeof applyFiltering === "function") {
      query = applyFiltering(query, state, action);
    }

    if (typeof applyPagination === "function") {
      query = applyPagination(query, state, action);
    }

    const { total, items } = await API.getRecords(query);
    if (typeof updatePagination === "function") {
      updatePagination(total, query);
    }
    sampleTable.render(items);
  } catch (error) {
    console.error("Error in render:", error);
    // Fallback на исходные данные при ошибке
    sampleTable.render(sourceData.slice(0, 10));
  }
}

// Сначала инициализируем таблицу
const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

let applyPagination, updatePagination, applyFiltering, updateIndexes;

if (sampleTable.paginationElements) {
  const pagination = initPagination(
    {
      pages: sampleTable.paginationElements.pages,
      fromRow: sampleTable.paginationElements.fromRow,
      toRow: sampleTable.paginationElements.toRow,
      totalRows: sampleTable.paginationElements.totalRows,
    },
    (el, page, isCurrent) => {
      const input = el.querySelector("input");
      const label = el.querySelector("span");
      input.value = page;
      input.checked = isCurrent;
      label.textContent = page;
      return el;
    }
  );
  applyPagination = pagination.applyPagination;
  updatePagination = pagination.updatePagination;
}

if (
  typeof initFiltering === "function" &&
  sampleTable.filter &&
  sampleTable.filter.elements
) {
  try {
    const filtering = initFiltering(sampleTable.filter.elements);
    applyFiltering = filtering.applyFiltering;
    updateIndexes = filtering.updateIndexes;
  } catch (error) {
    console.warn("Filtering initialization failed:", error);
  }
}

const applySorting = initSorting(
  [
    sampleTable.header.elements?.sortByDate,
    sampleTable.header.elements?.sortByTotal,
  ].filter(Boolean)
);

const applySearching = initSearching("search");

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);
async function init() {
  try {
    const indexes = await API.getIndexes();
    if (
      typeof updateIndexes === "function" &&
      sampleTable.filter &&
      sampleTable.filter.elements
    ) {
      updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers || {},
      });
    }
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
}

// Запускаем инициализацию и затем рендер
init().then(render);
