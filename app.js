(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const words = {
    beginner: ["bonjour","maison","école","clavier","ordinateur","soleil","livre","table","fenêtre","famille","stylo","cahier","jardin","sourire","musique","orange","chemin","facile","apprendre","écrire","vitesse","lettre","main","petit","grand","chaise","porte","image","temps","travail","salut","merci","demain","matin","soir","pluie","nuage","route","voiture","arbre"],
    intermediate: ["rapidement","précision","apprentissage","développement","concentration","informatique","organisation","performance","méthodique","clavier","exercice","régularité","attention","progresser","connaissance","professionnel","numérique","créativité","efficacité","indépendance","réussite","application","compétence","expérience","solution","programme","document","réflexion","objectif","amélioration"],
    advanced: ["L'entraînement régulier améliore la précision et la vitesse de frappe.","Chaque erreur est une occasion de corriger ses habitudes.","La maîtrise du clavier permet de travailler avec davantage d'efficacité.","Un bon rythme repose sur la concentration, la posture et la régularité.","Les outils numériques facilitent l'apprentissage lorsqu'ils sont utilisés avec méthode.","Prendre le temps de bien saisir chaque caractère aide à gagner en confiance."]
  };
  const texts = {
    beginner: ["Je m'entraîne à taper au clavier. Je regarde l'écran et je prends mon temps.","Chaque jour, je progresse un peu. Je fais attention aux lettres et aux espaces.","L'ordinateur est un outil utile pour apprendre, écrire et communiquer."],
    intermediate: ["La pratique régulière permet d'améliorer la vitesse de frappe sans sacrifier la précision. Il faut rester concentré et garder une posture confortable.","Un clavier bien maîtrisé aide à rédiger des documents, à faire des recherches et à communiquer plus facilement. La régularité fait la différence."],
    advanced: ["La rapidité ne suffit pas : une saisie efficace demande aussi de la précision, de la concentration et une bonne connaissance du clavier AZERTY. Avec un entraînement régulier, les gestes deviennent plus naturels.","Les compétences numériques occupent une place importante dans les études et la vie professionnelle. Savoir saisir un texte avec fluidité permet de gagner du temps et de se concentrer sur le contenu plutôt que sur chaque touche."]
  };
  const rows = [
    [{label:"²",sub:""},{label:"&",sub:"1"},{label:"é",sub:"2"},{label:""",sub:"3"},{label:"'",sub:"4"},{label:"(",sub:"5"},{label:"-",sub:"6"},{label:"è",sub:"7"},{label:"_",sub:"8"},{label:"ç",sub:"9"},{label:"à",sub:"0"},{label:")",sub:"°"},{label:"=",sub:"+"},{label:"⌫",sub:"Retour",wide:true}],
    [{label:"Tab",sub:"",wide:true},{label:"a",sub:"A"},{label:"z",sub:"Z"},{label:"e",sub:"E"},{label:"r",sub:"R"},{label:"t",sub:"T"},{label:"y",sub:"Y"},{label:"u",sub:"U"},{label:"i",sub:"I"},{label:"o",sub:"O"},{label:"p",sub:"P"},{label:"^",sub:"¨"},{label:"$",sub:"£",wide:true}],
    [{label:"⇪",sub:"Verr. Maj.",wide:true},{label:"q",sub:"Q"},{label:"s",sub:"S"},{label:"d",sub:"D"},{label:"f",sub:"F"},{label:"g",sub:"G"},{label:"h",sub:"H"},{label:"j",sub:"J"},{label:"k",sub:"K"},{label:"l",sub:"L"},{label:"m",sub:"M"},{label:"ù",sub:"%"},{label:"↵",sub:"Entrée",wide:true}],
    [{label:"⇧",sub:"Maj",wide:true},{label:"<",sub:">"},{label:"w",sub:"W"},{label:"x",sub:"X"},{label:"c",sub:"C"},{label:"v",sub:"V"},{label:"b",sub:"B"},{label:"n",sub:"N"},{label:",",sub:"?"},{label:";",sub:"."},{label:":",sub:"/"},{label:"!",sub:"§"},{label:"⇧",sub:"Maj",wide:true}],
    [{label:"Ctrl",sub:"",wide:true},{label:"Fn",sub:"",wide:true},{label:"⊞",sub:"",wide:true},{label:"Alt",sub:"",wide:true},{label:"Espace",sub:"",space:true},{label:"Alt Gr",sub:"",wide:true},{label:"Ctrl",sub:"",wide:true}]
  ];
  let target = "", startedAt = 0, endAt = 0, timerId = null, active = false, finished = false, duration = 30, errors = 0, lastLength = 0;
  const historyKey = "azerty-challenge-history-v1";
  const getHistory = () => { try { return JSON.parse(localStorage.getItem(historyKey) || "[]"); } catch (_) { return []; } };
  const saveHistory = (items) => { try { localStorage.setItem(historyKey, JSON.stringify(items.slice(0,100))); } catch (_) {} };
  const escapeHtml = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  function buildKeyboard() {
    $("virtual-keyboard").innerHTML = rows.map(row => '<div class="key-row">'+row.map(k => '<div class="key '+(k.wide?'wide ':'')+(k.space?'space':'')+'" data-key="'+escapeHtml(k.label.toLowerCase())+'"><span>'+escapeHtml(k.label)+'</span>'+(k.sub?'<span class="sub">'+escapeHtml(k.sub)+'</span>':'')+'</div>').join("")+'</div>').join("");
  }
  function makeTarget() {
    const level = $("difficulty").value, type = $("exercise-type").value;
    if (type === "text") return texts[level][Math.floor(Math.random()*texts[level].length)];
    const pool = words[level].join(" ").split(/s+/);
    const count = level === "beginner" ? 90 : level === "intermediate" ? 75 : 65;
    const out = [];
    for(let i=0;i<count;i++) out.push(pool[Math.floor(Math.random()*pool.length)]);
    return out.join(" ");
  }
  function renderText(value) {
    const typed = $("typing-input").value;
    let html = "";
    for(let i=0;i<value.length;i++) {
      let cls = "char";
      if(i < typed.length) cls += typed[i] === value[i] ? " correct" : " incorrect";
      else if(i === typed.length && active) cls += " current";
      html += '<span class="'+cls+'">'+(value[i] === " " ? "&nbsp;" : escapeHtml(value[i]))+'</span>';
    }
    $("text-display").innerHTML = html;
  }
  function formatTime(seconds) { return String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0"); }
  function stats() {
    const typed = $("typing-input").value;
    let correct = 0;
    for(let i=0;i<typed.length;i++) if(typed[i] === target[i]) correct++;
    const elapsed = startedAt ? Math.max(0.1, ((active ? Date.now() : endAt)-startedAt)/60000) : 0;
    const wpm = elapsed ? Math.round((correct/5)/elapsed) : 0;
    const accuracy = typed.length ? Math.round(correct/typed.length*100) : 100;
    errors = typed.length-correct;
    $("wpm").textContent = startedAt ? wpm : "—";
    $("accuracy").innerHTML = startedAt ? accuracy+'<small>%</small>' : '—<small>%</small>';
    $("errors").textContent = startedAt ? errors : "—";
    $("typed-progress").textContent = typed.length+" caractère"+(typed.length>1?"s":"")+" saisi"+(typed.length>1?"s":"");
    const remain = active ? Math.max(0,Math.ceil((duration*1000-(Date.now()-startedAt))/1000)) : (startedAt ? 0 : duration);
    $("time-left").textContent = formatTime(remain);
    $("time-progress").style.width = (remain/duration*100)+"%";
    return {wpm,accuracy,errors,typed:typed.length,correct};
  }
  function start() {
    stopTimer(); duration = Number($("duration").value); target = makeTarget(); startedAt = 0; endAt = 0; errors = 0; lastLength = 0; active = true; finished = false;
    $("typing-input").value = ""; $("typing-input").disabled = false; $("typing-input").placeholder = "Commence à taper ici…"; $("typing-input").focus();
    $("result-banner").hidden = true; $("exercise-status").textContent = "En cours"; $("typing-title").textContent = "Concentre-toi sur la précision";
    $("live-indicator")?.classList.add("running"); $("start-button").textContent = "Nouvel exercice →";
    renderText(target); stats(); $("typing-input").scrollIntoView({behavior:"smooth",block:"nearest"});
  }
  function stopTimer(){ if(timerId){clearInterval(timerId);timerId=null;} }
  function finish() {
    if(finished) return; finished = true; active = false; endAt = Date.now(); stopTimer();
    $("typing-input").disabled = true; $("exercise-status").textContent = "Terminé"; $("live-indicator")?.classList.remove("running");
    const s = stats(); const item = {date:new Date().toISOString(),type:$("exercise-type").value,level:$("difficulty").value,duration,wpm:s.wpm,accuracy:s.accuracy,errors:s.errors,chars:s.typed};
    const h = getHistory(); h.unshift(item); saveHistory(h); $("result-message").textContent = s.wpm+" mots/min · "+s.accuracy+" % de précision · "+s.errors+" erreur(s). Continue pour progresser !"; $("result-banner").hidden = false; $("session-count").textContent = h.length; $("start-button").textContent = "Faire un nouvel exercice →"; renderText(target); renderHistory();
  }
  function onInput() {
    if(!active) return;
    if(!startedAt){startedAt=Date.now();timerId=setInterval(()=>{stats();if(Date.now()-startedAt>=duration*1000)finish();},200);}
    const typed = $("typing-input").value;
    if(typed.length>target.length) $("typing-input").value = typed.slice(0,target.length);
    renderText(target); stats();
    const current = typed.slice(-1).toLowerCase();
    document.querySelectorAll(".key.active").forEach(el=>el.classList.remove("active"));
    if(current){let key = document.querySelector('.key[data-key="'+CSS.escape(current)+'"]'); if(key)key.classList.add("active");}
    if(typed.length>=target.length) finish();
  }
  function reset() {stopTimer();active=false;finished=false;startedAt=0;endAt=0;target="";$("typing-input").value="";$("typing-input").disabled=true;$("typing-input").placeholder="La zone de saisie sera activée au démarrage…";$("text-display").innerHTML='<p class="placeholder-text">Ton exercice apparaîtra ici. Choisis tes réglages puis clique sur <b>Commencer l\'exercice</b>.</p>';$("exercise-status").textContent="En attente";$("live-indicator")?.classList.remove("running");$("start-button").textContent="Commencer l'exercice →";$("result-banner").hidden=true;$("wpm").textContent="—";$("accuracy").innerHTML='—<small>%</small>';$("errors").textContent="—";$("time-left").textContent=formatTime(Number($("duration").value));$("time-progress").style.width="100%";$("typed-progress").textContent="0 caractère saisi";document.querySelectorAll(".key.active").forEach(el=>el.classList.remove("active"));}
  function renderHistory() {
    const h=getHistory(); $("session-count").textContent=h.length; $("history-total").textContent=h.length; $("history-best").textContent=h.length?Math.max(...h.map(x=>x.wpm||0)):0; $("history-accuracy").innerHTML=(h.length?Math.round(h.reduce((a,x)=>a+(x.accuracy||0),0)/h.length):0)+'<small>%</small>';
    const levelNames={beginner:"Débutant",intermediate:"Intermédiaire",advanced:"Avancé"},typeNames={words:"Mots",text:"Texte"};
    $("history-table").innerHTML=h.slice(0,30).map(x=>'<tr><td>'+new Date(x.date).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"})+'</td><td>'+typeNames[x.type]+'</td><td>'+levelNames[x.level]+'</td><td><b>'+x.wpm+' m/min</b></td><td>'+x.accuracy+' %</td><td>'+x.errors+'</td></tr>').join("");
    $("empty-history").hidden=h.length>0; $("history-table").parentElement.hidden=h.length===0;
  }
  function switchView(view) {
    const training=view==="training";$("training-view").hidden=!training;$("history-view").hidden=training;$("page-title").textContent=training?"Prêt à progresser ?":"Mes résultats";document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));if(!training)renderHistory();
  }
  $("start-button").addEventListener("click",start);$("retry-button").addEventListener("click",start);$("reset-button").addEventListener("click",reset);$("typing-input").addEventListener("input",onInput);
  $("duration").addEventListener("change",()=>{if(!active&&!startedAt){$("time-left").textContent=formatTime(Number($("duration").value));duration=Number($("duration").value);}});
  document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
  $("clear-history").addEventListener("click",()=>{if(confirm("Effacer tous les résultats enregistrés sur cet ordinateur ?")){saveHistory([]);renderHistory();}});
  window.addEventListener("keydown",e=>{if(active&&document.activeElement!==$("typing-input")&&e.key.length===1){$("typing-input").focus();}});
  let installPrompt=null;
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("install-button").hidden=false;});
  $("install-button").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("install-button").hidden=true;});
  if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost")) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
  buildKeyboard();renderHistory();reset();
})();