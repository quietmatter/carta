/* Preview harness only — injects a Paper/Dusk toggle and flips
   html[data-theme] so every specimen can be seen in both of the app's themes. */
(function(){
  function setTheme(t){
    document.documentElement.setAttribute('data-theme', t === 'dusk' ? 'dusk' : 'paper');
    document.querySelectorAll('.ds-theme button').forEach(function(b){
      b.classList.toggle('on', b.dataset.theme === t);
    });
  }
  window.addEventListener('DOMContentLoaded', function(){
    var bar = document.createElement('div');
    bar.className = 'ds-theme';
    bar.innerHTML = '<button data-theme="paper">Paper</button><button data-theme="dusk">Dusk</button>';
    document.body.appendChild(bar);
    bar.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){ setTheme(b.dataset.theme); });
    });
    setTheme('paper');
  });
})();
