<script>
  export let message

  function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
</script>

<div class="msg {message.role}">
  {#if message.role === 'assistant'}
    <div class="avatar bot-avatar" aria-hidden="true">AI</div>
  {/if}

  <div class="bubble">
    <p>{message.content}</p>
    <time>{formatTime(message.timestamp)}</time>
  </div>

  {#if message.role === 'user'}
    <div class="avatar user-avatar" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </div>
  {/if}
</div>

<style>
  .msg {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 12px;
    animation: slideIn 0.22s ease;
  }
  .msg.user { flex-direction: row-reverse; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.05em;
  }
  .bot-avatar {
    background: #fff;
    color: #000;
    border: 1px solid #fff;
  }
  .user-avatar {
    background: #222;
    color: #fff;
    border: 1px solid #333;
  }

  .bubble {
    max-width: min(72%, 300px);
    padding: 10px 14px;
    border-radius: 16px;
  }
  .assistant .bubble {
    background: #111;
    border: 1px solid #222;
    border-bottom-left-radius: 4px;
  }
  .user .bubble {
    background: #fff;
    border: 1px solid #fff;
    border-bottom-right-radius: 4px;
  }

  p {
    font-size: 14px;
    line-height: 1.55;
    font-weight: 400;
  }
  .assistant p { color: #e8e8e8; }
  .user p { color: #000; }

  time {
    display: block;
    font-size: 10px;
    margin-top: 4px;
    font-family: 'IBM Plex Mono', monospace;
  }
  .assistant time { color: #555; }
  .user time { color: #888; text-align: right; }
</style>
