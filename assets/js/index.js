
{

	$.validator.addMethod("greaterThan", 
		function(value, element, params) {
			if (!/Invalid|NaN/.test(new Date(value))) {
				return new Date(value) >= new Date($(params).val());
			}
			return false; 
		}
	);

    const logoContext = $(".logo");
    const logoSpin = () => {
        const next = logoContext.data("view") === "m" ? "f" : "m";
        logoContext.addClass("logo-out")
            .one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", () => {
                logoContext.find("a").html(`
                    <svg viewBox="0 0 512 512">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/images/sprite.svg#logo-${next}" x="0px" y="0px"></use>
                    </svg>`);
                logoContext.data("view", next);
                logoContext.addClass("logo-in").removeClass("logo-out")
                    .one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", () => {
                        logoContext.removeClass("logo-in");
                    });
            });
    };
    setInterval(logoSpin, 10000);

    const deserialize = serializedJavascript => {
        return eval(`(${serializedJavascript})`);
    };

    $.fn.book = function() {
        const form = $(this);
        form.validate({
            rules: {
				title: "required",
				author: "required",
				genre: "required"
            },
            messages: {
				title: "Please enter a book title",
				author: "Please enter author name",
				genre: "Please enter genre"
            }
        });
        form.find("#create").off("click").on("click", e => {
            e.preventDefault();
            if(form.valid()) {
				fetch("/book/create", {
					method: "POST",
					credentials: "same-origin",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
					},
					body: form.serialize()
				})
				.then(response => response.json())
				.then(book => {
					window.location.href = `/books/${book.id}`;
				});
			}
		});
		form.find("#update").off("click").on("click", e => {
            e.preventDefault();
            if(form.valid()) {
				fetch("/book/update", {
					method: "POST",
					credentials: "same-origin",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
					},
					body: form.serialize()
				})
				.then(response => response.json())
				.then(book => {
					window.location.href = `/books/${book.id}`;
				});
			}
        });
	};
	
	$.fn.patron = function() {
		const form = $(this);
        form.validate({
            rules: {
				first_name: "required",
				last_name: "required",
				address: "required",
				email: {
					required: true,
					email: true
				},
				library_id: "required",
				zip_code: {
					required: true,
					number: true
				}
            },
            messages: {
				first_name: "Please enter first name",
				last_name: "Please enter last name",
				address: "Please enter address",
				email: "Please enter email in format example@email.com",
				library_id: "Please enter a library id",
				zip_code: "Please enter zip code"
            }
        });
        form.find("#create").off("click").on("click", e => {
            e.preventDefault();
            if(form.valid()) {
				fetch("/patron/create", {
					method: "POST",
					credentials: "same-origin",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
					},
					body: form.serialize()
				})
				.then(response => response.json())
				.then(patron => {
					window.location.href = `/patrons/${patron.id}`;
				});
			}
		});
		form.find("#update").off("click").on("click", e => {
            e.preventDefault();
            if(form.valid()) {
				fetch("/patron/update", {
					method: "POST",
					credentials: "same-origin",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
					},
					body: form.serialize()
				})
				.then(response => response.json())
				.then(patron => {
					window.location.href = `/patrons/${patron.id}`;
				});
			}
        });
	};

	$.fn.loan = function() {
		const form = $(this);
        form.validate({
            rules: {
				book_id: "required",
				patron_id: "required",
				loaned_on: {
					required: true,
      				date: true
				},
				return_by: {
					required: true,
					date: true,
					greaterThan: `[name="loaned_on"]`
				}
            },
            messages: {
				book_id: "Please select a book",
				patron_id: "Please select a patron",
				loaned_on: "Please enter loaned on date",
				return_by: "Please enter return by date"
            }
		});
		const today = moment();
		form.find(`[name="loaned_on"]`).val(today.format("YYYY-MM-DD"));
		form.find(`[name="return_by"]`).val(
			today.add(7, "days").format("YYYY-MM-DD"));
		form.find("#create").off("click").on("click", e => {
            e.preventDefault();
            if(form.valid()) {
				fetch("/loan/create", {
					method: "POST",
					credentials: "same-origin",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
					},
					body: form.serialize()
				})
				.then(() => {
					window.location.href = `/loans`;
				});
			}
		});
	};

	$.fn.returnBook = function() {
		const form = $(this);
        form.validate({
            rules: {
				returned_on: {
					required: true,
      				date: true
				}
            },
            messages: {
				returned_on: "Please enter returned on date"
            }
		});
		const today = moment();
		form.find(`[name="returned_on"]`).val(today.format("YYYY-MM-DD"));
		form.find("#return").off("click").on("click", e => {
            e.preventDefault();
            if(form.valid()) {
				fetch("/loan/return", {
					method: "POST",
					credentials: "same-origin",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
					},
					body: form.serialize()
				})
				.then(() => {
					window.location.href = `/loans`;
				});
			}
		});
	};
}