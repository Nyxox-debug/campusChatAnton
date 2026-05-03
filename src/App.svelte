<script>
  import { tick } from 'svelte'
  import Message from './Message.svelte'
  import TypingIndicator from './TypingIndicator.svelte'
  import { messages, isLoading, userRole, sendMessage, resetChat, GITHUB_URL } from './store.js'

  let inputValue = ''
  let chatContainer
  let selectedRole = null
  let textareaEl

  const quickReplies = {
    student: ['Check my results', 'Pay school fees', 'Course registration', 'Hostel allocation', 'Library access'],
    staff: ['View payslip', 'Apply for leave', 'IT support', 'Procurement request', 'Training programs']
  }

  function selectRole(role) {
    selectedRole = role
    resetChat(role)
    scrollToBottom()
  }

  function switchRole() {
    selectedRole = null
    userRole.set(null)
  }

  async function handleSend() {
    const msg = inputValue.trim()
    if (!msg || $isLoading) return
    inputValue = ''
    autoResize()
    await sendMessage(msg, selectedRole)
    await scrollToBottom()
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleQuickReply(text) {
    if ($isLoading) return
    inputValue = text
    await handleSend()
  }

  async function scrollToBottom() {
    await tick()
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }

  function autoResize() {
    if (!textareaEl) return
    textareaEl.style.height = 'auto'
    textareaEl.style.height = Math.min(textareaEl.scrollHeight, 100) + 'px'
  }

  $: if ($messages || $isLoading) scrollToBottom()
</script>

<div class="app">

  <!-- HEADER -->
  <header class="header">
    <div class="header-brand">
      <div class="brand-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fff"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="brand-text">
        <span class="brand-name">Campus Support</span>
        {#if selectedRole}
          <span class="brand-role">{selectedRole}</span>
        {/if}
      </div>
    </div>
    <div class="header-actions">
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" class="source-link" aria-label="View source on GitHub">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        View source
      </a>
      {#if selectedRole}
        <button class="switch-btn" on:click={switchRole}>Switch role</button>
      {/if}
    </div>
  </header>

  <!-- ROLE SELECTOR -->
  {#if !selectedRole}
    <div class="role-screen">
      <div class="role-content">
        <p class="role-label">IDENTIFY YOURSELF</p>
        <h2 class="role-heading">Who are you?</h2>
        <p class="role-sub">Select your role to access personalised support</p>
        <div class="role-cards">
          <button class="role-card" on:click={() => selectRole('student')}>
            <div class="role-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.5"/>
              </svg>
            </div>
            <div class="role-info">
              <span class="role-title">Student</span>
              <span class="role-desc">Fees, results, registration & more</span>
            </div>
            <svg class="role-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <button class="role-card" on:click={() => selectRole('staff')}>
            <div class="role-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" opacity="0.5"/>
              </svg>
            </div>
            <div class="role-info">
              <span class="role-title">Staff</span>
              <span class="role-desc">Payroll, leave, IT & procurement</span>
            </div>
            <svg class="role-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div class="role-footer">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" class="source-link-alt">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View source on GitHub
          </a>
        </div>
      </div>
    </div>

  {:else}
    <!-- CHAT VIEW -->
    <div class="chat-view">

      <!-- Messages -->
      <div class="messages" bind:this={chatContainer}>
        <div class="messages-inner">
          {#each $messages as message (message.id)}
            <Message {message} />
          {/each}
          {#if $isLoading}
            <TypingIndicator />
          {/if}
        </div>
      </div>

      <!-- Quick Replies -->
      {#if !$isLoading}
        <div class="quick-bar">
          {#each quickReplies[selectedRole] as reply}
            <button class="quick-chip" on:click={() => handleQuickReply(reply)}>{reply}</button>
          {/each}
        </div>
      {/if}

      <!-- Input -->
      <div class="input-bar">
        <div class="input-wrap">
          <textarea
            bind:this={textareaEl}
            bind:value={inputValue}
            on:keydown={handleKeydown}
            on:input={autoResize}
            placeholder="Type a message..."
            disabled={$isLoading}
            rows="1"
            aria-label="Message input"
          ></textarea>
          <button
            class="send-btn"
            on:click={handleSend}
            disabled={!inputValue.trim() || $isLoading}
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
              <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  {/if}

</div>

<style>
  /* ── Layout shell ──────────────────────────────── */
  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
    height: -webkit-fill-available;
    background: #000;
    max-width: 640px;
    margin: 0 auto;
    width: 100%;
  }

  /* ── Header ────────────────────────────────────── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #1a1a1a;
    background: #000;
    flex-shrink: 0;
    min-height: 52px;
    gap: 8px;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .brand-icon {
    width: 32px;
    height: 32px;
    background: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .brand-name {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .brand-role {
    font-size: 10px;
    color: #666;
    font-family: 'IBM Plex Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .source-link {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #555;
    text-decoration: none;
    font-family: 'IBM Plex Mono', monospace;
    padding: 5px 8px;
    border: 1px solid #222;
    border-radius: 6px;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .source-link:hover { color: #fff; border-color: #444; }

  .switch-btn {
    background: none;
    border: 1px solid #222;
    color: #555;
    font-size: 11px;
    font-family: 'IBM Plex Mono', monospace;
    padding: 5px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .switch-btn:hover { color: #fff; border-color: #444; }

  /* ── Role screen ───────────────────────────────── */
  .role-screen {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    overflow-y: auto;
  }

  .role-content {
    width: 100%;
    max-width: 400px;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .role-label {
    font-size: 10px;
    color: #444;
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.15em;
    margin-bottom: 10px;
  }

  .role-heading {
    font-size: clamp(24px, 7vw, 36px);
    font-weight: 600;
    color: #fff;
    margin-bottom: 8px;
    line-height: 1.1;
  }

  .role-sub {
    font-size: 14px;
    color: #555;
    font-weight: 300;
    margin-bottom: 28px;
  }

  .role-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .role-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #0a0a0a;
    border: 1px solid #1c1c1c;
    border-radius: 14px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.18s;
    text-align: left;
    width: 100%;
    color: #fff;
  }
  .role-card:hover, .role-card:active {
    background: #111;
    border-color: #fff;
    transform: translateY(-1px);
  }

  .role-icon {
    width: 44px;
    height: 44px;
    background: #111;
    border: 1px solid #222;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #fff;
  }

  .role-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .role-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  .role-desc {
    font-size: 12px;
    color: #555;
    font-weight: 300;
  }

  .role-arrow {
    color: #333;
    flex-shrink: 0;
  }

  .role-footer {
    margin-top: 28px;
    text-align: center;
  }

  .source-link-alt {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #444;
    text-decoration: none;
    font-family: 'IBM Plex Mono', monospace;
    transition: color 0.15s;
  }
  .source-link-alt:hover { color: #888; }

  /* ── Chat view ─────────────────────────────────── */
  .chat-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; /* critical for flex scroll */
    overflow: hidden;
  }

  /* Messages scroll area */
  .messages {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    /* custom scrollbar */
    scrollbar-width: thin;
    scrollbar-color: #222 transparent;
  }
  .messages::-webkit-scrollbar { width: 3px; }
  .messages::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }

  .messages-inner {
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  /* Quick replies */
  .quick-bar {
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    flex-shrink: 0;
    border-top: 1px solid #111;
  }
  .quick-bar::-webkit-scrollbar { display: none; }

  .quick-chip {
    flex-shrink: 0;
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 20px;
    padding: 7px 12px;
    font-size: 12px;
    color: #888;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    font-family: 'IBM Plex Sans', sans-serif;
  }
  .quick-chip:hover, .quick-chip:active {
    border-color: #fff;
    color: #fff;
    background: #111;
  }

  /* Input bar */
  .input-bar {
    padding: 10px 12px;
    padding-bottom: max(10px, env(safe-area-inset-bottom));
    border-top: 1px solid #1a1a1a;
    background: #000;
    flex-shrink: 0;
  }

  .input-wrap {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    background: #0d0d0d;
    border: 1px solid #222;
    border-radius: 14px;
    padding: 6px 6px 6px 12px;
  }

  textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    resize: none;
    line-height: 1.5;
    max-height: 100px;
    min-height: 22px;
    padding: 4px 0;
    /* prevent zoom on iOS */
    font-size: max(16px, 14px);
  }
  textarea::placeholder { color: #444; }
  textarea:disabled { opacity: 0.4; cursor: not-allowed; }

  .send-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 9px;
    background: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    color: #000;
    flex-shrink: 0;
  }
  .send-btn:hover:not(:disabled) {
    background: #ddd;
    transform: scale(1.05);
  }
  .send-btn:disabled {
    background: #1a1a1a;
    color: #444;
    cursor: not-allowed;
    transform: none;
  }

  /* ── Desktop padding ───────────────────────────── */
  @media (min-width: 641px) {
    .app {
      border-left: 1px solid #111;
      border-right: 1px solid #111;
    }
    .role-heading { font-size: 36px; }
  }
</style>
