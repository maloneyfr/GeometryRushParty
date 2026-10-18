const fs = require('fs');
const path = require('path');

const assets = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets_b64.json'), 'utf8'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Geometry Rush - Party Manager</title>
  <style>
    @font-face {
      font-family: 'Burbank Big Condensed';
      src: url('data:font/otf;base64,${assets.fontBase64}') format('opentype');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    :root {
      --gr-blue: #0084ff;
      --gr-blue-hover: #1ca0ff;
      --gr-blue-dark: #0060cc;
      --gr-cyan: #30e0ff;
      --gr-cyan-border: #1ea4b9;
      --gr-green: #2ecc71;
      --gr-green-hover: #27ae60;
      --gr-red: #ff3344;
      --gr-red-hover: #e02434;
      --gr-yellow: #f1c40f;
      --gr-yellow-dark: #d4ac0d;
      --gr-dark: #11141a;
      --gr-gray: #e2e8f0;
      --gr-border: #000000;
      --font-burbank: 'Burbank Big Condensed', 'Arial Black', Impact, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      background-color: transparent;
      font-family: var(--font-burbank);
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
    }

    /* Outer Party Window (Matches Geometry Rush Reference Layout) */
    .party-window {
      position: relative;
      width: 96%;
      max-width: 980px;
      height: 94%;
      max-height: 540px;
      background: #ffffff;
      border: 5px solid var(--gr-border);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      padding: 16px 22px;
      overflow: hidden;
    }

    /* Header Bar */
    .party-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px solid #000;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }

    .header-left {
      display: flex;
      align-items: baseline;
      gap: 16px;
    }

    .title-your-party {
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 1.5px;
      line-height: 1;
      color: #000;
      text-transform: uppercase;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
    }

    .party-badge-code {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f0f4f8;
      border: 2px solid #000;
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 17px;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s;
    }
    .party-badge-code:hover {
      background: #e2eaf0;
      transform: translateY(-1px);
    }
    .party-badge-code:active {
      transform: translateY(1px);
    }
    .party-badge-code .code-val {
      font-weight: 900;
      color: var(--gr-blue);
      letter-spacing: 1px;
    }
    .party-badge-code .copy-icon {
      font-size: 13px;
      color: #666;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .network-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 16px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #333;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #bbb;
      border: 1.5px solid #000;
    }
    .status-dot.online {
      background: #2ecc71;
      box-shadow: 0 0 6px #2ecc71;
    }
    .status-dot.connecting {
      background: #f1c40f;
      animation: pulse 1s infinite alternate;
    }

    @keyframes pulse {
      from { opacity: 0.4; }
      to { opacity: 1; }
    }

    /* Signature Geometry Rush Cyan-Tab Blue Button (Exact replica of Image 2) */
    .btn-gr-blue {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      padding: 0 32px;
      background: var(--gr-blue);
      border: 3.5px solid #000;
      color: #000;
      font-family: var(--font-burbank);
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 4px 0 #000;
      transition: transform 0.08s, filter 0.08s, background-color 0.1s;
      overflow: hidden;
    }
    .btn-gr-blue:hover {
      background: var(--gr-blue-hover);
      filter: brightness(1.06);
    }
    .btn-gr-blue:active {
      transform: translateY(2px);
      box-shadow: 0 2px 0 #000;
    }

    /* Left Cyan Trapezoid / Triangle Accent */
    .btn-gr-blue::before {
      content: '';
      position: absolute;
      left: 3px;
      top: 3px;
      bottom: 3px;
      width: 12px;
      background: var(--gr-cyan);
      border: 2px solid var(--gr-cyan-border);
      clip-path: polygon(0 0, 100% 0, 0 100%);
    }

    /* Right Cyan Inverted Trapezoid / Triangle Accent */
    .btn-gr-blue::after {
      content: '';
      position: absolute;
      right: 3px;
      top: 3px;
      bottom: 3px;
      width: 12px;
      background: var(--gr-cyan);
      border: 2px solid var(--gr-cyan-border);
      clip-path: polygon(100% 100%, 0 100%, 100% 0);
    }

    /* Exit Button in Header */
    .btn-exit {
      height: 40px;
      padding: 0 26px;
      font-size: 20px;
    }

    /* Main Party Content Grid (Fortnite Squad Lobby Style) */
    .party-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 0;
    }

    .slots-container {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      min-height: 0;
    }

    /* Individual Player Slot Card */
    .player-slot {
      position: relative;
      background: #fdfdfd;
      border: 4px solid #000;
      box-shadow: 3px 4px 0 #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 10px;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
    }
    .player-slot:hover {
      transform: translateY(-2px);
      box-shadow: 4px 6px 0 #000;
    }

    /* Card Top: Crown & Role */
    .slot-top-badge {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 22px;
      margin-bottom: 6px;
    }
    .leader-crown {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #f1c40f;
      color: #000;
      border: 2px solid #000;
      border-radius: 3px;
      padding: 1px 6px;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.5px;
      box-shadow: 1px 1px 0 #000;
    }
    .slot-num-badge {
      font-size: 15px;
      font-weight: 900;
      color: #888;
    }

    /* Avatar Container with Geometry Rush Glow */
    .avatar-wrapper {
      position: relative;
      width: 78px;
      height: 78px;
      margin: 4px 0 10px;
    }
    .avatar-frame {
      width: 100%;
      height: 100%;
      border: 3.5px solid #000;
      background: #111;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 2px 2px 0 #000;
    }
    .avatar-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-cube-svg {
      width: 82%;
      height: 82%;
    }

    /* Ready / Unready Ring */
    .avatar-wrapper.is-ready .avatar-frame {
      border-color: #000;
      box-shadow: 0 0 12px var(--gr-green), 2px 2px 0 #000;
    }

    /* Player Username */
    .player-username {
      font-size: 22px;
      font-weight: 900;
      color: #000;
      letter-spacing: 1px;
      text-transform: uppercase;
      text-align: center;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 8px;
    }

    /* Ready Status Pill (Fortnite Slanted Style) */
    .ready-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 14px;
      border: 2.5px solid #000;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 1px;
      text-transform: uppercase;
      box-shadow: 2px 2px 0 #000;
      transform: skewX(-6deg);
    }
    .ready-pill.ready {
      background: var(--gr-green);
      color: #fff;
      text-shadow: 1px 1px 0 #000;
    }
    .ready-pill.not-ready {
      background: #e2e8f0;
      color: #555;
    }

    /* Host Controls (Kick / Promote) */
    .slot-host-actions {
      margin-top: auto;
      display: flex;
      gap: 6px;
      width: 100%;
      padding-top: 6px;
      opacity: 0.9;
    }
    .btn-action-small {
      flex: 1;
      height: 26px;
      background: #f8f9fa;
      border: 2px solid #000;
      font-family: var(--font-burbank);
      font-size: 14px;
      font-weight: 900;
      cursor: pointer;
      text-transform: uppercase;
      transition: background 0.1s, transform 0.05s;
    }
    .btn-action-small:hover {
      background: #e9ecef;
      transform: translateY(-1px);
    }
    .btn-action-small.btn-kick:hover {
      background: #ffe3e3;
      color: #c92a2a;
    }

    /* Empty Slot (+ INVITE) */
    .player-slot.empty-slot {
      border: 3.5px dashed #aaa;
      background: #fbfbfb;
      justify-content: center;
      cursor: pointer;
      box-shadow: none;
    }
    .player-slot.empty-slot:hover {
      border-color: var(--gr-blue);
      background: #f0f7ff;
      transform: translateY(-2px);
    }
    .empty-slot-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 3px dashed #bbb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 900;
      color: #999;
      margin-bottom: 8px;
      transition: all 0.15s;
    }
    .player-slot.empty-slot:hover .empty-slot-icon {
      border-color: var(--gr-blue);
      color: var(--gr-blue);
      transform: scale(1.1);
    }
    .empty-slot-label {
      font-size: 18px;
      font-weight: 900;
      color: #888;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* Bottom Control Bar */
    .party-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 3px solid #000;
      padding-top: 10px;
      gap: 16px;
    }

    /* Invite Bar */
    .invite-box {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
      max-width: 380px;
    }
    .input-gj-username {
      flex: 1;
      height: 44px;
      border: 3.5px solid #000;
      padding: 0 12px;
      font-family: var(--font-burbank);
      font-size: 20px;
      letter-spacing: 0.5px;
      outline: none;
      box-shadow: 0 4px 0 #000;
      background: #fff;
    }
    .input-gj-username:focus {
      border-color: var(--gr-blue);
    }
    .btn-invite-send {
      height: 44px;
      padding: 0 20px;
      font-size: 19px;
    }

    /* Center Ready Button (Huge Slanted Fortnite Style) */
    .center-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-ready-toggle {
      height: 48px;
      padding: 0 42px;
      font-family: var(--font-burbank);
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      border: 3.5px solid #000;
      box-shadow: 0 5px 0 #000;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transform: skewX(-5deg);
      transition: transform 0.08s, background 0.15s, box-shadow 0.08s;
    }
    .btn-ready-toggle:active {
      transform: skewX(-5deg) translateY(3px);
      box-shadow: 0 2px 0 #000;
    }
    .btn-ready-toggle.state-unready {
      background: var(--gr-yellow);
      color: #000;
    }
    .btn-ready-toggle.state-unready:hover {
      background: var(--gr-yellow-dark);
    }
    .btn-ready-toggle.state-ready {
      background: var(--gr-green);
      color: #fff;
      text-shadow: 1px 1px 0 #000;
    }
    .btn-ready-toggle.state-ready:hover {
      background: var(--gr-green-hover);
    }

    /* Leave Party Button */
    .btn-leave-party {
      height: 44px;
      padding: 0 20px;
      background: #fff;
      border: 3px solid #000;
      color: var(--gr-red);
      font-family: var(--font-burbank);
      font-size: 19px;
      font-weight: 900;
      letter-spacing: 1px;
      cursor: pointer;
      box-shadow: 0 4px 0 #000;
      transition: background 0.1s, transform 0.08s;
    }
    .btn-leave-party:hover {
      background: #ffebeb;
    }
    .btn-leave-party:active {
      transform: translateY(2px);
      box-shadow: 0 2px 0 #000;
    }

    /* Party Privacy Toggle */
    .privacy-toggle {
      display: flex;
      border: 2.5px solid #000;
      box-shadow: 0 3px 0 #000;
      background: #eef2f6;
    }
    .privacy-option {
      padding: 4px 10px;
      font-size: 15px;
      font-weight: 900;
      cursor: pointer;
      color: #666;
      border-right: 2px solid #000;
      transition: background 0.1s, color 0.1s;
    }
    .privacy-option:last-child {
      border-right: none;
    }
    .privacy-option.active {
      background: #000;
      color: #fff;
    }

    /* Floating Toast / Invite Notification */
    .invite-toast-container {
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%) translateY(-150%);
      width: 90%;
      max-width: 580px;
      background: #fff;
      border: 4px solid #000;
      box-shadow: 0 8px 0 #000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      z-index: 1000;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .invite-toast-container.show {
      transform: translateX(-50%) translateY(0);
    }
    .toast-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .toast-avatar {
      width: 44px;
      height: 44px;
      border: 2.5px solid #000;
      background: #222;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toast-text {
      display: flex;
      flex-direction: column;
    }
    .toast-sender {
      font-size: 21px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #000;
    }
    .toast-sub {
      font-size: 14px;
      color: #666;
      font-family: sans-serif;
      font-weight: bold;
    }
    .toast-buttons {
      display: flex;
      gap: 8px;
    }
    .btn-toast-accept {
      background: var(--gr-green);
      color: #fff;
      border: 2.5px solid #000;
      padding: 6px 18px;
      font-family: var(--font-burbank);
      font-size: 18px;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 3px 0 #000;
      text-shadow: 1px 1px 0 #000;
    }
    .btn-toast-decline {
      background: #f1f3f5;
      color: #333;
      border: 2.5px solid #000;
      padding: 6px 14px;
      font-family: var(--font-burbank);
      font-size: 18px;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 3px 0 #000;
    }

    /* Modal / Alert Dialog */
    .modal-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    .modal-overlay.open {
      display: flex;
    }
    .modal-card {
      background: #fff;
      border: 5px solid #000;
      box-shadow: 0 10px 0 #000;
      width: 90%;
      max-width: 440px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
    .modal-title {
      font-size: 30px;
      font-weight: 900;
      letter-spacing: 1px;
    }
    .modal-msg {
      font-size: 18px;
      color: #444;
      font-family: sans-serif;
    }
    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    /* Quick Game Sync / Party Chat Drawer */
    .chat-drawer {
      position: absolute;
      bottom: 0;
      right: 22px;
      width: 320px;
      height: 260px;
      background: #fff;
      border: 4px solid #000;
      border-bottom: none;
      box-shadow: 0 -4px 0 #000;
      display: flex;
      flex-direction: column;
      transform: translateY(220px);
      transition: transform 0.25s ease;
      z-index: 500;
    }
    .chat-drawer.open {
      transform: translateY(0);
    }
    .chat-header {
      height: 40px;
      background: #000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      cursor: pointer;
      font-size: 18px;
      letter-spacing: 1px;
    }
    .chat-messages {
      flex: 1;
      padding: 8px 10px;
      overflow-y: auto;
      font-family: sans-serif;
      font-size: 13px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: #f8fafc;
    }
    .chat-msg {
      padding: 3px 6px;
      border-radius: 3px;
      background: #fff;
      border: 1px solid #e2e8f0;
    }
    .chat-msg.system {
      background: #eef2f6;
      color: #555;
      font-style: italic;
    }
    .chat-msg .sender {
      font-weight: bold;
      color: var(--gr-blue);
      margin-right: 4px;
    }
    .chat-input-bar {
      display: flex;
      border-top: 2px solid #000;
    }
    .chat-input {
      flex: 1;
      height: 34px;
      border: none;
      padding: 0 8px;
      font-size: 13px;
      outline: none;
    }
    .btn-chat-send {
      width: 50px;
      background: var(--gr-blue);
      border: none;
      border-left: 2px solid #000;
      font-family: var(--font-burbank);
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
    }

  </style>
</head>
<body>

  <!-- Main Party Container -->
  <div class="party-window" id="partyWindow">
    
    <!-- Top Bar -->
    <header class="party-header">
      <div class="header-left">
        <h1 class="title-your-party">YOUR PARTY</h1>
        <div class="party-badge-code" id="partyCodeBadge" title="Click to copy Party Code">
          <span>CODE:</span>
          <span class="code-val" id="partyCodeDisplay">#GR-XXXX</span>
          <span class="copy-icon">📋</span>
        </div>
        <div class="privacy-toggle" id="privacyToggle">
          <div class="privacy-option active" data-privacy="public">PUBLIC</div>
          <div class="privacy-option" data-privacy="friends">FRIENDS</div>
          <div class="privacy-option" data-privacy="invite">INVITE ONLY</div>
        </div>
      </div>

      <div class="header-right">
        <div class="network-status">
          <span class="status-dot online" id="statusDot"></span>
          <span id="statusText">P2P READY</span>
        </div>
        <!-- EXIT Button (Matches Image 2) -->
        <button class="btn-gr-blue btn-exit" id="btnExit" title="Close Party Window">EXIT</button>
      </div>
    </header>

    <!-- Center 4-Player Slot Grid -->
    <main class="party-body">
      <div class="slots-container" id="slotsContainer">
        <!-- Rendered dynamically -->
      </div>
    </main>

    <!-- Bottom Controls -->
    <footer class="party-bottom">
      <div class="invite-box">
        <input 
          type="text" 
          id="inputInviteUsername" 
          class="input-gj-username" 
          placeholder="ENTER GAMEJOLT USER..." 
          autocomplete="off" 
          spellcheck="false"
        />
        <button class="btn-gr-blue btn-invite-send" id="btnSendInvite">INVITE</button>
      </div>

      <div class="center-actions">
        <!-- READY UP / UNREADY Toggle Button -->
        <button class="btn-ready-toggle state-unready" id="btnReadyToggle">READY UP</button>
        <!-- LEAVE PARTY Button -->
        <button class="btn-leave-party" id="btnLeaveParty">LEAVE PARTY</button>
      </div>
    </footer>

    <!-- Chat / Activity Drawer -->
    <div class="chat-drawer" id="chatDrawer">
      <div class="chat-header" id="chatDrawerHeader">
        <span>💬 PARTY CHAT (<span id="chatCount">0</span>)</span>
        <span id="chatToggleIcon">▲</span>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-msg system">Party chat opened. Co-ordinate your Geometry Rush squad!</div>
      </div>
      <div class="chat-input-bar">
        <input type="text" class="chat-input" id="chatInput" placeholder="Message party..." />
        <button class="btn-chat-send" id="btnChatSend">SEND</button>
      </div>
    </div>

    <!-- Slide-down Party Invite Toast -->
    <div class="invite-toast-container" id="inviteToast">
      <div class="toast-info">
        <div class="toast-avatar" id="toastAvatar">
          <svg viewBox="0 0 40 40" width="30" height="30">
            <rect width="40" height="40" fill="#30e0ff" rx="6" />
            <rect x="8" y="8" width="10" height="10" fill="#000" />
            <rect x="22" y="8" width="10" height="10" fill="#000" />
            <rect x="10" y="24" width="20" height="4" fill="#000" />
          </svg>
        </div>
        <div class="toast-text">
          <span class="toast-sender" id="toastSenderName">Player123</span>
          <span class="toast-sub">INVITED YOU TO THEIR PARTY!</span>
        </div>
      </div>
      <div class="toast-buttons">
        <button class="btn-toast-accept" id="btnToastAccept">ACCEPT</button>
        <button class="btn-toast-decline" id="btnToastDecline">DECLINE</button>
      </div>
    </div>

    <!-- Alert / Confirm Modal -->
    <div class="modal-overlay" id="modalOverlay">
      <div class="modal-card">
        <div class="modal-title" id="modalTitle">NOTICE</div>
        <div class="modal-msg" id="modalMsg">Party notification message.</div>
        <div class="modal-actions">
          <button class="btn-gr-blue" style="height:38px; padding:0 24px; font-size:18px;" id="modalBtnOk">OK</button>
        </div>
      </div>
    </div>

  </div>

  <script>
    (function() {
      // Audio Synthesizer (Zero-dependency Web Audio API)
      const audioCtx = (function() {
        try {
          return new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
          return null;
        }
      })();

      function playSfx(type) {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const now = audioCtx.currentTime;

        if (type === 'click') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'ready') {
          // Punchy power-up chord
          [440, 554.37, 659.25, 880].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);
            gain.gain.setValueAtTime(0.18, now + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.04);
            osc.stop(now + 0.35);
          });
        } else if (type === 'unready') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'invite') {
          // Fortnite-style chime
          [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.06);
            gain.gain.setValueAtTime(0.25, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.3);
          });
        } else if (type === 'join') {
          [392.00, 523.25, 659.25].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.08);
            gain.gain.setValueAtTime(0.2, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.25);
          });
        } else if (type === 'leave') {
          [440, 349.23, 261.63].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.07);
            gain.gain.setValueAtTime(0.2, now + i * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.2);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.2);
          });
        }
      }

      // State Management
      const state = {
        myUsername: 'Player1',
        myToken: '',
        partyId: 'GR-1001',
        leader: 'Player1',
        privacy: 'public',
        isReady: false,
        members: [
          { username: 'Player1', ready: false, isLeader: true, avatar: '' }
        ],
        pendingInvite: null,
        chatOpen: false,
        chatMessages: []
      };

      // Geometry Rush Cube Icon SVG Generator
      function getCubeSvg(username) {
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
          hash = (hash << 5) - hash + username.charCodeAt(i);
          hash |= 0;
        }
        const colors = ['#0084ff', '#2ecc71', '#ff3344', '#f1c40f', '#9b59b6', '#30e0ff', '#e67e22'];
        const eyeColors = ['#ffffff', '#ffff00', '#00ffff'];
        const baseColor = colors[Math.abs(hash) % colors.length];
        const eyeColor = eyeColors[Math.abs(hash >> 3) % eyeColors.length];

        return \`
          <svg class="avatar-cube-svg" viewBox="0 0 60 60">
            <rect width="60" height="60" fill="\${baseColor}" rx="10" stroke="#000" stroke-width="4"/>
            <rect x="8" y="8" width="44" height="44" fill="rgba(0,0,0,0.15)" rx="6"/>
            <!-- Eyes -->
            <rect x="13" y="14" width="12" height="12" fill="\${eyeColor}" stroke="#000" stroke-width="3" rx="2"/>
            <rect x="35" y="14" width="12" height="12" fill="\${eyeColor}" stroke="#000" stroke-width="3" rx="2"/>
            <!-- Pupils -->
            <rect x="18" y="18" width="5" height="5" fill="#000" rx="1"/>
            <rect x="40" y="18" width="5" height="5" fill="#000" rx="1"/>
            <!-- Mouth -->
            <rect x="18" y="38" width="24" height="5" fill="#000" rx="2"/>
          </svg>
        \`;
      }

      // DOM Elements
      const slotsContainer = document.getElementById('slotsContainer');
      const partyCodeDisplay = document.getElementById('partyCodeDisplay');
      const partyCodeBadge = document.getElementById('partyCodeBadge');
      const btnReadyToggle = document.getElementById('btnReadyToggle');
      const btnLeaveParty = document.getElementById('btnLeaveParty');
      const btnExit = document.getElementById('btnExit');
      const inputInviteUsername = document.getElementById('inputInviteUsername');
      const btnSendInvite = document.getElementById('btnSendInvite');
      const privacyToggle = document.getElementById('privacyToggle');
      const inviteToast = document.getElementById('inviteToast');
      const toastSenderName = document.getElementById('toastSenderName');
      const btnToastAccept = document.getElementById('btnToastAccept');
      const btnToastDecline = document.getElementById('btnToastDecline');
      const statusDot = document.getElementById('statusDot');
      const statusText = document.getElementById('statusText');
      const chatDrawer = document.getElementById('chatDrawer');
      const chatDrawerHeader = document.getElementById('chatDrawerHeader');
      const chatToggleIcon = document.getElementById('chatToggleIcon');
      const chatMessages = document.getElementById('chatMessages');
      const chatInput = document.getElementById('chatInput');
      const btnChatSend = document.getElementById('btnChatSend');
      const chatCount = document.getElementById('chatCount');
      const modalOverlay = document.getElementById('modalOverlay');
      const modalTitle = document.getElementById('modalTitle');
      const modalMsg = document.getElementById('modalMsg');
      const modalBtnOk = document.getElementById('modalBtnOk');

      // Render Party Slots
      function renderSlots() {
        slotsContainer.innerHTML = '';
        const isLeader = (state.leader.toLowerCase() === state.myUsername.toLowerCase());

        for (let i = 0; i < 4; i++) {
          const member = state.members[i];
          const slotEl = document.createElement('div');

          if (member) {
            const isMe = (member.username.toLowerCase() === state.myUsername.toLowerCase());
            slotEl.className = 'player-slot' + (member.ready ? ' slot-ready' : '');

            slotEl.innerHTML = \`
              <div class="slot-top-badge">
                \${member.isLeader ? '<span class="leader-crown">👑 LEADER</span>' : '<span></span>'}
                <span class="slot-num-badge">#\${i + 1}</span>
              </div>
              <div class="avatar-wrapper \${member.ready ? 'is-ready' : ''}">
                <div class="avatar-frame">
                  \${member.avatar ? \`<img src="\${member.avatar}" alt="\${member.username}"/>\` : getCubeSvg(member.username)}
                </div>
              </div>
              <div class="player-username" title="\${member.username}">\${member.username}</div>
              <div class="ready-pill \${member.ready ? 'ready' : 'not-ready'}">
                \${member.ready ? '✓ READY' : 'NOT READY'}
              </div>
              \${(isLeader && !isMe) ? \`
                <div class="slot-host-actions">
                  <button class="btn-action-small btn-promote" data-user="\${member.username}">LEADER</button>
                  <button class="btn-action-small btn-kick" data-user="\${member.username}">KICK</button>
                </div>
              \` : ''}
            \`;
          } else {
            // Empty Invitable Slot
            slotEl.className = 'player-slot empty-slot';
            slotEl.innerHTML = \`
              <div class="empty-slot-icon">+</div>
              <div class="empty-slot-label">INVITE PLAYER</div>
            \`;
            slotEl.addEventListener('click', () => {
              playSfx('click');
              inputInviteUsername.focus();
            });
          }

          slotsContainer.appendChild(slotEl);
        }

        // Attach action handlers for kick / promote
        slotsContainer.querySelectorAll('.btn-kick').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = btn.getAttribute('data-user');
            sendActionToParent('KICK_PLAYER', { username: target });
          });
        });

        slotsContainer.querySelectorAll('.btn-promote').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = btn.getAttribute('data-user');
            sendActionToParent('PROMOTE_LEADER', { username: target });
          });
        });

        // Update Party Code Display
        partyCodeDisplay.textContent = state.partyId ? '#' + state.partyId : '#GR-1001';

        // Update Ready Toggle Button
        const myMember = state.members.find(m => m.username.toLowerCase() === state.myUsername.toLowerCase());
        const readyState = myMember ? myMember.ready : state.isReady;
        if (readyState) {
          btnReadyToggle.className = 'btn-ready-toggle state-ready';
          btnReadyToggle.textContent = 'READY!';
        } else {
          btnReadyToggle.className = 'btn-ready-toggle state-unready';
          btnReadyToggle.textContent = 'READY UP';
        }
      }

      // Show In-Game Modal
      function showModal(title, msg) {
        modalTitle.textContent = title;
        modalMsg.textContent = msg;
        modalOverlay.classList.add('open');
      }

      modalBtnOk.addEventListener('click', () => {
        playSfx('click');
        modalOverlay.classList.remove('open');
      });

      // Show Slide-Down Invite Toast
      function showInviteToast(fromUser, partyId) {
        state.pendingInvite = { fromUser, partyId };
        toastSenderName.textContent = fromUser;
        inviteToast.classList.add('show');
        playSfx('invite');
      }

      function hideInviteToast() {
        inviteToast.classList.remove('show');
        state.pendingInvite = null;
      }

      btnToastAccept.addEventListener('click', () => {
        playSfx('click');
        if (state.pendingInvite) {
          sendActionToParent('ACCEPT_INVITE', {
            from: state.pendingInvite.fromUser,
            partyId: state.pendingInvite.partyId
          });
        }
        hideInviteToast();
      });

      btnToastDecline.addEventListener('click', () => {
        playSfx('click');
        if (state.pendingInvite) {
          sendActionToParent('DECLINE_INVITE', {
            from: state.pendingInvite.fromUser
          });
        }
        hideInviteToast();
      });

      // Ready Up Toggle
      btnReadyToggle.addEventListener('click', () => {
        const myMember = state.members.find(m => m.username.toLowerCase() === state.myUsername.toLowerCase());
        const current = myMember ? myMember.ready : state.isReady;
        const newReady = !current;
        state.isReady = newReady;
        if (myMember) myMember.ready = newReady;

        playSfx(newReady ? 'ready' : 'unready');
        renderSlots();
        sendActionToParent('SET_READY', { ready: newReady });
      });

      // Leave Party
      btnLeaveParty.addEventListener('click', () => {
        playSfx('leave');
        sendActionToParent('LEAVE_PARTY', {});
      });

      // Exit UI
      btnExit.addEventListener('click', () => {
        playSfx('click');
        sendActionToParent('EXIT', {});
      });

      // Invite Input Submit
      function triggerInvite() {
        const user = inputInviteUsername.value.trim();
        if (!user) {
          inputInviteUsername.focus();
          return;
        }
        if (user.toLowerCase() === state.myUsername.toLowerCase()) {
          showModal('CANNOT INVITE', 'You cannot invite yourself to the party!');
          return;
        }
        playSfx('click');
        sendActionToParent('INVITE_USER', { username: user });
        inputInviteUsername.value = '';
        addChatMessage('System', 'Invited ' + user + ' to party.');
      }

      btnSendInvite.addEventListener('click', triggerInvite);
      inputInviteUsername.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') triggerInvite();
      });

      // Copy Party Code
      partyCodeBadge.addEventListener('click', () => {
        playSfx('click');
        const code = state.partyId || 'GR-1001';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).catch(() => {});
        }
        const oldText = partyCodeDisplay.textContent;
        partyCodeDisplay.textContent = 'COPIED!';
        partyCodeBadge.style.background = '#d4edda';
        setTimeout(() => {
          partyCodeDisplay.textContent = oldText;
          partyCodeBadge.style.background = '';
        }, 1200);
      });

      // Privacy Toggle
      privacyToggle.querySelectorAll('.privacy-option').forEach(opt => {
        opt.addEventListener('click', () => {
          playSfx('click');
          privacyToggle.querySelectorAll('.privacy-option').forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          state.privacy = opt.getAttribute('data-privacy');
          sendActionToParent('SET_PRIVACY', { privacy: state.privacy });
        });
      });

      // Chat Drawer
      chatDrawerHeader.addEventListener('click', () => {
        playSfx('click');
        state.chatOpen = !state.chatOpen;
        if (state.chatOpen) {
          chatDrawer.classList.add('open');
          chatToggleIcon.textContent = '▼';
          setTimeout(() => chatInput.focus(), 150);
        } else {
          chatDrawer.classList.remove('open');
          chatToggleIcon.textContent = '▲';
        }
      });

      function addChatMessage(sender, text) {
        const msgEl = document.createElement('div');
        msgEl.className = 'chat-msg' + (sender === 'System' ? ' system' : '');
        if (sender === 'System') {
          msgEl.textContent = text;
        } else {
          msgEl.innerHTML = \`<span class="sender">\${sender}:</span> \${text}\`;
        }
        chatMessages.appendChild(msgEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        state.chatMessages.push({ sender, text });
        chatCount.textContent = state.chatMessages.length;
      }

      function submitChat() {
        const text = chatInput.value.trim();
        if (!text) return;
        playSfx('click');
        chatInput.value = '';
        addChatMessage(state.myUsername, text);
        sendActionToParent('SEND_CHAT', { text });
      }

      btnChatSend.addEventListener('click', submitChat);
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitChat();
      });

      // Communication Bridge with TurboWarp Extension
      function sendActionToParent(action, payload) {
        const msg = {
          source: 'GEOMETRY_RUSH_PARTY_UI',
          action: action,
          payload: payload || {}
        };
        // 1. Post to parent window (if in iframe)
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(msg, '*');
        }
        // 2. Direct hook into extension if running in same execution scope
        if (window.__GEOMETRY_RUSH_PARTY_EXTENSION__) {
          window.__GEOMETRY_RUSH_PARTY_EXTENSION__.handleUIAction(action, payload);
        }
      }

      // Public API exposed to window
      window.PartyUI = {
        init: function(username, token) {
          state.myUsername = username || 'Player1';
          state.myToken = token || '';
          state.leader = state.myUsername;
          state.members = [
            { username: state.myUsername, ready: false, isLeader: true, avatar: '' }
          ];
          renderSlots();
        },
        updateState: function(newState) {
          if (!newState) return;
          if (newState.myUsername) state.myUsername = newState.myUsername;
          if (newState.partyId) state.partyId = newState.partyId;
          if (newState.leader) state.leader = newState.leader;
          if (newState.members) {
            const oldCount = state.members.length;
            const newCount = newState.members.length;
            if (newCount > oldCount) playSfx('join');
            else if (newCount < oldCount) playSfx('leave');
            state.members = newState.members;
          }
          if (typeof newState.isReady === 'boolean') state.isReady = newState.isReady;
          renderSlots();
        },
        showInvite: function(fromUser, partyId) {
          showInviteToast(fromUser, partyId);
        },
        addChat: function(sender, text) {
          addChatMessage(sender, text);
        },
        setStatus: function(online, text) {
          if (online) {
            statusDot.className = 'status-dot online';
          } else {
            statusDot.className = 'status-dot connecting';
          }
          if (text) statusText.textContent = text;
        }
      };

      // Listen for postMessage from TurboWarp Extension
      window.addEventListener('message', (event) => {
        const data = event.data;
        if (!data || data.source !== 'GEOMETRY_RUSH_PARTY_EXT') return;

        switch (data.type) {
          case 'INIT':
            window.PartyUI.init(data.username, data.token);
            break;
          case 'UPDATE_STATE':
            window.PartyUI.updateState(data.state);
            break;
          case 'INVITE_RECEIVED':
            window.PartyUI.showInvite(data.from, data.partyId);
            break;
          case 'CHAT_RECEIVED':
            window.PartyUI.addChat(data.sender, data.text);
            break;
          case 'SET_STATUS':
            window.PartyUI.setStatus(data.online, data.text);
            break;
        }
      });

      // Initial Render
      renderSlots();

      // Notify parent that UI is mounted and ready
      sendActionToParent('UI_MOUNTED', {});

    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'party.html'), htmlContent, 'utf8');
console.log('Successfully written party.html, size:', htmlContent.length, 'bytes');
