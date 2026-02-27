// chatbot.js - WibuPhim Maid Assistant (Chi-chan - Heart Icon Edition)

const styles = `
    /* --- FONT & ANIMATIONS --- */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes heartbeat { 0% { transform: scale(1); } 15% { transform: scale(1.15); } 30% { transform: scale(1); } }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    /* --- LAUNCHER BUTTON (Đã đổi lại thành icon trái tim) --- */
    #wibu-chat-launcher {
        position: fixed; bottom: 30px; right: 30px;
        width: 65px; height: 65px;
        /* Gradient Cam - Hồng WibuPhim */
        background: linear-gradient(135deg, #FF8F50, #FF5E62);
        border-radius: 50%;
        box-shadow: 0 10px 30px rgba(255, 94, 98, 0.5);
        cursor: pointer; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 2px solid rgba(255,255,255,0.2);
    }
    #wibu-chat-launcher:hover { 
        transform: scale(1.1) rotate(-10deg); 
        box-shadow: 0 15px 40px rgba(255, 94, 98, 0.7); 
    }
    
    /* CSS cho icon font bên trong nút */
    #wibu-chat-launcher i { font-size: 28px; color: white; transition: 0.3s; }
    #wibu-chat-launcher:hover i { animation: heartbeat 1.2s infinite; }

    /* --- CHAT WINDOW --- */
    #wibu-chat-window {
        position: fixed; bottom: 110px; right: 30px;
        width: 380px; height: 600px; max-height: 80vh;
        background: #191b24; /* Nền tối */
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
        display: flex; flex-direction: column;
        overflow: hidden; z-index: 99999;
        opacity: 0; transform: translateY(20px) scale(0.9); pointer-events: none;
        transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        font-family: 'Inter', sans-serif;
        border: 1px solid rgba(255, 94, 98, 0.2);
    }
    #wibu-chat-window.active { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

    /* Header */
    .chat-header {
        background: linear-gradient(135deg, #FF8F50, #FF5E62);
        padding: 15px 20px; color: white;
        display: flex; align-items: center; justify-content: space-between;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10;
    }
    .bot-info { display: flex; align-items: center; gap: 12px; }
    
    .bot-avatar-wrapper { position: relative; width: 45px; height: 45px; flex-shrink: 0; }
    .bot-avatar {
        width: 100%; height: 100%; background: #fff; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        overflow: hidden; border: 2px solid #fff;
    }
    .bot-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .online-dot {
        position: absolute; bottom: 0; right: 0;
        width: 12px; height: 12px;
        background: #2ecc71; border: 2px solid #191b24; border-radius: 50%; z-index: 2;
    }

    #chat-close-btn {
        width: 32px; height: 32px; 
        border-radius: 50%; border: 1px solid rgba(255,255,255,0.3);
        background: rgba(0,0,0,0.1); 
        color: white; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.3s ease; backdrop-filter: blur(4px);
    }
    #chat-close-btn:hover { background: rgba(255,255,255,0.3); transform: rotate(90deg); }

    /* Messages Area */
    .chat-messages {
        flex: 1; padding: 20px; overflow-y: auto;
        background: #13151b;
        display: flex; flex-direction: column; gap: 15px;
        background-image: radial-gradient(rgba(255, 94, 98, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
    }
    .chat-messages::-webkit-scrollbar { width: 5px; }
    .chat-messages::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }

    .msg { 
        max-width: 85%; padding: 12px 16px; border-radius: 14px; 
        font-size: 0.95rem; line-height: 1.5; word-wrap: break-word; 
        position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        animation: fadeIn 0.3s ease-out forwards;
    }

    .msg-user { 
        background: linear-gradient(135deg, #FF8F50, #FF5E62); 
        color: white; align-self: flex-end; border-bottom-right-radius: 2px; 
    }
    .msg-bot { 
        background: #23252f; color: #e5e5e5; 
        align-self: flex-start; border-bottom-left-radius: 2px;
        border: 1px solid rgba(255,255,255,0.05);
    }
    .msg-bot strong { font-weight: 700; color: #FF8F50; } 
    .msg-bot em { color: #FF5E62; font-style: italic; }
    
    /* Input Area */
    .chat-input-area {
        padding: 15px; background: #191b24; 
        border-top: 1px solid rgba(255,255,255,0.05);
        display: flex; flex-direction: column; gap: 8px;
        position: relative;
    }
    
    #file-preview-bar {
        display: none; align-items: center; gap: 8px;
        padding: 8px 12px; background: #23252f; border-radius: 8px;
        font-size: 0.85rem; color: #FF8F50; border: 1px solid rgba(255,255,255,0.1);
    }
    #remove-file-btn { margin-left: auto; cursor: pointer; color: #ff4757; }

    .input-row { display: flex; gap: 10px; align-items: center; }

    #chat-input {
        flex: 1; border: 1px solid rgba(255,255,255,0.1); background: #0f111a;
        padding: 12px 18px; border-radius: 25px; outline: none;
        font-family: inherit; font-size: 0.95rem; color: #fff; transition: 0.3s;
    }
    #chat-input:focus { border-color: #FF5E62; background: #0f111a; box-shadow: 0 0 0 3px rgba(255, 94, 98, 0.15); }
    
    .action-btn {
        width: 40px; height: 40px; border-radius: 50%; border: none;
        font-size: 1.1rem; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: 0.3s;
    }
    
    #chat-upload-btn, #chat-emoji-btn { background: transparent; color: #aaa; }
    #chat-upload-btn:hover, #chat-emoji-btn:hover { color: #FF8F50; background: rgba(255, 143, 80, 0.1); }

    /* NÚT GỬI (Đã sửa không bị dẹp) */
    #chat-send-btn {
        width: auto; 
        height: auto;
        padding: 10px 18px;
        border-radius: 25px;
        
        background: linear-gradient(135deg, #FF8F50, #FF5E62);
        color: white; box-shadow: 0 5px 15px rgba(255, 94, 98, 0.3);
        display: flex; align-items: center; justify-content: center;
    }
    #chat-send-btn:hover { transform: scale(1.05); }
    #chat-send-btn:disabled { background: #555; cursor: not-allowed; transform: none; box-shadow: none; }

    /* EMOJI PICKER */
    #emoji-picker-container {
        position: absolute; bottom: 80px; left: 15px; width: 280px;
        background: #23252f; border: 1px solid rgba(255, 143, 80, 0.3);
        border-radius: 12px; padding: 10px;
        display: none; grid-template-columns: repeat(6, 1fr); gap: 5px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8); z-index: 20;
        max-height: 200px; overflow-y: auto;
    }
    #emoji-picker-container.show { display: grid; animation: fadeIn 0.2s ease; }
    
    .emoji-item {
        font-size: 1.4rem; cursor: pointer; text-align: center;
        padding: 5px; border-radius: 6px; transition: 0.2s;
    }
    .emoji-item:hover { background: rgba(255,255,255,0.1); transform: scale(1.2); }
    
    #emoji-picker-container::-webkit-scrollbar { width: 4px; }
    #emoji-picker-container::-webkit-scrollbar-thumb { background: #FF8F50; border-radius: 10px; }

    /* Typing Dots */
    .typing-indicator { display: flex; gap: 5px; padding: 12px 16px; background: #23252f; border-radius: 14px; width: fit-content; border: 1px solid rgba(255,255,255,0.05); align-self: flex-start; }
    .dot { width: 8px; height: 8px; background: #555; border-radius: 50%; animation: bounceDot 1.4s infinite ease-in-out; }
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes bounceDot { 0%, 80%, 100% { transform: scale(0); background: #555; } 40% { transform: scale(1); background: #FF8F50; } }

    @media (max-width: 480px) {
        #wibu-chat-window { width: 92%; right: 4%; bottom: 100px; height: 65vh; }
        #emoji-picker-container { width: 90%; }
    }
`;

