import React, { useState, useEffect } from "react";
import "./Users.css";
import axios from "axios";
import config from "../config/config";
import { useFormik } from "formik";
import * as Yup from "yup";
function Users() {
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [users, setUser] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const [maNguoiDung, setMaNguoiDung] = useState("");
  const [sdtNguoiDung, setSdtNguoiDung] = useState("");
  const [tenNguoiDung, setTenNguoiDung] = useState("");
  const [emailNguoiDung, setEmailNguoiDung] = useState("");
  const [dcNguoiDung, setDcNguoiDung] = useState("");
  const [nsNguoiDung, setNsNguoiDung] = useState("");
  const [vaiTroNguoiDung, setVaiTroNguoiDung] = useState("");
  const [passNguoiDung, setPassNguoiDung] = useState("");
  const [statusNguoiDung, setStatusNguoiDung] = useState("");

  const [nameUserSearch, setNameUserSearch] = useState("");
  const token = localStorage.getItem("token");
  //-------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [idUserUpdate, setIdUserUpdate] = useState("");
  const [nameUserUpdate, setNameUserUpdate] = useState("");
  const [passUserUpdate, setPassUserUpdate] = useState("");
  const [addressUserUpdate, setAddressUserUpdate] = useState("");
  const [phoneUserUpdate, setPhoneUserUpdate] = useState("");
  const [emailUserUpdate, setEmailUserUpdate] = useState("");
  const [dobUserUpdate, setDobUserUpdate] = useState("");
  const [roleIdUpdate, setRoleIdUpdate] = useState("");


  const [nameUser, setNameUser] = useState("");
  const [passUser, setPassUser] = useState("");
  const [addressUser, setAddressUser] = useState("");
  const [phoneUser, setPhoneUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [dobUser, setDobUser] = useState("");
  const [roleId, setRoleId] = useState("");
  const [editingPost, setEditingPost] = useState([]);
  const [duplicate, setDuplicate] = useState("");


  const formikUpdate = useFormik({
    initialValues: {
      ten: "",
      phone: "",
      email: "",
      dc: "",
      ma: "",
      vaitro: "",
      pass: "",
      ns: "",
      level: ""
    },
    validationSchema: Yup.object({
      ten: Yup.string()
        .min(3, 'Tên phải dài ít nhất 3 ký tự')
        .max(30, 'Tên không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, 'Tên không được chứa ký tự đặc biệt')
        .required('Tên là bắt buộc'),
      email: Yup.string()
        .email('Email không hợp lệ')
        .min(5, 'Email phải dài ít nhất 5 ký tự')
        .max(30, 'Email không được dài quá 30 ký tự')
        .required('Email là bắt buộc'),
      phone: Yup.string()
        .matches(/^\d{10}$/, 'Số điện thoại phải chứa đúng 10 số')
        .required('Số điện thoại là bắt buộc'),
      dc: Yup.string().required('Địa chỉ là bắt buộc'),
      // ma: Yup.string().required('Mã người dùng là bắt buộc'),
      vaitro: Yup.string().required('Vai trò là bắt buộc'),
      pass: Yup.string().required('Mật khẩu là bắt buộc'),
      ns: Yup.date().required('Ngày sinh là bắt buộc'),
      level: Yup.number().required('Level là bắt buộc'),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values);
      handleUpdate(values);
    },
  });

  useEffect(() => {
    if (editingPost) {
      console.log("Editing Post:", editingPost); // Kiểm tra giá trị của editingPost
      formikUpdate.setValues({
        ten: editingPost.fullName,
        phone: editingPost.phone,
        email: editingPost.email,
        dc: editingPost.address,
        ma: editingPost.userName,
        vaitro: editingPost.roles?.roleId,
        pass: editingPost.password,
        ns: new Date().toISOString().substr(0, 10),
        level: editingPost.level
      });
    }
  }, [editingPost]);

  const formik = useFormik({
    initialValues: {
      ten: "",
      phone: "",
      email: "",
      dc: "",
      ma: "",
      vaitro: "",
      pass: "",
      ns: "",
      level: ""
    },
    validationSchema: Yup.object({
      ten: Yup.string()
        .min(3, 'Tên phải dài ít nhất 3 ký tự')
        .max(30, 'Tên không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, 'Tên không được chứa ký tự đặc biệt hoặc số')
        .required('Tên là bắt buộc'),
      email: Yup.string()
        .email('Email không hợp lệ')
        .min(5, 'Email phải dài ít nhất 5 ký tự')
        .max(30, 'Email không được dài quá 30 ký tự')
        .required('Email là bắt buộc'),
      phone: Yup.string()
        .matches(/^\d{10}$/, 'Số điện thoại phải chứa đúng 10 số')
        .required('Số điện thoại là bắt buộc'),
      dc: Yup.string().required('Địa chỉ là bắt buộc'),
      ma: Yup.string().required('Mã người dùng là bắt buộc'),
      vaitro: Yup.string().required('Vai trò là bắt buộc'),
      pass: Yup.string().required('Mật khẩu là bắt buộc'),
      ns: Yup.date().required('Ngày sinh là bắt buộc'),
      level: Yup.number().required('Level là bắt buộc'),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleCreate(values);
    },
  });
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
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  // Hiển thị số trang
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  //--------------------------------------------
  //-------------------------------------------


  //------------------------------------------------------------

  const confirmDelete = (userIdDelete) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      handleDelete(userIdDelete);
    }
  };
  const handleDelete = async (userName) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/Users/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(`${config.API_ROOT}/api/Users/GetALL`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUser(response.data);
      setUsersCount(response.data.length);
      console.log("cook");
      setDeleteSuccess(true);
    } catch (error) {
      console.error('Xảy ra lỗi khi xóa vai trò!', error);
    }
    console.log("jeheh" + userName);
  };
  //----------------------------------
  const handleUpdate = async (values) => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Users/${idUserUpdate}`,
        {
          fullName: values.ten || nameUser,
          password: values.pass || passUser,
          address: values.dc || addressUser,
          phone: values.phone || phoneUser,
          email: values.email || emailUser,
          dob: values.ns || dobUser,
          level: values.level,
          status: "active",
          roleId: values.vaitro || roleId
        }
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response);
      // Update the specific post in the posts state
      // const updatedRoles = roles.map((roles) => {
      //   if (roles.categoryId === roleToIdUpdate) {
      //     return response.data;
      //   } else {
      //     return roles;
      //   }
      // });
      // setRoles(updatedRoles);
      setUpdateSuccess(true);
    closeModalUpdate();

    } catch (error) {
      console.error("There was an error updating the role!", error);
      setDuplicate(error.response.data);
      setTimeout(() => {
        setDuplicate(null)
      }, 3000);
    }

    console.log(phoneUserUpdate);
    console.log(nameUserUpdate);
    console.log(passUserUpdate);
    console.log(emailUserUpdate);
    console.log(dobUserUpdate);
    console.log(addressUserUpdate);
    console.log(roleIdUpdate);
  };

  const handleEditClick = (user) => {
    console.log(user);
    showAddFormUpdate();
    setNameUser(user.fullName)
    setPassUser(user.password)
    setAddressUser(user.address)
    setPhoneUser(user.phone)
    setEmailUser(user.email)
    setDobUser(user.dob)
    setRoleId(user.roleId)
    setIdUserUpdate(user.userName);
    setEditingPost(user);

    console.log(nameUser);
  };
  //--------------------------------
  //create us
  const handleCreate = async (values) => {
    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/Users`,
        {
          userName: values.ma,
          fullName: values.ten,
          password: values.pass,
          address: values.dc,
          phone: values.phone,
          email: values.email,
          dob: values.ns,
          level: values.level,
          status: "active",
          roleId: values.vaitro
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      formik.resetForm();
      console.log("User created successfully:", response.data);
      setAddSuccess(true);
      closeModal();
    } catch (error) {
      console.error("There was an error adding user!", error);
      setDuplicate(error.response.data);
      setTimeout(() => {
        setDuplicate(null)
      }, 3000);
    }
  };

  //--------------------------------
  //udate us

  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };

  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };

  //-----------------------------------------------
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Users/GetALL`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((users) => {
        setUser(users);
        setUsersCount(users.length);
      });
  }, [addSuccess]);

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Roles`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((roles) => {
        setRoles(roles);
      });
  }, []);
  const showAddForm = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  //----------------------------------------------------------------
  useEffect(() => {
    handleSearchCustomer();
  }, [nameUserSearch || addSuccess || updateSuccess || deleteSuccess]);

  const handleSearchCustomer = async () => {
    var url;
    try {
      url = `${config.API_ROOT}/api/Users/GetALL`;
      if (nameUserSearch !== "") {

        url = `${config.API_ROOT}/api/Users/get-users-by-fullname/${nameUserSearch}`
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data)
    } catch (error) {
      console.error('There was an error fetching the customer list!', error);
    }


  }
  //------------------------------------------------------------------
  return (
    <div className="col-10">
      {duplicate && (
        <div className="alert alert-danger position-fixed top-8 end-0 m-3 duplicateCss">
          {duplicate}
        </div>

      )}
      <div className="users">
        <div className={`alert alert-success position-fixed  notify-item-add-success ${addSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Thêm người dùng thành công
        </div>
        <div className={`alert alert-success position-fixed  notify-item-delete-success ${deleteSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Xóa người dùng thành công
        </div>
        <div className={`alert alert-success position-fixed  notify-item-update-success ${updateSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Cập nhật người dùng thành công
        </div>
        <div className="title">
          <p>Quản Lý Người Dùng</p>
        </div>

        <div className="tagResult">
          <div className="tagResultCustomer us">
            <div className="tagChild">
              <i className="fas fa-users"></i>
            </div>
            <h3>Số Người Dùng</h3>
            <p>{usersCount} Người Dùng</p>
          </div>
        </div>
        <div className="usersDetail">
          <p className="titlee">Danh sách Người Dùng</p>
          <div className="search">
            <input type="text"
              name="nameUserSearch"
              value={nameUserSearch}
              onChange={(e) => setNameUserSearch(e.target.value)} />
          </div>
          <button className="addUsers" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p>Thêm Mới Người Dùng</p>
          </button>
          <table className="tableUser ">
            <thead>
              <tr>
                {/* <th>STT</th> */}
                <th>Mã Người Dùng</th>
                <th>Tên Người Dùng</th>
                <th>Số Điện Thoại</th>
                <th>Email Người Dùng</th>
                <th>Địa Chỉ</th>
                <th>Ngày Sinh</th>
                <th>Hệ Số</th>
                <th>Vai Trò</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={index}>
                  {/* <td>{indexOfFirstItem + index + 1}</td> */}
                  <td>{user.userName}</td>
                  <td>{user.fullName}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{formatDateTime(user.dob)}</td>
                  <td>{user.level}</td>
                  <td>{user.roles.roleName}</td>
                  <td>
                    <div className="btn-group">
                      <i
                        className="btn btn-primary fas fa-edit update "
                        onClick={() => handleEditClick(user)}
                      ></i>
                      <i className="btn btn-danger fas fa-trash-alt delete" onClick={() => confirmDelete(user.userName)}></i>

                    </div>
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
      /**--------------------------------------------------------------- */
      <div className={`modal-user ${showModal ? "open" : ""}`}>
        <div className="modal-user-child">
          <div className="modal-user-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-user-headerr">
            <p>Tạo Người Dùng Mới</p>
          </header>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div className="modal-user-body">
                <div className="modal-user-body-left">
                  <label htmlFor="user-name" className="modal-user-label">
                    Tên Người Dùng
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    className="modal-user-input"
                    name="ten"
                    value={formik.values.ten}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />
                  {formik.touched.ten && formik.errors.ten ? (
                    <span className="error">{formik.errors.ten}</span>
                  ) : null}

                  <label htmlFor="user-phone" className="modal-user-label">
                    Ngày Sinh
                  </label>
                  <input
                    id="user-dob"
                    type="date"
                    className="modal-user-input"
                    name="ns"
                    value={formik.values.ns}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.ns && formik.errors.ns ? (
                    <span className="error">{formik.errors.ns}</span>
                  ) : null}

                  <label htmlFor="user-email" className="modal-user-label">
                    Số điện thoại
                  </label>
                  <input
                    id="user-phone"
                    type="text"
                    className="modal-user-input"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ví dụ: 0xxxxxxxxx"


                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <span className="error">{formik.errors.phone}</span>
                  ) : null}


                  <label htmlFor="user-address" className="modal-user-label">
                    Địa Chỉ
                  </label>
                  <input
                    id="user-address"
                    type="text"
                    className="modal-user-input"
                    name="dc"
                    value={formik.values.dc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ví dụ: Hà Nội"

                  />
                  {formik.touched.dc && formik.errors.dc ? (
                    <span className="error">{formik.errors.dc}</span>
                  ) : null}
                </div>

                <div className="modal-user-body-right">
                  <label htmlFor="user-id" className="modal-user-label">
                    Email
                  </label>
                  <input
                    id="user-email"
                    type="text"
                    className="modal-user-input"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ví dụ: user@gmail.com"

                  />
                  {formik.touched.email && formik.errors.email ? (
                    <span className="error">{formik.errors.email}</span>
                  ) : null}


                  <label htmlFor="user-role" className="modal-user-label nameVt">
                    Vai Trò
                    <div className="combobox create-combobox-user cc">
                      <select
                        className="vaiTroCus"
                        name="vaitro"
                        value={formik.values.vaitro}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="" defaultValue disabled>
                          Vai Trò
                        </option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.roleId}>{role.roleName}</option>
                        ))}
                      </select>

                    </div>
                  </label>
                  {formik.touched.vaitro && formik.errors.vaitro ? (
                    <span className="error vt">{formik.errors.vaitro}</span>
                  ) : null}
                  <label htmlFor="user-level" className="modal-user-label levelcc">
                    Level

                    <div className="combobox create-combobox-user">
                      <select
                        className="levelCbb"
                        name="level"
                        value={formik.values.level}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="" defaultValue disabled>
                          Level
                        </option>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>

                      </select>
                    </div>
                  </label>
                  {formik.touched.level && formik.errors.level ? (
                    <span className="error lv">{formik.errors.level}</span>
                  ) : null}

                  <label htmlFor="user-pass" className="modal-user-label xx">
                    Tên Đăng Nhập
                  </label>
                  <input
                    id="user-id"
                    type="text"
                    className="modal-user-input"
                    name="ma"
                    value={formik.values.ma}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Ví dụ: user123"

                  />
                  {formik.touched.ma && formik.errors.ma ? (
                    <span className="error">{formik.errors.ma}</span>
                  ) : null}




                  <label htmlFor="user-dob" className="modal-user-label">
                    Mật Khẩu
                  </label>
                  <input
                    id="user-pass"
                    type="password"
                    className="modal-user-input yy"
                    name="pass"
                    value={formik.values.pass}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}


                  />
                  {formik.touched.pass && formik.errors.pass ? (
                    <span className="error">{formik.errors.pass}</span>
                  ) : null}

                </div>
              </div>

              <button type="submit" id="create-user" className="modal-user-button">
                Tạo
              </button>
            </form>
          </div>
        </div>
      </div>
      /*------------------------------------------------------- */
      <div className={`modal-user-update ${showModalUpdate ? "open" : ""}`}>
        <div className="modal-user-child-update">
          <div className="modal-user-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-user-headerr-update">
            <p>Sửa Đổi Người Dùng</p>
          </header>
          <div>
            <form onSubmit={formikUpdate.handleSubmit}>
              <div className="modal-user-body-update">
                <div className="modal-user-body-left-update">
                  <label htmlFor="ten" className="modal-user-label-update">
                    Tên Người Dùng
                  </label>
                  <input
                    id="ten"
                    type="text"
                    className="modal-user-inpu-updatet"
                    name="ten"
                    value={formikUpdate.values.ten}
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}
                  />
                  {formikUpdate.touched.ten && formikUpdate.errors.ten ? (
                    <div className="errors">{formikUpdate.errors.ten}</div>
                  ) : null}

                  <label htmlFor="phone" className="modal-user-label-update">
                    Ngày Sinh
                  </label>
                  <input
                    id="user-dob"
                    type="date"
                    className="modal-user-input"
                    name="ns"
                    value={formikUpdate.values.ns}
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}
                  />
                  {formikUpdate.touched.ns && formikUpdate.errors.ns ? (
                    <div className="errors">{formikUpdate.errors.ns}</div>
                  ) : null}

                  <label htmlFor="email" className="modal-user-label-update">
                    Số Điện Thoại
                  </label>
                  <input
                    id="phone"
                    type="text"
                    className="modal-user-inpu-updatet"
                    name="phone"
                    value={formikUpdate.values.phone}
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}
                  />
                  {formikUpdate.touched.phone && formikUpdate.errors.phone ? (
                    <div className="errors">{formikUpdate.errors.phone}</div>
                  ) : null}

                  <label htmlFor="dc" className="modal-user-label-update">
                    Địa Chỉ
                  </label>
                  <input
                    id="dc"
                    type="text"
                    className="modal-user-inpu-updatet"
                    name="dc"
                    value={formikUpdate.values.dc}
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}
                  />
                  {formikUpdate.touched.dc && formikUpdate.errors.dc ? (
                    <div className="errors">{formikUpdate.errors.dc}</div>
                  ) : null}
                </div>

                <div className="modal-user-body-right-update">
                  <label htmlFor="vaitro" className="modal-user-label-update">
                    Vai Trò

                    <div className="combobox create-combobox-user-update ll">
                      <select
                        id="vaitro"
                        name="vaitro"
                        value={formikUpdate.values.vaitro}
                        onChange={formikUpdate.handleChange}
                        onBlur={formikUpdate.handleBlur}
                      >
                        <option value="" defaultValue disabled>
                          Vai Trò
                        </option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.roleId}>{role.roleName}</option>
                        ))}
                      </select>
                    </div>
                  </label>
                  {formikUpdate.touched.vaitro && formikUpdate.errors.vaitro ? (
                    <div className="errors">{formikUpdate.errors.vaitro}</div>
                  ) : null}

                  <label htmlFor="pass" className="modal-user-label-update xx">
                    Mật Khẩu
                  </label>
                  <input
                    id="pass"
                    type="text"
                    className="modal-user-inpu-updatet"
                    name="pass"
                    value={formikUpdate.values.pass}
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}
                  />
                  {formikUpdate.touched.pass && formikUpdate.errors.pass ? (
                    <div className="errors">{formikUpdate.errors.pass}</div>
                  ) : null}
                  <label htmlFor="ns" className="modal-user-label-update emaill">
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    className="modal-user-inpu-updatet"
                    name="email"
                    value={formikUpdate.values.email}
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}



                  />
                  {formikUpdate.touched.email && formikUpdate.errors.email ? (
                    <div className="errors">{formikUpdate.errors.email}</div>
                  ) : null}



                  <label htmlFor="level" className="modal-user-label level levell">
                    Level
                    <div className="combobox create-combobox-user">
                      <select
                        className="levelCbbb"
                        name="level"
                        value={formikUpdate.values.level}
                        onChange={formikUpdate.handleChange}
                        onBlur={formikUpdate.handleBlur}
                      >
                        <option value="" defaultValue disabled>
                          Level
                        </option>
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                      </select>
                    </div>
                  </label>

                  {formikUpdate.touched.level && formikUpdate.errors.level ? (
                    <div className="errors">{formikUpdate.errors.level}</div>
                  ) : null}
                </div>
              </div>
              <button  type="submit" id="create-user" className="modal-user-button">
                Cập Nhật
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
