import React, { useState, useEffect } from "react";
import axios from "axios";
import numeral from 'numeral';

import "./Stone.css";
import config from "../config/config";
import { useFormik } from "formik";
import * as Yup from "yup";
function Stone() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState([]);
  const [goldIdSearch, setGoldIdSearch] = useState("");
  const [editingPost, setEditingPost] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [duplicate, setDuplicate] = useState("");
  const [formattedInputValue, setFormattedInputValue] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, '');
    const formattedValue = numeral(rawValue).format('0,0');
    formik.setFieldValue(name, rawValue);
    setFormattedInputValue(formattedValue);
  };
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Product?pageNumber=1&pageSize=1000`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map(product => product.productCode.toString());
        console.log('Loaded product IDs:', ids);
        setProductIds(ids);
        setProducts(data);
      });
  }, []);


  const token = localStorage.getItem("token");
  //-------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);


  const formik = useFormik({
    initialValues: {
      code: "",
      tenDa: "",
      loaiDa: "",
      giaDa: 0,
      mauDa: "",
      daChinh: "",
      idProduct: ""
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .matches(/^D\d{4}$/, 'Mã đá phải bắt đầu bằng D và theo sau là 4 chữ số')
        .required('Mã đá là bắt buộc'),
      tenDa: Yup.string()
        .min(3, 'Tên đá phải dài ít nhất 3 ký tự')
        .max(30, 'Tên đá không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, 'Tên đá không được chứa ký tự đặc biệt hoặc số')
        .required('Tên đá là bắt buộc'),
      loaiDa: Yup.string()
        .min(3, 'Loại đá phải dài ít nhất 3 ký tự')
        .max(30, 'Loại đá không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, 'Loại loại vàng không được chứa ký tự đặc biệt hoặc số')
        .required('Loại đá là bắt buộc'),
      giaDa: Yup.number()
        .min(0, 'Giá đá tối thiểu là 0 VND')
        .max(100000000, 'Giá đá tối đa là 100,000,000 VND')
        .required('Giá mua là bắt buộc'),
      mauDa: Yup.string()
        .min(2, 'Màu đá phải dài ít nhất 2 ký tự')
        .max(30, 'Màu đá không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, 'Màu đá không được chứa ký tự đặc biệt hoặc số')
        .required('Màu đá là bắt buộc'),
      daChinh: Yup.string()
        .min(3, 'Tên đá phải dài ít nhất 3 ký tự')
        .max(30, 'Tên đá không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z\s]+$/, 'Tên loại vàng không được chứa ký tự đặc biệt hoặc số')
        .required('Đá chính là bắt buộc'),
      idProduct: Yup.string()
        .min(1, 'Mã sản phẩm phải dài ít nhất 1 ký tự')
        .max(30, 'Mã sản phẩm không được dài quá 30 ký tự')
        .required('Mã sản phẩm là bắt buộc')
        .test('checkIdProduct', 'Mã sản phẩm không tồn tại', function (value) {
          return productIds.includes(value);
        })
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const formikUpdate = useFormik({
    initialValues: {
      code: "",
      tenDa: "",
      loaiDa: "",
      giaDa: 0,
      mauDa: "",
      daChinh: postToUpdate.isPrimary,
      idProduct: ""
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .matches(/^D\d{4}$/, 'Mã đá phải bắt đầu bằng D và theo sau là 4 chữ số')
        .required('Mã đá là bắt buộc'),
      tenDa: Yup.string()
        .min(3, 'Tên đá phải dài ít nhất 3 ký tự')
        .max(30, 'Tên đá không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z\sÀ-Ỹà-ỹ]*$/, 'Tên đá không được chứa ký tự đặc biệt hoặc số')
        .required('Tên đá là bắt buộc'),
      loaiDa: Yup.string()
        .min(3, 'Loại đá phải dài ít nhất 3 ký tự')
        .max(30, 'Loại đá không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z\sÀ-Ỹà-ỹ]*$/, 'Loại đá không được chứa ký tự đặc biệt hoặc số')
        .required('Loại đá là bắt buộc'),
      giaDa: Yup.number()
        .min(0, 'Giá đá tối thiểu là 0 VND')
        .max(100000000, 'Giá đá tối đa là 100,000,000 VND')
        .required('Giá mua là bắt buộc'),
      mauDa: Yup.string()
        .min(2, 'Màu đá phải dài ít nhất 2 ký tự')
        .max(30, 'Màu đá không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z\sÀ-Ỹà-ỹ]*$/, 'Màu đá không được chứa ký tự đặc biệt hoặc số')
        .required('Màu đá là bắt buộc'),
      daChinh: Yup.string()
        .oneOf(['true', 'false'], 'Đá chính phải là "Đúng" hoặc "Không"')
        .required('Đá chính là bắt buộc'),
      idProduct: Yup.string()
        .min(1, 'Mã sản phẩm phải dài ít nhất 1 ký tự')
        .max(30, 'Mã sản phẩm không được dài quá 30 ký tự')
        .required('Mã sản phẩm là bắt buộc')
        .test('checkIdProduct', 'Mã sản phẩm không tồn tại', function (value) {
          return productIds.includes(value);
        })
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
        code: editingPost.stoneCode,
        tenDa: editingPost.name,
        loaiDa: editingPost.type,
        giaDa: editingPost.price,
        mauDa: editingPost.color,
        daChinh: editingPost.isPrimary,
        idProduct: editingPost.products?.productCode
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

  const handleUpdate = async (values) => {
    try {
      console.log(values);
      const payload = {
        stoneCode: values.code,
        productCode: values.idProduct,
        name: values.tenDa,
        type: values.loaiDa,
        price: values.giaDa,
        color: values.mauDa,
        isPrimary: values.daChinh == "true" ? true : false,
        status: "active"
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      console.log("payload:    " + typeof (payload.isPrimary));

      const response = await axios.put(
        `https://kimnganhoanbeta.azurewebsites.net/api/Stones/${postToUpdate.stoneId}`,
        payload,
        config
      );

      console.log("Response Data:", response.data);

      const updatedPosts = posts.map((post) => {
        if (post.stoneId === postToUpdate.stoneId) {
          return response.data;
        } else {
          return post;
        }
      });

      setPosts(updatedPosts);
      setUpdateSuccess(true);
      closeModalUpdate();
    } catch (error) {
      console.error("There was an error updating the stone!", error);
      setDuplicate(error.response.data);
      setTimeout(() => {
        setDuplicate(null)
      }, 3000);
    }
  };

  const confirmDelete = (stoneIdDelete) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại đá này không?")) {
      handleDelete(stoneIdDelete);
    }
  };
  const handleDelete = async (roleId) => {
    try {
      await axios.delete(
        `${config.API_ROOT}/api/Stones/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(
        `${config.API_ROOT}/api/Stones`,
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
      console.error("Xảy ra lỗi khi xóa vai trò!", error);
    }
  };

  const fetchStones = async () => {
    fetch(`${config.API_ROOT}/api/Stones`,
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
  }

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Stones`,
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
  }, [postCount]);

  const handleCreate = async (values) => {
    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/Stones`,
        {
          stoneCode: values.code,
          productCode: values.idProduct,
          name: values.tenDa,
          type: values.loaiDa,
          price: values.giaDa,
          color: values.mauDa,
          isPrimary: values.daChinh.toLowerCase() == 'true'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        formik.resetForm();
        console.log("Stone created successfully:", response.data);
        setAddSuccess(true);
        fetchStones();
      }
      closeModal();
      setFormattedInputValue('');
    } catch (error) {
      console.error("There was an error adding stone!", error);
      setDuplicate(error.response.data);
      setTimeout(() => {
        setDuplicate(null)
      }, 3000);
    }

  };
  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };


  const handleEditClick = (post) => {
    setPostToUpdate(post);
    showAddFormUpdate();
    setEditingPost(post);
  };

  const showAddForm = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    formik.resetForm();
    setShowModal(false);
    setFormattedInputValue('');

  };
  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };
  //----------------------------------------------------------------
  useEffect(() => {
    handleSearchCustomer()
  }, [goldIdSearch || deleteSuccess || addSuccess || updateSuccess])

  const handleSearchCustomer = async () => {
    var url;
    try {
      let url = `${config.API_ROOT}/api/Stones`;
      if (goldIdSearch !== "") {
        console.log(goldIdSearch);
        url = `${config.API_ROOT}/api/Stones/get-stones-by-name${goldIdSearch}`;
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
  //------------------------------------------------------------------
  return (
    <div className="col-10">
      {duplicate && (
        <div className="alert alert-danger position-fixed top-8 end-0 m-3 duplicateCss">
          {duplicate}
        </div>

      )}
      <div className="stone">
        <div className={`alert alert-success position-fixed align-items-center  notify-item-add-success addStoneSuccess ${addSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Thêm đá thành công
        </div>
        <div className={`alert alert-success position-fixed align-items-center notify-item-delete-success updateStoneSuccess ${deleteSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Xóa đá thành công
        </div>
        <div className={`alert alert-success position-fixed align-items-center notify-item-update-success deleteStoneSuccess ${updateSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Cập nhật đá thành công
        </div>
        <div className="title ">
          <p>Đá</p>
        </div>
        <div className="tagResult">
          <div className="tagResultStone">
            <div className="tagChild">
              <i className="far fa-gem"></i>
            </div>
            <h3> Tổng số đá hiện có</h3>
            <p>{postCount} viên đá</p>
          </div>
        </div>

        <div className="stoneDetail">
          <p>Quản lý đá</p>
          <div className="search">
            <input type="text"
              name="goldId"
              value={goldIdSearch}
              onChange={(e) => setGoldIdSearch(e.target.value)}
              placeholder="Tìm Kiếm" />
          </div>
          <button className="addStone" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p>Thêm Mới Đá</p>
          </button>

          <table className="tableStone">
            <thead>
              <tr>
                {/* <th>STT</th> */}
                <th>Mã Đá</th>
                <th>Tên Đá</th>
                <th>Loại Đá</th>
                <th>Màu Đá</th>
                <th>Giá Đá</th>
                <th>Mã Sản Phẩm</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((post, index) => (
                <tr key={index}>
                  {/* <td>{indexOfFirstItem + index + 1}</td> */}
                  <td>{post.stoneCode}</td>
                  <td>{post.name}</td>
                  <td>{post.type}</td>
                  <td>{post.color}</td>
                  <td>{numeral(post.price).format("0,0")} VND</td>
                  <td>{post.products.productCode}</td>
                  <td>
                    <i
                      className="btn btn-primary fas fa-edit update "
                      onClick={() => handleEditClick(post)}
                    ></i>
                    <i
                      className="btn btn-danger fas fa-trash-alt delete ms-2"
                      onClick={() => confirmDelete(post.stoneId)}
                    ></i>
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
      <div className={`modal-stone ${showModal ? "open" : ""}`}>
        <div className="modal-stone-child">
          <div className="modal-stone-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-stone-headerr">
            <p>Thêm Mới Đá</p>
          </header>
          <form onSubmit={formik.handleSubmit} className="inputAdd">
            <div className="modal-stone-body">
              <label htmlFor="code" className="modal-stone-label">Mã Đá</label>
              <input
                id="code"
                type="text"
                className="modal-stone-input"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: Dxxxx"

              />
              {formik.touched.code && formik.errors.code ? (
                <span className="error">{formik.errors.code}</span>
              ) : null}

              <label htmlFor="name" className="modal-stone-label">Tên Đá</label>
              <input
                id="name"
                type="text"
                className="modal-stone-input"
                name="tenDa"
                value={formik.values.tenDa}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: Đá Sa Phia"

              />
              {formik.touched.tenDa && formik.errors.tenDa ? (
                <span className="error">{formik.errors.tenDa}</span>
              ) : null}

              <label htmlFor="type" className="modal-stone-label">Loại Đá</label>
              <input
                id="type"
                type="text"
                className="modal-stone-input"
                name="loaiDa"
                value={formik.values.loaiDa}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: Đá quý"

              />
              {formik.touched.loaiDa && formik.errors.loaiDa ? (
                <span className="error">{formik.errors.loaiDa}</span>
              ) : null}

              <div className="priceDaContainer">
                <label htmlFor="price" className="modal-stone-label priceDa">Giá Đá</label>

                <input
                  type="text"
                  id="price"
                  name="giaDa"
                  className="modal-stone-input"
                  value={formattedInputValue}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ví dụ: 1,200,000"

                />
                {formik.touched.giaDa && formik.errors.giaDa ? (
                  <span className="error">{formik.errors.giaDa}</span>
                ) : null}
              </div>

              <label htmlFor="color" className="modal-stone-label">Màu Đá</label>
              <input
                id="color"
                type="text"
                className="modal-stone-input"
                name="mauDa"
                value={formik.values.mauDa}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: Đỏ"

              />
              {formik.touched.mauDa && formik.errors.mauDa ? (
                <span className="error mb-2">{formik.errors.mauDa}</span>
              ) : null}

              <label htmlFor="isPrimary" className="modal-stone-label daChinh mb-2 mt-2">Là đá chính:
                <div className="combobox create-combobox-stone">
                  <select
                    className="ms-4 combo-box-stone combo-box-stone-primary"
                    name="daChinh"
                    value={formik.values.daChinh}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}

                  >

                    <option value="" defaultValue disabled>
                      Chọn
                    </option>
                    <option value={true}>Đúng</option>
                    <option value={false}>Không</option>
                  </select>
                </div>
              </label>
              {formik.touched.daChinh && formik.errors.daChinh ? (
                <span className="error daChinh-error">{formik.errors.daChinh}</span>
              ) : null}

              <label htmlFor="idProduct" className="modal-stone-label mt-3 masanpham">Mã sản phẩm:</label>
              <select
                id="idProduct"
                className="combobox-product combo-box-stone"
                name="idProduct"
                value={formik.values.idProduct}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" defaultValue disabled>
                  Chọn
                </option>
                {products.map((product) => (
                  <option key={product.productCode} value={product.productCode}>
                    {product.productCode}
                  </option>
                ))}
              </select>
              {formik.touched.idProduct && formik.errors.idProduct ? (
                <span className="error product-error">{formik.errors.idProduct}</span>
              ) : null}


              <button id="create-stone" type="submit">Tạo</button>
            </div>
          </form>
        </div>
      </div>

      <div className={`modal-stone-update ${showModalUpdate ? "open" : ""}`}>
        <div className="modal-stone-child-update">
          <div className="modal-stone-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-stone-headerr-update">
            <p>Cập Nhật Thông Tin Loại Đá</p>
          </header>
          <form onSubmit={formikUpdate.handleSubmit}>
            <div className="modal-stone-body-update">
              <label htmlFor="code" className="modal-stone-label">Mã Đá</label>
              <input
                id="code"
                type="text"
                className="modal-stone-input"
                name="code"
                value={formikUpdate.values.code}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
              />
              {formikUpdate.touched.code && formikUpdate.errors.code ? (
                <span className="error">{formikUpdate.errors.code}</span>
              ) : null}

              <label htmlFor="tenDa" className="modal-stone-label-update">Tên Đá</label>
              <input
                id="tenDa"
                type="text"
                className="modal-stone-input-update"
                name="tenDa"
                value={formikUpdate.values.tenDa}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
              />
              {formikUpdate.touched.tenDa && formikUpdate.errors.tenDa ? (
                <span className="error">{formikUpdate.errors.tenDa}</span>
              ) : null}

              <label htmlFor="loaiDa" className="modal-stone-label-update">Loại Đá</label>
              <input
                id="loaiDa"
                type="text"
                className="modal-stone-input-update"
                name="loaiDa"
                value={formikUpdate.values.loaiDa}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
              />
              {formikUpdate.touched.loaiDa && formikUpdate.errors.loaiDa ? (
                <span className="error">{formikUpdate.errors.loaiDa}</span>
              ) : null}

              <div className="priceDaContainer">
                <label htmlFor="giaDa" className="modal-stone-label-update priceDa">Giá Đá</label>
                <input
                  id="giaDa"
                  type="number"
                  className="modal-stone-input-update"
                  name="giaDa"
                  value={formikUpdate.values.giaDa}
                  onChange={formikUpdate.handleChange}
                  onBlur={formikUpdate.handleBlur}
                />
                {formikUpdate.touched.giaDa && formikUpdate.errors.giaDa ? (
                  <span className="error">{formikUpdate.errors.giaDa}</span>
                ) : null}
              </div>

              <label htmlFor="mauDa" className="modal-stone-label-update">Màu Đá</label>
              <input
                id="mauDa"
                type="text"
                className="modal-stone-input-update"
                name="mauDa"
                value={formikUpdate.values.mauDa}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
              />
              {formikUpdate.touched.mauDa && formikUpdate.errors.mauDa ? (
                <span className="error">{formikUpdate.errors.mauDa}</span>
              ) : null}

              <label htmlFor="isPrimary" className="modal-stone-label daChinh mb-2 mt-2">Là đá chính:
                <div className="combobox create-combobox-stone">
                  <select
                    className="ms-4 combo-box-stone combo-box-stone-primary"
                    name="daChinh"
                    value={formikUpdate.values.daChinh}
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}
                  >
                    <option value="" defaultValue disabled>
                      Chọn
                    </option>
                    <option value={true}>Đúng</option>
                    <option value={false}>Không</option>
                  </select>
                </div>
              </label>
              {formikUpdate.touched.daChinh && formikUpdate.errors.daChinh ? (
                <span className="error daChinh-error">{formikUpdate.errors.daChinh}</span>
              ) : null}

              <label htmlFor="idProduct" className="modal-stone-label mt-3 masanpham">Mã sản phẩm:</label>
              <select
                id="idProduct"
                className="combobox-product combo-box-stone"
                name="idProduct"
                value={formikUpdate.values.idProduct}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
              >
                <option value="" defaultValue disabled>
                  Chọn
                </option>
                {products.map((product) => (
                  <option key={product.productCode} value={product.productCode}>
                    {product.productCode}
                  </option>
                ))}
              </select>
              {formikUpdate.touched.idProduct && formikUpdate.errors.idProduct ? (
                <span className="error product-error">{formikUpdate.errors.idProduct}</span>
              ) : null}

              <button id="create-stone-update" type="submit">Cập Nhật</button>
            </div>
          </form>

        </div>

      </div >
    </div >
  );
}
export default Stone;
