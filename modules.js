(() => {
"use strict";
const $=id=>document.getElementById(id);
const view=$("skills-view"), content=$("skills-content");
if(!view||!content)return;
const bank={
windows:{title:"Windows en pratique",intro:"Entraîne-toi aux gestes essentiels du Bureau Windows.",items:[
{q:"Quel raccourci ouvre l’Explorateur de fichiers ?",opts:["Win + E","Ctrl + P","Alt + F4"],a:0,why:"Win + E ouvre l’Explorateur de fichiers."},
{q:"Quel raccourci copie un élément sélectionné ?",opts:["Ctrl + X","Ctrl + C","Ctrl + Z"],a:1,why:"Ctrl + C copie ; Ctrl + V colle ; Ctrl + X coupe."},
{q:"Où retrouve-t-on généralement un fichier supprimé ?",opts:["Dans la Corbeille","Dans le BIOS","Dans le presse-papiers"],a:0,why:"La Corbeille permet souvent de restaurer les fichiers supprimés."},
{q:"Quel raccourci bascule entre les fenêtres ouvertes ?",opts:["Alt + Tab","Win + L","Ctrl + A"],a:0,why:"Alt + Tab permet de passer d’une application ouverte à une autre."},
{q:"Quel est le rôle du Bureau ?",opts:["Afficher raccourcis et fenêtres de travail","Refroidir le processeur","Remplacer la mémoire RAM"],a:0,why:"Le Bureau est l’espace de travail principal de Windows."}]},
hardware:{title:"Reconnaître le matériel",intro:"Associe chaque composant à son rôle.",items:[
{q:"Quel composant exécute les instructions et les calculs ?",opts:["Processeur (CPU)","Clavier","Haut-parleur"],a:0,why:"Le CPU exécute les instructions des programmes."},
{q:"À quoi sert principalement la mémoire RAM ?",opts:["Stockage temporaire des données en cours","Impression des documents","Connexion de l’écran uniquement"],a:0,why:"La RAM conserve temporairement les données utilisées par les programmes."},
{q:"Quel composant relie les principaux éléments internes ?",opts:["Carte mère","Souris","Webcam"],a:0,why:"La carte mère connecte les composants entre eux."},
{q:"Quel périphérique sert à saisir du texte ?",opts:["Écran","Clavier","Imprimante"],a:1,why:"Le clavier est un périphérique d’entrée."},
{q:"Le SSD sert principalement à…",opts:["Stocker durablement les fichiers","Augmenter la luminosité","Produire du son"],a:0,why:"Le SSD conserve le système, les applications et les fichiers même hors tension."}]},
mouse:{title:"Maîtriser la souris",intro:"Choisis le geste adapté à chaque situation.",items:[
{q:"Pour ouvrir rapidement un dossier sur le Bureau, tu fais généralement…",opts:["Un double-clic gauche","Un clic droit maintenu 10 secondes","Un clic sur la molette uniquement"],a:0,why:"Le double-clic gauche ouvre généralement un dossier."},
{q:"Pour afficher le menu contextuel d’un fichier…",opts:["Clic droit","Double-clic gauche","Appuyer sur Espace"],a:0,why:"Le clic droit affiche les actions disponibles pour l’élément."},
{q:"Pour déplacer un fichier dans un dossier à l’écran, tu peux…",opts:["Le glisser-déposer","Éteindre l’écran","Cliquer sur la barre d’adresse du navigateur"],a:0,why:"Le glisser-déposer permet de déplacer un élément dans certaines conditions."},
{q:"À quoi sert la molette ?",opts:["Faire défiler une page","Supprimer définitivement un disque","Allumer l’ordinateur"],a:0,why:"La molette sert généralement à faire défiler le contenu."}]},
office:{title:"Bureautique : Word, Excel et PowerPoint",intro:"Choisis l’outil et la commande appropriés.",items:[
{q:"Quel logiciel convient le mieux pour rédiger une lettre ?",opts:["Word","Excel","Calculatrice"],a:0,why:"Word est un traitement de texte."},
{q:"Dans Excel, quelle formule additionne les cellules A1 à A5 en français ?",opts:["=SOMME(A1:A5)","=PLUS(A1-A5)","=AJOUTER(A1;A5)"],a:0,why:"La fonction SOMME additionne les valeurs d’une plage."},
{q:"Quel logiciel sert à présenter des diapositives ?",opts:["PowerPoint","Bloc-notes uniquement","Explorateur de fichiers"],a:0,why:"PowerPoint sert à créer des présentations composées de diapositives."},
{q:"Quel raccourci enregistre un document ?",opts:["Ctrl + S","Ctrl + D","Alt + Espace"],a:0,why:"Ctrl + S enregistre le document dans de nombreuses applications."}]},
ports:{title:"Câbles, ports et branchements",intro:"Reconnais les connecteurs et leur utilité.",items:[
{q:"Quel connecteur transmet souvent l’image et le son vers un écran ?",opts:["HDMI","RJ11 uniquement","Jack microphone uniquement"],a:0,why:"HDMI transporte généralement le son et la vidéo numériques."},
{q:"Quel port relie souvent un ordinateur à un réseau filaire ?",opts:["Ethernet (RJ45)","Sortie casque","Lecteur de carte SD uniquement"],a:0,why:"Le port Ethernet permet une connexion réseau filaire."},
{q:"Avant de débrancher un périphérique, il est préférable de…",opts:["Vérifier les consignes et éjecter proprement le stockage USB si nécessaire","Tirer brutalement sur le câble","Verser de l’eau sur le port"],a:0,why:"Une éjection propre réduit le risque de perte de données sur un support USB."},
{q:"Quel appareil produit une sortie papier ?",opts:["Imprimante","Microphone","Clavier"],a:0,why:"L’imprimante est un périphérique de sortie."}]},
security:{title:"Sécurité numérique",intro:"Adopte les bons réflexes face aux risques courants.",items:[
{q:"Quel mot de passe est le plus sûr ?",opts:["12345678","Un mot de passe long, unique et difficile à deviner","Le prénom de tout le monde"],a:1,why:"Utilise un mot de passe long et unique, idéalement géré par un gestionnaire."},
{q:"Un courriel inattendu demande ton mot de passe via un lien. Que faire ?",opts:["Ne pas cliquer et vérifier par un canal officiel","Répondre avec le mot de passe","Transférer à tous tes contacts"],a:0,why:"C’est un signe possible d’hameçonnage. Vérifie l’expéditeur et le site par une voie officielle."},
{q:"Pourquoi installer les mises à jour ?",opts:["Corriger des bugs et des failles de sécurité","Rendre les mots de passe publics","Désactiver automatiquement l’écran"],a:0,why:"Les mises à jour apportent notamment des corrections de sécurité."},
{q:"Où télécharger de préférence un logiciel ?",opts:["Depuis son site officiel ou une boutique fiable","Depuis n’importe quelle fenêtre publicitaire","Depuis un lien inconnu reçu par message"],a:0,why:"Privilégie les sources officielles et vérifie l’éditeur."}]},
troubleshoot:{title:"Atelier de dépannage",intro:"Analyse une situation avant d’agir. Ne démonte jamais un appareil branché.",items:[
{q:"L’écran reste noir. Quel premier contrôle simple faire ?",opts:["Vérifier l’alimentation, le bouton et le câble vidéo","Démonter immédiatement l’alimentation","Supprimer tous les fichiers"],a:0,why:"Commence par les vérifications externes simples et sans danger."},
{q:"L’ordinateur n’émet plus de son. Que vérifier d’abord ?",opts:["Volume, sortie audio sélectionnée et branchement","Changer le processeur tout de suite","Formater le disque"],a:0,why:"Vérifie le volume, le périphérique de sortie et les connexions."},
{q:"L’imprimante n’imprime pas. Quelle première démarche est logique ?",opts:["Vérifier alimentation, papier, connexion et file d’attente","Désinstaller Windows directement","Ouvrir le bloc d’alimentation"],a:0,why:"Les contrôles simples résolvent de nombreux problèmes d’impression."},
{q:"Le disque est presque plein. Quelle action prudente ?",opts:["Examiner les fichiers et utiliser les outils de stockage Windows","Supprimer des dossiers système au hasard","Désactiver toutes les protections"],a:0,why:"Utilise les paramètres de stockage et supprime seulement ce que tu connais."}]}
};
let active="windows",idx=0,score=0,answered=false;
const key="azerty-practical-skills-v1";
function stats(){let s={};try{s=JSON.parse(localStorage.getItem(key)||"{}")}catch(e){};let done=Object.values(s).reduce((n,x)=>n+(x.done||0),0),points=Object.values(s).reduce((n,x)=>n+(x.points||0),0);$("skills-done").textContent=done;$("skills-points").textContent=points;}
function record(){let s={};try{s=JSON.parse(localStorage.getItem(key)||"{}")}catch(e){};s[active]=s[active]||{done:0,points:0,best:0};s[active].done++;s[active].points+=score*10;s[active].best=Math.max(s[active].best,score);try{localStorage.setItem(key,JSON.stringify(s))}catch(e){}stats();}
function switchView(){document.querySelectorAll(".app-shell > .main-content > section[id$='-view']").forEach(el=>el.hidden=el.id!=="skills-view");document.querySelectorAll(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.view==="skills"));$("page-title").textContent="Informatique pratique";document.body.classList.remove("immersive-play");window.scrollTo(0,0);}
function render(){const d=bank[active];content.innerHTML='<div class="skill-intro"><div><span class="step-label">MODULE D’APPRENTISSAGE</span><h3>'+d.title+'</h3><p>'+d.intro+'</p></div><span class="skill-counter">Défi '+Math.min(idx+1,d.items.length)+' / '+d.items.length+'</span></div><div class="skill-progress"><span style="width:'+((idx/d.items.length)*100)+'%"></span></div><div class="skill-question" id="skill-question"></div>';}
function question(){const d=bank[active],host=$("skill-question");if(idx>=d.items.length){record();content.innerHTML='<div class="skill-finish"><div class="skill-finish-icon">🏆</div><span class="step-label">MODULE TERMINÉ</span><h3>Bien joué !</h3><p>Tu as obtenu <strong>'+score+' / '+d.items.length+'</strong>.</p><p>'+ (score===d.items.length?"Excellent ! Toutes les réponses sont correctes.":"Relis les explications puis rejoue pour améliorer ton score.")+'</p><button class="primary-button" id="skill-replay">Recommencer</button></div>'; $("skill-replay").onclick=()=>{idx=0;score=0;render();question()};return;}
const q=d.items[idx];answered=false;host.innerHTML='<span class="question-number">QUESTION '+(idx+1)+'</span><h4>'+q.q+'</h4><div class="skill-options">'+q.opts.map((o,i)=>'<button class="skill-option" data-answer="'+i+'"><span class="option-letter">'+String.fromCharCode(65+i)+'</span>'+o+'</button>').join("")+'</div><div id="skill-feedback" class="skill-feedback" aria-live="polite"></div><div class="skill-question-footer"><span>Score : '+score+'</span><button id="skill-next" class="primary-button" disabled>'+(idx===d.items.length-1?"Voir le résultat":"Question suivante")+" →</button></div>";
host.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{if(answered)return;answered=true;let ok=Number(b.dataset.answer)===q.a;if(ok)score++;host.querySelectorAll("[data-answer]").forEach((el,i)=>{el.disabled=true;if(i===q.a)el.classList.add("correct");else if(el===b)el.classList.add("incorrect")});$("skill-feedback").innerHTML='<strong>'+(ok?"Bonne réponse !":"Pas tout à fait.")+'</strong> '+q.why;$("skill-next").disabled=false;});
$("skill-next").onclick=()=>{idx++;question();};
}
document.addEventListener("click",e=>{const nav=e.target.closest('[data-view="skills"]');if(nav){e.preventDefault();switchView();active="windows";idx=0;score=0;document.querySelectorAll(".skill-tab").forEach(t=>t.classList.toggle("active",t.dataset.skill===active));render();question();}});
document.querySelectorAll(".skill-tab").forEach(t=>t.addEventListener("click",()=>{active=t.dataset.skill;idx=0;score=0;document.querySelectorAll(".skill-tab").forEach(x=>x.classList.toggle("active",x===t));render();question();}));
const originalClick=document.querySelectorAll(".nav-item:not([data-view='skills'])");originalClick.forEach(b=>b.addEventListener("click",()=>{view.hidden=true;}));
stats();
})();