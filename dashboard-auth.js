const DASHBOARD_SESSION_KEY="elyanDashboardAuthenticated";
const DASHBOARD_USERNAME="elyanelixir88";
const DASHBOARD_PASSWORD_HASH="a60258c32ab79ec09de296d7a81f5bc1f499991cc1974b513f4eb0b239a65679";
const DASHBOARD_SALT="elyan-dashboard-2026:";

function unlockDashboard(){document.body.classList.remove("dashboard-locked");document.body.classList.add("dashboard-authenticated")}
function lockDashboard(){sessionStorage.removeItem(DASHBOARD_SESSION_KEY);document.body.classList.add("dashboard-locked");document.body.classList.remove("dashboard-authenticated");document.querySelector("#dashboard-password").value="";document.querySelector("#dashboard-user").focus()}
async function hashPassword(value){const bytes=new TextEncoder().encode(DASHBOARD_SALT+value),digest=await crypto.subtle.digest("SHA-256",bytes);return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,"0")).join("")}

if(sessionStorage.getItem(DASHBOARD_SESSION_KEY)==="yes")unlockDashboard();

document.querySelector("#dashboard-login").addEventListener("submit",async event=>{
  event.preventDefault();
  const username=document.querySelector("#dashboard-user").value.trim(),password=document.querySelector("#dashboard-password").value,message=document.querySelector("#login-message"),submit=event.currentTarget.querySelector(".login-submit");
  submit.disabled=true;submit.querySelector("span").textContent="Se verifică…";
  const passwordHash=await hashPassword(password);
  if(username===DASHBOARD_USERNAME&&passwordHash===DASHBOARD_PASSWORD_HASH){sessionStorage.setItem(DASHBOARD_SESSION_KEY,"yes");message.classList.remove("is-visible");unlockDashboard()}else{message.textContent="Utilizatorul sau parola nu sunt corecte.";message.classList.add("is-visible");document.querySelector("#dashboard-password").select()}
  submit.disabled=false;submit.querySelector("span").textContent="Intră în dashboard";
});

document.querySelector("#toggle-password").addEventListener("click",event=>{const input=document.querySelector("#dashboard-password"),show=input.type==="password";input.type=show?"text":"password";event.currentTarget.setAttribute("aria-label",show?"Ascunde parola":"Arată parola");event.currentTarget.innerHTML=`<i class="fa-regular fa-eye${show?"-slash":""}"></i>`});
document.querySelector("#dashboard-logout").addEventListener("click",lockDashboard);