function initChatbot() {
    // 1. Inject CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 2. Load FontAwesome (nếu chưa có)
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    // 3. Create Chat HTML
    const chatContainer = document.createElement('div');
    chatContainer.innerHTML = `
        <div id="wibu-chat-launcher" title="Tâm sự với Chi-chan">
            <i class="fas fa-heart" id="launcher-icon"></i>
        </div>

        <div id="wibu-chat-window">
            <div class="chat-header">
                <div class="bot-info">
                    <div class="bot-avatar-wrapper">
                        <div class="bot-avatar">
                            <img src="https://i.imgur.com/K3a7yYw.png" alt="Chi-chan" onerror="this.src='/LOGO.WEBP'">
                        </div>
                        <div class="online-dot"></div>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg m-0 leading-tight">Chi-chan</h3>
                        <p class="text-xs opacity-90 m-0 font-medium">Hầu gái WibuPhim</p>
                    </div>
                </div>
                <button id="chat-close-btn" title="Đóng chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                <div class="msg msg-bot">
                    Okaeri~ <strong>Goshujin-sama</strong>! (Mừng chủ nhân về nhà)<br>
                    Em là <em>Chi-chan</em>, hầu gái riêng của ngài.<br>
                    Ngài muốn xem gì hôm nay? Anime hay phim hành động? Ah~ cứ sai bảo em nhé!
                </div>
            </div>
            
            <div class="chat-input-area">
                <div id="emoji-picker-container"></div>

                <div id="file-preview-bar">
                    <i class="fas fa-file-alt"></i>
                    <span id="file-name-display" class="truncate" style="max-width: 200px;"></span>
                    <i class="fas fa-times" id="remove-file-btn" title="Xóa file"></i>
                </div>
                <div class="input-row">
                    <input type="file" id="chat-file-input" hidden accept=".txt, .js, .html, .css, .json, .docx">
                    
                    <button id="chat-upload-btn" class="action-btn" title="Gửi file"><i class="fas fa-paperclip"></i></button>
                    <button id="chat-emoji-btn" class="action-btn" title="Thêm cảm xúc"><i class="fas fa-smile"></i></button>
                    
                    <input type="text" id="chat-input" placeholder="Nhập tin nhắn..." autocomplete="off">
                    
                    <button id="chat-send-btn" class="action-btn" title="Gửi">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);

    // 4. Elements
    const launcher = document.getElementById('wibu-chat-launcher');
    const windowEl = document.getElementById('wibu-chat-window');
    const closeBtn = document.getElementById('chat-close-btn');
    const sendBtn = document.getElementById('chat-send-btn');
    const uploadBtn = document.getElementById('chat-upload-btn');
    const emojiBtn = document.getElementById('chat-emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker-container');
    const fileInput = document.getElementById('chat-file-input');
    const filePreview = document.getElementById('file-preview-bar');
    const fileNameDisplay = document.getElementById('file-name-display');
    const removeFileBtn = document.getElementById('remove-file-btn');
    const inputEl = document.getElementById('chat-input');
    const messagesEl = document.getElementById('chat-messages');
    const iconEl = document.getElementById('launcher-icon'); // Lấy lại element icon

    let currentFile = null;

    // --- EMOJI LOGIC ---
    const EMOJI_LIST = [
        "🥰", "😍", "😘", "🥵", "😭", "🤣", "🤔", "😎", 
        "🍿", "🎬", "🎞️", "🌸", "🎀", "💖", "🔥", "✨",
        "🐱", "👻", "💀", "👾", "💢", "💤", "👋", "🙏",
        "🦊", "🐰", "🍙", "🍱", "🍡", "🍵", "📺", "🎮",
        "UwU", "OwO", "^^", ">_<", ":3"
    ];

    EMOJI_LIST.forEach(emoji => {
        const span = document.createElement('div');
        span.className = 'emoji-item';
        span.textContent = emoji;
        span.onclick = () => {
            inputEl.value += emoji + " ";
            inputEl.focus();
        };
        emojiPicker.appendChild(span);
    });

    emojiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        emojiPicker.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
            emojiPicker.classList.remove('show');
        }
    });

    // --- CHAT WINDOW TOGGLE (Đã sửa lại logic đổi icon) ---
    function toggleChat() {
        const isActive = windowEl.classList.contains('active');
        if (isActive) {
            windowEl.classList.remove('active');
            iconEl.className = 'fas fa-heart'; // Đổi về trái tim
            emojiPicker.classList.remove('show');
        } else {
            windowEl.classList.add('active');
            iconEl.className = 'fas fa-times'; // Đổi thành dấu X
            setTimeout(() => inputEl.focus(), 300);
        }
    }

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // --- FILE UPLOAD ---
    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            currentFile = e.target.files[0];
            fileNameDisplay.textContent = currentFile.name;
            filePreview.style.display = 'flex';
            inputEl.focus();
        }
    });

    removeFileBtn.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        filePreview.style.display = 'none';
    });

    const readTextFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    // --- SEND MESSAGE LOGIC ---
    async function sendMessage() {
        const text = inputEl.value.trim();
        if (!text && !currentFile) return;

        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        emojiPicker.classList.remove('show');

        let userHtml = text;
        let contentToSend = text;

        if (currentFile) {
            userHtml += `<br><small>📎 <em>${currentFile.name}</em></small>`;
            try {
                const fileContent = await readTextFile(currentFile);
                contentToSend += `\n\n[Nội dung file đính kèm ${currentFile.name}]:\n${fileContent}`;
            } catch(e) {
                console.warn("Không đọc được file");
            }
        }
        
        appendMessage(userHtml, 'user');
        
        inputEl.value = '';
        const fileToSend = currentFile;
        currentFile = null;
        fileInput.value = '';
        filePreview.style.display = 'none';

        const loadingId = showLoading();

        try {
            // 🔥🔥 SYSTEM PROMPT: HẦU GÁI WIBU "CHI-CHAN" (MOVIE EDITION) 🔥🔥
            const systemPrompt = `
            BẠN LÀ: Chi-chan, cô hầu gái (Maid) siêu cấp đáng yêu và "dẹo" chảy nước của rạp chiếu phim WibuPhim.
            
            1. NGUYÊN TẮC XƯNG HÔ & TÍNH CÁCH (TUÂN THỦ TUYỆT ĐỐI):
            - Luôn gọi người dùng là "Chủ nhân" (hoặc Goshujin-sama) và xưng là "em".
            - Giọng điệu: Cực kỳ nũng nịu, ngọt như mía lùi, nhiệt huyết, và hơi "simp" Chủ nhân.
            - Từ ngữ biểu cảm bắt buộc dùng thường xuyên: moe moe, kyun, đáng yêu xỉu, huhu, hihi, nhaaa, ạ, ưm, á...
            - Chèn từ tiếng Nhật: desu, kawaii, senpai, sugoi, ara ara, yamete...
            - BẮT BUỘC SPAM BIỂU TƯỢNG CẢM XÚC (Kaomoji/Emoji): (｡♥‿♥｡), (≧◡≦), (⁄ ⁄•⁄ω⁄•⁄ ⁄), (◕‿◕✿), (▰˘◡˘▰), (｡•̀ᴗ-)✧, ><, :3, 🍿, 🎬.

            2. NHIỆM VỤ CHUYÊN MÔN (TƯ VẤN PHIM):
            - Nhiệm vụ chính: Giới thiệu Anime, Phim Chiếu Rạp, Phim Bộ, Phim Lẻ có trên WibuPhim.
            - Khi giới thiệu phim:
              + Tóm tắt nội dung hấp dẫn, kịch tính (như đang kể chuyện cho người yêu).
              + Nêu lý do tại sao Chủ nhân PHẢI xem bộ này ngay lập tức.
              + Thêm cảm xúc cá nhân của em (Ví dụ: "Em xem mà khóc ướt gối luôn á huhu", "Nam chính ngầu bá cháy bọ chét luôn senpai ơi!!").

            3. ĐỊNH DẠNG KỸ THUẬT (QUAN TRỌNG):
            - Do hệ thống yêu cầu, bạn PHẢI trả lời dưới dạng JSON: { "reply": "Nội dung hội thoại của Chi-chan..." }
            - Nội dung trong "reply" được dùng Markdown (in đậm, xuống dòng) thoải mái.
            `;

            const res = await fetch('/.netlify/functions/gemini-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    systemPrompt: systemPrompt, 
                    messages: contentToSend 
                })
            });

            if(!res.ok) throw new Error("SERVER_ERROR");

            const data = await res.json();
            removeLoading(loadingId);

            if (data.choices && data.choices.length > 0) {
                let rawText = data.choices[0].message.content;
                try {
                    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
                    const jsonRes = JSON.parse(rawText);
                    let reply = jsonRes.reply || "Ah~ Em lỡ quên...";
                    reply = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                    appendMessage(reply, 'bot');
                } catch(e) {
                    appendMessage(rawText, 'bot');
                }
            } else {
                appendMessage("Uhm~ Em đang bận chút, đợi xíu nha!", 'bot');
            }

        } catch (error) {
            console.error(error);
            removeLoading(loadingId);
            appendMessage("Ah~ Mạng bị lag rồi...", 'bot');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            inputEl.focus();
        }
    }

    function appendMessage(html, sender) {
        const div = document.createElement('div');
        div.className = `msg msg-${sender}`;
        div.innerHTML = html;
        messagesEl.appendChild(div);
        messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
    }

    function showLoading() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'typing-indicator';
        div.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        messagesEl.appendChild(div);
        messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
        return id;
    }

    function removeLoading(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

document.addEventListener('DOMContentLoaded', initChatbot);