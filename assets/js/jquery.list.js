/* An auxiliary function for building tables in this application. The table supports pagination and
     asynchronous data loading   */
$.fn.list = function (options) {
    const element = $(this);
    const TYPES = {
        LINK: "link",
        STRING: "string",
        NUMBER: "number",
        DATE: "date",
        ACTION: "action"
    };
    const pageSize = 10;
    
    class List {
        constructor() {
            this.options = options;
            this.element = element;
            this.init();
        }
        init() {
            if(this.options.isRemote) {
                fetch(this.options.dataSourceUrl, { credentials: "same-origin" })
                    .then(response => response.json())
                    .then(response => {
                        if(response.total === 0) {
                            return this.element.closest(".page").hide();
                        }
                        this.options.columns = deserialize(response.columns);
                        this.options.dataSource = deserialize(response.items);
                        this.options.total = response.total;
                        this.options.page = response.page;
                        this.options.paginationLink = "";
                        this.render();
                    });
                return;
            }
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
                    if(column.type !== TYPES.ACTION && typeof column.template === "function") {
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
                        case TYPES.ACTION:
                            if(typeof column.template !== "function") {
                                break;
                            }
                            itemValue = column.template(item);
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
        move(e, onNext = true) {
            e.preventDefault();
            this.options.page = this.options.page + (onNext ? 1 : -1);
            fetch(this.options.dataSourceUrl + `?page=${this.options.page}`, { credentials: "same-origin" })
                .then(response => response.json())
                .then(response => {
                    this.options.dataSource = deserialize(response.items);
                    this.render();
                });
        };
        createPager() {
            const pagesCount = Math.ceil(this.options.total / pageSize);
            const page = this.options.page;
            if(pagesCount < 2) { return; }
            const pagerContext = $(`
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
            if(this.options.isRemote) {
                pagerContext.find(".list-pager-link__prev")
                    .on("click", e => this.move(e, false))
                    .find("a").removeAttr("href");
                pagerContext.find(".list-pager-link__next")
                    .on("click", e => this.move(e))
                    .find("a").removeAttr("href");
            }
        }
    }

    const list = new List();
    element.data("list", list);
};