import React, { useState, useEffect } from "react";
import numeral from "numeral";
import axios from "axios";
import "./Product.css";
import config from "../config/config";
import { useFormik } from 'formik';
import * as Yup from 'yup';
function Product() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [golds, setGolds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showUpdateModal, setShowUpdateModel] = useState(false);
  const token = localStorage.getItem("token");
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [goldIdSearch, setGoldIdSearch] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateOneSuccess, setUpdateOneSuccess] = useState(false);
  const [updateAllSuccess, setUpdateAllSuccess] = useState(false);
  const [loadToUpdateAll, setLoadToUpdateAll] = useState(false);
  const [loadToUpdateOne, setLoadToUpdateOne] = useState(0);
  const [editingPost, setEditingPost] = useState([]);
  const [showModalDetailImg, setShowModalDetailImg] = useState(false);
  const [showImg, setShowImg] = useState("");
  const [showAddStone, setShowAddStone] = useState(false);
  const [showImgProductDetail, setShowImgProductDetail] = useState(false);
  const [showImgDetaileProduct, setShowImgDetaileProduct] = useState("");
  const [duplicate, setDuplicate] = useState("");
  const [formattedInputValue, setFormattedInputValue] = useState('');
  const [formattedInputValue2, setFormattedInputValue2] = useState('');
  const [formattedInputValue3, setFormattedInputValue3] = useState('');


  const handleDeleteStone = (index) => {
    const updatedStones = [...formik.values.stones];
    updatedStones.splice(index, 1);
    formik.setFieldValue('stones', updatedStones);
    setStones(updatedStones);
  };
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
  const [stone, setStone] = useState({
    StoneCode: '',
    Name: '',
    Type: '',
    Price: '',
    IsPrimary: false,
    Color: '',
    Status: 'active',
  });
  const [stones, setStones] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [postOutCount, setPostOutCount] = useState(0);
  const [detail, setDetail] = useState({})
  const showImgProductDetaill = (img) => {
    setShowImgProductDetail(true);
    setShowImgDetaileProduct(img)
  }
  const showImgDetail = (img) => {
    setShowModalDetailImg(true);
    setShowImg(img);
  }
  const handleAddStone = () => {
    formik.setFieldValue('stones', [...formik.values.stones, stone]);
    setStones((prevStones) => [...prevStones, stone]);
    setStone({
      StoneCode: '',
      Name: '',
      Type: '',
      Price: '',
      IsPrimary: false,
      Color: '',
      Status: 'active',
    });

  };
  useEffect(() => {
    console.log("st" + Object.values(stone));
    console.log("fm" + formik.values.stones);
    console.log(stones);
  }, [stones])

  var checkLoad = 0;
  const formik = useFormik({
    initialValues: {
      productName: '',
      productCode: '',
      description: '',
      size: '',
      image: null,
      quantity: '',
      categoryId: '',
      goldId: '',
      goldWeight: '',
      wage: '',
      price: '',
      warrantyPeriod: '',
      stones: stones
    },
    validationSchema: Yup.object({
      productCode: Yup.string()
        .min(9, 'Mã sản phẩm phải dài ít nhất 9 ký tự')
        .max(9, 'Mã sản phẩm tối đa 9 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ\-]*$/, 'Mã sản phẩm không được chứa ký tự đặc biệt')
        .required('Mã sản phẩm là bắt buộc'),
      productName: Yup.string()
        .min(3, 'Tên sản phẩm phải dài ít nhất 3 ký tự')
        .max(30, 'Tên sản phẩm tối đa 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ\-]*$/, 'Tên sản phẩm không được chứa ký tự đặc biệt')
        .required('Tên sản phẩm là bắt buộc'),
      description: Yup.string()
        .min(3, 'Mô tả phải dài ít nhất 3 ký tự')
        .max(30, 'Mô tả tối đa 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ\-]*$/, 'Mô tả không được chứa ký tự đặc biệt')
        .required('Mô tả là bắt buộc'),
      size: Yup.string()
        .min(1, 'Kích cỡ phải từ 1 đến 10 ký tự')
        .max(10, 'Kích cỡ phải từ 1 đến 10 ký tự')
        .required('Kích cỡ là bắt buộc'),
      quantity: Yup.number()
        .min(0, 'Số lượng tối thiểu là 0')
        .max(1000, 'Số lượng tối đa là 1000')
        .required('Số lượng là bắt buộc'),
      categoryId: Yup.string()
        .required('Danh mục là bắt buộc'),
      goldId: Yup.string()
        .required('Loại vàng là bắt buộc'),
      goldWeight: Yup.number()
        .min(0.1, 'Khối lượng vàng phải từ 0.1 đến 20')
        .max(20, 'Khối lượng vàng phải từ 0.1 đến 20')
        .required('Khối lượng vàng là bắt buộc'),
      wage: Yup.number()
        .min(0, 'Tiền công ít nhất là 0 VND')
        .max(10000000, 'Tiền công tối đa 10.000.000 VND')
        .required('Tiền công là bắt buộc'),
      price: Yup.number()
        .min(0, 'Giá sản phẩm phải từ 0 đến 300,000,000 VND')
        .max(300000000, 'Giá sản phẩm tối đa 300,000,000 VND')
        .required('Giá sản phẩm là bắt buộc'),
      warrantyPeriod: Yup.number()
        .min(3, 'Thời hạn bảo hành tối thiểu 3 tháng')
        .max(36, 'Thời hạn bảo hành tối đa 36 tháng')
        .required('Thời hạn bảo hành là bắt buộc'),

      image: Yup.mixed()
        .test('fileType', 'Ảnh sản phẩm chỉ chấp nhận định dạng PNG hoặc JPG', (value) => {
          if (!value) return true; // Bỏ qua nếu không có file
          const supportedFormats = ['image/jpeg', 'image/png'];
          return supportedFormats.includes(value.type);
        })
        .test('fileSize', 'Ảnh sản phẩm không được quá 5MB', (value) => {
          return value && value.size <= 5 * 1024 * 1024;
        })
        .required('Vui lòng tải lên ảnh sản phẩm'),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    }
  });


  const formikUpdate = useFormik({
    initialValues: {
      productCode: '',
      productName: '',
      description: '',
      size: '',
      image: null,
      quantity: '',
      categoryId: '',
      goldId: '',
      goldWeight: '',
      wage: '',
      price: '',
      warrantyPeriod: ''
    },
    validationSchema: Yup.object({
      productCode: Yup.string()
        .min(9, 'Mã sản phẩm phải dài ít nhất 9 ký tự')
        .max(9, 'Mã sản phẩm tối đa 9 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ\-]*$/, 'Mã sản phẩm không được chứa ký tự đặc biệt')
        .required('Mã sản phẩm là bắt buộc'),
      productName: Yup.string()
        .min(3, 'Tên sản phẩm phải dài ít nhất 3 ký tự')
        .max(30, 'Tên sản phẩm tối đa 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ\-]*$/, 'Tên sản phẩm không được chứa ký tự đặc biệt')
        .required('Tên sản phẩm là bắt buộc'),
      description: Yup.string()
        .min(3, 'Mô tả phải dài ít nhất 3 ký tự')
        .max(30, 'Mô tả tối đa 30 ký tự')
        .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ\-]*$/, 'Mô tả không được chứa ký tự đặc biệt')
        .required('Mô tả là bắt buộc'),
      size: Yup.string()
        .min(1, 'Kích cỡ phải từ 1 đến 10 ký tự')
        .max(10, 'Kích cỡ phải từ 1 đến 10 ký tự')
        .required('Kích cỡ là bắt buộc'),
      quantity: Yup.number()
        .min(0, 'Số lượng tối thiểu là 0')
        .max(1000, 'Số lượng tối đa là 1000')
        .required('Số lượng là bắt buộc'),
      categoryId: Yup.string()
        .required('Danh mục là bắt buộc'),
      goldId: Yup.string()
        .required('Loại vàng là bắt buộc'),
      goldWeight: Yup.number()
        .min(0.1, 'Khối lượng vàng phải từ 0.1 đến 20')
        .max(20, 'Khối lượng vàng phải từ 0.1 đến 20')
        .required('Khối lượng vàng là bắt buộc'),
      wage: Yup.number()
        .min(0, 'Tiền công tối thiểu 0 VND')
        .max(10000000, 'Tiền công tối đa 10.000.000 VND')
        .required('Tiền công là bắt buộc'),
      price: Yup.number()
        .min(0, 'Giá sản phẩm phải từ 0 đến 300,000,000 VND')
        .max(300000000, 'Giá sản phẩm tối đa 300,000,000 VND')
        .required('Giá sản phẩm là bắt buộc'),
      warrantyPeriod: Yup.number()
        .min(3, 'Thời hạn bảo hành tối thiểu 3 tháng')
        .max(36, 'Thời hạn bảo hành tối đa 36 tháng')
        .required('Thời hạn bảo hành là bắt buộc'),
      image: Yup.mixed().nullable()
        .test('fileType', 'Ảnh sản phẩm chỉ chấp nhận định dạng PNG hoặc JPG', (value) => {
          if (!value) return true; // no file selected
          const supportedFormats = ['image/jpeg', 'image/png'];
          return supportedFormats.includes(value.type);
        })
        .test('fileSize', 'Ảnh sản phẩm không được quá 5MB', (value) => {
          if (!value) return true; // no file selected
          return value.size <= 5 * 1024 * 1024;
        })

    }),
    onSubmit: (values) => {
      handleUpdateSubmit(values);
    }
  });
  useEffect(() => {
    if (editingPost) {
      console.log("Editing Post:", editingPost); // Kiểm tra giá trị của editingPost
      formikUpdate.setValues({
        productName: editingPost.productName,
        description: editingPost.description,
        size: editingPost.size,
        image: editingPost.image,
        quantity: editingPost.quantity,
        categoryId: editingPost.categories?.categoryId,
        goldId: editingPost.goldTypes?.goldId,
        goldWeight: editingPost.goldWeight,
        wage: editingPost.wage,
        price: editingPost.price,
        warrantyPeriod: editingPost.warrantyPeriod,
        productCode: editingPost.productCode
      });
    }
  }, [editingPost]);


  const showDetailForm = (x, id) => {
    setShowDetail(true);
    setDetail(x);
    console.log(x);

    // setIdOrderDetail(id);
  };
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

  useEffect(() => {
    setTimeout(() => {
      setUpdateOneSuccess(false)
    }, 3000)
  }, [updateOneSuccess])

  useEffect(() => {
    setTimeout(() => {
      setUpdateAllSuccess(false)
    }, 3000)
  }, [updateAllSuccess])

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Product/GetOutOfStockProduct`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPostOutCount(posts.length);
      });
  }, []);
  //--------------------------------------------
  const updateAllPrice = async () => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Product/UpdateTickALL`, {
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );
      setLoadToUpdateAll(true);
      setUpdateAllSuccess(true);
      console.log("Gold created successfully:", response.data);
    } catch (error) {
      console.error("There was an error adding gold!", error);
    }
    closeModal();
  }
  //-----------------------------------------------------
  const updateOne = async (productIdd) => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Product/UpdateTickOne/${productIdd}`, {
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );
      setUpdateOneSuccess(true);
      setLoadToUpdateOne(checkLoad + 1);
      console.log("Gold created successfully:", response.data);
    } catch (error) {
      console.error("There was an error adding gold!", error);
    }
    closeModal();
  }

  const updateProduct = async (product) => {
    showUpdateForm();
    setUpdatedProduct(product);
    setEditingPost(product);

  }


  //-------------------------------------------------------

  //Add product





  const handleSubmit = async (e) => {
    const data = new FormData();
    data.append('categoryId', e.categoryId);
    data.append('goldId', e.goldId);
    data.append('productName', e.productName);
    data.append('description', e.description);
    data.append('image', e.image);
    data.append('quantity', e.quantity);
    data.append('goldWeight', parseFloat(e.goldWeight));
    data.append('wage', e.wage);
    data.append('size', e.size);
    data.append('warrantyPeriod', e.warrantyPeriod);
    data.append('productCode', e.productCode);
    data.append('price', e.price);
    stones.forEach((stone, index) => {
      for (const key in stone) {
        data.append(`stones[${index}][${key}]`, stone[key]);
      }
    });
    console.log("da" + Object.values(stones));
    try {
      const response = await fetch(`${config.API_ROOT}/api/Product`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      formik.resetForm();
      closeModal();
      const result = await response.json();
      setAddSuccess(true);
      getProducts();
      setFormattedInputValue('');
      setFormattedInputValue2('')
      setFormattedInputValue3('')


    } catch (error) {
      console.error('Error:', error.response);
      setTimeout(() => {
        setDuplicate("Mã sản phẩm đã tồn tại");

      }, 3000);

    }
  };

  const handleUpdateSubmit = async (e) => {


    const data2 = new FormData();
    data2.append('categoryId', e.categoryId);
    data2.append('goldId', e.goldId);
    data2.append('productName', e.productName);
    data2.append('description', e.description);
    data2.append('image', e.image);
    data2.append('quantity', e.quantity);
    data2.append('goldWeight', parseFloat(e.goldWeight));
    data2.append('wage', e.wage);
    data2.append('size', e.size);
    data2.append('warrantyPeriod', e.warrantyPeriod);
    data2.append('price', e.price);
    data2.append('productCode', e.productCode);
    data2.append('status', "active");


    try {
      console.log("data2" + Object.values(data2));
      const response = await fetch(`${config.API_ROOT}/api/Product/UpdateProductNormal/${updatedProduct.productId}`, {
        method: 'PUT',
        body: data2,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      formikUpdate.resetForm();
      const result = await response.json();
      setUpdateSuccess(true);
      closeUpdateModalll();
    } catch (error) {
      console.error('Error:', error);
      setTimeout(() => {
        setDuplicate("Mã sản phẩm đã tồn tại");

      }, 3000);

    }
  }

  //-------------------------------------------------------
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
  console.log(currentItems);
  // Hiển thị số trang
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  //--------------------------------------------
  const confirmDelete = (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      handleDelete(productId);
    }
  };
  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `${config.API_ROOT}/api/Product/${productId}`
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(
        `${config.API_ROOT}/api/Product?pageNumber=1&pageSize=1000`
        ,
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

  const getProducts = () => {
    fetch(
      `${config.API_ROOT}/api/Product?pageNumber=1&pageSize=1000`
      , {
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
    fetch(
      `${config.API_ROOT}/api/Product?pageNumber=1&pageSize=1000`
      , {
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

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/GoldTypes`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((golds) => {
        setGolds(golds);
      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Category`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((categories) => {
        setCategories(categories);
      });
  }, []);
  const showAddForm = () => {
    formik.resetForm();
    setShowModal(true);
  };
  const showUpdateForm = () => {
    setShowUpdateModel(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormattedInputValue('');
    setFormattedInputValue2('')
    setFormattedInputValue3('')
  };
  const closeUpdateModalll = () => {
    formikUpdate.resetForm();
    setEditingPost({});
    setShowUpdateModel(false);
  };


  //---------------------------
  useEffect(() => {
    handleSearchCustomer()
  }, [loadToUpdateOne || loadToUpdateAll || goldIdSearch || updateSuccess || addSuccess || deleteSuccess])

  const handleSearchCustomer = async () => {
    var url;
    try {
      let url = `${config.API_ROOT}/api/Product?pageNumber=1&pageSize=1000`;
      if (goldIdSearch !== "") {
        console.log(goldIdSearch);
        url = `${config.API_ROOT}/api/Product/GetProductByNameOrCode?nameCode=${goldIdSearch}&pageNumber=1&pageSize=1000`;
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
  //---------------------------
  return (
    <div className="col-10">
      {duplicate && (
        <div className="alert alert-danger position-fixed top-8 end-0 m-3 duplicateCss">
          {duplicate}
        </div>

      )}
      <div className="product">
        <div className={`alert alert-success position-fixed  notify-item-add-success align-items-center addPrass ${addSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Thêm sản phẩm thành công
        </div>
        <div className={`alert alert-success position-fixed  notify-item-delete-success align-items-center deletePrass ${deleteSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Xóa sản phẩm thành công
        </div>
        <div className={`alert alert-success position-fixed  notify-item-update-success align-items-center updatePrass ${updateSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Cập nhật sản phẩm thành công
        </div>
        <div className={`alert alert-success position-fixed  notify-item-add-success  cngv align-items-center  ${updateOneSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Cập nhật giá sản phẩm theo giá vàng thành công
        </div>
        <div className={`alert alert-success position-fixed  notify-item-add-success  cngva align-items-center ${updateAllSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Cập nhật giá tất sản phẩm theo giá vàng thành công
        </div>
        <div className="title">
          <p>Sản Phẩm</p>
        </div>
        <div className="tagResult">
          <div className="tagResultToday sphc">
            <div className="tagChild">
              <i className="fas fa-expand-arrows-alt add1"></i>
            </div>
            <h3 >Sản phẩm hiện có</h3>
            <p>{postCount} sản phẩm</p>
          </div>
          <div className="tagResultWeek sphh">
            <div className="tagChild">
              <i className="fas fa-times-circle add2"></i>
            </div>
            <h3>Sản phẩm hết hàng</h3>
            <p>{postOutCount} Sản phẩm</p>
          </div>
          <div className="detailProduct">
            <p>Danh sách sản phẩm</p>
            <div className="search">
              <input type="text"
                name="goldId"
                value={goldIdSearch}
                onChange={(e) => setGoldIdSearch(e.target.value)}
                placeholder="Tìm Kiếm" />
            </div>
            <button className="addProduct" onClick={showAddForm}>
              <i className="fas fa-plus"></i>
              <p>Thêm mới sản phẩm</p>
            </button>
            <button className="updatePrice" onClick={updateAllPrice}>
              <i className="fas fa-wrench"></i>
              <p>Cập nhật giá tất cả sản phẩm theo giá vàng hiện tại</p>
            </button>

            <table className="tableProduct">
              <thead>
                <tr>

                  {/* <th className="stt-product">STT</th> */}
                  <th>Mã Sản Phẩm</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Ảnh</th>
                  <th>Số Lượng</th>

                  <th>Thành Tiền</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((post, index) => (

                  <tr key={index} >
                    {/* <td>{indexOfFirstItem + index + 1}</td> */}
                    <td>{post.productCode}</td>
                    <td>{post.productName}</td>
                    {/* <td>{post.image}</td> */}
                    <td onClick={() => showImgDetail(post.image)}><img className="product-img-luan" src={post.image} alt="{post.productName}" /></td>
                    <td>{post.quantity}</td>

                    <td>{numeral(post.price).format("0,0")} VND</td>

                    <td>
                      <div className="btn-group">
                        <button class="btn btn-info fas fa-eye eyeDetail" onClick={() => showDetailForm(post)}>
                          <i class=""></i>
                        </button>
                        <i className="btn btn-warning fas fa-pen-fancy update" onClick={() => updateOne(post.productId)}></i>

                        <i
                          className="btn btn-primary fas fa-edit update"
                          onClick={() => updateProduct(post)}
                        ></i>
                        <i
                          className="btn btn-danger fas fa-trash-alt delete"
                          onClick={() => confirmDelete(post.productId)}
                        ></i>

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
      </div>
      <div className={`modal-product ${showModal ? "open" : ""}`}>
        <div className="modal-product-child">
          <header className="modal-product-header">
            <div className="modal-product-closee" onClick={closeModal}>
              <i className="fas fa-times-circle"></i>
            </div>
            <p className="tspm">Thêm Mới Sản Phẩm Mới</p>
          </header>
          <div className="body-child">

            <form onSubmit={formik.handleSubmit}>

              <div className="modal-product-form">
                <div className="modal-product-left">
                  <div className="d-flex">
                    <label htmlFor="productCode" className="modal-product-label">Mã Sản Phẩm</label>
                    <input
                      type="text"
                      id="productCode"
                      className="modal-product-input"
                      name="productCode"
                      value={formik.values.productCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Ví dụ: KHN0xxxxx"
                    />
                  </div>
                  {formik.touched.productCode && formik.errors.productCode ? (
                    <span className="error lui">{formik.errors.productCode}</span>
                  ) : null}
                  <div className="d-flex cpn">
                    <label htmlFor="productName" className="modal-product-label">Tên Sản Phẩm</label>
                    <input
                      type="text"
                      id="productName"
                      className="modal-product-input"
                      name="productName"
                      value={formik.values.productName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Ví dụ: Dây Chuyền Vàng"

                    />
                  </div>
                  {formik.touched.productName && formik.errors.productName ? (
                    <span className="error lui">{formik.errors.productName}</span>
                  ) : null}
                  <div className="d-flex cpn rrlt">
                    <label htmlFor="categoryId" className="modal-product-label ">Danh Mục
                      <div className="combobox comboboxDm">
                        <select
                          id="categoryId"
                          name="categoryId"
                          value={formik.values.categoryId}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="modal-product-select"
                        >
                          <option value="" defaultValue disabled>Danh Mục</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category.categoryId}>{category.name}</option>
                          ))}
                        </select>

                      </div>
                    </label>


                    <label htmlFor="goldId" className="modal-product-label goldTypee">Loại Vàng</label>
                    <div className="combobox comboboxGold">
                      <select
                        id="goldId"
                        name="goldId"
                        value={formik.values.goldId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="modal-product-select"
                      >
                        <option value="" defaultValue disabled>Loại Vàng</option>
                        {golds.map((gold, index) => (
                          <option key={index} value={gold.goldId}>{gold.goldName}</option>
                        ))}
                      </select>

                    </div>
                  </div>
                  <div className="d-flex">
                    {formik.touched.categoryId && formik.errors.categoryId ? (
                      <span className="error luicbbdm">{formik.errors.categoryId}</span>
                    ) : null}
                    {formik.touched.goldId && formik.errors.goldId ? (
                      <span className="error luicbbv">{formik.errors.goldId}</span>
                    ) : null}
                  </div>
                  <div className="chiVang">
                    <div className="d-flex cpn">

                      <label htmlFor="goldWeight" className="modal-product-label">Khối Lượng Vàng</label>
                      <input
                        type="number"
                        id="goldWeight"
                        name="goldWeight"
                        value={formik.values.goldWeight}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="modal-product-input"
                        placeholder="Ví dụ: 5.5"
                        step="0.1"
                      />
                    </div>
                  </div>
                  {formik.touched.goldWeight && formik.errors.goldWeight ? (
                    <span className="error lui">{formik.errors.goldWeight}</span>
                  ) : null}
                  <div className="d-flex cpn">
                    <label htmlFor="description" className="modal-product-label">Mô Tả</label>
                    <input
                      type="text"
                      id="description"
                      className="modal-product-input"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Ví dụ: Dây Chuyền Vàng Trắng"

                    />

                  </div>
                  {formik.touched.description && formik.errors.description ? (
                    <span className="error lui">{formik.errors.description}</span>
                  ) : null}
                  <div className="kichCo">
                    <div className="d-flex cpn">
                      <label htmlFor="size" className="modal-product-label">Kích Cỡ</label>
                      <input
                        type="text"
                        id="size"
                        name="size"
                        value={formik.values.size}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="modal-product-input"
                        placeholder="Ví dụ: 65"

                      />
                    </div>
                  </div>
                  {formik.touched.size && formik.errors.size ? (
                    <span className="error lui">{formik.errors.size}</span>
                  ) : null}
                  <div className="soLuong">
                    <div className="d-flex cpn">
                      <label htmlFor="quantity" className="modal-product-label">Số Lượng</label>
                      <input
                        type="number"
                        id="quantity"
                        className="modal-product-input"
                        name="quantity"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ví dụ: 12"

                      />
                    </div>
                  </div>
                  {formik.touched.quantity && formik.errors.quantity ? (
                    <span className="error lui">{formik.errors.quantity}</span>
                  ) : null}
                  <div className="d-flex cpn">
                    <label htmlFor="image" className="modal-product-label">Ảnh</label>
                    <div className="modal-product-image-upload">
                      <input
                        type="file"
                        className="modal-product-image-input"
                        id="image"
                        name="image"
                        onChange={(event) => {
                          formik.setFieldValue('image', event.currentTarget.files[0]);
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                  </div>
                  {formik.touched.image && formik.errors.image ? (
                    <span className="error lui">{formik.errors.image}</span>
                  ) : null}
                </div>
                <div className="modal-product-right">
                  <div className="tienCong">
                    <div className="d-flex cpn">
                      <label htmlFor="wage" className="modal-product-label">Tiền Công</label>

                      <input
                        type="text"
                        id="wage"
                        name="wage"
                        className="modal-product-input"
                        value={formattedInputValue}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ví dụ: 200,000"
                      />
                    </div>

                  </div>
                  {formik.touched.wage && formik.errors.wage ? (
                    <span className="error lui">{formik.errors.wage}</span>
                  ) : null}
                  <div className="tienCong">

                    <div className="d-flex cpn">
                      <label htmlFor="price" className="modal-product-label">Giá Sản Phẩm</label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        className="modal-product-input"
                        value={formattedInputValue2}
                        onChange={handleChange2}
                        onBlur={formik.handleBlur}
                        placeholder="Ví dụ: 22,000,000"
                      />
                    </div>
                  </div>
                  {formik.touched.price && formik.errors.price ? (
                    <span className="error lui">{formik.errors.price}</span>
                  ) : null}
                  <div className="baoHanh">
                    <div className="d-flex cpn">
                      <label htmlFor="warrantyPeriod" className="modal-product-label">Thời Hạn Bảo Hành</label>
                      <input
                        type="number"
                        id="warrantyPeriod"
                        className="modal-product-input"
                        name="warrantyPeriod"
                        value={formik.values.warrantyPeriod}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ví dụ: 12"

                      />
                    </div>
                  </div>
                  {formik.touched.warrantyPeriod && formik.errors.warrantyPeriod ? (
                    <span className="error lui">{formik.errors.warrantyPeriod}</span>
                  ) : null}
                  <div className="btn muonthemda" onClick={() => setShowAddStone(true)}>Thêm đá</div>
                  {showAddStone && (
                    <div className="formDa">
                      <div className="d-flex cpn">
                        <label htmlFor="stoneCode" className="modal-product-label">Mã Đá</label>
                        <input
                          type="text"
                          id="stoneCode"
                          className="modal-product-input"
                          name="StoneCode"
                          value={stone.StoneCode}
                          onChange={(e) => setStone({ ...stone, StoneCode: e.target.value })}
                          placeholder="Ví dụ: Dxxxx"
                        />
                      </div>
                      <div className="d-flex cpn">
                        <label htmlFor="stoneName" className="modal-product-label">Tên Đá</label>
                        <input
                          type="text"
                          id="stoneName"
                          className="modal-product-input"
                          name="Name"
                          value={stone.Name}
                          onChange={(e) => setStone({ ...stone, Name: e.target.value })}
                          placeholder="Ví dụ: Đá Sa Phia"
                        />
                      </div>
                      <div className="d-flex cpn">
                        <label htmlFor="stoneType" className="modal-product-label">Loại Đá</label>
                        <input
                          type="text"
                          id="stoneType"
                          className="modal-product-input"
                          name="Type"
                          value={stone.Type}
                          onChange={(e) => setStone({ ...stone, Type: e.target.value })}
                          placeholder="Ví dụ: Đá quý"
                        />
                      </div>
                      <div className="giaDaa">
                        <div className="d-flex cpn">
                          <label htmlFor="stonePrice" className="modal-product-label">Giá đá</label>

                          <input
                            type="number"
                            id="stonePrice"
                            name="Price"
                            className="modal-product-input"
                            value={stone.Price}
                            onChange={(e) => setStone({ ...stone, Price: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="d-flex cpn">
                        <label htmlFor="stonePrimary" className="modal-product-label">Đá chính</label>
                        <p className="yess">Có</p>
                        <input
                          type="checkbox"
                          id="stonePrimary"
                          name="IsPrimary"
                          className="modal-product-input checkb"
                          checked={stone.IsPrimary}
                          onChange={(e) => setStone({ ...stone, IsPrimary: e.target.checked })}
                        />
                      </div>
                      <div className="d-flex cpn">
                        <label htmlFor="stoneColor" className="modal-product-label">Màu đá</label>
                        <input
                          type="text"
                          id="stoneColor"
                          name="Color"
                          className="modal-product-input"
                          value={stone.Color}
                          onChange={(e) => setStone({ ...stone, Color: e.target.value })}
                          placeholder="Ví dụ: Đỏ"
                        />
                      </div>
                      <div className="btn themda" onClick={handleAddStone}>Thêm Đá </div>
                    </div>
                  )}
                  {stones.length > 0 && (
                    <div className="table-container tableViewStone">
                      <table>
                        <thead>
                          <tr>
                            <th>Mã đá</th>
                            <th>Tên đá</th>
                            <th>Loại đá</th>
                            <th>Giá đá</th>
                            <th>Màu đá</th>
                            <th>Đá chính</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stones.map((stone, index) => (
                            <tr key={index}>
                              <td>{stone.StoneCode}</td>
                              <td>{stone.Name}</td>
                              <td>{stone.Type}</td>
                              <td>{stone.Price}</td>
                              <td>{stone.Color}</td>
                              <td>{stone.IsPrimary ? "Có" : "Không"}</td>
                              <td><i className="btn btn-danger fas fa-trash-alt delete" onClick={() => handleDeleteStone(index)}></i></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                  }
                </div>
              </div>


              <div className="footer-child"> <button id="create-pro" type="submit">Tạo</button></div>

            </form>
          </div>

        </div>
      </div>
      <div className={`modal-update-product ${showUpdateModal ? "open" : ""}`}>
        <div className="modal-product-child">
          <header className="modal-product-header">
            <div className="modal-product-closee" onClick={closeUpdateModalll}>
              <i className="fas fa-times-circle"></i>
            </div>
            <p className="tspm">Cập Nhật Sản Phẩm</p>
          </header>
          <div className="body-child">

            <form onSubmit={formikUpdate.handleSubmit}>

              <div className="modal-product-form">
                <div className="modal-product-left">
                  <div className="d-flex">
                    <label htmlFor="productCode" className="modal-product-label">Mã Sản Phẩm</label>
                    <input
                      type="text"
                      id="productCode"
                      className="modal-product-input"
                      name="productCode"
                      value={formikUpdate.values.productCode}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                    />
                  </div>
                  {formikUpdate.touched.productCode && formikUpdate.errors.productCode ? (
                    <span className="error lui">{formikUpdate.errors.productCode}</span>
                  ) : null}
                  <div className="d-flex cpn">
                    <label htmlFor="productName" className="modal-product-label">Tên Sản Phẩm</label>
                    <input
                      type="text"
                      id="productName"
                      className="modal-product-input"
                      name="productName"
                      value={formikUpdate.values.productName}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                    />
                  </div>
                  {formikUpdate.touched.productName && formikUpdate.errors.productName ? (
                    <span className="error lui">{formikUpdate.errors.productName}</span>
                  ) : null}
                  <div className="d-flex cpn rrlt">
                    <label htmlFor="categoryId" className="modal-product-label ">Danh Mục
                      <div className="combobox comboboxDm">
                        <select
                          id="categoryId"
                          name="categoryId"
                          value={formikUpdate.values.categoryId}
                          onChange={formikUpdate.handleChange}
                          onBlur={formikUpdate.handleBlur}
                          className="modal-product-select"
                        >
                          <option value="" defaultValue disabled>Danh Mục</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category.categoryId}>{category.name}</option>
                          ))}
                        </select>

                      </div>
                    </label>


                    <label htmlFor="goldId" className="modal-product-label goldTypee">Loại Vàng</label>
                    <div className="combobox comboboxGold">
                      <select
                        id="goldId"
                        name="goldId"
                        value={formikUpdate.values.goldId}
                        onChange={formikUpdate.handleChange}
                        onBlur={formikUpdate.handleBlur}
                        className="modal-product-select"
                      >
                        <option value="" defaultValue disabled>Loại Vàng</option>
                        {golds.map((gold, index) => (
                          <option key={index} value={gold.goldId}>{gold.goldName}</option>
                        ))}
                      </select>

                    </div>
                  </div>
                  <div className="d-flex">
                    {formikUpdate.touched.categoryId && formikUpdate.errors.categoryId ? (
                      <span className="error luicbbdm">{formikUpdate.errors.categoryId}</span>
                    ) : null}
                    {formikUpdate.touched.goldId && formikUpdate.errors.goldId ? (
                      <span className="error luicbbv">{formikUpdate.errors.goldId}</span>
                    ) : null}
                  </div>

                  <div className="d-flex cpn">
                    <label htmlFor="goldWeight" className="modal-product-label">Khối Lượng Vàng</label>
                    <input
                      type="number"
                      id="goldWeight"
                      name="goldWeight"
                      value={formikUpdate.values.goldWeight}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                      className="modal-product-input"
                      step="0.1"
                    />

                  </div>
                  {formikUpdate.touched.goldWeight && formikUpdate.errors.goldWeight ? (
                    <span className="error lui">{formikUpdate.errors.goldWeight}</span>
                  ) : null}
                  <div className="d-flex cpn">
                    <label htmlFor="description" className="modal-product-label">Mô Tả</label>
                    <input
                      type="text"
                      id="description"
                      className="modal-product-input"
                      name="description"
                      value={formikUpdate.values.description}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                    />

                  </div>
                  {formikUpdate.touched.description && formikUpdate.errors.description ? (
                    <span className="error lui">{formikUpdate.errors.description}</span>
                  ) : null}

                  <div className="d-flex cpn">
                    <label htmlFor="size" className="modal-product-label">Kích Cỡ</label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={formikUpdate.values.size}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                      className="modal-product-input"
                    />

                  </div>
                  {formikUpdate.touched.size && formikUpdate.errors.size ? (
                    <span className="error lui">{formikUpdate.errors.size}</span>
                  ) : null}
                  <div className="d-flex cpn">
                    <label htmlFor="quantity" className="modal-product-label">Số Lượng</label>
                    <input
                      type="number"
                      id="quantity"
                      className="modal-product-input"
                      name="quantity"
                      value={formikUpdate.values.quantity}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                    />

                  </div>
                  {formikUpdate.touched.quantity && formikUpdate.errors.quantity ? (
                    <span className="error lui">{formikUpdate.errors.quantity}</span>
                  ) : null}
                  <div className="d-flex cpn">
                    <label htmlFor="image" className="modal-product-label">Ảnh</label>
                    <div className="modal-product-image-upload">
                      <input
                        type="file"
                        className="modal-product-image-input"
                        id="image"
                        name="image"
                        onChange={(event) => {
                          formikUpdate.setFieldValue('image', event.currentTarget.files[0]);
                        }}
                        onBlur={formikUpdate.handleBlur}
                      />
                    </div>

                  </div>
                  {formikUpdate.touched.image && formikUpdate.errors.image ? (
                    <span className="error lui">{formikUpdate.errors.image}</span>
                  ) : null}
                </div>
                <div className="modal-product-right">
                  <div className="d-flex cpn">
                    <label htmlFor="wage" className="modal-product-label">Tiền Công</label>
                    <input
                      type="number"
                      id="wage"
                      className="modal-product-input"
                      name="wage"
                      value={formikUpdate.values.wage}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                      step="10000"
                    />

                  </div>
                  {formikUpdate.touched.wage && formikUpdate.errors.wage ? (
                    <span className="error lui">{formikUpdate.errors.wage}</span>
                  ) : null}
                  <div className="d-flex cpn">
                    <label htmlFor="price" className="modal-product-label">Giá Sản Phẩm</label>
                    <input
                      type="number"
                      id="price"
                      className="modal-product-input"
                      name="price"
                      value={formikUpdate.values.price}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                      step="10000"
                    />

                  </div>
                  {formikUpdate.touched.price && formikUpdate.errors.price ? (
                    <span className="error lui">{formikUpdate.errors.price}</span>
                  ) : null}
                  <div className="d-flex cpn">
                    <label htmlFor="warrantyPeriod" className="modal-product-label">Thời Hạn Bảo Hành</label>
                    <input
                      type="number"
                      id="warrantyPeriod"
                      className="modal-product-input"
                      name="warrantyPeriod"
                      value={formikUpdate.values.warrantyPeriod}
                      onChange={formikUpdate.handleChange}
                      onBlur={formikUpdate.handleBlur}
                    />

                  </div>
                  {formikUpdate.touched.warrantyPeriod && formikUpdate.errors.warrantyPeriod ? (
                    <span className="error lui">{formikUpdate.errors.warrantyPeriod}</span>
                  ) : null}
                  {/* <div className="btn muonthemda" onClick={() => setShowAddStone(true)}>Thêm đá</div>
                  {showAddStone && (
                    <div className="formDa">
                      <div className="d-flex cpn">
                        <label htmlFor="stoneCode" className="modal-product-label">Mã Đá</label>
                        <input
                          type="text"
                          id="stoneCode"
                          className="modal-product-input"
                          name="StoneCode"
                          value={stone.StoneCode}
                          onChange={(e) => setStone({ ...stone, StoneCode: e.target.value })}
                        />
                      </div>
                      <div className="d-flex cpn">
                        <label htmlFor="stoneName" className="modal-product-label">Tên Đá</label>
                        <input
                          type="text"
                          id="stoneName"
                          className="modal-product-input"
                          name="Name"
                          value={stone.Name}
                          onChange={(e) => setStone({ ...stone, Name: e.target.value })}
                        />
                      </div>
                      <div className="d-flex cpn">
                        <label htmlFor="stoneType" className="modal-product-label">Loại Đá</label>
                        <input
                          type="text"
                          id="stoneType"
                          className="modal-product-input"
                          name="Type"
                          value={stone.Type}
                          onChange={(e) => setStone({ ...stone, Type: e.target.value })}
                        />
                      </div>
                      <div className="d-flex cpn">
                        <label htmlFor="stonePrice" className="modal-product-label">Giá đá</label>
                        <input
                          type="number"
                          id="stonePrice"
                          name="Price"
                          className="modal-product-input"
                          value={stone.Price}
                          onChange={(e) => setStone({ ...stone, Price: e.target.value })}
                        />
                      </div>
                      <div className="d-flex cpn">
                        <label htmlFor="stonePrimary" className="modal-product-label">Đá chính</label>
                        <p className="yess">Có</p>
                        <input
                          type="checkbox"
                          id="stonePrimary"
                          name="IsPrimary"
                          className="modal-product-input checkb"
                          checked={stone.IsPrimary}
                          onChange={(e) => setStone({ ...stone, IsPrimary: e.target.checked })}
                        />
                      </div>
                      <div className="d-flex cpn">
                        <label htmlFor="stoneColor" className="modal-product-label">Màu đá</label>
                        <input
                          type="text"
                          id="stoneColor"
                          name="Color"
                          className="modal-product-input"
                          value={stone.Color}
                          onChange={(e) => setStone({ ...stone, Color: e.target.value })}
                        />
                      </div>
                      <div className="btn themda" onClick={handleAddStone}>Thêm Đá </div>
                    </div>
                  )}
                  {stones.length > 0 && (
                    <div className="table-container tableViewStone">
                      <table>
                        <thead>
                          <tr>
                            <th>Mã đá</th>
                            <th>Tên đá</th>
                            <th>Loại đá</th>
                            <th>Giá đá</th>
                            <th>Màu đá</th>
                            <th>Đá chính</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stones.map((stone, index) => (
                            <tr key={index}>
                              <td>{stone.StoneCode}</td>
                              <td>{stone.Name}</td>
                              <td>{stone.Type}</td>
                              <td>{stone.Price}</td>
                              <td>{stone.Color}</td>
                              <td>{stone.IsPrimary ? "Có" : "Không"}</td>
                              <td><i className="btn btn-danger fas fa-trash-alt delete"></i></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                  } */}
                </div>
              </div>


              <div className="footer-child"> <button id="create-pro" type="submit">Cập Nhật</button></div>

            </form>
          </div>

        </div>
      </div>
      <div className={`modal-detail ${showDetail ? "open" : ""}`}>
        <div className="modal-detail-child">
          <div className="modal-detail-header">
            <div className="modal-detail-child-close" onClick={closeModalDetail}>
              <i className="fas fa-times-circle"></i>
            </div>
            <p>Thông Tin Sản Phẩm Chi Tiết</p>
          </div>
          <div className="modal-detail-bodyyy">
            <div className="modal-detail-body-right fixPrL">

              <table className="tbdtprr">
                <thead>
                  <tr>
                    <td className="tieuDe">Mã sản phẩm</td>
                    <td>{detail.productCode}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tieuDe">Tên sản phẩm</td>
                    <td>{detail.productName}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Mô tả</td>
                    <td>{detail.description}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Ảnh</td>
                    <td onClick={() => showImgProductDetaill(detail.image)}><img className="product-img-luann" src={detail.image} alt={detail.productName} /></td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Kích cỡ</td>
                    <td>{detail.size} mm</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Danh mục</td>
                    <td>{detail.categories?.name}</td>
                  </tr>
                  <tr>
                    <td className="tieuDe">Số lượng sản phẩm </td>
                    <td>{detail.quantity} Chiếc</td>
                  </tr>

                </tbody>
              </table>
            </div>


            <div className="modal-detail-body-left fixPrR">

              <div className="modal-detail-body-left">

                <table className="tbdtprl">
                  <thead>
                    <tr>
                      <td className="tieuDe tdv">Loại vàng</td>
                      <td>{detail.goldTypes?.goldName}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="tieuDe tdv">Khối lượng vàng</td>
                      <td>{detail.goldWeight} Chỉ</td>
                    </tr>
                    {detail.stones?.length > 0 && (
                      <>
                        <tr>
                          <td className="tieuDe tdv">Tên đá chính</td>
                          <td>{detail.stones?.filter(stone => stone.isPrimary).map(stone => stone.name).join(', ')}</td>
                        </tr>
                        <tr>
                          <td className="tieuDe tdv">Tiền đá</td>
                          <td>
                            {numeral(detail.stones?.reduce((total, stone) => total + stone.price, 0)).format(0, 0)
                            } VND
                          </td>
                        </tr>
                      </>
                    )
                    }


                    <tr>
                      <td className="tieuDe">Tiền công</td>
                      <td>{numeral(detail.wage).format(0, 0)} VND</td>
                    </tr>
                    <tr>
                      <td className="tieuDe">Thời hạn bảo hành</td>
                      <td>{detail.warrantyPeriod} Tháng</td>
                    </tr>
                  </tbody>
                </table>

                {detail.stones?.length > 0 &&
                  <div className="dsdct">
                    <h6 className="mt-4">Danh sách đá chi tiết:</h6>
                    <table >
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã Đá</th>
                          <th>Tên Đá</th>
                          <th>Loại Đá</th>
                          <th>Màu Sắc</th>
                          <th>Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.stones?.map((stone, index) => (
                          <tr key={index}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{stone.stoneCode}</td>
                            <td>{stone.name}</td>
                            <td>{stone.type}</td>
                            <td>{stone.color}</td>
                            <td>{numeral(stone.price).format("0,0")} VND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }


              </div>
            </div>
            <p className="tongTien ttPr"> </p>

          </div>
        </div>
      </div>
      <div className={`modal-detail-img ${showModalDetailImg ? "open" : ""}`}>
        <div className="modal-product-close" onClick={() => setShowModalDetailImg(false)}>
          <i className="fas fa-times-circle"></i>
        </div>
        <img className="product-img" src={showImg} alt="{post.productName}" />
      </div>
      <div className={`modal-detail-img ${showImgProductDetail ? "open" : ""}`}>
        <div className="modal-product-close" onClick={() => setShowImgProductDetail(false)}>
          <i className="fas fa-times-circle"></i>
        </div>
        <img className="product-img" src={showImgDetaileProduct} alt="{post.productName}" />
      </div>
    </div >
  );
}

export default Product;
