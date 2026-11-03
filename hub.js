// hub.js — shared account logic for Noam's Game Hub
// Loaded on every page:  <script type="module" src="/hub.js"></script>
// Games call (no imports needed):
//   window.GameHub.saveScore(score)   → saves best score + play count for this game
//   window.GameHub.recordPlay()       → counts a play (games without a score)
//   window.GameHub.saveData({...}) / await window.GameHub.loadData()  → any saved progress

import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc, getDoc, setDoc, getDocs, collection, increment, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---------- Clean URLs: /login instead of /login.html, / instead of /index.html ----------
(() => {
    const p = location.pathname;
    const clean = p.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");
    if (clean !== p) history.replaceState(null, "", clean + location.search + location.hash);
})();

const ADSENSE_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8671583156732584";

import { GAMES, PLAY_ONLY, DEFAULT_PREMIUM } from "./games.js";
export { GAMES };

// ---------- Helpers ----------
export function gameIdFromPath(path) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const id = parts[0].toLowerCase();
    return GAMES[id] ? id : null;
}
export const CURRENT_GAME = gameIdFromPath(decodeURIComponent(location.pathname));

// ---------- Account + settings state ----------
export const state = { user: null, profile: null, premiumGames: DEFAULT_PREMIUM };

export const isPremium = (profile = state.profile) => !!(profile && (profile.premium || profile.role === "admin"));
export const isPremiumGame = (id) => state.premiumGames.includes(id);
export const isLockedGame = (id, profile = state.profile) => isPremiumGame(id) && !isPremium(profile);

const settingsLoaded = getDoc(doc(db, "settings", "games"))
    .then((snap) => { if (snap.exists() && Array.isArray(snap.data().premium)) state.premiumGames = snap.data().premium; })
    .catch((e) => console.warn("[GameHub] settings load failed", e));

const listeners = new Set();
let resolveReady;
export const ready = new Promise((r) => (resolveReady = r));
let first = true;

onAuthStateChanged(auth, async (user) => {
    state.user = user;
    state.profile = null;
    if (user) {
        try {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) state.profile = snap.data();
        } catch (e) { console.warn("[GameHub] profile load failed", e); }
    }
    await settingsLoaded;
    if (first) { first = false; resolveReady(state); }
    listeners.forEach((cb) => cb(state));
});

export function onAccount(cb) {
    listeners.add(cb);
    ready.then(() => cb(state));
    return () => listeners.delete(cb);
}

export async function savePremiumGames(list) {
    await setDoc(doc(db, "settings", "games"), { premium: list, updatedAt: serverTimestamp() }, { merge: true });
    state.premiumGames = list;
}

// ---------- Ads: only for visitors who aren't premium ----------
function loadAds() {
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = ADSENSE_SRC;
    document.head.appendChild(s);
}
ready.then(() => { if (!isPremium()) loadAds(); });

// ---------- Saving scores & progress ----------
const gameRef = (uid, id) => doc(db, "users", uid, "games", id);

export async function saveScore(score, game = CURRENT_GAME) {
    await ready;
    score = Math.floor(Number(score));
    if (!game || !Number.isFinite(score) || score < 0) return { saved: false };
    if (!state.user) { nudgeLogin(); return { saved: false }; }
    try {
        const ref = gameRef(state.user.uid, game);
        const snap = await getDoc(ref);
        const oldBest = snap.exists() ? (snap.data().best ?? 0) : 0;
        const best = Math.max(oldBest, score);
        await setDoc(ref, { best, lastScore: score, plays: increment(1), lastPlayed: serverTimestamp() }, { merge: true });
        if (score > oldBest && score > 0 && CURRENT_GAME) toast(`🏆 New personal best: ${score}! Saved to your profile`);
        return { saved: true, best, newBest: score > oldBest };
    } catch (e) {
        console.warn("[GameHub] save failed", e);
        return { saved: false };
    }
}

export async function recordPlay(game = CURRENT_GAME) {
    await ready;
    if (!game || !state.user) return { saved: false };
    try {
        await setDoc(gameRef(state.user.uid, game), { plays: increment(1), lastPlayed: serverTimestamp() }, { merge: true });
        return { saved: true };
    } catch (e) { return { saved: false }; }
}

