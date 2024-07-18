import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './CreateOrder.css';
import numeral from 'numeral';
import { Link, useNavigate } from "react-router-dom";
import './CreateCustomer.css';
import './ProductDetail.css';
import config from '../config/config.js';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import "./BarcodeScanner.css"
import SliderPrice from './SliderPrice.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function CreateOrder() {
    var numOfItems = 0;
    var total = 0;
    const [totalPriceStones, setTotalPriceStones] = useState(0);
    const navigate = useNavigate();
    const [idOrName, setIdOrName] = useState("");
    const [customerPhone, setCustomerPhone] = useState('');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [card, setCard] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [customer, setCustomer] = useState({
        customerName: '',
        phoneNumber: '',
        email: '',
    });
    const [popupProduct, setPopupProduct] = useState(false);
    const [curProductPage, setCurProductPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(1);
    const [createCustomerMessage, setCreateCustomerMessage] = useState('');
    const pageSize = 6;
    const token = localStorage.getItem('token');
    const [customers, setCustomers] = useState([]);
    const [noProductMessage, setNoProductMessage] = useState('');
    const webcamRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [selectedProduct, setSelectedProduct] = useState({});
    const [primaryStone, setPrimaryStone] = useState({});
    const [popupFilter, setPopupFilter] = useState(false);
    const [goldTypes, setGoldTypes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedGoldTypes, setSelectedGoldTypes] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 300]);
    const [onSelect, setOnSelect] = useState(1);
    //1 search 2 category 3 filter 
    const [customerInfo, setCustomerInfo] = useState({
        customerName: '',
        phoneNumber: '',
        email2: '',
    });
    const [noProductInCart, setNoProductInCart] = useState('');
    const [duplicateCustomer, setDuplicateCustomer] = useState('');
    const [cannotAddContinue, setCannotAddContinue] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email2: '',
            phone: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, 'Tên phải dài ít nhất 3 ký tự')
                .max(30, 'Tên không được dài quá 30 ký tự')
                .required('Tên là bắt buộc'),
            email2: Yup.string()
                .email('Email không hợp lệ')
                .min(5, 'Email phải dài ít nhất 5 ký tự')
                .max(30, 'Email không được dài quá 30 ký tự')
                .required('Email là bắt buộc'),
            phone: Yup.string()
                .matches(/^\d{10}$/, 'Số điện thoại phải chứa đúng 10 số')
                .required('Số điện thoại là bắt buộc'),
        }),
        onSubmit: (values) => {
            createCustomer(values);

        },
    });



    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/GoldTypes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setGoldTypes(response.data);
                console.log(goldTypes);
            })
            .catch(error => {
                console.error('There was an error fetching the goldtypes!', error);
            });
    }, [popupFilter]);

    const clearCart = async () => {
        try {
            const response = await axios.delete(`${config.API_ROOT}/api/Cart/clear`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('There was an error fetching the cart!', error);
        }
    }

    useEffect(() => {
        if (products.length > 0) {
            setNoProductMessage('');
        } else {
            setNoProductMessage('Không có sản phẩm nào phù hợp');
        }
    }, [products])

    const addCustomerDone = () => {
        setCreateCustomerMessage('Đã thêm thông tin khách hàng thành công');
    }

    const togglePopup = () => {
        setShowPopup(!showPopup);
        formik.resetForm();
        setCustomerInfo({})
    };

    const createCustomer = async (values) => {
        try {
            const response = await axios.post(`${config.API_ROOT}/api/Customer`, {
                customerName: values.name || "",
                email: values.email2 || "",
                phoneNumber: values.phone || "",
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                addCustomerDone();
                formik.resetForm();
                setCustomer({
                    customerName: values.name,
                    email: values.email2,
                    phoneNumber: values.phone,
                });
                setShowPopup(false);
            }
        } catch (error) {
            setDuplicateCustomer("SĐT đã trùng")
            setTimeout(() => {
                setDuplicateCustomer('')
            }, 3000)
            console.error('There was an error adding customer!', error);
        }
    };


    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/Category`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setCategories(response.data);
                if (response.data.length > 0) {
                }
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Cart/items`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCard(response.data);
        } catch (error) {
            console.error('There was an error fetching the cart!', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [card.length])

    const handleAddToCart = (product) => {
        axios.post(
            `${config.API_ROOT}/api/Cart/add`,
            {
                productId: product.productId,
                quantity: 1
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                fetchData();
            })
            .catch(error => {
                console.error('There was an error adding the product to the cart!', error);
                if (error.response && error.response.status === 400) {
                    setCannotAddContinue(true);
                    setTimeout(() => {
                        setCannotAddContinue(false);
                    }, 3000);
                }
            });
    };


    const removeFromCart = async (productId) => {
        try {
            const response = await axios.delete(`${config.API_ROOT}/api/Cart/remove/${productId}?quantity=1`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchData();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('Bad request. Invalid data or missing required fields.');
            } else {
                console.error('There was an error removing the product from the cart:', error);
            }
        }
    };

    const handleCheckOut = async () => {

        if (card.length === 0) {
            setNoProductInCart('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
            setTimeout(() => {
                setNoProductInCart('')
            }, 3000)
        }

        const formData = new FormData();
        formData.append('phoneNumberCustomer', customer.phoneNumber);
        formData.append('customerName', customer.customerName);
        formData.append('email', customer.email);

        console.log('Payload:', Object.fromEntries(formData));

        try {
            const response = await axios.post(`${config.API_ROOT}/api/Cart/checkout`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.setItem('createOrderMessage', "Bạn đã tạo đơn hàng mới thành công");
            navigate('/staff/trang-chu-nv');
        } catch (error) {
            console.error('There was an error during checkout!', error);
        }
    };


    const fetchCustomer = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Customer/get-customer-by-phone-number?phone=${customerPhone}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCustomer(response.data);
            setCustomerPhone('');
        } catch (error) {
            console.error('There was an error fetching the customer!', error);
        }
    };

    useEffect(() => {
        fetchCustomerListSearch();
        if (customerPhone.length === 0) {
            setCustomers([]);
        }
    }, [customerPhone]);

    useEffect(() => {
        fetchCustomerListSearch();
        if (customerPhone.length === 10) {
            fetchCustomer();
        }
        if (customerPhone.length === 0) {
            setCustomers([]);
        }
    }, [customerPhone]);

    const fetchCustomerListSearch = async () => {
        if (customerPhone.length > 0 && customerPhone.length < 10) {
            try {
                const response = await axios.get(`${config.API_ROOT}/api/Customer/get-customers-by-phone-number?phone=${customerPhone}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCustomers(response.data.slice(0, 3));
            } catch (error) {
                console.error('There was an error fetching the customer list!', error);
            }
        }
    };

    //========================================================================================================

    const searchProduct = async () => {
        try {
            setActiveCategory(null);

            if (idOrName.length === 0) {
                const response = await axios.get(`${config.API_ROOT}/api/Product/GetProductByNameOrCode?pageNumber=${curProductPage}&pageSize=${pageSize}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);

                const response2 = await axios.get(`${config.API_ROOT}/api/Product/GetProductByNameOrCode?pageNumber=1&pageSize=1000`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTotalProducts(response2.data.length);
            } else {
                const response = await axios.get(`${config.API_ROOT}/api/Product/GetProductByNameOrCode?nameCode=${idOrName}&pageNumber=${curProductPage}&pageSize=${pageSize}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);

                const response2 = await axios.get(`${config.API_ROOT}/api/Product/GetProductByNameOrCode?nameCode=${idOrName}&pageNumber=1&pageSize=1000`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTotalProducts(response2.data.length);
            }

        } catch (error) {
            console.error('There was an error fetching the products!', error);
        }
    };

    const handleInputChangeIdOrName = (e) => {
        setOnSelect(1);
        setCurProductPage(1);
        setIdOrName(e.target.value);
    }

    useEffect(() => {
        if (onSelect === 1) {
            searchProduct();
        }
    }, [idOrName, curProductPage]);

    useEffect(() => {
        if (activeCategory != null && onSelect === 2) {
            fetchProductData(activeCategory);
        }
    }, [activeCategory, curProductPage]);

    const handleClickCategory = (categoryId) => {
        setOnSelect(2);
        setActiveCategory(categoryId);
        setCurProductPage(1);
    };

    const fetchProductData = async (categoryId) => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Product?filterOn=categoryId&filterQuery=${categoryId}&pageNumber=${curProductPage}&pageSize=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProducts(response.data);

            const totalResponse = await axios.get(`${config.API_ROOT}/api/Product?filterOn=categoryId&filterQuery=${categoryId}&pageNumber=1&pageSize=1000`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTotalProducts(totalResponse.data.length);

        } catch (error) {
            console.error('There was an error fetching the products by category!', error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurProductPage(newPage);
    };

    const handleProductDetail = (product) => {
        setPopupProduct(true);
        setSelectedProduct(product);
        let totalStonePrice = 0;
        product.stones.forEach(stone => {
            if (stone.isPrimary) {
                setPrimaryStone(stone);
            }
            totalStonePrice += stone.price;
        });
        setTotalPriceStones(totalStonePrice);
    };

    const handleCategoryChange = (categoryId, isChecked) => {
        setCurProductPage(1);
        setOnSelect(3);
        const updatedCategories = isChecked
            ? [...selectedCategories, categoryId]
            : selectedCategories.filter((id) => id !== categoryId);

        setSelectedCategories(updatedCategories);
        fetchFilteredProducts(updatedCategories, selectedGoldTypes, priceRange, curProductPage, pageSize);
    };

    const handleGoldTypeChange = (goldTypeId, isChecked) => {
        setCurProductPage(1);
        setOnSelect(3);
        const updatedGoldTypes = isChecked
            ? [...selectedGoldTypes, goldTypeId]
            : selectedGoldTypes.filter((id) => id !== goldTypeId);

        setSelectedGoldTypes(updatedGoldTypes);
        fetchFilteredProducts(selectedCategories, updatedGoldTypes, priceRange, curProductPage, pageSize);
    };

    const handlePriceChange = (newPriceRange) => {
        setCurProductPage(1);
        setOnSelect(3);
        setPriceRange(newPriceRange);
    };

    const fetchFilteredProducts = async (categories, goldTypes, priceRange, page, size) => {
        try {
            setActiveCategory(null);
            const apiUrl = `${config.API_ROOT}/api/Product`;

            const params = new URLSearchParams();
            if (categories && categories.length > 0 && goldTypes && goldTypes.length > 0) {
                // Both categories and goldTypes are not null
                params.append('filterOn', 'categoryId');
                params.append('filterQuery', categories.join(','));
                params.append('filterOn', 'goldId');
                params.append('filterQuery', goldTypes.join(','));
            } else if (categories && categories.length > 0) {
                // Only categories are not null
                params.append('filterOn', 'categoryId');
                params.append('filterQuery', categories.join(','));
            } else if (goldTypes && goldTypes.length > 0) {
                // Only goldTypes are not null
                params.append('filterOn', 'goldId');
                params.append('filterQuery', goldTypes.join(','));
            }
            params.append('minPrice', priceRange[0] * 1000000);
            params.append('maxPrice', priceRange[1] * 1000000);
            params.append('pageSize', size);
            params.append('pageNumber', page);

            console.log(`${apiUrl}?${params.toString()}`);
            const response = await axios.get(`${apiUrl}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchTotalProducts = async (categories, goldTypes, priceRange) => {
        try {
            const apiUrl = `${config.API_ROOT}/api/Product`;

            const params = new URLSearchParams();
            if (categories && categories.length > 0 && goldTypes && goldTypes.length > 0) {
                // Both categories and goldTypes are not null
                params.append('filterOn', 'categoryId');
                params.append('filterQuery', categories.join(','));
                params.append('filterOn', 'goldId');
                params.append('filterQuery', goldTypes.join(','));
            } else if (categories && categories.length > 0) {
                // Only categories are not null
                params.append('filterOn', 'categoryId');
                params.append('filterQuery', categories.join(','));
            } else if (goldTypes && goldTypes.length > 0) {
                // Only goldTypes are not null
                params.append('filterOn', 'goldId');
                params.append('filterQuery', goldTypes.join(','));
            }
            params.append('minPrice', priceRange[0] * 1000000);
            params.append('maxPrice', priceRange[1] * 1000000);
            params.append('pageSize', 1000);
            params.append('pageNumber', 1);

            console.log(`${apiUrl}?${params.toString()}`);
            const response = await axios.get(`${apiUrl}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTotalProducts(response.data.length);
        } catch (error) {
            console.error('Error fetching total products:', error);
        }
    };


    useEffect(() => {

        if (onSelect === 3) {
            fetchFilteredProducts(selectedCategories, selectedGoldTypes, priceRange, curProductPage, pageSize);
            fetchTotalProducts(selectedCategories, selectedGoldTypes, priceRange);
        }
    }, [selectedCategories, selectedGoldTypes, priceRange, curProductPage, pageSize]);


    //========================================================================================================


    const handleViewDetailIncard = async (id) => {
        axios.get(`${config.API_ROOT} /api/Product / ${id} `, {
            headers: {
                Authorization: `Bearer ${token} `
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setSelectedProduct(response.data);
                    setPopupProduct(true);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the product!', error);
            });

    }

    const renderPagination = () => {
        const totalPages = Math.ceil(totalProducts / pageSize);
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i} className={`page - item ${i === curProductPage ? 'active' : ''} `}>
                    <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
                </li>
            );
        }

        return (
            totalPages > 1 &&
            <ul className="pagination staffhome-panationing">
                <li className={`page - item ${curProductPage === 1 ? 'disabled' : ''} `}>
                    <button className="page-link" onClick={() => handlePageChange(curProductPage - 1)}>Previous</button>
                </li>
                {pages}
                <li className={`page - item ${curProductPage === totalPages ? 'disabled' : ''} `}>
                    <button className="page-link" onClick={() => handlePageChange(curProductPage + 1)}>Next</button>
                </li>
            </ul>
        );
    };


    useEffect(() => {
        setTimeout(() => {
            setCreateCustomerMessage('');
        }, 3000);
    }, [createCustomerMessage]);

    const handleChooseCustomer = (customerChoose) => {
        setCustomer(customerChoose);
        setCustomerPhone('');
        setCustomers([]);
    }

    const startScan = () => {
        setScanning(true);
    };

    const handleScan = async () => {
        if (!scanning) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            try {
                const code = await decodeBarcode(imageSrc);
                if (code) {
                    setBarcode(code);
                    await addToCart(code);
                    setScanning(false);
                }
            } catch (error) {
                console.error('Barcode decoding failed', error);
            }
        }
    };

    const decodeBarcode = async (imageSrc) => {
        const codeReader = new BrowserMultiFormatReader();
        try {
            const result = await codeReader.decodeFromImage(undefined, imageSrc);
            return result.text;
        } catch (error) {
            return null;
        }
    };

    const addToCart = async (code) => {
        axios.post(`${config.API_ROOT} /api/Cart / add`,
            {
                productId: code,
                quantity: 1
            },
            {
                headers: {
                    Authorization: `Bearer ${token} `
                }
            }
        )
            .then(response => {
                fetchData();
            })
            .catch(error => {
                console.error('There was an error adding the product to the cart!', error);
            });

    };

    useEffect(() => {
        let interval;
        if (scanning) {
            interval = setInterval(handleScan, 300); // Quét mỗi 300ms
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [scanning]);

    const closeScan = () => {
        setScanning(false);
    }

    return (
        <div className="container-fluid order ">
            {createCustomerMessage && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3 ">
                    {createCustomerMessage}
                </div>

            )}
            {noProductInCart && (
                <div className="alert alert-danger position-fixed top-8 end-0 m-3">
                    Không có sản phẩm trong giỏ hàng
                </div>
            )}
            {duplicateCustomer && (
                <div className="alert alert-danger position-fixed top-8 end-0 m-3 sdfsdf">
                    Số điện thoại khách hàng đã được tạo
                </div>
            )}
            {cannotAddContinue && (
                <div className="alert alert-danger position-fixed top-8 end-0 m-3">
                    Sản phẩm không còn hàng để thêm vào đơn hàng
                </div>
            )}

            <div className="row ">
                <div className="col-2 sidebar-order ">
                    <div className="order-category text-center">
                        DANH MỤC
                    </div>
                    <ul className="category-list">
                        {categories.map((category) => (
                            <li
                                key={category.categoryId}
                                className={`category-item ${activeCategory === category.categoryId ? 'sidebar-active' : ''}`}
                                onClick={() => handleClickCategory(category.categoryId)}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-7 san-phamb vertical-line">
                    <div className="text-center  san-pham">
                        <h3 className="order-category">SẢN PHẨM</h3>
                        <div className="d-flex">
                            <div className="search-form d-flex align-items-center div-search">
                                <input className="input-search form-control min-width-100vh" type="text" placeholder="Nhập mã hoặc tên sản phẩm để tìm sản phẩm..." name="idOrName" value={idOrName} onChange={handleInputChangeIdOrName} />
                                <i type="submit" className="btn btn-search" onClick={searchProduct}>
                                    <i className="fas fa-search"></i>
                                </i>
                            </div>
                            <i className="fas fa-filter btn btn-info btn-filter" onClick={() => setPopupFilter(!popupFilter)}></i>
                            {popupFilter &&
                                <div className='popup-filter' onMouseLeave={() => setPopupFilter(false)}>
                                    <h4 className='text-center filter-title'>BỘ LỌC SẢN PHẨM</h4>
                                    <div className='row d-flex'>
                                        <div className='col-2 category-filter'>
                                            <h6>Danh mục: </h6>
                                            {categories.map((category, index) => (
                                                <div key={index}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category.categoryId)}
                                                        onChange={(e) => handleCategoryChange(category.categoryId, e.target.checked)}
                                                    />
                                                    {category.name}
                                                </div>
                                            ))}
                                        </div>
                                        <div className='col-2'>
                                            <h6>Loại vàng: </h6>
                                            {goldTypes.map((gold, index) => (
                                                <div key={index}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedGoldTypes.includes(gold.goldId)}
                                                        onChange={(e) => handleGoldTypeChange(gold.goldId, e.target.checked)}
                                                    />
                                                    {gold.goldName}
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                    <div className='price-filter'>
                                        <h6>Lọc theo giá sản phẩm: </h6>
                                        <SliderPrice onPriceChange={handlePriceChange} priceRange={priceRange} />
                                    </div>
                                </div>
                            }
                            <i className="fas fa-barcode btn btn-primary ms-2" onClick={startScan}></i>
                        </div>
                        <div className="product-list d-flex">
                            {noProductMessage && <div className='noProduct mt-8'>
                                {noProductMessage}
                            </div>}
                            {products?.map((product) => (
                                <div className="card product-item" key={product.productId}>
                                    <div className="link-xem-chi-tiet-san-pham" onClick={() => handleProductDetail(product)}>
                                        <img
                                            className="card-img-top img-product-item"
                                            src={product.image}
                                            alt={product.productName}
                                        />
                                    </div>
                                    <div className="card-body">
                                        <div className="link-xem-chi-tiet-san-pham" onClick={() => handleProductDetail(product)}>
                                            <h5 className="card-title product-name fw-bold">{product.productName}</h5>
                                            <h5 className="card-title product-id">{product.productCode}</h5>
                                            <h6 className="product-price fw-bold">{numeral(product.price).format("0,0")} VND</h6>
                                        </div>
                                        {product.quantity > 0 &&
                                            <div className="text-center">
                                                <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>
                                                    <i className="fas fa-cart-plus margin-right"></i>
                                                    Thêm vào đơn hàng
                                                </button>
                                            </div>
                                        }

                                        {product.quantity === 0 &&
                                            <div className="text-center">
                                                <button className="btn btn-secondary disable" onClick={() => handleAddToCart(product)}>
                                                    <i className="fas fa-exclamation-triangle margin-right"></i>
                                                    Sản phẩm đã hết hàng
                                                </button>
                                            </div>}
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                        {popupProduct && <div className='out-product-popup'>
                            <div className="row product-detail-popup">
                                <div className="col-5">
                                    <div className="product-detail-img">
                                        <img className="product-detail-picture" src={selectedProduct.image} alt={selectedProduct.productName} />
                                    </div>
                                </div>
                                <div className="col-7 product-info">
                                    <div className="off-popup" onClick={() => { setPopupProduct(false) && setSelectedProduct({}) && setTotalPriceStones(0) }}>
                                        <i className="far fa-times-circle btn btn-danger btn-off-popup"></i>
                                    </div>
                                    <div className="d-flex align-items-center detail-info">
                                        <div className="product-info-detail">
                                            <span className="fw-bold">Tên sản phẩm: </span> <span className='product-detail-name'>{selectedProduct.productName}</span><br />
                                            <span className="fw-bold">Mã sản phẩm:</span> <span> {selectedProduct.productCode}</span><br />
                                            <span className="fw-bold">Loại vàng:</span> <span> {selectedProduct.goldTypes.goldName}</span><br />
                                            <span className="fw-bold">Trọng lượng vàng:</span> <span> {selectedProduct.goldWeight} chỉ</span><br />
                                            {selectedProduct.stones.length >= 1 &&
                                                <>
                                                    <span className="fw-bold">Đá chính:</span> <span>{primaryStone.name}</span><br />
                                                    <span className="fw-bold">Màu đá chính:</span> <span> {primaryStone.color}</span><br />
                                                    <span className="fw-bold">Tổng tiền đá:</span> <span> {numeral(totalPriceStones).format(0, 0)} VND</span><br />
                                                </>
                                            }
                                            <span className="fw-bold">Tiền công:</span><span> {numeral(selectedProduct.wage).format(0, 0)} VND</span><br />
                                            <span className="fw-bold">Số lượng còn lại:</span><span> {selectedProduct.quantity}</span><br />
                                            <span className="fw-bold">Thành tiền:</span> <span className='product-detail-name'> {numeral(selectedProduct.price).format(0, 0)} VND</span><br />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>}
                        <nav aria-label="..." className="pagination-order position-absolute end-0 ">
                            {renderPagination()}
                        </nav>
                    </div>
                </div>
                <div className="col-3 don-hang">
                    <div className="">
                        <h3 className="order-category text-center">ĐƠN HÀNG</h3>
                        <div className="d-flex div-search">
                            <form className="search-form d-flex align-items-center search-customer">
                                <input className="input-search form-control"
                                    name="customerPhone"
                                    type="text"
                                    placeholder="Nhập sđt để tìm khách hàng ..."
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                />
                                <i className="btn btn-search" onClick={fetchCustomer}>
                                    <i className="fas fa-search"></i>
                                </i>
                            </form>
                            <button className="fas fa-user-plus btn btn-primary d-flex align-items-center justify-content-center add-cus" onClick={togglePopup}></button>
                            {showPopup && (
                                <div className="popup">
                                    <div className="popup-content">
                                        <h2>Thêm thông tin khách hàng</h2>
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="input-group">
                                                <label htmlFor="name">Tên:</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.name && formik.errors.name ? (
                                                    <span className="error">{formik.errors.name}</span>
                                                ) : null}
                                            </div>
                                            <div className="input-group">
                                                <label htmlFor="email">Email:</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email2"
                                                    value={formik.values.email2}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.email2 && formik.errors.email2 ? (
                                                    <span className="error">{formik.errors.email2}</span>
                                                ) : null}
                                            </div>
                                            <div className="input-group">
                                                <label htmlFor="phone">Số điện thoại:</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formik.values.phone}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.phone && formik.errors.phone ? (
                                                    <span className="error">{formik.errors.phone}</span>
                                                ) : null}
                                            </div>
                                            <div className="nutbam text-center">
                                                <button type="button" className="btn btn-danger close-button" onClick={togglePopup}>Hủy bỏ</button>
                                                <button type="submit" className="btn btn-success ms-4">Lưu</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                        </div>
                        <>
                            {customers.length > 0 && (
                                <ul className="results-list">
                                    Thông tin khách hàng phù hợp:
                                    {customers.map((customerSearch) => (
                                        <li className='position-relative' key={customerSearch.customerId}>
                                            {customerSearch.customerName} - {customerSearch.phoneNumber}
                                            <i className="fas fa-plus-circle position-absolute top-0 end-0 m-1 btn btn-success p-2" onClick={() => handleChooseCustomer(customerSearch)}></i></li>
                                    ))}
                                </ul>
                            )}

                        </>
                        <div className="cus-info">
                            <h5 className="fw-bold">Thông tin khách hàng: </h5>
                            <div className='d-flex cus-input'>
                                <span className="cus-name fw-bold">Khách hàng: </span>
                                <input
                                    className='cus-input xxzz'
                                    type="text"
                                    name="customerName"
                                    value={customer?.customerName}
                                    onChange={handleChange}
                                    maxLength={30}
                                />

                            </div>
                            <div className='d-flex cus-input'>
                                <span className="cus-name fw-bold">Số điện thoại: </span>
                                <input
                                    className='cus-input xxzz'
                                    type="text"
                                    name="phoneNumber"
                                    value={customer?.phoneNumber}
                                    onChange={handleChange}
                                    maxLength={10}
                                />
                            </div>
                            <div className='d-flex cus-input'>
                                <span className="cus-name fw-bold">Email: </span>
                                <input
                                    className='cus-input xxzz'
                                    type="email"
                                    name="email"
                                    value={customer?.email}
                                    onChange={handleChange}
                                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                />
                            </div>
                        </div>
                        <div className="order-info">
                            <h5 className="fw-bold">Thông tin đơn hàng:</h5>
                            <div className="order-product-list">
                                {card.map((item, index) => (
                                    <div className="order-item d-flex" key={index}>
                                        <img className="img-product" src={selectedProduct.image} alt={selectedProduct.productName} onClick={() => handleViewDetailIncard(item.productId)} />
                                        <div className="product-info">
                                            <h5>{item.productName}</h5>
                                            <div className="price-quantity">
                                                <h6 className="">{numeral(item.subTotal / item.quantity).format("0,0")} VND</h6>
                                                <div className="quantity-controls">
                                                    <span>SL: </span>
                                                    <button className="btn btn-sm" onClick={() => removeFromCart(item.productId)}>-</button>
                                                    <span className="quantity">{item.quantity}</span>
                                                    <button className="btn btn-sm" onClick={() => handleAddToCart(item)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {card.map((item) => {
                                numOfItems = numOfItems + item.quantity;
                                total = total + item.subTotal
                            })}
                            <div className="tong-sl d-flex">
                                <h6 className="sl-text fw-bold">Tổng số lượng sản phẩm: </h6>
                                <h6 className="sl-num">{numOfItems}</h6>
                            </div>
                            <div className="tong-tien d-flex">
                                <h6 className="tien-text fw-bold">Tổng tiền: </h6>
                                <h6 className="tien-num">{numeral(total).format("0,0")} VNĐ</h6>
                            </div>
                            <div className="text-center nut-order">
                                <Link to="/staff/trang-chu-nv" className="btn btn-danger btn-order huy-bo-order fw-bold" onClick={clearCart}>Hủy bỏ</Link>
                                <button className="btn btn-success btn-order fw-bold" onClick={handleCheckOut}>Tạo đơn hàng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {
                scanning &&
                <div className='out-video'>
                    <div className='scan-barcode'>
                        <div className='d-flex header-scan'>
                            <h3>Đang quét mã vạch ...</h3>
                            <i className="fas fa-window-close btn btn-danger close-video" onClick={closeScan}></i>
                        </div>
                        <br />
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={640}
                            height={480}
                            className='video-scanner'
                        />
                    </div>
                </div>
            }
        </div >
    );
}

export default CreateOrder;