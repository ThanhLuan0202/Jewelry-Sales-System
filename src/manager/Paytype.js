import React, { useState, useEffect } from "react";
import "./Paytype.css";
import config from "../config/config";
import axios from "axios";

// import formatDateTime from "./formatDatetime"
import numeral from 'numeral';

function Paytype() {
  const [posts, setPosts] = useState([]);
  const [donCk, setDonCk] = useState([]);
  const [donTm, setDonTm] = useState([]);
  const [donAll, setDonAll] = useState([]);
  const token = localStorage.getItem("token")

  const [donPriceTm, setPriceDonTm] = useState([]);
  const [donPriceCk, setPriceDonCk] = useState([]);

  //-------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goldIdSearch, setGoldIdSearch] = useState("");
  const [showImgg, setShowImgg] = useState("");

  const [showDetail, setShowDetail] = useState(false);
  const [checkType, setCheckType] = useState(false);
  const [showwDetailImg, setShowDetailImg] = useState(false);

  const [detail, setDetail] = useState({})

  const [option, setOption] = useState('');
  const [checkOption, setCheckOption] = useState("all");



  var cash=0;
  var bank=0;
  const checkPaytypeByOption = async (selectedOption) => {
    try {
      let url = `${config.API_ROOT}/api/Payments`;
      if (selectedOption !== "all") {
        url = `${config.API_ROOT}/api/Payments/GetPaymentByOption/option?option=${selectedOption}`;
      }
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      setDonTm(response.data.length);
      setDonCk(response.data.length);
      response.data.forEach(item => {
        
        cash += item.cash;
        bank += item.bankTransfer;
        
      });
      setPriceDonCk(bank);
      setPriceDonTm(cash);

      setPosts(response.data);
     
      setCurrentPage(1);
    } catch (error) {
      console.error('There was an error when fetching payment data:', error);
    }
  };
  const handleOptionChange = (selectedOption) => {
    checkPaytypeByOption(selectedOption);
    setCheckOption(selectedOption)
  };
  const showDetailImg = (img) => {
    setShowDetailImg(true);
    setShowImgg(img);

  }
  //---------------------------
  const showDetailForm = (x) => {
    setShowDetail(true);
    setDetail(x);
    if (x.paymentType === "Tiền mặt") {
      setCheckType(false);
    } else {
      if (x.paymentType === "Chuyển khoản") {
        setCheckType(true);
      }
    }
  };
  const closeModalDetail = () => {
    setShowDetail(false)
  }
  // Hàm xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tính toán vị trí bắt đầu và kết thúc của dữ liệu hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);

  // Hiển thị số trang
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

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-payment-type/cash`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPriceDonTm(posts);


      });
  }, []);

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-payment-type/bank-transfer`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPriceDonCk(posts);


      });
  }, []);

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Payments`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPosts(posts);


      });
  }, []);


  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-number-of-orders-by-payment-type/cash`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setDonTm(posts);


      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-number-of-orders-by-payment-type/bank-transfer`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setDonCk(posts);


      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-number-of-orders-by-payment-type/both`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setDonAll(posts);


      });
  }, []);


  useEffect(() => {
    handleSearchCustomer()
  }, [goldIdSearch])

  const handleSearchCustomer = async () => {
    var url;
    try {
      let url = `${config.API_ROOT}/api/Payments`;
      if (goldIdSearch !== "") {
        console.log(goldIdSearch);
        url = `${config.API_ROOT}/api/Payments/SearchPaymentByPaymentCodeOrOrderCode?searchText=${goldIdSearch}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('There was an error fetching the customer list!', error);
    }
    console.log(goldIdSearch);

  }
  return (
    <div className="col-10">
      <div className="payType">
        <div className="title">
          <p>Giao Dịch</p>
        </div>
        <div className="tagResultt">
          <div className="tagResultTransfer">
            <div className="tagChild">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <h3>Tiền mặt</h3>
            <h2>{donTm} Giao dịch</h2>
            <p>{numeral(donPriceTm).format("0,0")} VND</p>
          </div>
          <div className="tagResultCash">
            <div className="tagChild">
              <i className="fas fa-qrcode ax"></i>
            </div>
            <h3>Chuyển khoản</h3>
            <h2>{donCk} Giao dịch</h2>
            <p>{numeral(donPriceCk).format("0,0")} VND</p>
          </div>


        </div>
        <div className="detailPay">
          <p>Danh Sách Thanh Toán</p>
          <div className="search">
            <input type="text"
              name="goldId"
              value={goldIdSearch}
              onChange={(e) => setGoldIdSearch(e.target.value)}
              placeholder="Tìm Kiếm" />
          </div>
          <div className="choose-type-paytype d-flex">
            <input className="ms-2" checked={checkOption === "all"} type="radio" name="option" id="all" value="all" onClick={() => handleOptionChange('all')} />
            <label className="ms-2 mt-2" htmlFor="today">Tất cả</label>
            <input className="ms-2" type="radio" name="option" id="today" value="today" onClick={() => handleOptionChange('today')} />
            <label className="ms-2 mt-2" htmlFor="today">Hôm nay</label>
            <input className="ms-2" type="radio" name="option" id="this-week" value="this-week" onClick={() => handleOptionChange('this-week')} />
            <label className="ms-2 mt-2" htmlFor="this-week">Tuần này</label>
            <input className="ms-2" type="radio" name="option" id="this-month" value="this-month" onClick={() => handleOptionChange('this-month')} />
            <label className="ms-2 mt-2" htmlFor="this-month">Tháng này</label>
            <input className="ms-2" type="radio" name="option" id="this-year" value="this-year" onClick={() => handleOptionChange('this-year')} />
            <label className="ms-2 mt-2" htmlFor="this-year">Năm nay</label>
          </div>
          <table className="tablePaytype">
            <thead>
              <tr>
                {/* <th>STT</th> */}
                <th>Mã Thanh Toán</th>
                <th>Mã Đơn Hàng</th>
                <th>Thời Gian</th>
                <th>Phương Thức Thanh Toán</th>
                {/* <th>Mã Chuyển Khoản</th>
                <th>Chuyển Khoản</th>
                <th>Tiền Mặt</th> */}
                <th>Tổng Tiền</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>

              {
                currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6">Chưa có bất kỳ đơn hàng nào</td>
                  </tr>
                ) : (currentItems.map((post, index) => (

                  <tr key={index}>
                    {/* <td>{indexOfFirstItem + index + 1}</td> */}
                    <td>{post.paymentCode}</td>
                    <td>{post.orders?.orderCode}</td>
                    <td>{formatDateTime(post.paymentTime)}</td>
                    <td>{post.paymentType}</td>
                    {/* <td>{post.transactionId}</td>
                    <td>{numeral(post.bankTransfer).format("0,0")} VND</td>
                    <td>{numeral(post.cash).format("0,0")} VND</td> */}

                    <td>{numeral((post.cash) + (post.bankTransfer)).format("0,0")} VND</td>
                    <td><button class="btn btn-info fas fa-eye eyeDetail" onClick={() => showDetailForm(post)}>
                      <i class=""></i>
                    </button></td>
                    {/* <td>
                      <i className="btn btn-danger fas fa-trash-alt delete"></i>
                      <i className="btn btn-primary fas fa-edit update"></i> 
                    </td> */}
                  </tr>
                )))
              }
            </tbody>
          </table>
          <div className="pagination-l">
            {currentPage > 1 && (
              <button className="btn btn-primary" onClick={() => handlePageChange(currentPage - 1)}>
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
              <button className="btn btn-primary" onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={`modal-detail ${showDetail ? "open" : ""}`}>
        <div className="modal-detail-childd">
          <div className="modal-detail-headerr">
            <div className="btnClPaydt" onClick={closeModalDetail}>
              <i className="fas fa-times-circle"></i>
            </div>
            <p className="ee">Thông Tin Chi Tiết Giao Dịch</p>
          </div>
          <div className="table-container">
            <table className="tablexxx" >
              <thead>
                <tr>
                  <td className="tieuDe">Mã thanh toán </td>
                  <td>{detail.paymentCode}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tieuDe">Thời gian</td>
                  <td>{formatDateTime(detail.paymentTime)}</td>
                </tr>
                <tr>
                  <td className="tieuDe">Phương thức thanh toán</td>
                  <td>{detail.paymentType}</td>
                </tr>
                {checkType ? (
                  <>
                    <tr>
                      <td className="tieuDe">Số tiền chuyển khoản</td>
                      <td>{numeral(detail.bankTransfer).format("0,0")} VND</td>
                    </tr>
                    <tr>
                      <td className="tieuDe">Mã chuyển khoản</td>
                      <td>{detail.transactionId}</td>
                    </tr>
                    <tr>
                      <td className="tieuDe">Ảnh giao dịch</td>
                      <td onClick={() => showDetailImg(detail.image)} ><img className="paytype-img-detail img-hover" src={detail.image} alt={detail.transactionId} /></td>
                    </tr>
                  </>
                ) : (<><tr>
                  <td className="tieuDe">Số tiền mặt</td>
                  <td>{numeral(detail.cash).format("0,0")} VND</td>
                </tr></>)}
              </tbody>
            </table>

          </div>
        </div>


      </div>
      <div className={`modal-detail-img ${showwDetailImg ? "open" : ""}`}>
        <div className="modal-product-close" onClick={() => setShowDetailImg(false)}>
          <i className="fas fa-times-circle"></i>
        </div>
        <div className="product-img">
          <img className="product-img" src={showImgg} alt="{post.productName}" />
        </div>
      </div>
    </div>
  );
}
export default Paytype;
