import React from "react";
import './WarrantyPolicy.css'

export default function WarrantyPolicy() {

    return (
        <div className="fluid-container warranty-policy">
            <div className="container warranty-policy-container">
                <div className="warranty-policy-header">
                    <h1>Chính Sách Bảo Hành</h1>
                    <p>Cập nhật lần cuối: Tháng 6, 2024</p>
                </div>

                <div className="warranty-policy-section">
                    <h3>1. Giới Thiệu</h3>
                    <p>Chào mừng các nhân viên của Kim Hoàn Ngân. Chính sách bảo hành này nhằm cung cấp thông tin và thống nhất quy định thanh toán trong nội bộ của chúng ta. Đảm bảo mọi người hiểu rõ và tuân thủ các quy định dưới đây.</p>
                </div>

                <div className="warranty-policy-section">
                    <h3>2. Cam kết về chất lượng sản phẩm</h3>
                    <p>Tất cả các sản phẩm Kim Hoàn Ngân bán ra đều có:</p>
                    <ol>
                        <li>Hóa đơn bán hàng</li>
                        <li>Được khắc kí hiệu độc quyền thương hiệu Kim Hoàn Ngân Jewelry hoặc KHNJ</li>
                        <li>Thông số ký hiệu về chất lượng tuổi vàng</li>
                        <li>Phiếu bảo hành sản phẩm cho từng sản phẩm bán ra</li>
                    </ol>
                    <p>Chính sách thu đổi và bảo hành chỉ được áp dụng đối với các sản phẩm được Kim Hoàn Ngân bán ra. Mọi sai hỏng do lỗi kỹ thuật chế tác, Kim Hoàn Ngân có trách nhiệm bảo hành sản phẩm.</p>
                </div>

                <div className="warranty-policy-section">
                    <h3>3. Quy định bảo hành</h3>
                    <ol>
                        <li>Điều khoản bảo hành miễn phí:</li>
                        <ul>
                            <li>Vệ sinh, đánh bóng và làm mới trong quá trình sử dụng</li>
                            <li>Bảo hành kỹ thuật sản phẩm không cần thêm vàng</li>
                            <li>Nhẫn cưới được miễn phí khắc tên một lần</li>
                        </ul>

                        <li>Điều khoản bảo hành có tính phí:</li>
                        <ul>
                            <li>Bảo hành kỹ thuật phải thêm vàng, chi phí sẽ bao gồm phần vàng thêm được tính theo trọng lượng vàng, giá vàng niêm yết tại thời điểm giao dịch và tiền gia công</li>
                            <li>Kim cương đính trên trang sức bị rớt, trầy xước, mẻ, mòn, nứt; sẽ tính chi phí nguyên vật liệu khi bảo hành (nếu có thể thay thế và sửa chữa được)</li>
                            <li>Ngọc trai, Swarovski và đá màu đính trên trang sức bị rớt đá, trầy xước, mẻ, mòn, nứt; sẽ tính chi phí nguyên vật liệu khi bảo hành (nếu có thể thay thế và sửa chữa được)</li>
                        </ul>
                    </ol>
                </div>
                <div className="warranty-policy-section">
                    <h3>4. Thay Đổi Chính Sách Bảo Hành</h3>
                    <p>Chính sách này có thể được cập nhật thường xuyên. Chúng tôi sẽ thông báo về bất kỳ thay đổi nào thông qua email nội bộ hoặc thông báo trên hệ thống.</p>
                </div>

                <div className="warranty-policy-section">
                    <h3>5. Liên Hệ</h3>
                    <p>Nếu bạn có bất kỳ câu hỏi nào về Chính Sách Bảo Hành này, vui lòng liên hệ phòng kinh doanh tại: <a href="phongkinhdoanh@kimhoanngan.com">phongkinhdoanh@kimhoanngan.com</a></p>
                </div>
            </div>
        </div>
    );
}