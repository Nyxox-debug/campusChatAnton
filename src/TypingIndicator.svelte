<div class="typing">
  <div class="avatar">AI</div>
  <div class="bubble">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
</div>

<style>
  .typing {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 12px;
    animation: slideIn 0.2s ease;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #fff;
    color: #000;
    border: 1px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 500;
  }

  .bubble {
    background: #111;
    border: 1px solid #222;
    border-radius: 16px;
    border-bottom-left-radius: 4px;
    padding: 12px 16px;
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #555;
    animation: bounce 1.1s infinite ease-in-out;
  }
  .dot:nth-child(2) { animation-delay: 0.18s; }
  .dot:nth-child(3) { animation-delay: 0.36s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); background: #444; }
    30% { transform: translateY(-4px); background: #fff; }
  }
</style>
