const fs = require('fs');
const path = require('path');

const root = __dirname;
const fontB64 = fs.readFileSync(path.join(root, 'assets/BurbankBigCondensed-Bold.otf')).toString('base64');
const buttonB64 = fs.readFileSync(path.join(root, 'assets/button.png')).toString('base64');
const peerJsCode = fs.readFileSync(path.join(root, 'assets/peerjs.min.js'), 'utf8').replace(/\/\/# sourceMappingURL=.*$/m, '');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Geometry Rush - Party Manager</title>
  <style>
    @font-face {
      font-family: 'Burbank Big Condensed';
      src: url('data:font/otf;base64,${fontB64}') format('opentype');
      font-weight: normal;
      font-style: normal;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Burbank Big Condensed', Impact, 'Arial Narrow', sans-serif;
      font-weight: normal;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      background: transparent;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
    }

    /* Modal Backdrop */
    .grp-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(8, 18, 28, 0.48);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      animation: grp-fade 0.18s ease-out;
    }

    /* Main Party Panel - Clean white card like Fortnite, NO black border */
    .grp-panel {
      position: relative;
      width: 92%;
      max-width: 960px;
      height: 90%;
      max-height: 540px;
      background: #ffffff;
      border: none;
      border-radius: 6px;
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.38);
      display: flex;
      flex-direction: column;
      padding: 22px 28px 18px;
      overflow: hidden;
      animation: grp-pop 0.22s cubic-bezier(0.2, 1.25, 0.4, 1);
    }

    /* Buttons using user's button.png */
    .grp-btn {
      appearance: none;
      -webkit-appearance: none;
      border: 0;
      outline: 0;
      background: transparent url('data:image/png;base64,${buttonB64}') center / 100% 100% no-repeat;
      color: #000;
      font-size: 28px;
      line-height: 1;
      height: 52px;
      min-width: 190px;
      padding: 5px 32px 0;
      cursor: pointer;
      text-transform: uppercase;
      white-space: nowrap;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.09s ease, filter 0.12s ease;
    }
    .grp-btn:hover {
      filter: brightness(1.12);
      transform: scale(1.03);
    }
    .grp-btn:active {
      transform: scale(0.96);
      filter: brightness(0.92);
    }
    .grp-btn:disabled {
      filter: grayscale(1) brightness(1.15);
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .grp-btn-sm {
      height: 38px !important;
      min-width: 110px !important;
      font-size: 21px !important;
      padding: 3px 18px 0 !important;
    }
    .grp-btn-lg {
      height: 60px !important;
      min-width: 240px !important;
      font-size: 36px !important;
      padding: 5px 28px 0 !important;
    }

    /* Views */
    .grp-view {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    /* Header */
    .grp-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }
    .grp-title {
      font-size: 64px;
      line-height: 0.85;
      text-transform: uppercase;
      padding-top: 4px;
      letter-spacing: 0.5px;
      color: #000;
    }

    /* Screen 1: CREATE OR JOIN PARTY screen */
    .grp-menu-body {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px;
      margin-top: 18px;
    }
    .grp-tile {
      background: #f1f4f8;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 24px 20px;
      text-align: center;
      min-height: 0;
      transition: background 0.15s;
    }
    .grp-tile:hover {
      background: #e9eef4;
    }
    .grp-tile-title {
      font-size: 44px;
      line-height: 0.9;
      color: #000;
    }
    .grp-tile-text {
      font-size: 21px;
      color: #66727f;
      max-width: 320px;
      line-height: 1.15;
    }
    .grp-code-input {
      width: 250px;
      height: 54px;
      border: 3px solid #cbd3dc;
      border-radius: 4px;
      background: #fff;
      font-size: 36px;
      text-align: center;
      letter-spacing: 6px;
      padding-top: 4px;
      outline: none;
      text-transform: uppercase;
      color: #000;
      user-select: text;
      -webkit-user-select: text;
      transition: border-color 0.12s;
    }
    .grp-code-input:focus {
      border-color: #0088ff;
    }
    .grp-code-input::placeholder {
      color: #a4b0bc;
      letter-spacing: 3px;
    }

    /* Screen 2: In-Party Screen */
    .grp-code-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 10px 0 14px;
    }
    .grp-code-label {
      font-size: 26px;
      color: #68737e;
      padding-top: 3px;
    }
    .grp-code {
      font-size: 36px;
      letter-spacing: 4px;
      color: #0088ff;
      padding-top: 2px;
      min-width: 140px;
    }

    /* 4 Player Slots Grid */
    .grp-slots {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .grp-slot {
      position: relative;
      background: #f1f4f8;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 30px 10px 12px;
      min-height: 0;
      overflow: hidden;
      transition: transform 0.12s, box-shadow 0.12s;
    }
    .grp-slot.grp-me {
      background: #e4f1ff;
    }
    .grp-slot.grp-empty {
      background: transparent;
      border: 3px dashed #d1d8df;
    }

    /* Badges */
    .grp-tags {
      position: absolute;
      top: 8px;
      left: 8px;
      right: 8px;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
    }
    .grp-tag {
      font-size: 17px;
      line-height: 1;
      padding: 3px 8px 1px;
      border-radius: 3px;
    }
    .grp-tag-leader {
      background: #ffd23f;
      color: #000;
    }
    .grp-tag-you {
      background: #0088ff;
      color: #fff;
    }

    /* Avatar Icon - Pure programmatic display, NO manual picker! */
    .grp-icon-wrapper {
      position: relative;
      width: 58%;
      max-width: 120px;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 1;
      min-height: 0;
      cursor: default; /* Icon choosing inside UI removed as requested */
    }
    .grp-icon-wrapper img, .grp-icon-wrapper svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      border-radius: 4px;
      -webkit-user-drag: none;
    }
    .grp-slot.grp-empty .grp-icon-wrapper {
      border: 3px dashed #d1d8df;
      border-radius: 8px;
    }

    /* Player Name */
    .grp-name {
      font-size: 29px;
      line-height: 1;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-transform: uppercase;
      padding-top: 4px;
      color: #000;
    }
    .grp-slot.grp-empty .grp-name {
      color: #adb6c0;
    }

    /* Footer */
    .grp-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 14px;
    }
    .grp-msg {
      font-size: 24px;
      color: #4f5862;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-top: 3px;
      text-transform: uppercase;
    }
    .grp-msg.grp-err {
      color: #e0243a;
    }

    /* Unread chat notification badge */
    .grp-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 22px;
      background: #ff2a4b;
      color: #ffffff;
      font-size: 16px;
      border-radius: 11px;
      padding: 0 6px;
      margin-left: 8px;
      vertical-align: middle;
      box-shadow: 0 2px 6px rgba(255, 42, 75, 0.4);
    }

    /* Party Chat Drawer */
    .grp-chat-drawer {
      position: absolute;
      top: 0;
      right: 0;
      width: 360px;
      max-width: 90%;
      height: 100%;
      background: #ffffff;
      border-left: 3px solid #e1e7ee;
      box-shadow: -8px 0 32px rgba(0, 0, 0, 0.16);
      display: flex;
      flex-direction: column;
      z-index: 60;
      transform: translateX(105%);
      transition: transform 0.22s cubic-bezier(0.2, 1, 0.3, 1);
      border-radius: 0 6px 6px 0;
    }
    .grp-chat-drawer.open {
      transform: translateX(0);
    }
    .grp-chat-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px 12px;
      background: #f8fafc;
      border-bottom: 2px solid #e9eef4;
    }
    .grp-chat-title {
      font-size: 34px;
      line-height: 1;
      letter-spacing: 0.5px;
      color: #000;
    }
    .grp-chat-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #ffffff;
    }
    .grp-chat-body::-webkit-scrollbar {
      width: 6px;
    }
    .grp-chat-body::-webkit-scrollbar-track {
      background: #f1f4f8;
    }
    .grp-chat-body::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    .grp-chat-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
      word-break: break-word;
    }
    .grp-chat-sender {
      font-size: 18px;
      line-height: 1;
      text-transform: uppercase;
      color: #64748b;
    }
    .grp-chat-sender.leader {
      color: #d97706;
    }
    .grp-chat-sender.me {
      color: #0088ff;
    }
    .grp-chat-bubble {
      background: #f1f5f9;
      border-radius: 6px;
      padding: 8px 12px 6px;
      font-size: 21px;
      line-height: 1.15;
      color: #0f172a;
      user-select: text;
      -webkit-user-select: text;
    }
    .grp-chat-item.me .grp-chat-bubble {
      background: #e0f2fe;
    }
    .grp-chat-sys {
      align-self: center;
      background: #f1f5f9;
      color: #64748b;
      font-size: 16px;
      line-height: 1;
      padding: 4px 10px 2px;
      border-radius: 12px;
      text-transform: uppercase;
      text-align: center;
      margin: 2px 0;
    }
    .grp-chat-foot {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 12px 16px;
      border-top: 2px solid #e9eef4;
      background: #f8fafc;
    }
    .grp-chat-input {
      flex: 1;
      height: 42px;
      border: 2px solid #cbd5e1;
      border-radius: 4px;
      background: #fff;
      font-size: 20px;
      padding: 4px 10px 0;
      outline: none;
      color: #000;
      user-select: text;
      -webkit-user-select: text;
    }
    .grp-chat-input:focus {
      border-color: #0088ff;
    }
    .grp-chat-input::placeholder {
      color: #94a3b8;
    }

    /* Busy Spinner Overlay */
    .grp-busy {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.94);
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 22px;
      z-index: 40;
    }
    .grp-busy.open {
      display: flex;
    }
    .grp-cube {
      width: 54px;
      height: 54px;
      background: #0088ff;
      border: 4px solid #000;
      animation: grp-jump 0.7s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .grp-busy-text {
      font-size: 34px;
      color: #000;
      text-transform: uppercase;
    }

    @keyframes grp-jump {
      0% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-34px) rotate(90deg); }
      100% { transform: translateY(0) rotate(180deg); }
    }
    @keyframes grp-pop {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes grp-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>
</head>
<body>

  <!-- Fullscreen Modal Container -->
  <div class="grp-backdrop" id="grpBackdrop">
    <div class="grp-panel">

      <!-- ======================================================== -->
      <!-- SCREEN 1: CREATE OR JOIN PARTY SCREEN                   -->
      <!-- ======================================================== -->
      <div class="grp-view" id="viewMenu">
        <div class="grp-head">
          <h1 class="grp-title">PARTY</h1>
        </div>

        <div class="grp-menu-body">
          <!-- Create Party Card -->
          <div class="grp-tile">
            <div class="grp-tile-title">CREATE PARTY</div>
            <div class="grp-tile-text">START A NEW PARTY AND SHARE THE CODE WITH YOUR FRIENDS.</div>
            <button class="grp-btn grp-btn-lg" id="btnCreate">CREATE</button>
          </div>

          <!-- Join Party Card -->
          <div class="grp-tile">
            <div class="grp-tile-title">JOIN PARTY</div>
            <input 
              type="text" 
              class="grp-code-input" 
              id="inputCode" 
              placeholder="CODE" 
              maxlength="6"
              autocomplete="off"
              spellcheck="false"
            />
            <button class="grp-btn grp-btn-lg" id="btnJoin">JOIN</button>
          </div>
        </div>

        <div class="grp-foot">
          <div class="grp-msg" id="menuMsg">LOGGED IN AS PLAYER1</div>
          <button class="grp-btn" id="btnMenuExit">EXIT</button>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- SCREEN 2: IN-PARTY SCREEN                               -->
      <!-- ======================================================== -->
      <div class="grp-view" id="viewParty" style="display: none;">
        <div class="grp-head">
          <h1 class="grp-title">YOUR PARTY</h1>
          <button class="grp-btn" id="btnLeaveParty">LEAVE PARTY</button>
        </div>

        <div class="grp-code-row">
          <div class="grp-code-label">PARTY CODE</div>
          <div class="grp-code" id="partyCodeDisplay">------</div>
          <button class="grp-btn grp-btn-sm" id="btnCopyCode">COPY</button>
        </div>

        <!-- 4 Player Slots Grid -->
        <div class="grp-slots" id="slotsContainer">
          <!-- Rendered dynamically -->
        </div>

        <div class="grp-foot">
          <div class="grp-msg" id="partyMsg">1/4 PLAYERS</div>
          <!-- EXIT button replaced with CHAT button as requested! -->
          <button class="grp-btn" id="btnPartyChat">
            CHAT<span class="grp-badge" id="chatBadge" style="display: none;">0</span>
          </button>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PARTY CHAT DRAWER                                        -->
      <!-- ======================================================== -->
      <div class="grp-chat-drawer" id="chatDrawer">
        <div class="grp-chat-head">
          <div class="grp-chat-title">PARTY CHAT</div>
          <button class="grp-btn grp-btn-sm" id="btnCloseChat">CLOSE</button>
        </div>
        <div class="grp-chat-body" id="chatMessages">
          <div class="grp-chat-sys">WELCOME TO PARTY CHAT!</div>
        </div>
        <form class="grp-chat-foot" id="chatForm">
          <input 
            type="text" 
            class="grp-chat-input" 
            id="chatInput" 
            placeholder="TYPE A MESSAGE..." 
            maxlength="120"
            autocomplete="off"
            spellcheck="false"
          />
          <button type="submit" class="grp-btn grp-btn-sm" id="btnSendChat">SEND</button>
        </form>
      </div>

      <!-- Busy Loading Overlay -->
      <div class="grp-busy" id="busyOverlay">
        <div class="grp-cube"></div>
        <div class="grp-busy-text" id="busyText">CONNECTING...</div>
      </div>

    </div>
  </div>

  <!-- PeerJS Library -->
  <script>
    ${peerJsCode}
  </script>

  <!-- Party Manager Core Script -->
  <script>
    (function() {
      'use strict';

      // Default fallback avatar (Cyan Rusher Cube)
      const DEFAULT_ICON = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="92" height="92" fill="#FFF78A" stroke="#000" stroke-width="6"/><rect x="20" y="22" width="22" height="22" fill="#8AF7FF"/><rect x="58" y="22" width="22" height="22" fill="#8AF7FF"/><rect x="22" y="62" width="56" height="15" fill="#8AF7FF"/></svg>';

      // Party State
      const PEER_PREFIX = 'gr-party-v1-';
      const state = {
        username: 'Player1',
        token: '',
        icon: DEFAULT_ICON, // Set via Scratch costume / API
        inParty: false,
        isLeader: true,
        partyCode: '',
        leaderName: 'Player1',
        members: [] // [{ name, icon, isLeader }]
      };

      // Networking references
      let peer = null;
      let hostConn = null;
      let memberConns = new Map(); // username -> conn
      let heartbeatTimer = null;
      let unreadChatCount = 0;
      let isChatOpen = false;

      // DOM Elements
      const viewMenu = document.getElementById('viewMenu');
      const viewParty = document.getElementById('viewParty');
      const btnCreate = document.getElementById('btnCreate');
      const inputCode = document.getElementById('inputCode');
      const btnJoin = document.getElementById('btnJoin');
      const btnMenuExit = document.getElementById('btnMenuExit');
      const menuMsg = document.getElementById('menuMsg');
      const partyCodeDisplay = document.getElementById('partyCodeDisplay');
      const btnCopyCode = document.getElementById('btnCopyCode');
      const btnLeaveParty = document.getElementById('btnLeaveParty');
      const btnPartyChat = document.getElementById('btnPartyChat');
      const chatBadge = document.getElementById('chatBadge');
      const slotsContainer = document.getElementById('slotsContainer');
      const partyMsg = document.getElementById('partyMsg');
      const busyOverlay = document.getElementById('busyOverlay');
      const busyText = document.getElementById('busyText');

      // Chat Elements
      const chatDrawer = document.getElementById('chatDrawer');
      const btnCloseChat = document.getElementById('btnCloseChat');
      const chatMessages = document.getElementById('chatMessages');
      const chatForm = document.getElementById('chatForm');
      const chatInput = document.getElementById('chatInput');

      // Helpers
      function generateCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      }

      function cleanName(n) {
        return String(n || '').trim().slice(0, 32);
      }

      function showBusy(text) {
        busyText.textContent = text || 'CONNECTING...';
        busyOverlay.classList.add('open');
      }

      function hideBusy() {
        busyOverlay.classList.remove('open');
      }

      function notifyParent(action, payload) {
        const msg = { source: 'GEOMETRY_RUSH_PARTY_UI', action, payload: payload || {} };
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(msg, '*');
        }
        if (window.__GEOMETRY_RUSH_PARTY_EXTENSION__) {
          window.__GEOMETRY_RUSH_PARTY_EXTENSION__.handleUIAction(action, payload);
        }
      }

      function renderIconInto(container, iconData) {
        container.innerHTML = '';
        if (!iconData) {
          container.innerHTML = DEFAULT_ICON;
          return;
        }
        if (iconData.trim().startsWith('<svg')) {
          container.innerHTML = iconData;
        } else {
          const img = document.createElement('img');
          img.src = iconData;
          img.alt = '';
          img.onerror = () => { container.innerHTML = DEFAULT_ICON; };
          container.appendChild(img);
        }
      }

      // --- Chat System ---
      function openChat() {
        isChatOpen = true;
        chatDrawer.classList.add('open');
        unreadChatCount = 0;
        updateChatBadge();
        chatInput.focus();
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      function closeChat() {
        isChatOpen = false;
        chatDrawer.classList.remove('open');
      }

      function toggleChat() {
        if (isChatOpen) closeChat();
        else openChat();
      }

      function updateChatBadge() {
        if (unreadChatCount > 0 && !isChatOpen) {
          chatBadge.textContent = unreadChatCount > 9 ? '9+' : unreadChatCount;
          chatBadge.style.display = 'inline-flex';
        } else {
          chatBadge.style.display = 'none';
        }
      }

      function appendChatMessage(sender, text, isSystem = false) {
        if (isSystem) {
          const sys = document.createElement('div');
          sys.className = 'grp-chat-sys';
          sys.textContent = text;
          chatMessages.appendChild(sys);
        } else {
          const isMe = cleanName(sender).toLowerCase() === state.username.toLowerCase();
          const isLeader = cleanName(sender).toLowerCase() === state.leaderName.toLowerCase();

          const item = document.createElement('div');
          item.className = 'grp-chat-item' + (isMe ? ' me' : '');

          const senderEl = document.createElement('div');
          senderEl.className = 'grp-chat-sender' + (isLeader ? ' leader' : (isMe ? ' me' : ''));
          senderEl.textContent = (isLeader ? '👑 ' : '') + sender + (isMe ? ' (YOU)' : '');
          item.appendChild(senderEl);

          const bubble = document.createElement('div');
          bubble.className = 'grp-chat-bubble';
          bubble.textContent = text;
          item.appendChild(bubble);

          chatMessages.appendChild(item);

          if (!isChatOpen && !isMe) {
            unreadChatCount++;
            updateChatBadge();
          }
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      function sendChat(rawText) {
        const text = String(rawText || '').trim().slice(0, 140);
        if (!text) return;

        appendChatMessage(state.username, text, false);
        notifyParent('CHAT_MESSAGE', { sender: state.username, text });

        if (state.isLeader) {
          const msg = { t: 'chat', from: state.username, text };
          for (const conn of memberConns.values()) {
            try { if (conn.open) conn.send(msg); } catch(e){}
          }
        } else if (hostConn && hostConn.open) {
          try { hostConn.send({ t: 'chat', text }); } catch(e){}
        }
      }

      // --- PeerJS / P2P Core ---
      function openPeer(id) {
        return new Promise((resolve, reject) => {
          const p = id ? new Peer(id) : new Peer();
          const timer = setTimeout(() => reject(new Error('Signaling server timeout')), 10000);
          p.on('open', () => {
            clearTimeout(timer);
            resolve(p);
          });
          p.on('error', (err) => {
            clearTimeout(timer);
            reject(err);
          });
        });
      }

      async function createParty() {
        showBusy('CREATING PARTY...');
        const code = generateCode();
        try {
          if (peer) { try { peer.destroy(); } catch(e){} }
          peer = await openPeer(PEER_PREFIX + code);
          state.inParty = true;
          state.isLeader = true;
          state.partyCode = code;
          state.leaderName = state.username;
          state.members = [
            { name: state.username, icon: state.icon, isLeader: true }
          ];

          peer.on('connection', (conn) => handleHostConnection(conn));
          startHeartbeat();
          hideBusy();
          render();
          notifyParent('PARTY_CREATED', { code });
        } catch (err) {
          hideBusy();
          menuMsg.textContent = 'COULD NOT CREATE PARTY. TRY AGAIN.';
          menuMsg.classList.add('grp-err');
        }
      }

      function handleHostConnection(conn) {
        let memberName = '';
        conn.on('data', (d) => {
          if (!d || typeof d !== 'object') return;
          if (d.t === 'hello') {
            const name = cleanName(d.name);
            if (!name || state.members.length >= 4) {
              try { conn.send({ t: 'reject', reason: 'Party is full' }); conn.close(); } catch(e){}
              return;
            }
            memberName = name;
            memberConns.set(name.toLowerCase(), conn);
            state.members.push({ name, icon: d.icon || '', isLeader: false });
            try { conn.send({ t: 'welcome', code: state.partyCode }); } catch(e){}
            broadcastState();
            render();
            appendChatMessage('', name + ' JOINED THE PARTY', true);
            notifyParent('PLAYER_JOINED', { name });
          } else if (d.t === 'icon') {
            const m = state.members.find(x => x.name.toLowerCase() === (d.name || '').toLowerCase());
            if (m) m.icon = d.icon;
            broadcastState();
            render();
          } else if (d.t === 'chat') {
            const text = String(d.text || '').trim().slice(0, 140);
            if (text && memberName) {
              appendChatMessage(memberName, text, false);
              notifyParent('CHAT_MESSAGE', { sender: memberName, text });
              // Relay to other members
              const relay = { t: 'chat', from: memberName, text };
              for (const [n, c] of memberConns.entries()) {
                if (c !== conn) {
                  try { if (c.open) c.send(relay); } catch(e){}
                }
              }
            }
          } else if (d.t === 'leave') {
            removeMember(d.name);
          }
        });

        conn.on('close', () => {
          for (const [name, c] of memberConns.entries()) {
            if (c === conn) {
              removeMember(name);
              break;
            }
          }
        });
      }

      function broadcastState() {
        const msg = {
          t: 'state',
          code: state.partyCode,
          leader: state.leaderName,
          members: state.members
        };
        for (const conn of memberConns.values()) {
          try { if (conn.open) conn.send(msg); } catch(e){}
        }
      }

      function removeMember(name) {
        const clean = cleanName(name);
        memberConns.delete(clean.toLowerCase());
        state.members = state.members.filter(m => m.name.toLowerCase() !== clean.toLowerCase());
        broadcastState();
        render();
        appendChatMessage('', clean + ' LEFT THE PARTY', true);
        notifyParent('PLAYER_LEFT', { name: clean });
      }

      async function joinParty(rawCode) {
        const code = String(rawCode || '').trim().toUpperCase();
        if (code.length !== 6) {
          menuMsg.textContent = 'PARTY CODES ARE 6 CHARACTERS LONG.';
          menuMsg.classList.add('grp-err');
          return;
        }
        showBusy('JOINING PARTY...');
        try {
          if (peer) { try { peer.destroy(); } catch(e){} }
          peer = await openPeer(null);

          hostConn = peer.connect(PEER_PREFIX + code, { reliable: true });
          hostConn.on('open', () => {
            hostConn.send({ t: 'hello', name: state.username, icon: state.icon });
          });

          hostConn.on('data', (d) => {
            if (!d || typeof d !== 'object') return;
            if (d.t === 'welcome') {
              state.inParty = true;
              state.isLeader = false;
              state.partyCode = code;
              hideBusy();
              render();
              notifyParent('PARTY_JOINED', { code });
            } else if (d.t === 'state') {
              state.partyCode = d.code;
              state.leaderName = d.leader;
              state.members = d.members || [];
              render();
            } else if (d.t === 'chat') {
              const text = String(d.text || '').trim();
              const from = cleanName(d.from);
              if (text && from) {
                appendChatMessage(from, text, false);
                notifyParent('CHAT_MESSAGE', { sender: from, text });
              }
            } else if (d.t === 'kicked') {
              const kickedName = cleanName(d.name);
              appendChatMessage('', kickedName + ' WAS KICKED FROM THE PARTY', true);
              notifyParent('PLAYER_KICKED', { name: kickedName });
            } else if (d.t === 'reject') {
              leaveParty();
              menuMsg.textContent = d.reason || 'COULD NOT JOIN PARTY.';
              menuMsg.classList.add('grp-err');
            } else if (d.t === 'kick') {
              notifyParent('PLAYER_KICKED', { name: state.username });
              leaveParty();
              menuMsg.textContent = 'YOU WERE KICKED FROM THE PARTY.';
              menuMsg.classList.add('grp-err');
            }
          });

          hostConn.on('close', () => {
            leaveParty();
            menuMsg.textContent = 'DISCONNECTED FROM PARTY.';
            menuMsg.classList.add('grp-err');
          });

        } catch(err) {
          hideBusy();
          menuMsg.textContent = 'PARTY NOT FOUND. CHECK CODE.';
          menuMsg.classList.add('grp-err');
        }
      }

      function leaveParty() {
        if (state.isLeader) {
          for (const conn of memberConns.values()) {
            try { conn.send({ t: 'kick' }); conn.close(); } catch(e){}
          }
          memberConns.clear();
        } else if (hostConn && hostConn.open) {
          try { hostConn.send({ t: 'leave', name: state.username }); hostConn.close(); } catch(e){}
        }

        if (peer) {
          try { peer.destroy(); } catch(e){}
          peer = null;
        }
        if (heartbeatTimer) clearInterval(heartbeatTimer);

        state.inParty = false;
        state.isLeader = true;
        state.partyCode = '';
        state.members = [];
        closeChat();
        chatMessages.innerHTML = '<div class="grp-chat-sys">WELCOME TO PARTY CHAT!</div>';
        unreadChatCount = 0;
        updateChatBadge();
        hideBusy();
        render();
        notifyParent('PARTY_LEFT', {});
      }

      function kickPlayer(name) {
        if (!state.isLeader) return;
        const clean = cleanName(name);
        const conn = memberConns.get(clean.toLowerCase());
        if (conn) {
          try { conn.send({ t: 'kick' }); conn.close(); } catch(e){}
        }
        // Broadcast to other members that this player was kicked
        const kmsg = { t: 'kicked', name: clean };
        for (const [n, c] of memberConns.entries()) {
          if (n !== clean.toLowerCase()) {
            try { if (c.open) c.send(kmsg); } catch(e){}
          }
        }
        removeMember(clean);
        appendChatMessage('', clean + ' WAS KICKED FROM THE PARTY', true);
        notifyParent('PLAYER_KICKED', { name: clean });
      }

      function pushMyIcon() {
        if (state.isLeader) {
          const me = state.members.find(m => m.name.toLowerCase() === state.username.toLowerCase());
          if (me) me.icon = state.icon;
          broadcastState();
        } else if (hostConn && hostConn.open) {
          try { hostConn.send({ t: 'icon', name: state.username, icon: state.icon }); } catch(e){}
        }
      }

      function startHeartbeat() {
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(() => {
          if (state.isLeader) {
            for (const [name, conn] of memberConns.entries()) {
              if (!conn || !conn.open) removeMember(name);
            }
          }
        }, 3000);
      }

      // --- UI Render ---
      function render() {
        if (!state.inParty) {
          viewMenu.style.display = 'flex';
          viewParty.style.display = 'none';
          menuMsg.textContent = 'LOGGED IN AS ' + state.username.toUpperCase();
          menuMsg.classList.remove('grp-err');
        } else {
          viewMenu.style.display = 'none';
          viewParty.style.display = 'flex';
          partyCodeDisplay.textContent = state.partyCode || '------';
          partyMsg.textContent = state.members.length + '/4 PLAYERS';

          slotsContainer.innerHTML = '';
          for (let i = 0; i < 4; i++) {
            const m = state.members[i];
            const slot = document.createElement('div');
            slot.className = 'grp-slot';

            if (m) {
              const isMe = m.name.toLowerCase() === state.username.toLowerCase();
              const isLeader = m.name.toLowerCase() === state.leaderName.toLowerCase();
              if (isMe) slot.classList.add('grp-me');

              const tags = document.createElement('div');
              tags.className = 'grp-tags';
              if (isLeader) {
                const lt = document.createElement('span');
                lt.className = 'grp-tag grp-tag-leader';
                lt.textContent = '👑 LEADER';
                tags.appendChild(lt);
              } else {
                tags.appendChild(document.createElement('span'));
              }
              if (isMe) {
                const yt = document.createElement('span');
                yt.className = 'grp-tag grp-tag-you';
                yt.textContent = 'YOU';
                tags.appendChild(yt);
              }
              slot.appendChild(tags);

              // Avatar Icon (Programmatic sprite costume display, non-clickable)
              const iconWrapper = document.createElement('div');
              iconWrapper.className = 'grp-icon-wrapper';
              renderIconInto(iconWrapper, isMe ? state.icon : m.icon);
              slot.appendChild(iconWrapper);

              // Name
              const nameEl = document.createElement('div');
              nameEl.className = 'grp-name';
              nameEl.textContent = m.name;
              slot.appendChild(nameEl);

              // Kick button if I am Leader
              if (state.isLeader && !isMe) {
                const kb = document.createElement('button');
                kb.className = 'grp-btn grp-btn-sm';
                kb.textContent = 'KICK';
                kb.addEventListener('click', (e) => {
                  e.stopPropagation();
                  kickPlayer(m.name);
                });
                slot.appendChild(kb);
              }

            } else {
              slot.classList.add('grp-empty');
              const iw = document.createElement('div');
              iw.className = 'grp-icon-wrapper';
              slot.appendChild(iw);

              const nameEl = document.createElement('div');
              nameEl.className = 'grp-name';
              nameEl.textContent = 'EMPTY';
              slot.appendChild(nameEl);
            }

            slotsContainer.appendChild(slot);
          }
        }
      }

      // --- Button & Form Handlers ---
      btnCreate.addEventListener('click', () => createParty());
      btnJoin.addEventListener('click', () => joinParty(inputCode.value));
      inputCode.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') joinParty(inputCode.value);
      });

      btnLeaveParty.addEventListener('click', () => leaveParty());

      btnCopyCode.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(state.partyCode).catch(()=>{});
        }
        btnCopyCode.textContent = 'COPIED!';
        setTimeout(() => { btnCopyCode.textContent = 'COPY'; }, 1200);
      });

      // Chat toggling & messaging
      btnPartyChat.addEventListener('click', () => toggleChat());
      btnCloseChat.addEventListener('click', () => closeChat());

      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value;
        if (text) {
          sendChat(text);
          chatInput.value = '';
        }
      });

      // Screen 1 EXIT button (Closes UI)
      btnMenuExit.addEventListener('click', () => notifyParent('EXIT', {}));

      // --- Public Window API ---
      window.PartyUI = {
        login: function(username, token) {
          state.username = cleanName(username) || 'Player1';
          state.token = token || '';
          render();
        },
        setIcon: function(iconUrl) {
          if (iconUrl) {
            state.icon = iconUrl;
            render();
            pushMyIcon();
          }
        },
        sendChat: function(message) {
          sendChat(message);
        },
        openChat: function() {
          openChat();
        },
        closeChat: function() {
          closeChat();
        },
        toggleChat: function() {
          toggleChat();
        },
        open: function() {
          document.getElementById('grpBackdrop').style.display = 'flex';
          render();
        },
        close: function() {
          document.getElementById('grpBackdrop').style.display = 'none';
        }
      };

      // Listen for postMessage from TurboWarp Extension or parent iframe
      window.addEventListener('message', (event) => {
        const data = event.data;
        if (!data || data.source !== 'GEOMETRY_RUSH_PARTY_EXT') return;
        switch (data.type) {
          case 'LOGIN':
            window.PartyUI.login(data.username, data.token);
            break;
          case 'SET_ICON':
            window.PartyUI.setIcon(data.icon);
            break;
          case 'SEND_CHAT':
            window.PartyUI.sendChat(data.message);
            break;
          case 'TOGGLE_CHAT':
            window.PartyUI.toggleChat();
            break;
          case 'OPEN':
            window.PartyUI.open();
            break;
          case 'CLOSE':
            window.PartyUI.close();
            break;
        }
      });

      // Initial Render
      render();

    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'party.html'), html, 'utf8');
console.log('Successfully updated party.html (' + Math.round(html.length / 1024) + ' KB)');
