# Dropkick Games Party Service — P2P Party Manager for TurboWarp

A high-performance **Peer-to-Peer (WebRTC) Party Manager** designed for **Geometry Rush**, built with:
* **Burbank Big Condensed Bold** typography.
* **Create or Join Party Screen** when opening or leaving a party.
* **Party Chat System** (collapsible drawer with Burbank font, message history, chat input, and unread notification badge).
* **Transformed Bottom Button**: The exit button on the party screen is replaced by the `CHAT` button!
* **Pure Costume-Driven Avatars**: Icons are selected programmatically via Scratch sprite costumes (`set my party icon to costume [COSTUME]`), with no manual UI picker.
* **GameJolt Account Authentication** (pass username and GameJolt token).
* **New Event Hat Blocks**:
  - `when a player gets kicked`
  - `when a new message gets sent`
  - `when a new player leaves the party`
  - `when a new player joins the party`
  - `when the client joins a party`
  - `when the client leaves a party`
* **Real-Time WebRTC Data Sync**: Sub-millisecond latency game packets, star topology, and automatic leader migration if the host disconnects.

---

## 📁 Files in this Project

| File | Description |
| :--- | :--- |
| **[`party.html`](file:///c:/Users/Windows%20User/Desktop/GeometryRushParty/party.html)** | **Party Manager HTML**: Standalone HTML view ready to be hosted on **GitHub Pages** or viewed in TurboWarp via HTML viewing extensions / iframes. 100% self-contained with base64 assets and PeerJS. |
| **[`extension.js`](file:///c:/Users/Windows%20User/Desktop/GeometryRushParty/extension.js)** | **TurboWarp Extension**: The complete, self-contained unsandboxed extension file to load into TurboWarp. Bundles PeerJS, the built-in UI overlay, and all blocks. |
| **[`simulator.html`](file:///c:/Users/Windows%20User/Desktop/GeometryRushParty/simulator.html)** | **2-Player Live Simulator**: Open in your browser to test two players creating, joining, and chatting simultaneously. |
| **[`build.js`](file:///c:/Users/Windows%20User/Desktop/GeometryRushParty/build.js)** | Build script that compiles `src/extension.src.js` into `extension.js`. |
| **[`build_party_html.js`](file:///c:/Users/Windows%20User/Desktop/GeometryRushParty/build_party_html.js)** | Build script that compiles `party.html`. |
| **[`assets/`](file:///c:/Users/Windows%20User/Desktop/GeometryRushParty/assets)** | Contains `button.png`, `BurbankBigCondensed-Bold.otf`, and `peerjs.min.js`. |

---

## 🌐 Tutorial: Hosting on GitHub Pages & Using in TurboWarp

### Part 1: Uploading to GitHub & Enabling GitHub Pages

1. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com) and click **New Repository**.
   - Name it `GeometryRushParty` (or any name you like).
   - Set it to **Public** and click **Create repository**.

2. **Upload the Files**:
   - You can push via Git or simply drag and drop:
     - `party.html` (Required for the web view)
     - `extension.js` (Your TurboWarp extension file)
     - `button.png` and other assets (optional since `party.html` is 100% self-contained!)
   - Commit the files to the `main` branch.

3. **Enable GitHub Pages**:
   - In your repository, click **Settings** (gear icon at the top).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** > **Branch**:
     - Select `main` branch.
     - Folder: `/ (root)`.
     - Click **Save**.
   - Wait 1–2 minutes. GitHub will provide your live URL, formatted like:
     ```
     https://<YOUR-USERNAME>.github.io/GeometryRushParty/party.html
     ```

---

### Part 2: Loading in TurboWarp

You can use the Party Manager in TurboWarp using either of these two methods:

#### Method A: Using TurboWarp's HTML Viewer / Iframe Extension
If your Scratch project uses an HTML / Web Page Viewer extension:
1. In your HTML Viewer extension, set the URL or iframe source to your GitHub Pages URL:
   ```
   https://<YOUR-USERNAME>.github.io/GeometryRushParty/party.html
   ```
2. Also load [`extension.js`](file:///c:/Users/Windows%20User/Desktop/GeometryRushParty/extension.js) as an unsandboxed extension in TurboWarp:
   - Click **Add Extension** (bottom-left) > **Custom Extension** > Choose **File** > Select `extension.js` > Check **Run extension without sandbox**.
3. The extension automatically syncs two-way with the GitHub Pages iframe via `window.postMessage`!
   - Setting skins, logging in with GameJolt, chatting, and party events will trigger seamlessly between your game and the HTML view.

#### Method B: Direct Built-in Stage Overlay (Zero Setup!)
[`extension.js`](file:///c:/Users/Windows%20User/Desktop/GeometryRushParty/extension.js) also comes with the exact same HTML UI built directly into the extension:
- Just call the `open party menu` block! It renders directly on top of the Scratch stage without needing any separate iframe extension or internet hosting.

---

## 🧩 TurboWarp Blocks Reference & Code Examples

### 1. GameJolt Login
```scratch
when green flag clicked
// Log into GameJolt (connects username and token to party system)
log in with GameJolt username (gamejolt_username) token (gamejolt_token) :: #0084FF
```

### 2. Setting Your Skin / Costume as Party Icon
Whenever the player equips or changes their skin in Geometry Rush, update their party icon so all other party members see it:
```scratch
when I receive [EQUIP_SKIN v]
switch costume to (current_skin_name)
set my party icon to costume (costume [name v]) :: #0084FF
```
*(The extension rasterizes your sprite's costume into a sharp 128x128 PNG and syncs it via WebRTC to everyone in the party!)*

### 3. Opening the Party Menu
```scratch
when this sprite clicked // When clicking "PARTY" in your menu
open party menu :: #0084FF
```

### 4. Party Event Hat Blocks
All 6 requested event blocks are available:

```scratch
// 1. Client joins a party (either by creating one or joining with a code)
when the client joins a party :: #0084FF hat
broadcast [START_LOBBY_MUSIC v]

// 2. Client leaves a party
when the client leaves a party :: #0084FF hat
broadcast [RETURN_TO_MAIN_MENU v]

// 3. A new player joins your squad
when a new player joins the party :: #0084FF hat
say (join (player who joined :: #0084FF) [ joined the squad!]) for (2) secs

// 4. A player leaves your squad
when a new player leaves the party :: #0084FF hat
say (join (player who left :: #0084FF) [ left the squad.]) for (2) secs

// 5. A player gets kicked (fires if you kick someone or you get kicked!)
when a player gets kicked :: #0084FF hat
if <(player who was kicked :: #0084FF) = (my username :: #0084FF)> then
    say [You were kicked from the party!] for (3) secs
else
    say (join (player who was kicked :: #0084FF) [ was kicked.]) for (2) secs
end

// 6. When a new chat or game message arrives
when a new message gets sent :: #0084FF hat
say (join (last chat sender :: #0084FF) (join [: ] (last chat message :: #0084FF))) for (2) secs
```

### 5. Sending Chat from Scratch
You can open the chat drawer or send messages directly from Scratch scripts:
```scratch
// Send a chat message programmatically
send chat message [Let's go!] :: #0084FF

// Toggle the chat drawer open/close
toggle party chat :: #0084FF
```

### 6. Sending Real-Time Game Packets (Gameplay Sync)
```scratch
// Leader picks level:
if <am I party leader? :: #0084FF> then
    send to party [level] value [Electroman Adventures] :: #0084FF
end

// Receiving custom game packets:
when party data received :: #0084FF hat
if <(received label :: #0084FF) = [level]> then
    set [current_level v] to (received value :: #0084FF)
end
```
