import React, { useState, useEffect } from "react";
import "./Category.css";
import axios from "axios";
import config from "../config/config";
import { useFormik } from "formik";
import * as Yup from "yup";
function Category() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [goldIdSearch, setGoldIdSearch] = useState("");
  const [postToNameUpdate, setPostToNameUpdate] = useState("");
  const token = localStorage.getItem("token");

  const [tenDanhMuc, setTenDanhMuc] = useState("");

  const [updatedName, setUpdatedName] = useState("");
  const [postToIdUpdate, setPostToIdUpdate] = useState("");

  //-------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [nameDanhMuc, setNameDanhMuc] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingPost, setEditingPost] = useState([]);
  const [categoryCode, setCategoryCode] = useState([]);
  const [duplicate, setDuplicate] = useState("");


  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Category`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map(product => product.categoryCode.toString());
        console.log('Loaded product IDs:', ids);
        setCategoryCode(ids);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      categoryCode: ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Tên danh mục phải dài ít nhất 3 ký tự")
        .max(20, "Tên danh mục không được dài quá 20 ký tự")
        .matches(/^[a-zA-Z\sÀ-Ỹà-ỹ]*$/, "Tên danh mục không được chứa ký tự đặc biệt hoặc số")
        .required("Tên danh mục là bắt buộc"),
      categoryCode: Yup.string()
        .min(3, "Mã danh mục phải dài ít nhất 3 ký tự")
        .max(20, "Mã danh mục không được dài quá 20 ký tự")
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, "Tên danh mục không được chứa ký tự đặc biệt hoặc số")
        .required("Mã danh mục là bắt buộc")
      // .test('checkIdProduct', 'Mã danh mục tồn tại', function (value) {
      //   return !categoryCode.includes(value);
      // }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const formikUpdate = useFormik({
    initialValues: {
      name: "",
      categoryCode: ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Tên danh mục phải dài ít nhất 3 ký tự")
        .max(20, "Tên danh mục không được dài quá 20 ký tự")
        .matches(/^[a-zA-Z\sÀ-Ỹà-ỹ]*$/, "Tên danh mục không được chứa ký tự đặc biệt hoặc số")
        .required("Tên danh mục là bắt buộc"),
      categoryCode: Yup.string()
        .min(3, "Mã danh mục phải dài ít nhất 3 ký tự")
        .max(20, "Mã danh mục không được dài quá 20 ký tự")
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, "Tên danh mục không được chứa ký tự đặc biệt hoặc số")
        .required("Mã danh mục là bắt buộc")
      // .test('unique', 'Mã danh mục đã tồn tại', function(value) {
      //   return editingPost && editingPost.categoryCode === value || !categoryCode.includes(value);
      // }),
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
        name: editingPost.name,
        categoryCode: editingPost.categoryCode
      });
    }
  }, [editingPost]);
  useEffect(() => {
    setTimeout(() => {
      setAddSuccess(false);
    }, 3000);
  }, [addSuccess]);

  useEffect(() => {
    setTimeout(() => {
      setDeleteSuccess(false);
    }, 3000);
  }, [deleteSuccess]);

  useEffect(() => {
    setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);
  }, [updateSuccess]);
  //------------------------------------------------------------------
  //-------------------------------------------

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
  const confirmDelete = (cagetoryIdDelete) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      handleDelete(cagetoryIdDelete);
    }
  };
  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/Category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Cập nhật lại danh sách các vai trò sau khi xóa thành công
      const response = await axios.get(`${config.API_ROOT}/api/Category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
      setPostCount(response.data.length);
      setDeleteSuccess(true);
    } catch (error) {
      console.error("Xảy ra lỗi khi xóa danh mục!", error);
    }
  };
  //-------------------------------------------------------------
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Category/${postToIdUpdate}`,
        {
          code: formikUpdate.values.categoryCode,
          name: formikUpdate.values.name,
          status: "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the specific post in the posts state
      const updatedPosts = posts.map((post) => {
        if (post.categoryId === postToIdUpdate) {
          return response.data;
        } else {
          return post;
        }
      });

      formikUpdate.resetForm();

      setPosts(updatedPosts);
      setUpdateSuccess(true);
    closeModalUpdate();

    } catch (error) {
      console.error("There was an error updating the category!", error);
      setDuplicate(error.response.data);
      setTimeout(() => {
        setDuplicate(null)
      }, 3000);

    }
  };

  const handleEditClick = (post) => {
    showAddFormUpdate();
    setPostToIdUpdate(post.categoryId);
    setNameDanhMuc(post.name);
    handlePostClick(post.categoryId);
    setEditingPost(post);

  };
  const handlePostClick = (post) => {
    showAddFormUpdate();
  };

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((posts) => {
        setPosts(posts);
        setPostCount(posts.length);
      });
  }, [addSuccess]);

  //
  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/Category`,
        {
          categoryCode: formik.values.categoryCode,
          name: formik.values.name,
          status: "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      formik.resetForm();

      closeModal();
      setTenDanhMuc("");

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
  const showAddForm = () => {
    formik.resetForm();
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };
  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };

  //----------------------------------------------------------------
  useEffect(() => {
    handleSearchCustomer();
  }, [goldIdSearch || addSuccess || deleteSuccess || updateSuccess]);

  const handleSearchCustomer = async () => {
    var url;
    try {
      let url = `${config.API_ROOT}/api/Category`;
      if (goldIdSearch !== "") {
        url = `${config.API_ROOT}/api/Category/get-categories-by-name/${goldIdSearch}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("There was an error fetching the customer list!", error);
    }
  };
  //------------------------------------------------------------------

  return (
    <div className="col-10">
      {duplicate && (
        <div className="alert alert-danger position-fixed top-8 end-0 m-3 duplicateCss">
          {duplicate}
        </div>

      )}
      <div className="category">
        <div
          className={`alert alert-success position-fixed  notify-item-add-success align-items-center addCate ${addSuccess ? "open" : ""
            }`}
        >
          <i className="fas fa-check-circle me-2 dai" ></i>
          Thêm danh mục thành công
        </div>
        <div
          className={`alert alert-success position-fixed  notify-item-delete-success align-items-center deleteCate ${deleteSuccess ? "open" : ""
            }`}
        >
          <i className="fas fa-check-circle me-2"></i>
          Xóa danh mục thành công
        </div>
        <div
          className={`alert alert-success position-fixed  notify-item-update-success align-items-center updateCate ${updateSuccess ? "open" : ""
            }`}
        >
          <i className="fas fa-check-circle me-2 dai"></i>
          Cập nhật danh mục thành công
        </div>
        <div className="title">
          <p>Danh Mục</p>
        </div>
        <div className="tagResult">
          <div className="tagResultCategory">
            <div className="tagChild">
              <i class="fas fa-bars ass"></i>
            </div>
            <h3>Danh mục hiện có</h3>
            <p>{postCount} Danh mục</p>
          </div>
        </div>

        <div className="categoryDetail">
          <p>Quản lý danh mục</p>
          <div className="search">
            <input
              type="text"
              name="goldId"
              value={goldIdSearch}
              onChange={(e) => setGoldIdSearch(e.target.value)}
              placeholder="Tìm Kiếm"
            />
          </div>
          <button className="addCategory" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p>Thêm Mới Danh Mục</p>
          </button>

          <table className="tableCategory">
            <thead>
              <tr>
                {/* <th>STT</th> */}
                <th>Mã Danh Mục</th>
                <th>Tên Danh Mục</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((post, index) => (
                <tr key={index}>
                  {/* <td>{indexOfFirstItem + index + 1}</td> */}
                  <td>{post.categoryCode}</td>
                  <td>{post.name}</td>
                  <td>
                    <i
                      className="btn btn-primary fas fa-edit update "
                      onClick={() => handleEditClick(post)}
                    ></i>
                    <i
                      className="btn btn-danger fas fa-trash-alt delete ms-2"
                      onClick={() => confirmDelete(post.categoryId)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-l">
            {currentPage > 1 && (
              <button
                className="btn btn-primary"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            )}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`btn btn-primary ${currentPage === pageNumber ? "active" : ""
                  }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                className="btn btn-primary"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`modal-category ${showModal ? "open" : ""}`}>
        <div className="modal-child-category">
          <div className="modal-category-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-cagetory-headerr">
            <p>Thêm Mới Danh Mục</p>
          </header>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-category-body">
              <label htmlFor="name-category" className="model-category-label-update">
                Mã Danh Mục
              </label>
              <input
                id="name-category"
                type="text"
                className="modal-category-input"
                name="categoryCode"
                value={formik.values.categoryCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: LSP000x"

              />
              {formik.touched.categoryCode && formik.errors.categoryCode ? (
                <span className="error ercate">{formik.errors.categoryCode}</span>
              ) : null}
              <label htmlFor="name-category" className="model-category-label-update">
                Tên Danh Mục
              </label>
              <input
                id="name-category"
                type="text"
                className="modal-category-input"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: Lắc tay"

              />
              {formik.touched.name && formik.errors.name ? (
                <span className="error ercate" >{formik.errors.name}</span>
              ) : null}
              <button type="submit" id="create-category" >
                Tạo
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`modal-category-update ${showModalUpdate ? "open" : ""}`}>
        <div className="modal-child-category-update">
          <div
            className="modal-category-close-update"
            onClick={closeModalUpdate}
          >
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-cagetory-headerr-update">
            <p>Cập Nhật Thông Tin Danh Mục</p>
          </header>
          <form onSubmit={formikUpdate.handleSubmit}>
            <div className="modal-category-body-update">
              <label htmlFor="name-category" className="model-category-label-update">
                Mã Danh Mục
              </label>
              <input
                id="name-category"
                type="text"
                className="modal-category-input"
                name="categoryCode"
                value={formikUpdate.values.categoryCode}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
                placeholder="Ví dụ: LSP000x"

              />
              {formikUpdate.touched.categoryCode && formikUpdate.errors.categoryCode ? (
                <span className="error ercate">{formikUpdate.errors.categoryCode}</span>
              ) : null}
              <label
                htmlFor="name-category"
                className="model-category-label-update"
              >
                Tên Danh Mục
              </label>
              <input
                id="name-category"
                type="text"
                className="modal-category-input-update"
                name="name"
                value={formikUpdate.values.name}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
                placeholder="Ví dụ: Lắc tay"

              />
              {formikUpdate.touched.name && formikUpdate.errors.name ? (
                <span className="error ercate">{formikUpdate.errors.name}</span>
              ) : null}
              <button type="submit" id="create-category-update" >
                Cập Nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Category;
