import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Gold.css";
import config from "../config/config";
import numeral from 'numeral';
import { useFormik } from "formik";
import * as Yup from "yup";

function Gold() {
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);

  const [postToUpdate, setPostToUpdate] = useState(null);
  const [goldIdSearch, setGoldIdSearch] = useState("");

  const [tenVang, setTenVang] = useState("");
  const [giaBan, setGiaBan] = useState(0);
  const [giaMua, setgiaMua] = useState(0);
  //------------------------------------------
  const [postToIdUpdate, setPostToIdUpdate] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPriceSell, setUpdatedPriceSell] = useState("");
  const [updatedPriceBuy, setUpdatedPriceBuy] = useState("");
  const token = localStorage.getItem("token");
  //-------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [goldNameUpdate, setGoldNameUpdate] = useState("");
  const [goldSellUpdate, setGoldSellUpdate] = useState("");
  const [goldBuyUpdate, setGoldBuyUpdate] = useState("");
  const [editingPost, setEditingPost] = useState([]);
  const [duplicate, setDuplicate] = useState("");
  const [goldCodee, setGoldCode] = useState([]);
  const [formattedInputValue, setFormattedInputValue] = useState('');
  const [formattedInputValue2, setFormattedInputValue2] = useState('');
  const [formattedInputValue3, setFormattedInputValue3] = useState('');


  const formatedInputNumber = (input) => {
    return numeral(input).format('0,0');
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, '');
    const formattedValue = numeral(rawValue).format('0,0');
    formik.setFieldValue(name, rawValue);
    setFormattedInputValue(formattedValue);
  };
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, '');
    const formattedValue = numeral(rawValue).format('0,0');
    formik.setFieldValue(name, rawValue);
    setFormattedInputValue2(formattedValue);
  };
  const handleChange3 = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, '');
    const formattedValue = numeral(rawValue).format('0,0');
    formik.setFieldValue(name, rawValue);
    setFormattedInputValue3(formattedValue);
  };
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/GoldTypes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map(product => product.goldCode.toString());
        console.log('Loaded product IDs:', ids);
        setGoldCode(ids);
      });
  }, []);
  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      giaBan: 0,
      giaMua: 0,
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .matches(/^V\d{4}$/, 'Mã loại vàng phải bắt đầu bằng V và theo sau là 4 chữ số')
        .required('Mã loại vàng là bắt buộc')
      // .test('checkGoldCode', 'Mã loại vàng đã tồn tại', function (value) {
      //   return !goldCodee.includes(value);
      // }),
      ,
      name: Yup.string()
        .min(3, 'Tên loại vàng phải dài ít nhất 3 ký tự')
        .max(30, 'Tên loại vàng không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, 'Tên loại vàng không được chứa ký tự đặc biệt')
        .required('Tên loại vàng là bắt buộc'),
      giaMua: Yup.number()
        .min(1000000, 'Giá mua tối thiểu là 1,000,000 VND')
        .max(100000000, 'Giá mua tối đa là 100 triệu đồng')
        .required('Giá mua là bắt buộc'),
      giaBan: Yup.number()
        .min(1000000, 'Giá bán tối thiểu là 1,000,000 VND')
        .max(100000000, 'Giá bán tối đa là 100,000,000 VND')
        .required('Giá bán là bắt buộc')
        .test('is-greater-than-giaMua', 'Giá bán phải lớn hơn giá mua', function (value) {
          const { giaMua } = this.parent;
          return giaMua ? value > giaMua : true;
        }),

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
      name: "",
      giaBan: 0,
      giaMua: 0,
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .matches(/^V\d{4}$/, 'Mã loại vàng phải bắt đầu bằng V và theo sau là 4 chữ số')
        .required('Mã loại vàng là bắt buộc'),
      name: Yup.string()
        .min(3, 'Tên loại vàng phải dài ít nhất 3 ký tự')
        .max(30, 'Tên loại vàng không được dài quá 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, 'Tên loại vàng không được chứa ký tự đặc biệt')
        .required('Tên loại vàng là bắt buộc'),
      giaMua: Yup.number()
        .min(1000000, 'Giá mua tối thiểu là 1,000,000 VND')
        .max(100000000, 'Giá mua tối đa là 100 triệu đồng')
        .required('Giá mua là bắt buộc'),
      giaBan: Yup.number()
        .min(1000000, 'Giá bán tối thiểu là 1,000,000 VND')
        .max(100000000, 'Giá bán tối đa là 100,000,000 VND')
        .required('Giá bán là bắt buộc')
        .test('is-greater-than-giaMua', 'Giá bán phải lớn hơn giá mua', function (value) {
          const { giaMua } = this.parent;
          return giaMua ? value > giaMua : true;
        }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleUpdate(values);
      // console.log("xxx"+goldSellUpdate);

    },
  });
  useEffect(() => {
    if (editingPost) {
      formikUpdate.setValues({
        code: editingPost.goldCode,
        name: editingPost.goldName,
        giaBan: editingPost.sellPrice,
        giaMua: editingPost.buyPrice,
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
  const confirmDelete = (goldIdDelete) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại vàng này không?")) {
      handleDelete(goldIdDelete);
    }
  };
  const handleDelete = async (roleId) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/GoldTypes/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(`${config.API_ROOT}/api/GoldTypes`,
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
      console.error('Xảy ra lỗi khi xóa vai trò!', error);
    }
  };
  //-------------------------------------------

  //------------------------------------------------------------
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/GoldTypes/${postToIdUpdate}`,
        {
          goldCode: formikUpdate.values.code,
          goldName: formikUpdate.values.name,
          sellPrice: formikUpdate.values.giaBan,
          buyPrice: formikUpdate.values.giaMua,
          status: "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the specific post in the posts state
      const updatedPosts = posts.map((post) => {
        if (post.goldId === postToIdUpdate) {
          return response.data;
        } else {
          return post;
        }
      });
      formikUpdate.resetForm();


      setUpdateSuccess(true);
      closeModalUpdate();
    } catch (error) {
      setDuplicate(error.response.data);
      setTimeout(() => {
        setDuplicate(false);
      }, 3000)
      console.error("There was an error updating the category!", error);
    }


  };

  //------------------------------------------
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/GoldTypes`,
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
  }, [addSuccess || deleteSuccess]);
  //--

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/GoldTypes`,
        {
          goldCode: formik.values.code,
          goldName: formik.values.name,
          sellPrice: formik.values.giaBan,
          buyPrice: formik.values.giaMua,
          status: "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      formik.resetForm();

      closeModal();
      setTenVang("");
      setGiaBan(0);
      setgiaMua(0);
      setFormattedInputValue('');
      setFormattedInputValue2('');
      console.log("Gold created successfully:", response.data);
      setAddSuccess(true);
    } catch (error) {
      setDuplicate(error.response.data);
      setTimeout(() => {
        setDuplicate(false);
      }, 3000)
      console.error("There was an error adding gold!", error);
    }
  };
  const showAddForm = () => {
    formik.resetForm();
    setShowModal(true);
  };
  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };


  const handleEditClick = (post) => {
    setPostToIdUpdate(post.goldId);
    setEditingPost(post);
    showAddFormUpdate();
  };

  const closeModal = () => {
    formik.resetForm();
    setShowModal(false);
    setFormattedInputValue('');
    setFormattedInputValue2('');
  };
  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };
  //-------------------------------------------------------------

  //----------------------------------------------------------------
  useEffect(() => {
    handleSearchCustomer();
  }, [goldIdSearch || deleteSuccess || addSuccess || updateSuccess]);

  const handleSearchCustomer = async () => {
    var url;
    try {
      url = `${config.API_ROOT}/api/GoldTypes`;
      if (goldIdSearch !== "") {

        url = `${config.API_ROOT}/api/GoldTypes/get-gold-type-by-name/${goldIdSearch}`
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
  };
  //------------------------------------------------------------------
  return (
    <div className="col-10">
      {duplicate && (
        <div className="alert alert-danger position-fixed top-8 end-0 m-3 duplicateCss">
          {duplicate}
        </div>

      )}
      <div className="gold">
        <div className={`alert alert-success position-fixed align-items-center  notify-item-add-success addGoldss ${addSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Thêm loại vàng thành công
        </div>

        <div className={`alert alert-success position-fixed align-items-center notify-item-delete-success deleteGoldss ${deleteSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i> Xóa loại vàng thành công
        </div>
        <div className={`alert alert-success position-fixed align-items-center notify-item-update-success updateGoldss ${updateSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Cập nhật loại vàng thành công
        </div>
        <div className="title title-gold-a">
          <p>Loại Vàng</p>
        </div>
        <div className="tagResult">
          <div className="tagResultGold">
            <div className="tagChild">
              <i className="fas fa-coins"></i>
            </div>
            <h3>Loại vàng hiện có</h3>
            <p>{postCount} loại vàng</p>
          </div>
        </div>

        <div className="goldDetail">
          <p>Quản lý loại vàng</p>
          <div className="search">
            <input
              type="text"
              name="goldId"
              value={goldIdSearch}
              onChange={(e) => setGoldIdSearch(e.target.value)}
              placeholder="Tìm Kiếm"
            />

          </div>
          <button className="addGold" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p>Thêm mới loại vàng</p>
          </button>
          <h6 className="donvitinh-gold">*Đơn vị tính: VND/Chỉ</h6>
          <table className="tableGold">
            <thead>
              <tr>
                {/* <th>STT</th> */}
                <th>Mã Loại Vàng</th>
                <th>Tên Loại Vàng</th>
                <th>Giá Mua</th>
                <th>Giá Bán</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((post, index) => (
                <tr key={index}>
                  {/* <td>{indexOfFirstItem + index + 1}</td> */}
                  <td>{post.goldCode}</td>
                  <td>{post.goldName}</td>
                  <td>{numeral(post.buyPrice).format("0,0")} VND</td>
                  <td>{numeral(post.sellPrice).format("0,0")} VND</td>
                  <td className="thaoTac">
                    <i
                      className="btn btn-primary fas fa-edit update "
                      onClick={() => handleEditClick(post)}
                    ></i>
                    <i className="btn btn-danger fas fa-trash-alt delete ms-2" onClick={() => confirmDelete(post.goldId)}></i>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
          <div className="pagination-l ptg">
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
      <div className={`modal-gold ${showModal ? "open" : ""}`}>
        <div className="modal-gold-child">
          <div className="modal-gold-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-gold-headerr">
            <p>Thêm Mới Loại Vàng</p>
          </header>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-gold-body ">

              <label htmlFor="code" className="modal-gold-label">Mã Loại Vàng</label>
              <input
                id="code"
                type="text"
                className="modal-gold-input"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: V1234"
              />
              {formik.touched.code && formik.errors.code ? (
                <span className="error">{formik.errors.code}</span>
              ) : null}


              <label htmlFor="name" className="modal-gold-label">Tên Loại Vàng</label>
              <input
                id="name"
                type="text"
                className="modal-gold-input"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ví dụ: Vàng 18k"
              />
              {formik.touched.name && formik.errors.name ? (
                <span className="error">{formik.errors.name}</span>
              ) : null}

              <div className="input-container">
                <label htmlFor="priceBuy" className="modal-gold-label">Giá Mua</label>

                <input
                  type="text"
                  id="priceBuy"
                  name="giaMua"
                  className="modal-gold-input"
                  value={formattedInputValue}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Ví dụ: 4,200,000"

                />
                {formik.touched.giaMua && formik.errors.giaMua ? (
                  <span className="error">{formik.errors.giaMua}</span>
                ) : null}
              </div>

              <div className="input-container">
                <label htmlFor="priceSell" className="modal-gold-label">Giá Bán</label>

                <input
                  type="text"
                  id="priceSell"
                  name="giaBan"
                  className="modal-gold-input"
                  value={formattedInputValue2}
                  onChange={handleChange2}
                  onBlur={formik.handleBlur}
                  placeholder="Ví dụ: 5,200,000"
                />
                {formik.touched.giaBan && formik.errors.giaBan ? (
                  <span className="error">{formik.errors.giaBan}</span>
                ) : null}
              </div>


              <button type="submit" className="create-gold" >
                Tạo
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={`modal-gold-update ${showModalUpdate ? "open" : ""}`}>
        <div className="modal-gold-child-update">
          <div className="modal-gold-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-gold-headerr-update">
            <p>Cập Nhật Thông Tin Loại Vàng</p>
          </header>
          <form onSubmit={formikUpdate.handleSubmit}>
            <div className="modal-gold-body-update ">
              <label htmlFor="code" className="modal-gold-label-update">
                Mã Loại Vàng
              </label>
              <input
                id="code"
                type="text"
                className="modal-gold-input-update"
                name="code"
                value={formikUpdate.values.code}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
                placeholder="Ví dụ: V1234"

              />
              {formikUpdate.touched.code && formikUpdate.errors.code ? (
                <span className="error">{formikUpdate.errors.code}</span>
              ) : null}

              <label htmlFor="name" className="modal-gold-label-update">
                Tên Loại Vàng
              </label>
              <input
                id="name"
                type="text"
                className="modal-gold-input-update"
                name="name"
                value={formikUpdate.values.name}
                onChange={formikUpdate.handleChange}
                onBlur={formikUpdate.handleBlur}
                placeholder="Ví dụ: Vàng 18k"

              />
              {formikUpdate.touched.name && formikUpdate.errors.name ? (
                <span className="error">{formikUpdate.errors.name}</span>
              ) : null}
              <div className="input-container">
                <label htmlFor="priceBuy" className="modal-gold-label-update">
                  Giá Mua
                </label>
                <input
                  id="priceBuy"
                  type="text"
                  className="modal-gold-input-update"
                  name="giaMua"
                  value={formikUpdate.values.giaMua}
                  onChange={formikUpdate.handleChange}
                  onBlur={formikUpdate.handleBlur}
                />
                {formikUpdate.touched.giaMua && formikUpdate.errors.giaMua ? (
                  <span className="error">{formikUpdate.errors.giaMua}</span>
                ) : null}
              </div>
              <div className="input-container">

                <label htmlFor="priceSell" className="modal-gold-label-update">
                  Giá Bán
                </label>
                <input
                  id="priceSell"
                  type="text"
                  className="modal-gold-input-update"
                  name="giaBan"
                  value={formikUpdate.values.giaBan}
                  onChange={formikUpdate.handleChange}
                  onBlur={formikUpdate.handleBlur}
                />
                
                {formikUpdate.touched.giaBan && formikUpdate.errors.giaBan ? (
                  <span className="error">{formikUpdate.errors.giaBan}</span>
                ) : null}
              </div>
              <button type="submit" className="create-gold-update" >
                Cập Nhật
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

export default Gold;
