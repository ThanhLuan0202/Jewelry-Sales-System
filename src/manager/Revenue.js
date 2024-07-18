import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Revenue.css";
import config from "../config/config";
import numeral from 'numeral';

function Revenue() {
  const [today, setToday] = useState([]);
  const [week, setWeek] = useState([]);
  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);
  const [xs, setXs] = useState([]);
  const [postCountToday, setPostCountToday] = useState(0);
  const [postCountWeek, setPostCountWeek] = useState(0);
  const [postCountYear, setPostCountYear] = useState(0);
  const [postCountMonth, setPostCountMonth] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [priceYear, setPriceYear] = useState([]);
  const [priceMonth, setPriceMonth] = useState([]);
  const [priceWeek, setPriceWeek] = useState([]);
  const [priceDay, setPriceDay] = useState([]);

  const [selectedOption, setSelectedOption] = useState("");
  const token = localStorage.getItem("token");

  const [showDetail, setShowDetail] = useState(false);
  const [goldIdSearch, setGoldIdSearch] = useState("");

  const [detail, setDetail] = useState({})
  const [productDetail, setProductDetail] = useState({})
  const [idOrderDetail, setIdOrderDetail] = useState("")


  const [saleFullName, setSaleFullName] = useState('');
  const [cashierFullName, setCashierFullName] = useState('');
  const [servicesFullName, setServicesFullName] = useState('');
  const [kCoQuyen, setKCoQuyen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [payments, setPayments] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [orderIdW, setOrderIdW] = useState('');

  const [showwDetailImg, setShowwDetailImg] = useState(false);
  const [imgDetail, setImgDetail] = useState('');
  const [warrantyList, setWarrantyList] = useState([]);
  const [idDsOrder, SetDDsOrder] = useState('');
  const [dsDetail, setDsDetail] = useState({})
  const [chectype, setChectype] = useState('');
  const [day, setDay] = useState([]);
  const [report, setReport] = useState({
    dailyRevenue: 0,
    totalDailyOrder: 0,
    monthlyRevenue: 0,
    totalMonthOrder: 0,
    yearlyRevenue: 0,
    totalYearOrder: 0
  });

  const fetchReport2 = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}/api/Dashboard/revenue-summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        // setReport(response.data);
        // setPostCountToday(report.totalDailyOrder)
        // setPriceDay(report.dailyRevenue)
        // setPostCountMonth(report.totalMonthOrder)
        // setPriceMonth(report.totalMonthOrder)
        // setPostCountWeek(report.totalWeekOrder)
        // setPriceWeek(report.weeklyRevenue)
        // setPostCountYear(report.totalYearOrder)
        // setPriceYear(report.yearlyRevenue)
      }
    } catch (error) {
      console.error('There was an error when fetching revenue summary', error);
    }
  };

  useEffect(() => {

    fetchReport2();
  }, []);
  useEffect(() => {
    if (idOrderDetail) {
      fetch(`${config.API_ROOT}/api/Orders/GetOrderDetails/${idDsOrder}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((posts) => {
          setDsDetail(posts);

        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
        });
    }
  }, [idDsOrder]);

  const fetchWarrantyList = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}/api/Cart/get-warranty/${orderIdW}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Warranty List data:', response.data);
      setWarrantyList(response.data);
      response.data.map((x) => {


      })
    } catch (error) {
      console.error('There was an error fetching the warranty!', error);
    }
  };

  useEffect(() => {
    if (orderIdW !== '') {
      fetchWarrantyList();
    }
  }, [orderIdW]);
  // useEffect(() => {
  //   if (warrantyList.length > 0) {
  //     const firstProductCode = warrantyList[0].orderDetails.products.productCode;
  //     setWrCode(firstProductCode);
  //   }
  // }, [warrantyList]);



  const showImgdetail = (img) => {
    console.log("ss" + productList);
    setShowwDetailImg(true)
    setImgDetail(img)

  }
  useEffect(() => {
    fetchPayments();
  }, [orderId]);
  const fetchPayments = () => {
    axios.get(`${config.API_ROOT}/api/Payments/GetPaymentByOrderOrderCode?orderOrder=${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setPayments(response.data);
        response.data.map((x) => {
          setChectype(x.paymentType)

        })
      })
      .catch(error => {
        console.error('There was an error fetching payments!', error);
      });
  }
  const fetchOrderDetail = (x) => {
    axios.get(`${config.API_ROOT}/api/Orders/GetOrderDetails/1`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        const posts = response.json;
        console.log("abcddd");
        console.log(response);
        setProductDetail(response.data);
        setOrderDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
      });
  }


  // const checkDelete = (x) => {
  //   if (x.status === "Đợi thanh toán") {
  //     setCheckType(true);
  //   } else {
  //     setCheckType(true);
  //   }
  // };

  useEffect(() => {
    if (idOrderDetail) {
      fetch(`${config.API_ROOT}/api/Orders/GetOrderDetails/${idOrderDetail}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((posts) => {
          setProductDetail(posts);
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
        });
    }
  }, [idOrderDetail]);

  const productList = Object.values(productDetail);

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
  const formatDateTime1 = (dateTimeString) => {
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

      return `${day}/${month}/${year}`;
    } catch (error) {
      return 'Invalid date';
    }
  };
  const showDetailForm = (x) => {
    console.log("orderIdW: " + x.orderId);
    setOrderIdW(x.orderId);
    SetDDsOrder(x.orderId)
    setShowDetail(true);
    setDetail(x);
    setOrderId(x.orderCode);
    fetchOrderDetail(x.orderId);
    setIdOrderDetail(x.orderId);

  };



  const closeModalDetail = () => {
    setShowDetail(false)
    setOrderIdW("")
    SetDDsOrder("")
    setOrderId("");
    fetchOrderDetail("");
    setIdOrderDetail("");
  }



  //-------------------------------------------

  // Hàm xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tính toán vị trí bắt đầu và kết thúc của dữ liệu hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = xs.slice(indexOfFirstItem, indexOfLastItem);

  // Hiển thị số trang
  const totalPages = Math.ceil(xs.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  //--------------------------------------------
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-orders/today`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setXs(posts);
      });
  }, []);
  //----------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const todayResponse = await fetch(
        `${config.API_ROOT}/api/Orders/get-orders/today`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const todayData = await todayResponse.json();
      setToday(todayData);
      setPostCountToday(todayData.length);
      const weekResponse = await fetch(
        `${config.API_ROOT}/api/Orders/get-orders/this-week`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const weekData = await weekResponse.json();
      setWeek(weekData);
      setPostCountWeek(weekData.length);

      const monthResponse = await fetch(
        `${config.API_ROOT}/api/Orders/get-orders/this-month`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const monthData = await monthResponse.json();
      setMonth(monthData);
      setPostCountMonth(monthData.length);

      const yearResponse = await fetch(
        `${config.API_ROOT}/api/Orders/get-orders/this-year`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const yearData = await yearResponse.json();
      setYear(yearData);
      setPostCountYear(yearData.length);
    };

    fetchData();
  }, []);
  const check = (selectedOption) => {
    setSelectedOption(selectedOption);
    switch (selectedOption) {

      case "option1":
        setXs(today);
        setCurrentPage(1);
        break;
      case "option2":
        setXs(week);
        setCurrentPage(1);
        break;
      case "option3":
        setXs(month);
        setCurrentPage(1);
        break;
      case "option4":
        setXs(year);
        setCurrentPage(1);
        break;
      default:
        setXs([]);
    }
  };

  const confirmDelete = (x) => {
    if (x.status !== "Đợi thanh toán") {
      setKCoQuyen(true);
      setTimeout(() => {
        setKCoQuyen(false);
      }, 3000);
    } else {
      if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
        handleDelete(x.orderId);
      }
    }

  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/Orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      let response;
      if (selectedOption === "option1") {
        response = await axios.get(`${config.API_ROOT}/api/Orders/get-orders/today`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPostCountToday(response.data.length);
      } else if (selectedOption === "option2") {
        response = await axios.get(`${config.API_ROOT}/api/Orders/get-orders/this-week`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPostCountWeek(response.data.length);
      } else if (selectedOption === "option3") {
        response = await axios.get(`${config.API_ROOT}/api/Orders/get-orders/this-month`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPostCountMonth(response.data.length);
      } else if (selectedOption === "option4") {
        response = await axios.get(`${config.API_ROOT}/api/Orders/get-orders/this-year`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPostCountYear(response.data.length);
      }

      if (response && response.data) {
        setXs(response.data);
      } else {
        console.error("No data received from server");
      }
      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      console.error("Xảy ra lỗi khi xóa vai trò!", error);
    }
  };

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-orders/this-year`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((xxxx) => {
        setPriceYear(xxxx);
      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-orders/this-month`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((eee) => {
        setPriceMonth(eee);
      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-orders/this-week`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((qqq) => {
        setPriceWeek(qqq);
      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-orders/today`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((zzz) => {
        setPriceDay(zzz);
      });
  }, []);

  useEffect(() => {
    handleSearchCustomer()
  }, [goldIdSearch])

  const handleSearchCustomer = async () => {
    var url;
    try {
      let url = `${config.API_ROOT}/api/Orders/get-orders/today`;
      if (goldIdSearch !== "") {
        console.log(goldIdSearch);
        url = `${config.API_ROOT}/api/Orders/getOrderByOrderCode?code=${goldIdSearch}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setXs(response.data);
    } catch (error) {
      console.error('There was an error fetching the customer list!', error);
    }
    console.log(goldIdSearch);

  }

  return (
    <div className="col-10 ">
      {kCoQuyen && (
        <div className="alert alert-danger position-fixed top-8 end-0 m-3 z10000">
          Đơn hàng đã thanh toán không thể xóa
        </div>
      )}
      <div className="revenue">
        <div className="title ">
          <p>Doanh Thu</p>
        </div>
        <div className="tagResult">
          <div className="tagResultToday">
            <div className="tagChild asd">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h3>Hôm nay</h3>
            <h2>{postCountToday} Đơn Hàng</h2>
            <p>{numeral(priceDay).format("0,0")} VND</p>
          </div>
          <div className="tagResultWeek">
            <div className="tagChild asd">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h3>Tuần này</h3>
            <h2>{postCountWeek} Đơn Hàng</h2>
            <p>{numeral(priceWeek).format("0,0")} VND</p>
          </div>
          <div className="tagResultMonth">
            <div className="tagChild asd">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h3> Tháng này</h3>
            <h2>{postCountMonth} Đơn Hàng</h2>
            <p>{numeral(priceMonth).format("0,0")} VND</p>
          </div>
          <div className="tagResultYear">
            <div className="tagChild asd">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h3> Năm nay</h3>
            <h2>{postCountYear} Đơn Hàng</h2>
            <p>{numeral(priceYear).format("0,0")} VND</p>
          </div>
        </div>
        <div className="detailOrder">
          <p>Danh sách đơn hàng</p>
          <div className="combobox dhSearch">
            <select onChange={(e) => check(e.target.value)}>
              <option value="" defaultValue disabled>
                Thời gian
              </option>
              <option value="option1">Hôm nay</option>
              <option value="option2">Tuần này</option>
              <option value="option3">Tháng này</option>
              <option value="option4">Năm nay</option>
            </select>
          </div>
          <div className="search">
            <input type="text"
              name="goldId"
              value={goldIdSearch}
              onChange={(e) => setGoldIdSearch(e.target.value)}
              placeholder="Tìm Kiếm" />
          </div>

          <table className="tableRevenue">
            <thead>
              <tr>
                <th>Mã Đơn Hàng</th>
                <th>Thời Gian</th>
                <th>Khách Hàng</th>
                {/* <th>Số Điện Thoại</th>
                <th>Email Khách Hàng</th>
                <th>Người Tạo Đơn</th>
                <th>Người Thanh Toán</th>
                <th>Người Lấy Hàng</th> */}
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6">Chưa có bất kỳ đơn hàng nào</td>
                </tr>
              ) : (
                currentItems.map((x, index) => (
                  <tr key={index}>
                    <td>{x.orderCode}</td>
                    <td>{formatDateTime(x.orderDate)}</td>
                    <td>{x.customerName ? x.customerName : 'Khách vãng lai'}</td>
                    <td>{numeral(x.total).format("0,0")} VND</td>
                    <td className={
                      x.status === 'Đợi thanh toán' ? 'status-waiting' :
                        x.status === 'Đang thanh toán' ? 'status-paying' :
                          x.status === 'Đã thanh toán' ? 'status-paid' :
                            x.status === 'Đã hoàn thành' ? 'status-completed' :
                              x.status === 'Hủy thanh toán' ? 'status-cancel' :
                                ''
                    }>
                      {x.status}
                    </td>
                    <td>
                      <button className="btn btn-info fas fa-eye eyeDetail" onClick={() => showDetailForm(x)}>
                        <i className=""></i>
                      </button>
                      <i
                        className="btn btn-danger fas fa-trash-alt delete ms-2"
                        onClick={() => confirmDelete(x)}
                      ></i>
                      {/* <i className="btn btn-primary fas fa-edit update"></i> */}
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
          <div className="pagination pagination-l">
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
        <div className="modal-detail-child ">
          <div className="modal-detail-header">
            <div className="modal-detail-child-close" onClick={closeModalDetail}>
              <i className="fas fa-times-circle"></i>
            </div>
            <p>Thông Tin Chi Tiết Đơn Hàng</p>
          </div>
          <div className="modal-detail-body dtbd">
            <div className="modal-detail-body-right dtbdr">
              <p className="dhdh">Đơn hàng</p>
              <table className="tbDt">
                <thead>
                  <tr>
                    <td className="tieuDeMadh">Mã đơn hàng</td>
                    <td>{detail.orderCode}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tieuDe">Thời gian</td>

                    <td>{formatDateTime(detail.orderDate)}</td>

                  </tr>
                  <tr>
                    <td className="tieuDe">Tổng tiền</td>
                    <td> {numeral(detail.total).format(0, 0)} VND</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Trạng thái</td>
                    <td className={
                      detail.status === 'Đợi thanh toán' ? 'status-waitingg' :
                        detail.status === 'Đang thanh toán' ? 'status-payingg' :
                          detail.status === 'Đã thanh toán' ? 'status-paidd' :
                            detail.status === 'Đã hoàn thành' ? 'status-completedd' :
                              detail.status === 'Hủy thanh toán' ? 'status-cancell' :
                                ''
                    }>
                      {detail.status}
                    </td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Người tạo đơn</td>
                    <td>{orderDetails[0]?.sale?.fullName}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Người thanh toán</td>
                    <td>{orderDetails[0]?.cashier?.fullName}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Người lấy hàng</td>
                    <td>{orderDetails[0]?.services?.fullName}</td>
                  </tr>

                </tbody >
              </table >
              <p className="dhkh">Khách hàng</p>
              <table className="ttkhct">
                <thead>
                  <tr>
                    <td className="tieuDe">Tên khách hàng</td>
                    <td>{detail.customerName}</td>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                    <td className="tieuDe">Số điện thoại</td>
                    <td>{detail.phoneNumber}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Email</td>
                    <td>{detail.email}</td>
                  </tr>

                </tbody>


              </table>
            </div >
            <div className="modal-detail-body-left mddtl">
              <p className="dsPrDt">Danh sách sản phẩm</p>
              <table className="tbDtDt">
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Loại vàng</th>
                    <th>Đá chính</th>
                    <th>Tiền công</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(dsDetail).map((post) => (
                    <tr key={post.product?.productCode}>
                      <td>{post.product?.productCode}</td>
                      <td>{post.product?.productName}</td>
                      <td>{post.quantity}</td>
                      <td>{post.product?.goldTypes?.goldName}</td>
                      <td>{post.product?.stones?.filter(stone => stone.isPrimary).map(stone => stone.name).join(', ')}</td>
                      <td>{numeral(post.product?.wage).format('0,0')} VND</td>
                      <td>{numeral(post.product?.price).format('0,0')} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="dhct">
                {payments.length > 0 && (
                  <div>
                    <h6 className="dsdh mt-4">Danh sách thanh toán</h6>
                    <table className="tbdsdh">
                      <thead>

                        <tr>
                          <td className="tieuDe">STT</td>
                          <td className="tieuDe">Mã giao dịch</td>
                          <td className="tieuDe">Thời gian</td>
                          <td className="tieuDe">Phương thức thanh toán</td>
                          <td className="tieuDe">Số tiền thanh toán</td>

                          {
                            chectype === "Chuyển khoản" && (
                              <>
                                <td className="tieuDe">Mã chuyển khoản</td>
                                <td className="tieuDe">Ảnh minh chứng</td>
                              </>
                            )
                          }
                        </tr>


                      </thead>
                      <tbody>

                        {payments.map((payment, index) => (
                          <tr key={payment.paymentId}>
                            <td>{index + 1}</td>
                            <td>{payment.paymentCode}</td>
                            <td>{formatDateTime(payment.paymentTime)}</td>
                            <td>{payment.paymentType}</td>
                            <td >{payment.cash === 0 ? numeral(payment.bankTransfer).format(0, 0) : numeral(payment.cash).format(0, 0)} VND</td>
                            {payment.paymentType === "Chuyển khoản" && (
                              <>
                                <td >{payment.transactionId}</td>
                                <td onClick={() => showImgdetail(payment.image)}>
                                  {payment.image && <img className="img-luan" src={payment.image} alt="N/A" width="100" />}
                                </td>
                              </>
                            )
                            }


                          </tr>
                        ))}

                      </tbody>
                    </table>
                  </div>

                )
                }

              </div>
              {warrantyList.length > 0 && (
                <>
                  <p className="pbhdhh">Phiếu bảo hành</p>
                  <table className="pbhdh">
                    <thead>
                      <tr>
                        <td className="tieuDe">STT</td>
                        <td className="tieuDe">Mã phiếu bảo hành</td>
                        <td className="tieuDe">Mã sản phẩm</td>
                        <td className="tieuDe">Tên sản phẩm</td>
                        <td className="tieuDe">Hạn bảo hành</td>
                      </tr>
                    </thead>
                    <tbody>
                      {warrantyList.map((post, index) => (

                        <tr>
                          <td>{index + 1}</td>
                          <td>{post.warrantyCode}</td>
                          <td>{post.orderDetails.products.productCode}</td>
                          <td>{post.orderDetails.products.productName}</td>
                          <td>{formatDateTime1(post.endDate)} </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )


              }

            </div>

          </div>
        </div >
      </div >
      <div className={`modal-detail-img ${showwDetailImg ? "open" : ""}`}>
        <div className="modal-product-close" onClick={() => setShowwDetailImg(false)}>
          <i className="fas fa-times-circle"></i>
        </div>
        <div className="product-img">
          <img className="product-img" src={imgDetail} alt="{post.productName}" />
        </div>

      </div>
    </div >

  );
}

export default Revenue;
