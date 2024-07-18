import React from "react";
import './PaymentPolicy.css'

export default function ExchangePolicy() {

    return (
        <div className="fluid-container payment-policy">
            <div className="container payment-policy-container">
                <div className="payment-policy-header">
                    <h1>Chính Sách Thanh Toán</h1>
                    <p>Cập nhật lần cuối: Tháng 6, 2024</p>
                </div>

                <div className="payment-policy-section">
                    <h3>1. Giới Thiệu</h3>
                    <p>Chào mừng các nhân viên của Kim Hoàn Ngân. Chính sách thanh toán này nhằm cung cấp thông tin và thống nhất quy định thanh toán trong nội bộ của chúng ta. Đảm bảo mọi người hiểu rõ và tuân thủ các quy định dưới đây.</p>
                </div>

                <div className="payment-policy-section">
                    <h3>2. Phương thức thanh toán</h3>
                    <p>Chúng ta chấp nhận 3 phương thức thanh toán bao gồm:</p>
                    <ul>
                        <li>Thanh toán bằng tiền mặt</li>
                        <li>Thnah toán bằng chuyển khoản qua ngân hàng</li>
                        <li>Thanh toán bằng hình thức kết hợp tiền mặt và chuyển khoản</li>
                    </ul>
                    <p>*** Đối với từng phương thức thanh toán chúng ta có từng quy định cụ thể (Chi tiết xem bên dưới)</p>
                </div>

                <div className="payment-policy-section">
                    <h3>3. Quy định thanh toán bằng tiền mặt</h3>
                    <p>Nếu khách hàng có nhu cầu thanh toán bằng tiền mặt nhân viên phải: </p>
                    <ol>
                        <li>Nhận và sử dụng máy đếm tiền đảm bảo khách có thể giám sát quá trình</li>
                        <li>Xác nhận số tiền đã nhận với khách</li>
                        <li>Tiến hành xuất hóa đơn cho khách hàng</li>
                    </ol>
                </div>

                <div className="payment-policy-section">
                    <h3>4. Quy định thanh toán bằng chuyển khoản</h3>
                    <p>Nếu khách hàng có nhu cầu thanh toán bằng hình thức chuyển khoản nhân viên cần: </p>
                    <ol>
                        <li>Tiến hành cung cấp thông tin tài khoản cửa hàng hoặc mã QR</li>
                        <li>Xác nhận số tiền cần thanh toán với khách hàng</li>
                        <li>Sau khi khách hàng thực hiện chuyển khoản thành công, chụp lại màn hình giao dịch và upload lên hệ thống, đồng thời ghi mã giao dịch vào hệ thống</li>
                    </ol>
                </div>

                <div className="payment-policy-section">
                    <h3>5. Quy định thanh toán bằng hình thức kết hợp tiền mặt và thanh toán</h3>
                    <p>Nếu khách hàng có nhu cầu thanh toán bằng hình thức kết hợp nhân viên phải: </p>
                    <ol>
                        <li>Thực hiện quy trình thanh toán tiền mặt</li>
                        <li>Thực hiện quy trình thanh toán chuyển khoản</li>
                    </ol>
                </div>


                <div className="payment-policy-section">
                    <h3>6. Thay Đổi Chính Sách Thanh Toán</h3>
                    <p>Chính sách này có thể được cập nhật thường xuyên. Chúng tôi sẽ thông báo về bất kỳ thay đổi nào thông qua email nội bộ hoặc thông báo trên hệ thống.</p>
                </div>

                <div className="payment-policy-section">
                    <h3>7. Liên Hệ</h3>
                    <p>Nếu bạn có bất kỳ câu hỏi nào về Chính Sách Bảo Mật này, phòng tài chính tại: <a href="phongtaichinh@kimhoanngan.com">phongtaichinh@kimhoanngan.com</a></p>
                </div>
            </div>
        </div>
    );
}