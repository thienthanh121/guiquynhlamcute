/* ==========================================================================
   config.js – TOÀN BỘ NỘI DUNG CÓ THỂ CHỈNH SỬA Ở ĐÂY
   Xưng hô: anh (người gửi) – em (Quỳnh Lam).
   ========================================================================== */
window.CONFIG = {

  /* Nhạc nền.
     - file: đường dẫn file piano (đặt vào assets/music/).
     - useFile: đổi thành true SAU KHI đã chép file nhạc vào đúng đường dẫn.
       Khi false (hoặc file lỗi), website dùng nhạc piano ambient tự tạo, không báo lỗi. */
  music: { file: "assets/music/troi-giau-troi-mang-di-piano.mp3", useFile: true, volume: 0.22 },

  /* Gửi câu trả lời về email của người gửi (qua dịch vụ FormSubmit, không cần server riêng).
     - enabled: false để tắt hoàn toàn (khi đó website không gửi gì ra ngoài).
     - notice: dòng thông báo nhỏ hiển thị cho người nhận ngay cạnh hai nút trả lời. */
  notify: {
    enabled: true,
    email: "daithanhpt15@gmail.com",
    subject: "Midnight Romance – Quỳnh Lam đã trả lời",
    notice: "Câu trả lời của em sẽ được gửi đến anh qua email."
  },

  /* Khoá website đến giờ mở. unlockAt theo giờ Việt Nam (+07:00).
     Muốn đổi giờ/ngày: sửa unlockAt, ví dụ "2026-11-20T21:00:00+07:00". enabled: false để tắt. */
  countdown: {
    enabled: true,
    unlockAt: "2026-11-15T21:00:00+07:00",
    timeZone: "Asia/Ho_Chi_Minh",
    title: "Chưa đến giờ đâu, em ơi.",
    message: "Có một món quà nhỏ anh muốn em mở đúng lúc 21:00 tối nay. Em quay lại khi đồng hồ đếm về 0 nhé."
  },

  begin: {
    title: "MIDNIGHT ROMANCE",
    subtitle: "A little something, just for you.",
    greeting: "Chào Quỳnh Lam, có một điều anh muốn em khám phá...",
    button: "MỞ BÍ MẬT ♡"
  },

  story: {
    p1: "Đôi khi, một người xuất hiện trong cuộc sống của chúng ta rất bình thường.",
    p2: "Nhưng chẳng hiểu từ lúc nào, sự xuất hiện ấy lại khiến một ngày bình thường trở nên đặc biệt hơn.",
    p3: "Anh cũng không biết từ khi nào, việc được nhìn thấy em lại trở thành một điều khiến anh mong chờ.",
    closing: "Và có lẽ, em chính là người như thế.",
    button: "Tiếp tục khám phá"
  },

  game: {
    title: "THE SECRET OF QUỲNH LAM",
    intro: "Trước khi mở món quà cuối cùng, anh có một thử thách nhỏ dành riêng cho em.",
    /* Không có đáp án đúng/sai – mỗi lựa chọn chỉ có một lời phản hồi nhẹ nhàng */
    questions: [
      {
        q: "Nếu một ngày có thể dành riêng một buổi tối cho bản thân, em sẽ chọn điều gì?",
        options: ["Ngắm bầu trời đêm.", "Nghe một bản nhạc yêu thích.", "Đi dạo dưới ánh đèn thành phố."],
        feedback: ["Một lựa chọn thật yên bình.", "Âm nhạc luôn biết cách làm đêm dịu lại.", "Thành phố về đêm có vẻ đẹp rất riêng."]
      },
      {
        q: "Em nghĩ điều gì khiến một khoảnh khắc trở nên đáng nhớ?",
        options: ["Một địa điểm thật đẹp.", "Một người khiến em cảm thấy vui.", "Một điều bất ngờ không được báo trước."],
        feedback: ["Có những nơi chỉ cần nhìn thôi đã muốn nhớ mãi.", "Anh cũng nghĩ vậy.", "Và đôi khi, bất ngờ lại là điều đẹp nhất."]
      },
      {
        q: "Nếu có một thông điệp bí mật dành riêng cho em, em có muốn mở nó không?",
        options: ["Tất nhiên rồi!", "Em tò mò lắm.", "Mở ngay thôi!"],
        feedback: ["Vậy thì anh rất vui.", "Anh cũng hơi hồi hộp đây.", "Được thôi, sắp đến rồi."]
      }
    ],
    done: "Em đã khám phá được tất cả những bí mật nhỏ.",
    button: "NHẬN MÓN QUÀ CUỐI CÙNG"
  },

  letter: {
    to: "TO: QUỲNH LAM",
    subtitle: "A letter I've been meaning to write.",
    hint: "Chạm vào phong bì để mở",
    /* Mỗi phần tử là một đoạn, hiện lần lượt. Nội dung do người gửi cung cấp. */
    paragraphs: [
      "Gửi em, Quỳnh Lam.",
      "Có một điều anh nghĩ em nên biết.",
      "Anh vẫn nhớ những ngày đầu tiên, khi em là người chủ động bước đến và muốn làm quen với anh. Có lẽ em không biết rằng sự chủ động ấy đã để lại trong anh nhiều ấn tượng hơn em nghĩ.",
      "Ban đầu, anh chỉ nghĩ rằng chúng ta đang bắt đầu một cuộc trò chuyện bình thường. Nhưng rồi, qua từng lần nói chuyện, anh nhận ra mình dần có những cảm xúc khác lạ.",
      "Anh bắt đầu mong chờ những tin nhắn, quan tâm đến những câu chuyện nhỏ của em và muốn biết thêm nhiều điều về cô gái đã chủ động bước vào cuộc sống của anh ngày ấy.",
      "Đôi khi anh nghĩ, thật may vì ngày đó em đã không ngần ngại bắt đầu trước.",
      "Bởi nếu không có sự chủ động ấy, có lẽ anh đã bỏ lỡ cơ hội được biết đến một người đặc biệt như em.",
      "Anh không muốn chỉ nói những lời hoa mỹ. Anh chỉ muốn em biết rằng tình cảm em dành cho anh không hề đơn độc.",
      "Vì anh cũng đang dần thích em, theo cách rất riêng của mình.",
      "Và lần này, anh muốn là người chủ động nói ra điều đó.",
      "ANH THÍCH EM, QUỲNH LAM.",
      "Mong rằng chúng ta sẽ có cơ hội cùng nhau tạo nên những kỷ niệm thật đẹp.",
      "Thân gửi em."
    ],
    /* Câu được in chữ viết tay (Dancing Script) */
    emphasis: [
      "Vì anh cũng đang dần thích em, theo cách rất riêng của mình.",
      "Và lần này, anh muốn là người chủ động nói ra điều đó."
    ],
    /* Câu nhấn lớn nhất */
    highlight: "ANH THÍCH EM, QUỲNH LAM.",
    signature: "From someone who is happy that you came into his life.",
    button: "ANH CÒN MỘT ĐIỀU MUỐN HỎI EM"
  },

  question: {
    lead: "Quỳnh Lam, anh có một câu hỏi cuối cùng...",
    main: "Vậy... em có muốn cho anh một vị trí đặc biệt trong trái tim em không?",
    yes: "EM ĐỒNG Ý ♡",
    later: "EM CẦN THÊM THỜI GIAN",
    yesTitle: "YOU JUST MADE MY DAY!",
    yesText: "Vậy thì anh mong rằng chúng ta sẽ có thêm thật nhiều khoảnh khắc đẹp cùng nhau, Quỳnh Lam nhé.",
    laterText: "Không sao cả, anh tôn trọng cảm xúc và quyết định của em.\n\nEm không cần phải vội vàng đưa ra câu trả lời.\n\nDù câu trả lời là gì, anh vẫn cảm ơn em vì đã dành thời gian khám phá món quà nhỏ này.",
    next: "Tiếp tục"
  },

  final: {
    line1: "Some feelings are too beautiful to keep hidden.",
    line2: "Và đây là cách anh chọn để nói với em.",
    tagline: "Có những điều anh không dễ dàng nói thành lời, nên anh đã tạo ra một nơi nhỏ bé để kể cho em nghe.",
    footer1: "Made with sincerity, just for Quỳnh Lam.",
    footer2: "November 2026.",
    replay: "XEM LẠI HÀNH TRÌNH"
  }
};
