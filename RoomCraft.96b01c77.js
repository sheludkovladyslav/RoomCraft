var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},n=e.parcelRequire4fae;null==n&&((n=function(e){if(e in t)return t[e].exports;if(e in o){var n=o[e];delete o[e];var u={id:e,exports:{}};return t[e]=u,n.call(u.exports,u,u.exports),u.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){o[e]=t},e.parcelRequire4fae=n),n.register;var u={};u=(function e(t,o,n){function u(i,l){if(!o[i]){if(!t[i]){var s=void 0;if(!l&&s)return s(i,!0);if(r)return r(i,!0);var a=Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var c=o[i]={exports:{}};t[i][0].call(c.exports,function(e){return u(t[i][1][e]||e)},c,c.exports,e,t,o,n)}return o[i].exports}for(var r=void 0,i=0;i<n.length;i++)u(n[i]);return u})({1:[function(e,t,o){Object.defineProperty(o,"__esModule",{value:!0}),o.create=o.visible=void 0;var n=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=document.createElement("div");return o.innerHTML=e.trim(),!0===t?o.children:o.firstChild},u=function(e,t){var o=e.children;return 1===o.length&&o[0].tagName===t},r=function(e){return null!=(e=e||document.querySelector(".basicLightbox"))&&!0===e.ownerDocument.body.contains(e)};o.visible=r,o.create=function(e,t){var o,i,l,s,a,c,d,f=(o=e=function(e){var t="string"==typeof e,o=e instanceof HTMLElement==1;if(!1===t&&!1===o)throw Error("Content must be a DOM element/node or string");return!0===t?Array.from(n(e,!0)):"TEMPLATE"===e.tagName?[e.content.cloneNode(!0)]:Array.from(e.children)}(e),i=t=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(null==(e=Object.assign({},e)).closable&&(e.closable=!0),null==e.className&&(e.className=""),null==e.onShow&&(e.onShow=function(){}),null==e.onClose&&(e.onClose=function(){}),"boolean"!=typeof e.closable)throw Error("Property `closable` must be a boolean");if("string"!=typeof e.className)throw Error("Property `className` must be a string");if("function"!=typeof e.onShow)throw Error("Property `onShow` must be a function");if("function"!=typeof e.onClose)throw Error("Property `onClose` must be a function");return e}(t),s=(l=n('\n		<div class="basicLightbox '.concat(i.className,'">\n			<div class="basicLightbox__placeholder" role="dialog"></div>\n		</div>\n	'))).querySelector(".basicLightbox__placeholder"),o.forEach(function(e){return s.appendChild(e)}),a=u(s,"IMG"),c=u(s,"VIDEO"),d=u(s,"IFRAME"),!0===a&&l.classList.add("basicLightbox--img"),!0===c&&l.classList.add("basicLightbox--video"),!0===d&&l.classList.add("basicLightbox--iframe"),l),v=function(e){var o;return!1!==t.onClose(b)&&(o=function(){if("function"==typeof e)return e(b)},f.classList.remove("basicLightbox--visible"),setTimeout(function(){return!1===r(f)||f.parentElement.removeChild(f),o()},410),!0)};!0===t.closable&&f.addEventListener("click",function(e){e.target===f&&v()});var b={element:function(){return f},visible:function(){return r(f)},show:function(e){var o;return!1!==t.onShow(b)&&(o=function(){if("function"==typeof e)return e(b)},document.body.appendChild(f),setTimeout(function(){requestAnimationFrame(function(){return f.classList.add("basicLightbox--visible"),o()})},10),!0)},close:v};return b}},{}]},{},[1])(1);var r=n("kXXb0");document.querySelector(".settings").addEventListener("click",e=>{let t=u.create(`
    <div class="modal">
      <div class="grid">
        <div class="grid__toggler toggler ">
          <div class="toggler__circle"></div>
        </div>
        <p class="grid__label">\u{41F}\u{43E}\u{43A}\u{430}\u{437}\u{430}\u{442}\u{438} \u{441}\u{456}\u{442}\u{43A}\u{443}</p>
      </div>

      
      <div class="select-wrapper">
        <select name="skins-selector" id="skins" class="modal__selector skins">
          <option value="" disabled selected hidden>
            \u{412}\u{438}\u{431}\u{440}\u{430}\u{442}\u{438} \u{432}\u{438}\u{433}\u{43B}\u{44F}\u{434} \u{43A}\u{456}\u{43C}\u{43D}\u{430}\u{442}\u{438}
          </option>
          <option value="style1">\u{421}\u{442}\u{438}\u{43B}\u{44C} #1</option>
          <option value="style2">\u{421}\u{442}\u{438}\u{43B}\u{44C} #2</option>
          <option value="style3">\u{421}\u{442}\u{438}\u{43B}\u{44C} #3</option>
        </select>
      </div>

      <div class="modal__buttons buttons">
        <div class="buttons__wrapper">
          <button class="button__save">\u{417}\u{431}\u{435}\u{440}\u{435}\u{433}\u{442}\u{438} \u{43A}\u{456}\u{43C}\u{43D}\u{430}\u{442}\u{443}</button>
          <button class="button__load">\u{417}\u{430}\u{432}\u{430}\u{43D}\u{442}\u{430}\u{436}\u{438}\u{442}\u{438} \u{43A}\u{456}\u{43C}\u{43D}\u{430}\u{442}\u{443}</button>
        </div>
        <button class="button__delete">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438} \u{437}\u{431}\u{435}\u{440}\u{435}\u{436}\u{435}\u{43D}\u{443} \u{43A}\u{456}\u{43C}\u{43D}\u{430}\u{442}\u{443}</button>
      </div>


      <button class="modal__close close">
    X
      </button>
    </div>
  `);t.show();let o=t.element(),n=o.querySelector(".button__save"),i=o.querySelector(".button__load"),l=o.querySelector(".button__delete"),s=o.querySelector(".toggler");localStorage&&"gridOn"===localStorage.getItem("grid")&&s.classList.add("active"),localStorage&&"gridOff"===localStorage.getItem("grid")&&s.classList.remove("active"),n.addEventListener("click",()=>{r.roomInstance.saveRoomState()}),i.addEventListener("click",()=>{r.roomInstance.loadRoomState()}),l.addEventListener("click",()=>{r.roomInstance.deleteRoomState()}),s.addEventListener("click",()=>{s.classList.toggle("active"),s.classList.contains("active")?localStorage.setItem("grid","gridOn"):localStorage.setItem("grid","gridOff"),r.roomInstance.gridCheck()}),o.querySelector(".modal__close").addEventListener("click",()=>{t.close()})});
//# sourceMappingURL=RoomCraft.96b01c77.js.map
