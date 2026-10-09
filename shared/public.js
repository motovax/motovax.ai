(() => {
const toggle = document.querySelector('.mv-menu-toggle');
const nav = document.querySelector('#mv-navigation');
function closeNav() { toggle?.setAttribute('aria-expanded','false'); nav?.classList.remove('is-open'); }
toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded',String(open)); nav.classList.toggle('is-open',open); });
nav?.addEventListener('click', e => { if(e.target.closest('a')) closeNav(); });
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeNav();});
const tabs = [...document.querySelectorAll('[data-platform-tab]')];
function activate(tab) { tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;}); }
tabs.forEach((tab,i)=> { tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=tabs[(i+1)%tabs.length];if(e.key==='ArrowLeft')next=tabs[(i+tabs.length-1)%tabs.length];if(e.key==='Home')next=tabs[0];if(e.key==='End')next=tabs.at(-1);if(next){e.preventDefault();activate(next);next.focus();}}); });
const viewer = document.querySelector('#platform-viewer');
let returnFocus;
document.querySelectorAll('[data-platform-full]').forEach(button=>button.addEventListener('click',()=>{returnFocus=button;const img=button.closest('[role="tabpanel"]').querySelector('img');viewer.querySelector('img').src=img.currentSrc;viewer.querySelector('img').alt=img.alt;viewer.showModal();document.body.style.overflow='hidden';}));
viewer?.querySelector('button').addEventListener('click',()=>viewer.close());
viewer?.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});
viewer?.addEventListener('close',()=>{document.body.style.overflow='';returnFocus?.focus();});
})();

if (document.body.classList.contains("mv-home")) {
/** Kompatibilitas session lama: handoff langsung, tanpa portal akun di landing. */
(function continueLegacyPortalHandoff() {
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const transferredToken = fragment.get("portal_session");
  if (!transferredToken) return;
  fragment.delete("portal_session");
  fragment.delete("portal_action");
  const cleanHash = fragment.toString();
  history.replaceState({}, "", `${location.pathname}${location.search}${cleanHash ? `#${cleanHash}` : ""}`);

  fetch("https://onboard.motovax.com/api/portal/workspace/enter", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${transferredToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ destination: "/" }),
  })
    .then(async (response) => {
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.redirectUrl) throw new Error("Session lama tidak dapat dilanjutkan.");
      window.location.replace(payload.redirectUrl);
    })
    .catch(() => {
      window.location.replace("https://onboard.motovax.com/login.html");
    });
})();

}
