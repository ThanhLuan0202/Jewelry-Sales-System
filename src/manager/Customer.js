import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Customer.css";
import config from "../config/config";
import { useFormik } from "formik";
import * as Yup from "yup";
function Customer() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const [tenKhachHang, setTenKhachHang] = useState("");
  const [sdtKhachHang, setSdtKhachHang] = useState("");
  const [emailKhachHang, setEmailKhachHang] = useState("");

  const [idKhachHangSearch, setIdKhachHangSearch] = useState("");

  const token = localStorage.getItem("token");

  //---------------------------------------------------------------

  const [updatedName, setUpdatedName] = useState("");
  const [updatedPhone, setUpdatedPhone] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  const [postToIdUpdate, setPostToIdUpdate] = useState("");
  //-------------------------------------------------------------
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [phoneCusCheck, setPhoneCusCheck] = useState("")

  //------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [editingPost, setEditingPost] = useState([]);
  const [phoneCus, setPhoneCus] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("")
  const [duplicate, setDuplicate] = useState("");


  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Customer`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const phones = data.map(customer => customer.phoneNumber.toString());
        console.log('Loaded phone:', phones);
        setPhoneCus(phones);
      });
  }, []);
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
  const formik = useFormik({
    initialValues: {
      tenKh: "",
      phoneKh: "",
      emailKh: "",
    },
    validationSchema: Yup.object({
      tenKh: Yup.string()
        .min(3, 'Tên phải dài ít nhất 3 ký tự')
        .max(30, 'Tên không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z\sÀ-Ỹà-ỹ]*$/, 'Tên không được chứa ký tự đặc biệt')
        .required('Tên là bắt buộc'),
      emailKh: Yup.string()
        .email('Email không hợp lệ')
        .min(5, 'Email phải dài ít nhất 5 ký tự')
        .max(30, 'Email không được dài quá 30 ký tự')
        .required('Email là bắt buộc'),
      phoneKh: Yup.string()
        .matches(/^\d{10}$/, 'Số điện thoại phải chứa đúng 10 số')
        .required('Số điện thoại là bắt buộc')
        
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });


  const formikUpdate = useFormik({
    initialValues: {
      tenKh: "",
      phoneKh: "",
      emailKh: "",
    },
    validationSchema: Yup.object({
      tenKh: Yup.string()
        .min(3, 'Tên phải dài ít nhất 3 ký tự')
        .max(30, 'Tên không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z\sÀ-Ỹà-ỹ]*$/, 'Tên không được chứa ký tự đặc biệt')
        .required('Tên là bắt buộc'),
      emailKh: Yup.string()
        .email('Email không hợp lệ')
        .min(5, 'Email phải dài ít nhất 5 ký tự')
        .max(30, 'Email không được dài quá 30 ký tự')
        .required('Email là bắt buộc'),
      phoneKh: Yup.string()
        .matches(/^\d{10}$/, 'Số điện thoại phải chứa đúng 10 số')
        .required('Số điện thoại là bắt buộc')
        
        
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleUpdate(values);
    },
  });

  useEffect(() => {
    if (editingPost) {
      formikUpdate.setValues({
        tenKh: editingPost.customerName,
        phoneKh: editingPost.phoneNumber,
        emailKh: editingPost.email
      });
    }
  }, [editingPost]);


  useEffect(() => {
    setTimeout(() => {
      setAddSuccess(false)
    }, 3000)
  }, [addSuccess])

  useEffect(() => {
    setTimeout(() => {
      setDeleteSuccess(false)
    }, 3000)
  }, [deleteSuccess])

  useEffect(() => {
    setTimeout(() => {
      setUpdateSuccess(false)
    }, 3000)
  }, [updateSuccess])
  //------------------------------------------------------------------
  //-------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
  // 
  const confirmDelete = (customerIdDelete) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này không?")) {
      handleDelete(customerIdDelete);
    }
  };

  const fetchCustomers = async () => {
    const response = await axios.get(`${config.API_ROOT}/api/Customer`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setPosts(response.data);
    setPostCount(response.data.length);
  }

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/Customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(`${config.API_ROOT}/api/Customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setPosts(response.data);
      setPostCount(response.data.length);
      setDeleteSuccess(true);
    } catch (error) {
      console.error('Xảy ra lỗi khi xóa khách hàng!', error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      console.log(values.tenKh);
      console.log(values.phoneKh);
      console.log(values.emailKh);
      const response = await axios.put(
        `${config.API_ROOT}/api/Customer/${postToIdUpdate}`,
        {
          customerName: values.tenKh || customerName,
          phoneNumber: values.phoneKh || customerPhone,
          email: values.emailKh || customerEmail,
          status: "active",
        }
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      formikUpdate.resetForm();
      // Update the specific post in the posts state
      const updatedPosts = posts.map((post) => {
        if (post.categoryId === postToIdUpdate) {
          return response.data;
        } else {
          return post;
        }
      });

      setPosts(updatedPosts);
      closeModalUpdate();

      setUpdateSuccess(true);
    } catch (error) {
      console.error("There was an error updating the category!", error);
      setDuplicate(error.response.data);
      setTimeout(() => {
        setDuplicate(null)
      }, 3000);
    }
    setEmailKhachHang("");
    setTenKhachHang("");
    setSdtKhachHang("")

  };

  const handleEditClick = (post) => {
    showAddFormUpdate();
    setCustomerName(post.customerName);
    setCustomerPhone(post.phoneNumber);
    setCustomerEmail(post.email);
    setPostToIdUpdate(post.customerId);
    handlePostClick(post.customerId);
    setEditingPost(post);
    setPhoneCusCheck(post.phoneNumber)

  };
  const handlePostClick = (post) => {
    showAddFormUpdate();
    setPostToUpdate(post);
  };
  //---------------------------------------------------------------

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Customer`,
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

  const handleCreate = async (values) => {
    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/Customer`,
        {
          customerName: values.tenKh,
          phoneNumber: values.phoneKh,
          email: values.emailKh,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      formik.resetForm();
      closeModal();
      setTenKhachHang("");
      setSdtKhachHang("");
      setEmailKhachHang("");
      fetchCustomers();
      console.log("Gold created successfully:", response.data);
      setAddSuccess(true);
    } catch (error) {
      console.error("There was an error adding gold!", error);
      setDuplicate(error.response.data);
      setTimeout(() => {
        setDuplicate(null)
      }, 3000);
    }
  };
  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };

  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };

  const showAddForm = () => {
    formik.resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    handleSearchCustomer();
  }, [idKhachHangSearch, addSuccess, updateSuccess, deleteSuccess])

  const handleSearchCustomer = async () => {
    var url;
    try {
      url = `${config.API_ROOT}/api/Customer`;
      if (idKhachHangSearch !== "") {
        url = `${config.API_ROOT}/api/Customer/SearchCustomerByNameOrPhone?searchText=${idKhachHangSearch}`;
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
  return (
    <div className="col-10">
      {duplicate && (
        <div className="alert alert-danger position-fixed top-8 end-0 m-3 duplicateCss">
          {duplicate}
        </div>

      )}
      <div className="customer">
        <div className={`alert alert-success position-fixed  notify-item-add-success align-items-center addKh ${addSuccess  ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Thêm khách hàng thành công
        </div>
        <div className={`alert alert-success position-fixed  notify-item-delete-success align-items-center deleteKh ${deleteSuccess  ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Xóa khách hàng thành công
        </div>
        <div className={`alert alert-success position-fixed  notify-item-update-success align-items-center updateKh ${updateSuccess  ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Cập nhật khách hàng thành công
        </div>
        <div className="title">
          <p>Khách Hàng</p>
        </div>
        <div className="tagResult">
          <div className="tagResultCustomer">
            <div className="tagChild">
              <i className="fas fa-users"></i>
            </div>
            <h3 className="skh">Số khách hàng</h3>
            <p className="skhct">{postCount} Khách hàng</p>
          </div>
        </div>
        <div className="customerDetail">
          <p>Quản lý khách hàng</p>
          <div className="search">
            <input type="text"
              name="idKhachHangSearch"
              value={idKhachHangSearch}
              onChange={(e) => setIdKhachHangSearch(e.target.value)}
              placeholder="Tìm Kiếm" />
          </div>
          <button className="addCustomer js-add-customer" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p className="addCusP">Thêm Mới Khách Hàng</p>
          </button>
          <table className="tableCustomer">
            <thead>
              <tr>
                {/* <th>STT</th> */}
                {/* <th>Mã Khách Hàng</th> */}
                <th>Tên Khách Hàng</th>
                <th>Số Điện Thoại</th>
                <th>Email Khách Hàng</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((post, index) => (
                <tr key={index}>
                  {/* <td>{indexOfFirstItem + index + 1}</td> */}
                  {/* <td>{post.customerId}</td> */}
                  <td>{post.customerName}</td>
                  <td>{post.phoneNumber}</td>
                  <td>{post.email}</td>
                  <td>


                    <i
                      className="btn btn-primary fas fa-edit update ms-2 "
                      onClick={() => handleEditClick(post)}
                    ></i>
                    <i className="btn btn-danger fas fa-trash-alt delete ms-2" onClick={() => confirmDelete(post.customerId)}></i>

                  </td>

                </tr>
              ))}
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

      <div className={`modal ${showModal ? "open" : ""}`}>
        <div className="modal-child">
          <div className="modal-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-headerr">
            <p>Thêm Mới Khách Hàng</p>
          </header>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body ">
              <label htmlFor="name" className="modal-label">
                Tên Khách Hàng
              </label>
              <input
                id="name"
                type="text"
                className="modal-input"
                name="tenKh"
                value={formik.values.tenKh}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: Nguyễn Văn A"

              />
              {formik.touched.tenKh && formik.errors.tenKh ? (
                <span className="error">{formik.errors.tenKh}</span>
              ) : null}
              <label htmlFor="phone" className="modal-label">
                Số Điện Thoại
              </label>
              <input
                id="phone"
                type="text"
                className="modal-input"
                name="phoneKh"
                value={formik.values.phoneKh}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: 0xxxxxxxxx"

              />
              {formik.touched.phoneKh && formik.errors.phoneKh ? (
                <span className="error">{formik.errors.phoneKh}</span>
              ) : null}
              <label htmlFor="email" className="modal-label">
                Email
              </label>
              <input
                id="email"
                type="text"
                className="modal-input"
                name="emailKh"
                value={formik.values.emailKh}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: customer@gmail.com"

              />
              {formik.touched.emailKh && formik.errors.emailKh ? (
                <span className="error">{formik.errors.emailKh}</span>
              ) : null}
              <button id="create-cus" type="submit">
                Tạo
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`modal-update ${showModalUpdate ? "open" : ""}`}>
        <div className="modal-child-update">
          <div className="modal-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-headerr-update">
            <p>Cập Nhật Thông Tin Khách Hàng</p>
          </header>
          <form onSubmit={formikUpdate.handleSubmit}>
            <div className="modal-body-update ">
              <label htmlFor="name" className="modal-label-update">
                Tên Khách Hàng
              </label>
              <input
                id="name"
                type="text"
                className="modal-input-update"
                name="tenKh"
                value={formikUpdate.values.tenKh}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
              />
              {formikUpdate.touched.tenKh && formikUpdate.errors.tenKh ? (
                <span className="error">{formikUpdate.errors.tenKh}</span>
              ) : null}
              <label htmlFor="phone" className="modal-label-update">
                Số Điện Thoại
              </label>
              <input
                id="phone"
                type="text"
                className="modal-input-update"
                name="phoneKh"
                value={formikUpdate.values.phoneKh}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
              />
              {formikUpdate.touched.phoneKh && formikUpdate.errors.phoneKh ? (
                <span className="error">{formikUpdate.errors.phoneKh}</span>
              ) : null}
              <label htmlFor="email" className="modal-label-update">
                Email
              </label>
              <input
                id="email"
                type="text"
                className="modal-input-update"
                name="emailKh"
                value={formikUpdate.values.emailKh}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
              />
              {formikUpdate.touched.emailKh && formikUpdate.errors.emailKh ? (
                <span className="error">{formikUpdate.errors.emailKh}</span>
              ) : null}
              <button type="submit" id="create-cus-update" >
                Cập Nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Customer;
