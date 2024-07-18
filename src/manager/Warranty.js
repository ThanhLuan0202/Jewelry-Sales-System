import React, { useState, useEffect } from "react";
import "./Warranty.css";
import config from "../config/config";
import numeral from 'numeral';
// import formatDateTime from "./formatDatetime"
import axios from "axios";

function Warranty() {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0)
  const [postCountOut, setPostCountOut] = useState(0)

  const [ends, setEnds] = useState([]);
  const [warrantyId, setWarrantyId] = useState("");

  //-------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const token = localStorage.getItem('token');

  const [showDetail, setShowDetail] = useState(false);

  const [detail, setDetail] = useState({})
  const [productDetail, setProductDetail] = useState([])
  const [idOrderDetail, setIdOrderDetail] = useState("")
  //---------------------------

  const closeModalDetail = () => {
    setShowDetail(false)
  }
  // useEffect(() => {
  //   fetch(`${config.API_ROOT}/api/Orders/GetOrderDetails/${idOrderDetail}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((posts) => {
  //       setProductDetail(posts);
  //     });
  // }, []);

  // Hàm xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  //--------------------------------------------
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) {
      return 'Invalid date';
    }

    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }

      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };

      return new Intl.DateTimeFormat('en-GB', options).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Warranty/GetOutOfDateWarranty`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {

        setPostCountOut(posts.length);

      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Warranty`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPosts(posts);
        setPostCount(posts.length);

      });
  }, []);


  //----------------------------------------------------------------
  useEffect(() => {
    handleSearchCustomer()
  }, [warrantyId])

  const handleSearchCustomer = async () => {
    var url;
    try {
      url = `${config.API_ROOT}/api/Warranty`;
      if (warrantyId !== "") {

        url = `${config.API_ROOT}/api/Warranty/searchWarrantyByCode?code=${warrantyId}`
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data)
    } catch (error) {
      console.error('There was an error fetching the customer list!', error);
    }


  }
  //------------------------------------------------------------------
  const showDetailForm = (x, id) => {
    setShowDetail(true);
    setDetail(x);
    setIdOrderDetail(id);
    console.log(x);
  };
  //------------------------------------------------------------------
  return (
    <div className="col-10">
      <div className="warranty">
        <div className="title ">
          <p>Phiếu Bảo Hành</p>
        </div>
        <div className="tagResult">
          <div className="tagResultOut">
            <div className="tagChild">
              <i class="far fa-clock wrt1 fw-bold"></i>
            </div>
            <h3>Phiếu bảo hành còn hạn</h3>
            <p>{postCount} Phiếu</p>

          </div>

          <div className="tagResulHave">
            <div className="tagChild">
              <i className="fas fa-times-circle wrt2"></i>
            </div>
            <h3>Phiếu bảo hành hết hạn</h3>
            <p>{postCountOut} Phiếu</p>
          </div>

        </div>

        <div className="warrantyDetail">
          <p>Danh sách phiếu bảo hành</p>
          <div className="search">
            <input type="text"
              name="warrantyId"
              value={warrantyId}
              onChange={(e) => setWarrantyId(e.target.value)}
              placeholder="Tìm Kiếm"
            />

          </div>

          <table className="tableWarranty">
            <thead>
              <tr>
                {/* <th>STT</th> */}
                <th>Mã Phiếu Bảo Hành</th>
                <th>Mã Đơn Hàng</th>
                <th>Tên Khách Hàng</th>
                {/* <th>Số Điện Thoại</th>
                <th>Email Khách Hàng</th>
                <th>Mã Sản Phẩm</th>
                <th>Tên Sản Phẩm</th>
                <th>Loại Vàng</th>
                <th>Trọng Lượng Vàng</th>
                <th>Tiền Công</th> */}
                <th>Sản Phẩm</th>
                <th>Ngày Mua</th>
                <th>Ngày Hết Hạn</th>
                <th>Thao Tác</th>

              </tr>
            </thead>
            <tbody>
              {currentItems?.map((post, index) => (

                <tr key={index}>
                  {/* <td>{indexOfFirstItem + index + 1}</td> */}
                  <td>{post?.warrantyCode}</td>
                  <td>{post?.orderDetails?.orders.orderCode}</td>
                  <td>{post?.customers?.customerName}</td>
                  {/* <td>{post?.customers?.phoneNumber}</td>
                  <td>{post?.customers?.email}</td>
                  <td>{post?.orderDetails?.productId}</td>
                  <td>{post?.orderDetails?.products.productName}</td>
                  <td>{post?.orderDetails?.products.goldTypes.goldName}</td>
                  <td>{numeral(post?.orderDetails?.products.wage).format("0,0")} VND</td>
                  <td>{numeral(post?.orderDetails?.products?.wage).format("0,0")} VND</td> */}
                  <td>{post?.orderDetails?.products.productName}</td>
                  <td>{formatDateTime(post?.startDate)}</td>
                  <td>{formatDateTime(post?.endDate)}</td>
                  <td><button class="btn btn-info fas fa-eye eyeDetail" onClick={() => showDetailForm(post)}>
                    <i class=""></i>
                  </button></td>


                </tr>
              ))}



            </tbody>
          </table>
          <div className="pagination-l">
            {currentPage > 1 && (
              <button className="btn btn-primary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}>
                Previous
              </button>
            )}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`btn btn-primary ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            {currentPage < totalPages && (
              <button className="btn btn-primary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}>
                Next
              </button>
            )}
          </div>
        </div>

        {/* <div className="warrantyOut">
            <p>Phiếu bảo hành hết hạn</p>
            <table className="table">
            <thead>
              <tr>
              <th>STT</th>
                <th>Mã Phiếu Bảo Hành</th>
                <th>Tên Khách Hàng</th>
                <th>Sản Phẩm</th>
                <th>Ngày Mua</th>
                <th>Ngày Hết Hạn</th>
              </tr>
            </thead>
            <tbody>
            {ends?.map((end,index) => (
              
              <tr>
                <td>{index+1}</td>
                <td>{end?.warrantyId}</td>
                <td>{end?.customerId}</td>
                <td>{end?.x}</td>
                <td>{end?.startDate}</td>
                <td>{end?.endDate}</td>
              </tr>
            ))}
            
              
            </tbody>
          </table>

        </div> */}
      </div>
      <div className={`modal-detail ${showDetail ? "open" : ""}`}>
        <div className="modal-detail-child">
          <div className="modal-detail-header">
            <div className="modal-detail-child-close" onClick={closeModalDetail}>
              <i className="fas fa-times-circle"></i>
            </div>
            <p>Thông Tin Bảo Hành Chi Tiết</p>
          </div>
          <div className="modal-detail-body bdwrt">
            <div className="modal-detail-body-right tbRW">
              <table className="tbwr">
                <thead>
                  <tr>
                    <td className="tieuDe">Mã phiếu bảo hành</td>
                    <td>{detail.warrantyId}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tieuDe">Tên khách hàng</td>
                    <td>{detail.orderDetails?.orders?.customerName}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Số Điện Thoại</td>
                    <td>{detail.orderDetails?.orders?.phoneNumber}</td>
                  </tr> <tr>
                    <td className="tieuDe">Email Khách Hàng</td>
                    <td>{detail.orderDetails?.orders?.email}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Thời hạn bảo hành</td>
                    <td>{detail.orderDetails?.products?.warrantyPeriod} tháng</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Ngày Mua</td>
                    <td>{formatDateTime(detail.startDate)}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Hạn bảo hành</td>
                    <td>{formatDateTime(detail.endDate)}</td>
                  </tr>
                </tbody>
              </table>

            </div>

            <div className="modal-detail-body-left tbLW">
              <table className="tbwl">
                <thead>

                </thead>
                <tbody>
                  <tr>
                    <td className="tieuDe">Mã Sản Phẩm</td>
                    <td>{detail.orderDetails?.products?.productCode}</td>
                  </tr> <tr>
                    <td className="tieuDe">Tên Sản Phẩm</td>
                    <td>{detail.orderDetails?.products?.productName}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Loại vàng</td>
                    <td>{detail.orderDetails?.products?.goldTypes.goldName}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Khối lượng vàng</td>
                    <td>{detail.orderDetails?.products?.goldWeight}</td>
                  </tr>

                  {detail.orderDetails?.products?.stones.length > 0 && 
                    <>
                      <tr>
                        <td className="tieuDe">Đá chính</td>
                        <td>{detail.orderDetails?.products?.stones?.filter(stone => stone.isPrimary).map(stone => stone.name).join(', ')}</td>
                      </tr>
                      <tr>
                        <td className="tieuDe">Tổng tiền đá</td>
                        <td>{numeral(detail.orderDetails?.products?.stones?.reduce((total, stone) => total + stone.price, 0)).format(0, 0)} VND</td>
                      </tr>
                    </>
                  }





                  <tr>
                    <td className="tieuDe">Tiền công</td>
                    <td>{numeral(detail.orderDetails?.products?.wage).format(0, 0)} VND</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Thành tiền</td>
                    <td>{numeral(detail.orderDetails?.products?.price).format(0, 0)} VND</td>
                  </tr>

                </tbody>
              </table>
            </div>
            {/* <p className="tongTien ttwr">Giá sản phẩm: {numeral(detail.orderDetails?.products?.price).format(0, 0)} VND</p> */}

          </div>
        </div>
      </div>
    </div>
  );
}
export default Warranty;
