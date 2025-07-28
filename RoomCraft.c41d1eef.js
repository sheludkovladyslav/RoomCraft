var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},r={},a=e.parcelRequire4035;null==a&&((a=function(e){if(e in t)return t[e].exports;if(e in r){var a=r[e];delete r[e];var l={id:e,exports:{}};return t[e]=l,a.call(l.exports,l,l.exports),l.exports}var n=Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,t){r[e]=t},e.parcelRequire4035=a),a.register;var l=a("5fUTz");const n=document.getElementById("menuCards"),s=document.getElementById("menuFilter"),c={декорації:"decoration",меблі:"furniture",електроніка:"electronics","ін.":"all"},i=(e="all")=>{n.innerHTML=l.default.filter(t=>"all"===e||t.category===e).map(e=>`
            <li class="menu-cards-card">
          <button class="furniture__spawn" data-spawn="${e.key}">
         <div class="menu-cards-card__img"></div>
        <h3 class="menu-cards-card__title">${e.name}</h3>
    <p class="menu-cards-card__category">\u{41A}\u{430}\u{442}\u{435}\u{433}\u{43E}\u{440}\u{456}\u{44F}: ${e.category}</p>
              </button>
</li>
        `).join("")};s.addEventListener("click",e=>{let t=e.target.closest(".menu-filter__list");document.querySelectorAll(".menu-filter__list").forEach(e=>e.classList.remove("active")),t.classList.add("active"),i(c[t.textContent.trim().toLowerCase()]||"all")}),i(),n.addEventListener("click",e=>{let t=e.target.closest(".menu-cards-card");t&&(document.querySelectorAll(".menu-cards-card").forEach(e=>e.classList.remove("active")),t.classList.add("active"))});
//# sourceMappingURL=RoomCraft.c41d1eef.js.map
