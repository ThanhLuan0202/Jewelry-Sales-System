import React from "react";
import './PrivacyPolicy.css'

export default function PrivacyPolicy() {
    return (
        <div className="privacy-policy fluid-container">
            <div className="container policy-container">
                <div className="policy-header">
                    <h1>Chính Sách Bảo Mật</h1>
                    <p>Cập nhật lần cuối: Tháng 6, 2024</p>
                </div>

                <div className="policy-section">
                    <h3>1. Giới Thiệu</h3>
                    <p>Chào mừng các nhân viên của Kim Hoàn Ngân. Chính sách bảo mật này nhằm bảo vệ thông tin cá nhân và dữ liệu nội bộ của chúng ta. Đảm bảo mọi người hiểu rõ và tuân thủ các quy định dưới đây.</p>
                </div>

                <div className="policy-section">
                    <h3>2. Thông Tin Thu Thập</h3>
                    <p>Chúng tôi thu thập thông tin để cung cấp dịch vụ tốt hơn cho nhân viên của chúng ta. Điều này bao gồm:</p>
                    <ul>
                        <li>Thông tin cá nhân (Tên, địa chỉ email, số điện thoại)</li>
                        <li>Thông tin liên quan đến công việc (Mã nhân viên, chức vụ, phòng ban)</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h3>3. Cách Chúng Tôi Sử Dụng Thông Tin</h3>
                    <p>Thông tin thu thập được sử dụng để:</p>
                    <ul>
                        <li>Quản lý nhân sự và phân công công việc</li>
                        <li>Cải thiện hiệu quả làm việc và hỗ trợ nội bộ</li>
                        <li>Gửi thông báo liên quan đến công việc và các hoạt động của công ty</li>
                    </ul>
                </div>

                <div className="policy-section">
                    <h3>4. Bảo Vệ Dữ Liệu</h3>
                    <p>Chúng tôi áp dụng nhiều biện pháp bảo mật để bảo vệ thông tin cá nhân và dữ liệu nội bộ. Chỉ những người có quyền hạn mới được truy cập thông tin này.</p>
                </div>

                <div className="policy-section">
                    <h3>5. Quyền Của Bạn</h3>
                    <p>Nhân viên có quyền truy cập và yêu cầu sửa đổi thông tin cá nhân của mình. Vui lòng liên hệ với phòng nhân sự để thực hiện các thay đổi cần thiết.</p>
                </div>

                <div className="policy-section">
                    <h3>6. Thay Đổi Chính Sách Bảo Mật</h3>
                    <p>Chính sách này có thể được cập nhật thường xuyên. Chúng tôi sẽ thông báo về bất kỳ thay đổi nào thông qua email nội bộ hoặc thông báo trên hệ thống.</p>
                </div>

                <div className="policy-section">
                    <h3>7. Liên Hệ</h3>
                    <p>Nếu bạn có bất kỳ câu hỏi nào về Chính Sách Bảo Mật này, vui lòng liên hệ với phòng IT hoặc phòng nhân sự tại: <a href="mailto:it@kimhoanngan.com">it@kimhoanngan.com</a></p>
                </div>
            </div>
        </div>
    );
}