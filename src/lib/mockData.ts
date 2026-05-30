import type { PostWithAuthor, CommentWithAuthor } from "./types";

export function getMockPosts(): PostWithAuthor[] {
  return [
    {
      id: "mock-post-1",
      author_id: "mock-author-1",
      title: "Chi tiết bản cập nhật LoL 14.11: Làm lại chỉ số AD và đợt giảm sức mạnh Sát Thủ",
      slug: "chi-tiet-ban-cap-nhat-lol-14-11-lam-lai-chi-so-ad-va-giam-suc-manh-sat-thu",
      excerpt: "Bản cập nhật 14.11 nhắm thẳng vào sự thống trị của các Sát Thủ đường giữa và điều chỉnh lại trang bị Xạ Thủ. Hãy cùng GamingBlog phân tích những thay đổi cốt lõi này.",
      content: `Bản cập nhật **League of Legends 14.11** chính thức cập bến với hàng loạt thay đổi mang tính bước ngoặt đối với meta hiện tại. Riot Games đang nỗ lực đưa các Xạ Thủ truyền thống trở lại đúng vị thế và kiềm chế sức mạnh quá lớn của các Sát Thủ Sát Lực.

### 1. Thay đổi tướng tiêu biểu

*   **Caitlyn (Điều chỉnh)**: Tỷ lệ SMCK của nội tại *Thiện Xạ* tăng từ 50-90% lên 60-100%. Tuy nhiên, sát thương của chiêu Q bị giảm nhẹ ở các cấp độ đầu.
*   **Talon (Giảm sức mạnh)**: Sát thương cơ bản của chiêu W - *Ám Khí* giảm ở các cấp độ sau, khiến khả năng dọn lính đường giữa bị chậm lại.
*   **Hecarim (Tăng sức mạnh)**: Tăng lượng giáp cộng thêm từ chiêu W và giảm nhẹ thời gian hồi chiêu E - *Vó Ngựa Hủy Diệt*.

### 2. Thay đổi Trang bị Xạ Thủ

Riot quyết định giảm giá vàng của **Vô Cực Kiếm** từ 3400 xuống 3300 để giúp các Xạ Thủ đạt ngưỡng sức mạnh sớm hơn trong bối cảnh nhịp độ trận đấu đang diễn ra rất nhanh.

\`\`\`json
{
  "item": "Infinity Edge",
  "cost": 3300,
  "attack_damage": 80,
  "critical_strike_chance": 25
}
\`\`\`

Bạn đánh giá thế nào về meta 14.11? Hãy để lại bình luận phía dưới nhé!`,
      cover_image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60", // League of Legends vibe / gaming
      published: true,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      profiles: {
        id: "mock-author-1",
        username: "faker_fan",
        full_name: "Lê Minh Hoàng",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    },
    {
      id: "mock-post-2",
      author_id: "mock-author-2",
      title: "Valorant: Đội hình Agent tối ưu nhất bản đồ Bind tại giải đấu VCT",
      slug: "valorant-doi-hinh-agent-toi-uu-nhat-ban-do-bind-tai-giai-dau-vct",
      excerpt: "Bind luôn là bản đồ có lối chơi độc đáo nhờ các cổng dịch chuyển. Khám phá cách các đội tuyển chuyên nghiệp thiết lập đội hình Agent kiểm soát tối đa khu vực cổng dịch chuyển.",
      content: `Tại các giải đấu chuyên nghiệp **VCT (Valorant Champions Tour)** gần đây, bản đồ **Bind** đang chứng kiến sự thống trị của lối chơi kiểm soát tầm nhìn và ép giao tranh nhanh. Dưới đây là phân tích đội hình Agent đạt tỷ lệ thắng cao nhất hiện tại:

### Đội hình Meta tiêu chuẩn:
1.  **Viper (Controller)**: Không thể thiếu nhờ bức tường độc *Toxic Screen* chia đôi khu vực A và kiểm soát tuyệt đối khu vực B-Long.
2.  **Brimstone (Controller)**: Sự kết hợp 2 Controller rất phổ biến trên Bind. 3 quả bom khói thời gian lâu của Brimstone giúp đồng đội dễ dàng thực hiện các tình huống đặt bom nhanh.
3.  **Raze (Duellist)**: Nữ hoàng bay lượn tận dụng tối đa không gian hẹp của Bind với *Paint Shells* và *Showstopper*.
4.  **Skye (Initiator)**: Cung cấp thông tin quan trọng qua chim dò đường và hồi máu cho đồng đội sau những pha đấu súng ở khu vực nhà tắm (Showers).
5.  **Cypher (Sentinel)**: Đặt bẫy *Trapwire* thủ cứng khu vực B-Site để Viper có thể tự do đi roam hỗ trợ khu vực A.

### Chiến thuật kiểm soát cổng Teleport:
Tận dụng cổng Teleport từ A-Short sang B-Short để thực hiện các pha xoay chuyển đội hình (rotate) gây bất ngờ cho đối thủ. Skye luôn là người ném flash đi đầu để kiểm tra cổng dịch chuyển trước khi cả đội tiến vào.`,
      cover_image_url: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&auto=format&fit=crop&q=60", // Esports gaming arena vibe
      published: true,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      profiles: {
        id: "mock-author-2",
        username: "tenz_viewer",
        full_name: "Trần Anh Tuấn",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    },
    {
      id: "mock-post-3",
      author_id: "mock-author-1",
      title: "Đấu Trường Chân Lý Mùa Mới: Top 3 giáo án leo rank cực dễ đạt Top 1",
      slug: "dau-truong-chan-ly-mua-moi-top-3-giao-an-leo-rank-cuc-de-dat-top-1",
      excerpt: "Đấu Trường Chân Lý (TFT) vừa cập bến mùa giải mới với cơ chế cơ bản thay đổi hoàn toàn. Bỏ túi ngay 3 đội hình mạnh mẽ giúp bạn càn quét phòng chờ.",
      content: `Mùa giải mới của **Đấu Trường Chân Lý (TFT)** mang đến những cơ chế đột phá đầy thú vị. Để giúp các kỳ thủ không bị bỡ ngỡ và dễ dàng tích lũy điểm nhóm giải, GamingBlog đã tổng hợp 3 đội hình (giáo án) mạnh mẽ nhất hiện nay.

### 1. Đội hình Định Mệnh U Linh (Fated Umbral)
Đội hình xoay quanh việc kết nối sợi dây Định Mệnh của **Yasuo** và **Kindred** ở giai đoạn đầu game để lấy chỉ số hút máu toàn phần, sau đó carry bằng **Yone** 3 sao ở cấp 7.
*   **Trang bị ưu tiên cho Yone**: *Quyền Năng Khổng Lồ*, *Huyết Kiếm*, *Vô Cực Kiếm*.
*   **Khung đội hình**: 5 U Linh, 3 Định Mệnh, 2 Tử Sĩ.

### 2. Đội hình Pháp Sư Thuật Sĩ (Arcanist)
Dành cho những người chơi có nhiều trang bị sức mạnh phép thuật (gậy quá khổ, nước mắt). Lối chơi xoay quanh việc thủ máu bằng **Illaoi** và dồn đồ carry cho **Syndra**.
*   **Trang bị Syndra**: *Bùa Xanh*, *Mũ Phù Thủy Rabadon*, *Găng Bảo Thạch*.

### 3. Đội hình Sứ Thanh Hoa Khổng Lồ (Porcelain Warden)
Sự kết hợp giữa dàn chống chịu vững chắc của Khổng Lồ (**Amumu**, **Ornn**) và lượng sát thương khổng lồ theo thời gian của **Ashe** Sứ Thanh Hoa.
*   **Trang bị Ashe**: *Cuồng Đao Guinsoo*, *Cung Xanh*, *Diệt Khổng Lồ*.

Hãy thử áp dụng ngay vào trận đấu tiếp theo và chia sẻ kết quả với chúng tôi nhé!`,
      cover_image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60", // Tabletop/Board/Strategy game vibe
      published: true,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      profiles: {
        id: "mock-author-1",
        username: "faker_fan",
        full_name: "Lê Minh Hoàng",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
  ];
}

export function getMockComments(): CommentWithAuthor[] {
  return [
    {
      id: "mock-comment-1",
      post_id: "mock-post-1",
      author_id: "mock-author-2",
      content: "Yone mùa này mạnh quá, đi đâu cũng thấy Yone 3 sao gánh team.",
      created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      profiles: {
        id: "mock-author-2",
        username: "tenz_viewer",
        full_name: "Trần Anh Tuấn",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    },
    {
      id: "mock-comment-2",
      post_id: "mock-post-2",
      author_id: "mock-author-1",
      content: "Đội hình Bind này Cypher đặt trap thủ hay cực kỳ, đối thủ đẩy B là khóc thét luôn.",
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      profiles: {
        id: "mock-author-1",
        username: "faker_fan",
        full_name: "Lê Minh Hoàng",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
  ];
}
