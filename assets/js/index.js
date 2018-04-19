
{
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
}