export async function saveData(data, game = CURRENT_GAME) {
    await ready;
    if (!game || !state.user) return { saved: false };
    await setDoc(gameRef(state.user.uid, game), { data, lastPlayed: serverTimestamp() }, { merge: true });
    return { saved: true };
}

export async function loadData(game = CURRENT_GAME) {
    await ready;
    if (!game || !state.user) return null;
    const snap = await getDoc(gameRef(state.user.uid, game));
    return snap.exists() ? (snap.data().data ?? null) : null;
}

export async function getMyGames(uid = state.user?.uid) {
    if (!uid) return {};
    const snap = await getDocs(collection(db, "users", uid, "games"));
    const out = {};
    snap.forEach((d) => (out[d.id] = d.data()));
    return out;
}

// ---------- Small UI for game pages ----------
function ensureStyles() {
    if (document.getElementById("gh-styles")) return;
    const st = document.createElement("style");
    st.id = "gh-styles";
    st.textContent = `
      .gh-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(20px);opacity:0;
        background:#171b36;color:#eef0ff;border:1px solid #7c5cff;border-radius:12px;padding:12px 18px;
        font:600 14px Inter,system-ui,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.5);z-index:99999;
        transition:opacity .25s,transform .25s;pointer-events:none;max-width:90vw;text-align:center}
      .gh-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
      .gh-toast a{color:#2ee6c9;pointer-events:auto}
      .gh-lock{position:fixed;inset:0;z-index:99998;display:grid;place-items:center;padding:16px;
        background:rgba(11,13,26,.97);backdrop-filter:blur(8px);font-family:Inter,system-ui,sans-serif;color:#eef0ff}
      .gh-lock .box{max-width:420px;text-align:center;background:#171b36;border:1px solid #2a3060;border-radius:20px;padding:32px 26px}
      .gh-lock .star{font-size:44px;color:#ffc94d}
      .gh-lock h2{margin:10px 0 8px;font-size:22px}
      .gh-lock p{color:#9aa0c8;margin:0 0 22px;line-height:1.5}
      .gh-lock a{display:inline-block;margin:4px;padding:11px 20px;border-radius:10px;text-decoration:none;font-weight:700}
      .gh-lock .primary{background:#7c5cff;color:#fff}.gh-lock .ghost{border:1px solid #2a3060;color:#eef0ff}`;
    document.head.appendChild(st);
}

export function toast(html, ms = 3200) {
    ensureStyles();
    let t = document.querySelector(".gh-toast");
    if (!t) { t = document.createElement("div"); t.className = "gh-toast"; document.body.appendChild(t); }
    t.innerHTML = html;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("show"), ms);
}

let nudged = false;
function nudgeLogin() {
    if (nudged || !CURRENT_GAME) return;
    nudged = true;
    const next = encodeURIComponent(GAMES[CURRENT_GAME]?.path || "/");
    toast(`<a href="/login?next=${next}">Log in</a> to save your scores to your profile`, 5000);
}

function showLock() {
    ensureStyles();
    const loggedIn = !!state.user;
    const next = encodeURIComponent(GAMES[CURRENT_GAME]?.path || "/");
    const el = document.createElement("div");
    el.className = "gh-lock";
    el.innerHTML = `<div class="box">
        <div class="star">★</div>
        <h2>${GAMES[CURRENT_GAME]?.name || "This game"} is Premium</h2>
        <p>${loggedIn ? "Your account is on the free plan. Premium unlocks every ★ game and removes all ads."
                      : "Premium is ₪10, once, for life. Already have it? Log in."}</p>
        <a class="primary" href="/premium">★ Get Premium · ₪10</a>
        ${loggedIn ? "" : `<a class="ghost" href="/login?next=${next}">Log in</a>`}
        <a class="ghost" href="/">Back to games</a>
      </div>`;
    document.body.appendChild(el);
    // stop the game underneath from taking keys
    addEventListener("keydown", (e) => e.stopImmediatePropagation(), true);
}

if (CURRENT_GAME) {
    ready.then(() => {
        if (isLockedGame(CURRENT_GAME)) showLock();
        else if (PLAY_ONLY.includes(CURRENT_GAME)) recordPlay();
    });
}

// For plain (non-module) game scripts
window.GameHub = { saveScore, recordPlay, saveData, loadData, ready, state, isPremium: () => isPremium() };
