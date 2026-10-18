const fs = require('fs');
const path = require('path');

const peerJsCode = fs.readFileSync(path.join(__dirname, 'peerjs.min.js'), 'utf8');
const partyHtmlCode = fs.readFileSync(path.join(__dirname, 'party.html'), 'utf8');

// Escape HTML for template literal or JS string
const escapedHtml = JSON.stringify(partyHtmlCode);

const extensionCode = `// ====================================================================
// Geometry Rush - Party Manager TurboWarp Extension
// P2P WebRTC Networking with GameJolt Authentication
// ====================================================================

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Geometry Rush Party extension must run unsandboxed!');
  }

  // --- EMBEDDED PEERJS LIBRARY (92KB standalone WebRTC) ---
  if (typeof window.Peer === 'undefined') {
    ${peerJsCode}
  }

  // Helper: sanitize GameJolt username for peer ID
  function sanitizePeerId(name) {
    if (!name) return 'gr_' + Math.floor(Math.random() * 100000);
    return 'grp_' + name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  }

  // Generate 4-letter Party Code
  function generatePartyCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'GR-' + code;
  }

  // Party Manager Class
  class GeometryRushPartyExtension {
    constructor() {
      this.myUsername = 'Player1';
      this.myToken = '';
      this.partyId = generatePartyCode();
      this.leaderUsername = 'Player1';
      this.isLeader = true;
      this.isReady = false;
      this.isConnected = false;

      // Party members array: [{ username, ready, isLeader, peerId, conn }]
      this.members = [];

      // P2P State
      this.peer = null;
      this.connections = new Map(); // username -> DataConnection
      this.leaderConnection = null; // if not leader, connection to leader

      // Event variables
      this.lastInviteSender = '';
      this.lastInvitePartyId = '';
      this.lastJoinedUser = '';
      this.lastLeftUser = '';
      this.lastReceivedLabel = '';
      this.lastReceivedData = '';
      this.lastDataSender = '';

      // Embedded party HTML
      this.partyHtmlSource = ${escapedHtml};

      // Overlay DOM iframe reference
      this.overlayElement = null;
      this.isOverlayVisible = false;

      // Register global hook for communication
      window.__GEOMETRY_RUSH_PARTY_EXTENSION__ = this;

      // Listen for window postMessage from party iframe
      window.addEventListener('message', (event) => {
        const msg = event.data;
        if (!msg || msg.source !== 'GEOMETRY_RUSH_PARTY_UI') return;
        this.handleUIAction(msg.action, msg.payload);
      });
    }

    // -----------------------------------------------------------------
    // Scratch Block Info Definition
    // -----------------------------------------------------------------
    getInfo() {
      return {
        id: 'geometryRushParty',
        name: 'Geometry Rush Party',
        color1: '#0084FF',
        color2: '#006FD6',
        color3: '#005CB0',
        blocks: [
          // Header / Category label
          {
            blockType: Scratch.BlockType.LABEL,
            text: '--- GameJolt & P2P Connection ---'
          },
          {
            opcode: 'connectGameJolt',
            blockType: Scratch.BlockType.COMMAND,
            text: 'connect to party network with GameJolt user [USERNAME] token [TOKEN]',
            arguments: {
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Player1'
              },
              TOKEN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'gj_token'
              }
            }
          },
          {
            opcode: 'disconnectNetwork',
            blockType: Scratch.BlockType.COMMAND,
            text: 'disconnect from party network'
          },
          {
            opcode: 'getIsConnected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'connected to party network?'
          },
          {
            opcode: 'getMyUsername',
            blockType: Scratch.BlockType.REPORTER,
            text: 'my GameJolt username'
          },

          // --- Party Hat Events ---
          {
            blockType: Scratch.BlockType.LABEL,
            text: '--- Party Events ---'
          },
          {
            opcode: 'whenReceivedPartyInvite',
            blockType: Scratch.BlockType.HAT,
            text: 'when received party invite',
            isEdgeActivated: false
          },
          {
            opcode: 'whenJoinedParty',
            blockType: Scratch.BlockType.HAT,
            text: 'when joined party',
            isEdgeActivated: false
          },
          {
            opcode: 'whenLeftParty',
            blockType: Scratch.BlockType.HAT,
            text: 'when left the party',
            isEdgeActivated: false
          },
          {
            opcode: 'whenAnotherUserJoined',
            blockType: Scratch.BlockType.HAT,
            text: 'when another user joined the party',
            isEdgeActivated: false
          },
          {
            opcode: 'whenAnotherUserLeft',
            blockType: Scratch.BlockType.HAT,
            text: 'when another user left the party',
            isEdgeActivated: false
          },
          {
            opcode: 'whenPartyDataReceived',
            blockType: Scratch.BlockType.HAT,
            text: 'when party data received',
            isEdgeActivated: false
          },

          // --- Party Actions ---
          {
            blockType: Scratch.BlockType.LABEL,
            text: '--- Party Controls ---'
          },
          {
            opcode: 'inviteUser',
            blockType: Scratch.BlockType.COMMAND,
            text: 'invite GameJolt user [USERNAME] to party',
            arguments: {
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Player2'
              }
            }
          },
          {
            opcode: 'acceptInvite',
            blockType: Scratch.BlockType.COMMAND,
            text: 'accept party invite from [USERNAME]',
            arguments: {
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ''
              }
            }
          },
          {
            opcode: 'declineInvite',
            blockType: Scratch.BlockType.COMMAND,
            text: 'decline party invite'
          },
          {
            opcode: 'leaveParty',
            blockType: Scratch.BlockType.COMMAND,
            text: 'leave party'
          },
          {
            opcode: 'kickUser',
            blockType: Scratch.BlockType.COMMAND,
            text: 'kick player [USERNAME] from party',
            arguments: {
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Player2'
              }
            }
          },
          {
            opcode: 'setReadyStatus',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set ready status [STATUS]',
            arguments: {
              STATUS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'readyStatusMenu'
              }
            }
          },

          // --- Party In-Game Data Sync ---
          {
            blockType: Scratch.BlockType.LABEL,
            text: '--- Game Data Broadcast ---'
          },
          {
            opcode: 'sendPartyData',
            blockType: Scratch.BlockType.COMMAND,
            text: 'send party data label [LABEL] value [VALUE]',
            arguments: {
              LABEL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'level_start'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'level_1'
              }
            }
          },

          // --- Reporters ---
          {
            blockType: Scratch.BlockType.LABEL,
            text: '--- Party Information ---'
          },
          {
            opcode: 'getIsInParty',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is in party?'
          },
          {
            opcode: 'getIsPartyLeader',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is party leader?'
          },
          {
            opcode: 'getPartyLeader',
            blockType: Scratch.BlockType.REPORTER,
            text: 'party leader username'
          },
          {
            opcode: 'getPartyMemberCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'party member count'
          },
          {
            opcode: 'getPartyMembersJson',
            blockType: Scratch.BlockType.REPORTER,
            text: 'party members list (JSON)'
          },
          {
            opcode: 'getPartyMemberAt',
            blockType: Scratch.BlockType.REPORTER,
            text: 'party member at index [INDEX]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'getIsMemberReady',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is member [USERNAME] ready?',
            arguments: {
              USERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Player1'
              }
            }
          },
          {
            opcode: 'getPartyCode',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current party code'
          },
          {
            opcode: 'getLastInviteSender',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last invite sender'
          },
          {
            opcode: 'getLastJoinedUser',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last player joined'
          },
          {
            opcode: 'getLastLeftUser',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last player left'
          },
          {
            opcode: 'getLastPartyData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last received party data'
          },
          {
            opcode: 'getLastPartyLabel',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last received party label'
          },
          {
            opcode: 'getLastDataSender',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last party data sender'
          },

          // --- HTML UI Integration ---
          {
            blockType: Scratch.BlockType.LABEL,
            text: '--- Party Manager HTML UI ---'
          },
          {
            opcode: 'getPartyHtmlCode',
            blockType: Scratch.BlockType.REPORTER,
            text: 'party manager HTML code'
          },
          {
            opcode: 'showPartyOverlay',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show party manager overlay'
          },
          {
            opcode: 'hidePartyOverlay',
            blockType: Scratch.BlockType.COMMAND,
            text: 'hide party manager overlay'
          },
          {
            opcode: 'getIsOverlayVisible',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is party manager visible?'
          }
        ],
        menus: {
          readyStatusMenu: {
            acceptReporters: true,
            items: ['READY', 'NOT READY']
          }
        }
      };
    }

    // -----------------------------------------------------------------
    // P2P WebRTC Connection & Handshake
    // -----------------------------------------------------------------
    connectGameJolt(args) {
      const username = String(args.USERNAME || '').trim();
      const token = String(args.TOKEN || '').trim();

      if (!username) {
        console.warn('[Party] Username is required');
        return;
      }

      this.myUsername = username;
      this.myToken = token;
      this.leaderUsername = username;
      this.isLeader = true;
      this.isReady = false;
      this.partyId = generatePartyCode();

      this.members = [
        { username: this.myUsername, ready: false, isLeader: true, peerId: '' }
      ];

      // Close any previous Peer connection
      if (this.peer) {
        try { this.peer.destroy(); } catch(e) {}
      }

      const peerId = sanitizePeerId(this.myUsername);
      console.log('[Party] Initializing P2P node for:', this.myUsername, 'Peer ID:', peerId);

      try {
        this.peer = new window.Peer(peerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          console.log('[Party] Connected to P2P network with ID:', id);
          this.isConnected = true;
          this.members[0].peerId = id;
          this.broadcastStateToUI();
          this.notifyUIStatus(true, 'P2P ONLINE');
        });

        this.peer.on('connection', (conn) => {
          this.setupIncomingConnection(conn);
        });

        this.peer.on('error', (err) => {
          console.warn('[Party] Peer error:', err.type, err);
          if (err.type === 'unavailable-id') {
            // Suffix retry
            const altId = peerId + '_' + Math.floor(Math.random() * 1000);
            console.log('[Party] Retrying with alternative peer ID:', altId);
            this.peer = new window.Peer(altId);
            this.peer.on('open', (id) => {
              this.isConnected = true;
              this.members[0].peerId = id;
              this.broadcastStateToUI();
              this.notifyUIStatus(true, 'P2P ONLINE');
            });
            this.peer.on('connection', (conn) => this.setupIncomingConnection(conn));
          }
        });

        this.peer.on('disconnected', () => {
          console.log('[Party] Peer disconnected from signaling server, reconnecting...');
          try { this.peer.reconnect(); } catch(e) {}
        });

      } catch(e) {
        console.error('[Party] Failed to create Peer:', e);
      }
    }

    disconnectNetwork() {
      if (this.peer) {
        try { this.peer.destroy(); } catch(e) {}
        this.peer = null;
      }
      this.isConnected = false;
      this.connections.clear();
      this.leaderConnection = null;
      this.members = [];
      this.broadcastStateToUI();
      this.notifyUIStatus(false, 'DISCONNECTED');
    }

    // Setup an incoming P2P connection from another user
    setupIncomingConnection(conn) {
      conn.on('open', () => {
        console.log('[Party] Incoming connection established from:', conn.peer);
      });

      conn.on('data', (data) => {
        this.handlePeerData(conn, data);
      });

      conn.on('close', () => {
        this.handlePeerClosed(conn);
      });

      conn.on('error', (err) => {
        console.warn('[Party] Connection error with peer:', conn.peer, err);
      });
    }

    // Handle Packet received over P2P DataChannel
    handlePeerData(conn, packet) {
      if (!packet || !packet.type) return;

      switch (packet.type) {
        case 'INVITE':
          // Another user invited me!
          this.lastInviteSender = packet.from;
          this.lastInvitePartyId = packet.partyId;
          console.log('[Party] Received party invite from:', packet.from, 'Party:', packet.partyId);
          // Trigger Hat Block
          Scratch.vm.runtime.startHats('geometryRushParty_whenReceivedPartyInvite');
          // Notify HTML UI
          this.sendUIToast(packet.from, packet.partyId);
          break;

        case 'JOIN_REQUEST':
          // Another user wants to join MY party (I am Leader)
          if (!this.isLeader) return;
          if (this.members.length >= 4) {
            conn.send({ type: 'JOIN_REJECT', reason: 'Party is full' });
            return;
          }
          const newUser = packet.username;
          this.connections.set(newUser.toLowerCase(), conn);
          this.members.push({
            username: newUser,
            ready: false,
            isLeader: false,
            peerId: conn.peer
          });

          this.lastJoinedUser = newUser;
          console.log('[Party] User joined party:', newUser);

          // Respond with acceptance and current full party state
          conn.send({
            type: 'JOIN_ACCEPT',
            partyId: this.partyId,
            leader: this.leaderUsername,
            members: this.members.map(m => ({
              username: m.username,
              ready: m.ready,
              isLeader: m.isLeader
            }))
          });

          // Broadcast to all other members that a new user joined
          this.broadcastToMembers({
            type: 'MEMBER_JOINED',
            member: { username: newUser, ready: false, isLeader: false }
          }, newUser);

          // Trigger Scratch Hat Block on leader
          Scratch.vm.runtime.startHats('geometryRushParty_whenAnotherUserJoined');
          this.broadcastStateToUI();
          break;

        case 'JOIN_ACCEPT':
          // Leader accepted my join request
          this.partyId = packet.partyId;
          this.leaderUsername = packet.leader;
          this.isLeader = false;
          this.isReady = false;
          this.leaderConnection = conn;
          this.members = packet.members || [];
          console.log('[Party] Successfully joined party of:', packet.leader);

          // Trigger Hat Block on client
          Scratch.vm.runtime.startHats('geometryRushParty_whenJoinedParty');
          this.broadcastStateToUI();
          break;

        case 'MEMBER_JOINED':
          // Notification that another user joined the party
          if (packet.member) {
            this.members.push(packet.member);
            this.lastJoinedUser = packet.member.username;
            console.log('[Party] Another user joined:', packet.member.username);
            Scratch.vm.runtime.startHats('geometryRushParty_whenAnotherUserJoined');
            this.broadcastStateToUI();
          }
          break;

        case 'MEMBER_LEFT':
          // Notification that another user left
          const leftUser = packet.username;
          this.members = this.members.filter(m => m.username.toLowerCase() !== leftUser.toLowerCase());
          this.lastLeftUser = leftUser;
          console.log('[Party] Another user left:', leftUser);
          Scratch.vm.runtime.startHats('geometryRushParty_whenAnotherUserLeft');
          this.broadcastStateToUI();
          break;

        case 'LEAVE':
          // Member informed leader they are leaving
          const leavingUser = packet.username;
          this.connections.delete(leavingUser.toLowerCase());
          this.members = this.members.filter(m => m.username.toLowerCase() !== leavingUser.toLowerCase());
          this.lastLeftUser = leavingUser;
          console.log('[Party] Member left:', leavingUser);

          // Broadcast to remaining members
          this.broadcastToMembers({
            type: 'MEMBER_LEFT',
            username: leavingUser
          });

          Scratch.vm.runtime.startHats('geometryRushParty_whenAnotherUserLeft');
          this.broadcastStateToUI();
          break;

        case 'KICKED':
          // I was kicked by the party leader
          console.log('[Party] You were kicked from the party.');
          this.resetToSoloParty();
          Scratch.vm.runtime.startHats('geometryRushParty_whenLeftParty');
          this.broadcastStateToUI();
          break;

        case 'PARTY_DISBANDED':
          console.log('[Party] Party was disbanded by host.');
          this.resetToSoloParty();
          Scratch.vm.runtime.startHats('geometryRushParty_whenLeftParty');
          this.broadcastStateToUI();
          break;

        case 'READY_CHANGE':
          // Member changed ready status
          const rUser = packet.username;
          const rStatus = !!packet.ready;
          const target = this.members.find(m => m.username.toLowerCase() === rUser.toLowerCase());
          if (target) {
            target.ready = rStatus;
          }
          if (this.isLeader) {
            // Leader relays to other members
            this.broadcastToMembers({
              type: 'READY_CHANGE',
              username: rUser,
              ready: rStatus
            }, rUser);
          }
          this.broadcastStateToUI();
          break;

        case 'GAME_DATA':
          // Custom in-game real-time data packet
          this.lastReceivedLabel = packet.label || '';
          this.lastReceivedData = String(packet.value || '');
          this.lastDataSender = packet.sender || '';

          if (this.isLeader) {
            // Relay to other members
            this.broadcastToMembers(packet, packet.sender);
          }

          Scratch.vm.runtime.startHats('geometryRushParty_whenPartyDataReceived');
          break;

        case 'CHAT':
          this.sendUIChat(packet.sender, packet.text);
          if (this.isLeader) {
            this.broadcastToMembers(packet, packet.sender);
          }
          break;
      }
    }

    handlePeerClosed(conn) {
      // Find which member disconnected
      let disconnectedUser = '';
      for (const [user, c] of this.connections.entries()) {
        if (c === conn || c.peer === conn.peer) {
          disconnectedUser = user;
          this.connections.delete(user);
          break;
        }
      }

      if (conn === this.leaderConnection) {
        // Party leader disconnected!
        console.log('[Party] Leader disconnected, party disbanded');
        this.resetToSoloParty();
        Scratch.vm.runtime.startHats('geometryRushParty_whenLeftParty');
        this.broadcastStateToUI();
        return;
      }

      if (disconnectedUser) {
        this.members = this.members.filter(m => m.username.toLowerCase() !== disconnectedUser.toLowerCase());
        this.lastLeftUser = disconnectedUser;
        console.log('[Party] User connection dropped:', disconnectedUser);
        this.broadcastToMembers({
          type: 'MEMBER_LEFT',
          username: disconnectedUser
        });
        Scratch.vm.runtime.startHats('geometryRushParty_whenAnotherUserLeft');
        this.broadcastStateToUI();
      }
    }

    // Broadcast message to all connected members (except optional excludeUser)
    broadcastToMembers(packet, excludeUser) {
      const exc = (excludeUser || '').toLowerCase();
      for (const [user, conn] of this.connections.entries()) {
        if (user !== exc && conn && conn.open) {
          try { conn.send(packet); } catch(e) {}
        }
      }
    }

    // Reset current state to solo party
    resetToSoloParty() {
      this.partyId = generatePartyCode();
      this.leaderUsername = this.myUsername;
      this.isLeader = true;
      this.isReady = false;
      this.leaderConnection = null;
      this.connections.clear();
      this.members = [
        { username: this.myUsername, ready: false, isLeader: true, peerId: this.peer ? this.peer.id : '' }
      ];
    }

    // -----------------------------------------------------------------
    // Scratch Block Action Implementations
    // -----------------------------------------------------------------
    inviteUser(args) {
      const target = String(args.USERNAME || '').trim();
      if (!target || !this.peer) return;

      const targetPeerId = sanitizePeerId(target);
      console.log('[Party] Sending invite to:', target, 'via peer:', targetPeerId);

      const conn = this.peer.connect(targetPeerId);
      conn.on('open', () => {
        conn.send({
          type: 'INVITE',
          from: this.myUsername,
          partyId: this.partyId
        });
        setTimeout(() => {
          try { conn.close(); } catch(e) {}
        }, 1500);
      });
      conn.on('error', (e) => console.warn('[Party] Could not deliver invite to:', target, e));
    }

    acceptInvite(args) {
      const from = String(args.USERNAME || this.lastInviteSender || '').trim();
      if (!from || !this.peer) return;

      console.log('[Party] Accepting invite from:', from);
      const hostPeerId = sanitizePeerId(from);

      // Disconnect from current party if in one
      this.leaveParty();

      const conn = this.peer.connect(hostPeerId);
      this.setupIncomingConnection(conn);

      conn.on('open', () => {
        conn.send({
          type: 'JOIN_REQUEST',
          username: this.myUsername,
          token: this.myToken
        });
      });
    }

    declineInvite() {
      console.log('[Party] Declined party invite from:', this.lastInviteSender);
      this.lastInviteSender = '';
      this.lastInvitePartyId = '';
    }

    leaveParty() {
      if (this.isLeader) {
        // Disband party
        this.broadcastToMembers({ type: 'PARTY_DISBANDED' });
        for (const conn of this.connections.values()) {
          try { conn.close(); } catch(e) {}
        }
      } else if (this.leaderConnection && this.leaderConnection.open) {
        try {
          this.leaderConnection.send({
            type: 'LEAVE',
            username: this.myUsername
          });
          this.leaderConnection.close();
        } catch(e) {}
      }

      this.resetToSoloParty();
      Scratch.vm.runtime.startHats('geometryRushParty_whenLeftParty');
      this.broadcastStateToUI();
    }

    kickUser(args) {
      if (!this.isLeader) return;
      const target = String(args.USERNAME || '').trim().toLowerCase();
      const conn = this.connections.get(target);
      if (conn) {
        try {
          conn.send({ type: 'KICKED' });
          conn.close();
        } catch(e) {}
        this.connections.delete(target);
      }
      this.members = this.members.filter(m => m.username.toLowerCase() !== target);
      this.lastLeftUser = target;
      this.broadcastToMembers({ type: 'MEMBER_LEFT', username: target });
      Scratch.vm.runtime.startHats('geometryRushParty_whenAnotherUserLeft');
      this.broadcastStateToUI();
    }

    setReadyStatus(args) {
      const statusStr = String(args.STATUS || 'READY').toUpperCase();
      const isReady = (statusStr === 'READY');
      this.isReady = isReady;

      const myMember = this.members.find(m => m.username.toLowerCase() === this.myUsername.toLowerCase());
      if (myMember) myMember.ready = isReady;

      if (this.isLeader) {
        this.broadcastToMembers({
          type: 'READY_CHANGE',
          username: this.myUsername,
          ready: isReady
        });
      } else if (this.leaderConnection && this.leaderConnection.open) {
        this.leaderConnection.send({
          type: 'READY_CHANGE',
          username: this.myUsername,
          ready: isReady
        });
      }

      this.broadcastStateToUI();
    }

    sendPartyData(args) {
      const label = String(args.LABEL || '');
      const value = String(args.VALUE || '');

      const packet = {
        type: 'GAME_DATA',
        label: label,
        value: value,
        sender: this.myUsername
      };

      if (this.isLeader) {
        this.broadcastToMembers(packet);
      } else if (this.leaderConnection && this.leaderConnection.open) {
        this.leaderConnection.send(packet);
      }
    }

    // -----------------------------------------------------------------
    // Reporters
    // -----------------------------------------------------------------
    getIsConnected() { return this.isConnected; }
    getMyUsername() { return this.myUsername; }
    getIsInParty() { return this.members.length > 1 || !this.isLeader; }
    getIsPartyLeader() { return this.isLeader; }
    getPartyLeader() { return this.leaderUsername; }
    getPartyMemberCount() { return this.members.length; }
    getPartyMembersJson() { return JSON.stringify(this.members.map(m => m.username)); }
    getPartyMemberAt(args) {
      const idx = Math.max(1, Math.min(4, parseInt(args.INDEX, 10) || 1)) - 1;
      return this.members[idx] ? this.members[idx].username : '';
    }
    getIsMemberReady(args) {
      const u = String(args.USERNAME || '').toLowerCase();
      const m = this.members.find(x => x.username.toLowerCase() === u);
      return m ? m.ready : false;
    }
    getPartyCode() { return this.partyId; }
    getLastInviteSender() { return this.lastInviteSender; }
    getLastJoinedUser() { return this.lastJoinedUser; }
    getLastLeftUser() { return this.lastLeftUser; }
    getLastPartyData() { return this.lastReceivedData; }
    getLastPartyLabel() { return this.lastReceivedLabel; }
    getLastDataSender() { return this.lastDataSender; }
    getPartyHtmlCode() { return this.partyHtmlSource; }
    getIsOverlayVisible() { return this.isOverlayVisible; }

    // -----------------------------------------------------------------
    // HTML UI Synchronization & Overlay
    // -----------------------------------------------------------------
    broadcastStateToUI() {
      const stateObj = {
        myUsername: this.myUsername,
        partyId: this.partyId,
        leader: this.leaderUsername,
        isReady: this.isReady,
        members: this.members.map(m => ({
          username: m.username,
          ready: m.ready,
          isLeader: m.isLeader,
          avatar: ''
        }))
      };

      // 1. Direct window call if PartyUI exists
      if (window.PartyUI) {
        window.PartyUI.updateState(stateObj);
      }

      // 2. PostMessage to iframes
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(ifr => {
        try {
          ifr.contentWindow.postMessage({
            source: 'GEOMETRY_RUSH_PARTY_EXT',
            type: 'UPDATE_STATE',
            state: stateObj
          }, '*');
        } catch(e) {}
      });
    }

    sendUIToast(from, partyId) {
      if (window.PartyUI) {
        window.PartyUI.showInvite(from, partyId);
      }
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(ifr => {
        try {
          ifr.contentWindow.postMessage({
            source: 'GEOMETRY_RUSH_PARTY_EXT',
            type: 'INVITE_RECEIVED',
            from: from,
            partyId: partyId
          }, '*');
        } catch(e) {}
      });
    }

    sendUIChat(sender, text) {
      if (window.PartyUI) {
        window.PartyUI.addChat(sender, text);
      }
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(ifr => {
        try {
          ifr.contentWindow.postMessage({
            source: 'GEOMETRY_RUSH_PARTY_EXT',
            type: 'CHAT_RECEIVED',
            sender: sender,
            text: text
          }, '*');
        } catch(e) {}
      });
    }

    notifyUIStatus(online, text) {
      if (window.PartyUI) {
        window.PartyUI.setStatus(online, text);
      }
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(ifr => {
        try {
          ifr.contentWindow.postMessage({
            source: 'GEOMETRY_RUSH_PARTY_EXT',
            type: 'SET_STATUS',
            online: online,
            text: text
          }, '*');
        } catch(e) {}
      });
    }

    handleUIAction(action, payload) {
      console.log('[Party] Received UI Action:', action, payload);
      switch (action) {
        case 'UI_MOUNTED':
          this.broadcastStateToUI();
          this.notifyUIStatus(this.isConnected, this.isConnected ? 'P2P ONLINE' : 'DISCONNECTED');
          break;
        case 'SET_READY':
          this.setReadyStatus({ STATUS: payload.ready ? 'READY' : 'NOT READY' });
          break;
        case 'INVITE_USER':
          this.inviteUser({ USERNAME: payload.username });
          break;
        case 'ACCEPT_INVITE':
          this.acceptInvite({ USERNAME: payload.from });
          break;
        case 'DECLINE_INVITE':
          this.declineInvite();
          break;
        case 'LEAVE_PARTY':
          this.leaveParty();
          break;
        case 'KICK_PLAYER':
          this.kickUser({ USERNAME: payload.username });
          break;
        case 'EXIT':
          this.hidePartyOverlay();
          break;
        case 'SEND_CHAT':
          const chatPacket = {
            type: 'CHAT',
            sender: this.myUsername,
            text: payload.text
          };
          if (this.isLeader) {
            this.broadcastToMembers(chatPacket);
          } else if (this.leaderConnection && this.leaderConnection.open) {
            this.leaderConnection.send(chatPacket);
          }
          break;
      }
    }

    // Direct Overlay UI methods
    showPartyOverlay() {
      if (!this.overlayElement) {
        const stage = document.querySelector('.stage_stage_1tD78') ||
                      document.querySelector('canvas[class*="stage"]') ||
                      document.body;

        const wrapper = document.createElement('div');
        wrapper.id = 'gr-party-overlay-wrapper';
        wrapper.style.position = 'fixed';
        wrapper.style.inset = '0';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.zIndex = '999999';
        wrapper.style.background = 'rgba(0, 0, 0, 0.65)';
        wrapper.style.backdropFilter = 'blur(4px)';

        const iframe = document.createElement('iframe');
        iframe.style.width = '96vw';
        iframe.style.maxWidth = '1020px';
        iframe.style.height = '94vh';
        iframe.style.maxHeight = '560px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        iframe.srcdoc = this.partyHtmlSource;

        wrapper.appendChild(iframe);
        document.body.appendChild(wrapper);
        this.overlayElement = wrapper;
      }

      this.overlayElement.style.display = 'flex';
      this.isOverlayVisible = true;
      this.broadcastStateToUI();
    }

    hidePartyOverlay() {
      if (this.overlayElement) {
        this.overlayElement.style.display = 'none';
      }
      this.isOverlayVisible = false;
    }
  }

  // Register TurboWarp Extension
  Scratch.extensions.register(new GeometryRushPartyExtension());

})(Scratch);
`;

fs.writeFileSync(path.join(__dirname, 'extension.js'), extensionCode, 'utf8');
console.log('Successfully created extension.js, size:', extensionCode.length, 'bytes');
