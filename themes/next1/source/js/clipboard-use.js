/*页面载入完成后，创建复制按钮*/
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  var initCopyCode = function(){
    let parents = document.querySelectorAll(".highlight .code");
    parents.forEach(parent => {
      let btn = document.createElement('button');
      let i = document.createElement('i');
      let span = document.createElement('span');
      btn.classList.add('btn-copy');
      btn.setAttribute("data-clipboard-snippet", "");
      i.classList.add('fa', 'fa-clipboard');
      span.innerText = '复制';
      i.appendChild(span);
      btn.appendChild(i);
      parent.insertBefore(btn, parent.firstChild);
    })
    
    new ClipboardJS('.btn-copy', {
        target: function(trigger) {
            return trigger.nextElementSibling;
        }
    });
  }
  initCopyCode();
});