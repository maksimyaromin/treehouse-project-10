$.fn.activePlaceholder = function() {

    const activate = item => {
        const input = item.find("> input.form-input__control");
        const check = () => {
            const value = input.val();
            if(value) {
                input.addClass("form-input__control_full");
            } else {
                input.removeClass("form-input__control_full");
            }
        };
        check();
        input.on("blur", check);
        item.addClass("form-input_activated");
    };

    $(this).each((idx, item) => {
        item = $(item);
        activate(item);
    });

};