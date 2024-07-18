import React from "react";
import './LegalPolicy.css'

export default function LegalPolicy() {

    return (
        <div className="fluid-container legal-policy">
            <div className="container legal-commitment-container">
                <div className="legal-commitment-header">
                    <h1>Chính Sách Cam Kết Về Vấn Đề Pháp Lý</h1>
                    <p>Cập nhật lần cuối: Tháng 6, 2024</p>
                </div>

                <div className="legal-commitment-section">
                    <h3>1. Tuân Thủ Pháp Luật</h3>
                    <p>Kim Hoàn Ngân cam kết tuân thủ mọi quy định pháp luật liên quan đến hoạt động kinh doanh và quản lý của công ty.</p>
                </div>

                <div className="legal-commitment-section">
                    <h3>2. Bảo Vệ Thông Tin Khách Hàng</h3>
                    <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng và tuân thủ các quy định về bảo vệ dữ liệu cá nhân theo pháp luật.</p>
                </div>

                <div className="legal-commitment-section">
                    <h3>3. Đảm Bảo Chất Lượng Sản Phẩm</h3>
                    <p>Kim Hoàn Ngân cam kết cung cấp các sản phẩm chất lượng, đảm bảo an toàn và tuân thủ các quy định về chất lượng sản phẩm.</p>
                </div>

                <div className="legal-commitment-section">
                    <h3>4. Trách Nhiệm Với Khách Hàng</h3>
                    <p>Chúng tôi cam kết phục vụ khách hàng một cách công bằng, trung thực và nhiệt tình, đảm bảo quyền lợi và sự hài lòng của khách hàng.</p>
                </div>

                <div className="legal-commitment-section">
                    <h3>5. Liên Hệ</h3>
                    <p>Nếu bạn có bất kỳ thắc mắc hoặc góp ý nào về Chính Sách Cam Kết Pháp Lý này, vui lòng liên hệ với chúng tôi qua địa chỉ email: <a href="mailto:legal@kimhoanngan.com">legal@kimhoanngan.com</a></p>
                </div>
            </div>
        </div>
    );
}