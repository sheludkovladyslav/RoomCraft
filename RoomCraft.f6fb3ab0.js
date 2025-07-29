var e={};e=(function e(t,u,o){function n(i,s){if(!u[i]){if(!t[i]){var l=void 0;if(!s&&l)return l(i,!0);if(r)return r(i,!0);var c=Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var a=u[i]={exports:{}};t[i][0].call(a.exports,function(e){return n(t[i][1][e]||e)},a,a.exports,e,t,u,o)}return u[i].exports}for(var r=void 0,i=0;i<o.length;i++)n(o[i]);return n})({1:[function(e,t,u){Object.defineProperty(u,"__esModule",{value:!0}),u.create=u.visible=void 0;var o=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],u=document.createElement("div");return u.innerHTML=e.trim(),!0===t?u.children:u.firstChild},n=function(e,t){var u=e.children;return 1===u.length&&u[0].tagName===t},r=function(e){return null!=(e=e||document.querySelector(".basicLightbox"))&&!0===e.ownerDocument.body.contains(e)};u.visible=r,u.create=function(e,t){var u,i,s,l,c,a,d,v=(u=e=function(e){var t="string"==typeof e,u=e instanceof HTMLElement==1;if(!1===t&&!1===u)throw Error("Content must be a DOM element/node or string");return!0===t?Array.from(o(e,!0)):"TEMPLATE"===e.tagName?[e.content.cloneNode(!0)]:Array.from(e.children)}(e),i=t=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(null==(e=Object.assign({},e)).closable&&(e.closable=!0),null==e.className&&(e.className=""),null==e.onShow&&(e.onShow=function(){}),null==e.onClose&&(e.onClose=function(){}),"boolean"!=typeof e.closable)throw Error("Property `closable` must be a boolean");if("string"!=typeof e.className)throw Error("Property `className` must be a string");if("function"!=typeof e.onShow)throw Error("Property `onShow` must be a function");if("function"!=typeof e.onClose)throw Error("Property `onClose` must be a function");return e}(t),l=(s=o('\n		<div class="basicLightbox '.concat(i.className,'">\n			<div class="basicLightbox__placeholder" role="dialog"></div>\n		</div>\n	'))).querySelector(".basicLightbox__placeholder"),u.forEach(function(e){return l.appendChild(e)}),c=n(l,"IMG"),a=n(l,"VIDEO"),d=n(l,"IFRAME"),!0===c&&s.classList.add("basicLightbox--img"),!0===a&&s.classList.add("basicLightbox--video"),!0===d&&s.classList.add("basicLightbox--iframe"),s),f=function(e){var u;return!1!==t.onClose(b)&&(u=function(){if("function"==typeof e)return e(b)},v.classList.remove("basicLightbox--visible"),setTimeout(function(){return!1===r(v)||v.parentElement.removeChild(v),u()},410),!0)};!0===t.closable&&v.addEventListener("click",function(e){e.target===v&&f()});var b={element:function(){return v},visible:function(){return r(v)},show:function(e){var u;return!1!==t.onShow(b)&&(u=function(){if("function"==typeof e)return e(b)},document.body.appendChild(v),setTimeout(function(){requestAnimationFrame(function(){return v.classList.add("basicLightbox--visible"),u()})},10),!0)},close:f};return b}},{}]},{},[1])(1),document.querySelector(".settings").addEventListener("click",t=>{let u=e.create(`
    <div class="modal">
      <div class="grid">
        <div class="grid__toggler toggler">
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
  `);u.show();let o=u.element(),n=o.querySelector(".toggler");n.addEventListener("click",()=>{n.classList.toggle("active")}),o.querySelector(".modal__close").addEventListener("click",()=>{u.close()})});
//# sourceMappingURL=RoomCraft.f6fb3ab0.js.map
