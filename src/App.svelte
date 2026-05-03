<script>
    import { tick } from "svelte";
    import Message from "./Message.svelte";
    import TypingIndicator from "./TypingIndicator.svelte";
    import {
        messages,
        isLoading,
        userRole,
        sendMessage,
        resetChat,
        GITHUB_URL,
    } from "./store.js";

    let inputValue = "";
    let chatContainer;
    let selectedRole = null;
    let textareaEl;

    const quickReplies = {
        student: [
            "Check my results",
            "Pay school fees",
            "Course registration",
            "Hostel allocation",
            "Library access",
        ],
        staff: [
            "View payslip",
            "Apply for leave",
            "IT support",
            "Procurement request",
            "Training programs",
        ],
    };

    function selectRole(role) {
        selectedRole = role;
        resetChat(role);
        scrollToBottom();
    }

    function switchRole() {
        selectedRole = null;
        userRole.set(null);
    }

    async function handleSend() {
        const msg = inputValue.trim();
        if (!msg || $isLoading) return;
        inputValue = "";
        autoResize();
        await sendMessage(msg, selectedRole);
        await scrollToBottom();
    }

    function handleKeydown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    async function handleQuickReply(text) {
        if ($isLoading) return;
        inputValue = text;
        await handleSend();
    }

    async function scrollToBottom() {
        await tick();
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    function autoResize() {
        if (!textareaEl) return;
        textareaEl.style.height = "auto";
        textareaEl.style.height = Math.min(textareaEl.scrollHeight, 100) + "px";
    }

    $: if ($messages || $isLoading) scrollToBottom();
</script>

<div class="app">
    <header class="header">
        <div class="header-brand">
            <div class="logo" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L2 8.5l10 5.5 10-5.5L12 3z" fill="#fff" />
                    <path
                        d="M2 15.5l10 5.5 10-5.5"
                        stroke="#fff"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M2 12l10 5.5 10-5.5"
                        stroke="rgba(255,255,255,0.45)"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>
            <div class="brand-text">
                <span class="brand-name">Campus Support</span>
                {#if selectedRole}
                    <span class="brand-badge">{selectedRole}</span>
                {/if}
            </div>
        </div>

        <div class="header-actions">
            <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                class="gh-link"
                aria-label="View source"
            >
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path
                        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                    />
                </svg>
                <span class="gh-label">View source</span>
            </a>
            {#if selectedRole}
                <button class="pill-btn" on:click={switchRole}
                    >Switch role</button
                >
            {/if}
        </div>
    </header>

    {#if !selectedRole}
        <div class="role-screen">
            <div class="role-content">
                <div class="hero-badge">CAMPUS SUPPORT AI</div>
                <h1 class="hero-heading">Who are<br />you today?</h1>
                <p class="hero-sub">
                    Get instant answers tailored to your role
                </p>

                <div class="role-cards">
                    <button
                        class="role-card"
                        on:click={() => selectRole("student")}
                    >
                        <div class="role-card-inner">
                            <div class="rc-icon student-icon">
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
                                    />
                                    <path
                                        d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
                                        opacity="0.5"
                                    />
                                </svg>
                            </div>
                            <div class="rc-text">
                                <span class="rc-title">Student</span>
                                <span class="rc-desc"
                                    >Fees · Results · Registration · Hostel</span
                                >
                            </div>
                            <div class="rc-arrow">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                >
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </div>
                        <div class="rc-divider"></div>
                        <div class="rc-footer">
                            <span>Admissions</span>
                            <span>Library</span>
                            <span>Bursary</span>
                            <span>Academic records</span>
                        </div>
                    </button>

                    <button
                        class="role-card"
                        on:click={() => selectRole("staff")}
                    >
                        <div class="role-card-inner">
                            <div class="rc-icon staff-icon">
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <circle cx="12" cy="8" r="4" />
                                    <path
                                        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                                        opacity="0.6"
                                    />
                                </svg>
                            </div>
                            <div class="rc-text">
                                <span class="rc-title">Staff</span>
                                <span class="rc-desc"
                                    >Payroll · Leave · IT · Procurement</span
                                >
                            </div>
                            <div class="rc-arrow">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                >
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </div>
                        <div class="rc-divider"></div>
                        <div class="rc-footer">
                            <span>HR portal</span>
                            <span>Training</span>
                            <span>IT helpdesk</span>
                            <span>Admin</span>
                        </div>
                    </button>
                </div>

                <div class="screen-footer">
                    <div class="footer-line"></div>
                    <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="footer-gh"
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path
                                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                            />
                        </svg>
                        View source on GitHub
                    </a>
                </div>
            </div>
        </div>
    {:else}
        <div class="chat-view">
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

            {#if !$isLoading}
                <div class="quick-bar">
                    {#each quickReplies[selectedRole] as reply}
                        <button
                            class="quick-chip"
                            on:click={() => handleQuickReply(reply)}
                            >{reply}</button
                        >
                    {/each}
                </div>
            {/if}

            <div class="input-bar">
                <div class="input-wrap">
                    <textarea
                        bind:this={textareaEl}
                        bind:value={inputValue}
                        on:keydown={handleKeydown}
                        on:input={autoResize}
                        placeholder="Ask anything..."
                        disabled={$isLoading}
                        rows="1"
                        aria-label="Message input"
                    ></textarea>
                    <button
                        class="send-btn"
                        on:click={handleSend}
                        disabled={!inputValue.trim() || $isLoading}
                        aria-label="Send"
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M22 2L11 13"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                            />
                            <path
                                d="M22 2L15 22 11 13 2 9l20-7z"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
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

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        height: 54px;
        border-bottom: 1px solid #141414;
        background: #000;
        flex-shrink: 0;
        gap: 8px;
    }

    .header-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        flex: 1;
    }

    .logo {
        width: 34px;
        height: 34px;
        background: #111;
        border: 1px solid #2a2a2a;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .brand-text {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
    }

    .brand-name {
        font-size: 15px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
    }

    .brand-badge {
        font-size: 9px;
        font-family: "IBM Plex Mono", monospace;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #000;
        background: #fff;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 500;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
    }

    .gh-link {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: #555;
        text-decoration: none;
        font-family: "IBM Plex Mono", monospace;
        padding: 5px 9px;
        border: 1px solid #1e1e1e;
        border-radius: 7px;
        transition: all 0.15s;
        white-space: nowrap;
    }
    .gh-link:hover {
        color: #ccc;
        border-color: #333;
    }

    .pill-btn {
        background: #111;
        border: 1px solid #2a2a2a;
        color: #888;
        font-size: 11px;
        font-family: "IBM Plex Mono", monospace;
        padding: 5px 9px;
        border-radius: 7px;
        cursor: pointer;
        transition: all 0.15s;
        white-space: nowrap;
    }
    .pill-btn:hover {
        color: #fff;
        border-color: #444;
    }

    .role-screen {
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 32px 20px 24px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .role-content {
        width: 100%;
        max-width: 420px;
        animation: fadeUp 0.28s ease;
    }

    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero-badge {
        display: inline-block;
        font-size: 9px;
        font-family: "IBM Plex Mono", monospace;
        letter-spacing: 0.2em;
        color: #444;
        border: 1px solid #1e1e1e;
        border-radius: 20px;
        padding: 4px 10px;
        margin-bottom: 18px;
    }

    .hero-heading {
        font-size: clamp(30px, 8vw, 42px);
        font-weight: 600;
        color: #fff;
        line-height: 1.08;
        letter-spacing: -0.02em;
        margin-bottom: 10px;
    }

    .hero-sub {
        font-size: 14px;
        color: #4a4a4a;
        font-weight: 300;
        margin-bottom: 32px;
        line-height: 1.5;
    }

    .role-cards {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 32px;
    }

    .role-card {
        background: #090909;
        border: 1px solid #1c1c1c;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.18s;
        text-align: left;
        width: 100%;
        color: #fff;
        overflow: hidden;
        padding: 0;
    }
    .role-card:hover,
    .role-card:focus-visible {
        background: #0f0f0f;
        border-color: #3a3a3a;
        transform: translateY(-1px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }
    .role-card:active {
        transform: translateY(0);
    }

    .role-card-inner {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px 16px 14px;
    }

    .rc-icon {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .student-icon {
        background: #141414;
        border: 1px solid #252525;
        color: #fff;
    }
    .staff-icon {
        background: #141414;
        border: 1px solid #252525;
        color: #fff;
    }

    .rc-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .rc-title {
        font-size: 17px;
        font-weight: 600;
        color: #fff;
        letter-spacing: -0.01em;
    }
    .rc-desc {
        font-size: 12px;
        color: #4a4a4a;
        font-weight: 300;
    }
    .rc-arrow {
        color: #2e2e2e;
    }

    .rc-divider {
        height: 1px;
        background: #141414;
        margin: 0 16px;
    }

    .rc-footer {
        display: flex;
        gap: 6px;
        padding: 10px 16px;
        flex-wrap: wrap;
    }
    .rc-footer span {
        font-size: 10px;
        font-family: "IBM Plex Mono", monospace;
        color: #3a3a3a;
        background: #111;
        border: 1px solid #1e1e1e;
        border-radius: 4px;
        padding: 2px 7px;
        letter-spacing: 0.03em;
    }

    .screen-footer {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .footer-line {
        flex: 1;
        height: 1px;
        background: #141414;
    }
    .footer-gh {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #333;
        text-decoration: none;
        font-family: "IBM Plex Mono", monospace;
        transition: color 0.15s;
        white-space: nowrap;
    }
    .footer-gh:hover {
        color: #666;
    }

    .chat-view {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
    }

    .messages {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        scrollbar-width: thin;
        scrollbar-color: #1a1a1a transparent;
    }
    .messages::-webkit-scrollbar {
        width: 3px;
    }
    .messages::-webkit-scrollbar-thumb {
        background: #1e1e1e;
        border-radius: 3px;
    }

    .messages-inner {
        padding: 16px;
        display: flex;
        flex-direction: column;
    }

    .quick-bar {
        display: flex;
        gap: 7px;
        padding: 8px 14px;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        flex-shrink: 0;
        border-top: 1px solid #0f0f0f;
        background: #000;
    }
    .quick-bar::-webkit-scrollbar {
        display: none;
    }

    .quick-chip {
        flex-shrink: 0;
        background: #0a0a0a;
        border: 1px solid #1e1e1e;
        border-radius: 20px;
        padding: 6px 12px;
        font-size: 12px;
        color: #666;
        cursor: pointer;
        transition: all 0.15s;
        white-space: nowrap;
        font-family: "IBM Plex Sans", sans-serif;
    }
    .quick-chip:hover,
    .quick-chip:active {
        border-color: #444;
        color: #ddd;
        background: #111;
    }

    .input-bar {
        padding: 10px 12px;
        padding-bottom: max(10px, env(safe-area-inset-bottom));
        border-top: 1px solid #141414;
        background: #000;
        flex-shrink: 0;
    }

    .input-wrap {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        background: #0a0a0a;
        border: 1px solid #1e1e1e;
        border-radius: 14px;
        padding: 7px 7px 7px 14px;
        transition: border-color 0.15s;
    }
    .input-wrap:focus-within {
        border-color: #333;
    }

    textarea {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #e8e8e8;
        font-family: "IBM Plex Sans", sans-serif;
        font-size: 16px;
        font-weight: 400;
        resize: none;
        line-height: 1.5;
        max-height: 100px;
        min-height: 22px;
        padding: 3px 0;
    }
    textarea::placeholder {
        color: #333;
    }
    textarea:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .send-btn {
        width: 34px;
        height: 34px;
        min-width: 34px;
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
        background: #e0e0e0;
        transform: scale(1.06);
    }
    .send-btn:disabled {
        background: #151515;
        color: #333;
        cursor: not-allowed;
        transform: none;
    }

    @media (min-width: 641px) {
        .app {
            border-left: 1px solid #111;
            border-right: 1px solid #111;
        }
    }

    .header-brand {
        overflow: hidden;
    }

    .brand-text {
        overflow: hidden;
        flex-wrap: nowrap;
    }

    @media (max-width: 420px) {
        .gh-label {
            display: none;
        }

        .gh-link {
            padding: 5px 8px;
        }

        .brand-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
</style>
