(function () {
    // 1. Tạo CSS Styles
    const style = document.createElement("style");
    style.textContent = `
        .back-to-top-btn {
            position: fixed;
            bottom: 35px;
            right: 110px;
            width: 56px; 
            height: 56px;
            background: #ffffff;
            border-radius: 14px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 9000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            border: 1px solid rgba(0,0,0,0.05);
        }

        .back-to-top-btn.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        /* Tùy chỉnh dấu mũi tên SVG */
        .back-to-top-btn svg {
            width: 18px;
            height: 18px;
            margin-bottom: 2px;
            transition: 0.3s;
            fill: none;
            stroke: #000; /* Màu đen mặc định */
            stroke-width: 2.5; /* Độ mảnh của mũi tên */
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        /* Chữ ĐẦU TRANG: To, mảnh (Thin) */
        .back-to-top-btn span {
            color: #000;
            font-size: 10px;
            font-weight: 500;
            line-height: 1.2;
            text-align: center;
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.5px;
            transition: 0.3s;
        }

        .back-to-top-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(255, 94, 98, 0.4);
            border-color: #FF5E62;
        }

        /* Khi hover đổi màu cả icon SVG và chữ */
        .back-to-top-btn:hover svg {
            stroke: #FF5E62;
        }
        .back-to-top-btn:hover span {
            color: #FF5E62;
        }
    `;
    document.head.appendChild(style);

    // 2. Tạo HTML với mã SVG thay vì icon font
    const btn = document.createElement("div");
    btn.className = "back-to-top-btn";
    btn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
        <span>ĐẦU<br>TRANG</span>
    `;
    document.body.appendChild(btn);

    // 3. Logic ẩn/hiện
    window.addEventListener("scroll", () => {
        btn.classList.toggle("show", window.scrollY > 300);
    });

    // 4. Click cuộn mượt
    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();