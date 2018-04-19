$.fn.list = function (options) {
    const element = $(this);
    const TYPES = {
        LINK: "link",
        STRING: "string",
        NUMBER: "number",
        DATE: "date"
    };
    const pageSize = 10;
    
    class List {
        constructor() {
            this.options = options;
            this.element = element;
            this.render();
        }
        render() {
            if(this.isRendered) { this.element.html(""); }
            this.wrapper = $(
                `<div class="${this.options.name}-wrapper"></div>`
            ).appendTo(this.element);
            $(
                `<div class="list-title">${this.options.title}</div>`
            ).appendTo(this.wrapper);
            this.table = $(
                `<table class="list ${this.options.name}"></table>`
            ).appendTo(this.wrapper);
            this.createHeader();
            this.createBody();
            this.createPager();
            this.isRendered = true;
        }
        createHeader() {
            const columns = this.options.columns.map(column => 
                `<th class="list-header list-header_${column.type}">
                    <span>${column.displayName}</span>
                </th>`).join("");
            $(`<thead><tr>${columns}</tr></thead>`).appendTo(this.table);
        }
        createBody() {
            const rows = this.options.dataSource.map((item, index) => {
                const columns = this.options.columns.map(column => {
                    let itemValue = item[column.field];
                    if(typeof column.template === "function") {
                        itemValue = column.template(itemValue);
                    }
                    if(!itemValue) { itemValue = ""; }
                    switch (column.type) {
                        case TYPES.LINK:
                            const link = column.link
                                ? item[column.link]
                                : item.link;
                            itemValue = 
                                `<a href="${link}">${itemValue}</a>`;
                            break;
                        case TYPES.NUMBER:
                            itemValue = 
                                `<span>
                                    ${itemValue.toFixed(column.fixed)}
                                </span>`;
                            break;
                        case TYPES.DATE:
                            if(itemValue) {
                                itemValue = moment(itemValue).format("YYYY-MM-DD");
                            }
                            itemValue = 
                                `<span>
                                    ${itemValue}
                                </span>`;
                            break;
                        case TYPES.STRING:
                        default:
                            itemValue = `<span>${itemValue}</span>`;
                            break;
                    }
                    return `
                        <td class="list-cell list-cell_${column.type}">
                            ${itemValue}
                        </td>`;
                }).join("");
                return `<tr class="list-row">${columns}</tr>`;
            }).join("");
            $(`<tbody>${rows}</tbody>`).appendTo(this.table);
        }
        createPager() {
            const pagesCount = Math.ceil(this.options.total / pageSize);
            const page = this.options.page;
            if(pagesCount < 2) { return; }
            $(`
                <div class="list-pager-context">
                    <div class="list-pager-total">
                        ${pageSize * (page - 1) + 1}-${pageSize * page} of ${this.options.total} 
                    </div>
                    <div class="list-pager">
                        ${page === 1
                            ? `<div class="list-pager-link"></div>`
                            : `
                                <div class="list-pager-link list-pager-link__prev">
                                    <a class="icon" href="${this.options.paginationLink}${page - 1}"></a>
                                </div>`
                        }
                        ${page === pagesCount
                            ? `<div class="list-pager-link"></div>`
                            : `
                                <div class="list-pager-link list-pager-link__next">
                                    <a class="icon" href="${this.options.paginationLink}${page + 1}"></a>
                                </div>`
                        }
                    </div>
                </div>`
            ).appendTo(this.wrapper);
        }
    }

    const list = new List();
    element.data("list", list);
};