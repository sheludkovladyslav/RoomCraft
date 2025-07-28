var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},r={},a=e.parcelRequire4035;null==a&&((a=function(e){if(e in t)return t[e].exports;if(e in r){var a=r[e];delete r[e];var n={id:e,exports:{}};return t[e]=n,a.call(n.exports,n,n.exports),n.exports}var l=Error("Cannot find module '"+e+"'");throw l.code="MODULE_NOT_FOUND",l}).register=function(e,t){r[e]=t},e.parcelRequire4035=a),a.register;var n=a("5fUTz");const l=document.getElementById("menuCards"),i=document.getElementById("menuFilter"),s={декорації:"decoration",меблі:"furniture",електроніка:"electronics","ін.":"all"},o=(e="all")=>{l.innerHTML=n.default.filter(t=>"all"===e||t.category===e).map(e=>`
            <article class="menu-cards-card">
          <button class="furniture__spawn" data-spawn="${e.key}">
         <div class="menu-cards-card__img"></div>
        <h3 class="menu-cards-card__title">Name: ${e.name}</h3>
    <span class="menu-cards-card__category">Category: ${e.category}</span>
              </button>
</article>
        `).join("")};i.addEventListener("click",e=>{let t=e.target.closest(".menu-filter__list");document.querySelectorAll(".menu-filter__list").forEach(e=>e.classList.remove("active")),t.classList.add("active"),o(s[t.textContent.trim().toLowerCase()]||"all")}),o();
//# sourceMappingURL=RoomCraft.5a3edbe1.js.map
