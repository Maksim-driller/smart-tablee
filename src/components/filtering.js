// @todo: #4.3 — настроить компаратор
export function initFiltering(elements) {
    // Обработка кнопок очистки
    const handleClearButtons = (action) => {
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            if (field && elements[`searchBy${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
                elements[`searchBy${field.charAt(0).toUpperCase() + field.slice(1)}`].value = '';
            }
        }
    };
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName]) {
                // Очищаем существующие опции (кроме первой пустой)
                elements[elementName].innerHTML = '<option value="" selected>—</option>';
                
                // Обрабатываем как массив, так и объект
                const data = indexes[elementName];
                if (Array.isArray(data)) {
                    // Если это массив
                    data.forEach(name => {
                        const el = document.createElement('option');
                        el.textContent = name;
                        el.value = name;
                        elements[elementName].appendChild(el);
                    });
                } else if (typeof data === 'object' && data !== null) {
                    // Если это объект (как в случае с sellers)
                    Object.values(data).forEach(name => {
                        const el = document.createElement('option');
                        el.textContent = name;
                        el.value = name;
                        elements[elementName].appendChild(el);
                    });
                }
            }
        });
    }

    const applyFiltering = (query, state, action) => {
        // Обрабатываем кнопки очистки
        handleClearButtons(action);

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                }
            }
        });

        // Добавляем фильтры из состояния формы
        if (state.seller) {
            filter['filter[seller]'] = state.seller;
        }
        if (state.date) {
            filter['filter[date]'] = state.date;
        }
        if (state.customer) {
            filter['filter[customer]'] = state.customer;
        }
        if (state.totalFrom || state.totalTo) {
            if (state.totalFrom) filter['filter[totalFrom]'] = state.totalFrom;
            if (state.totalTo) filter['filter[totalTo]'] = state.totalTo;
        }

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    }

    return {
        updateIndexes,
        applyFiltering
    }
}