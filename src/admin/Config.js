import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import './Config.css';

export default function Config() {
    const [popup, setPopup] = useState(false);
    const [info, setInfo] = useState({
        avatar: null,
        logo: "",
        slogan: "",
        address: "",
        email: "",
        numberPhone: "",
        taxNumber: "",
        customerPolicy: "Chính sách thanh toán, Chính sách bảo hành, Chính sách bảo mật, Chính sách về vấn đề pháp lý",
        footer: ""
    });
    const [success, setSuccess] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch("https://kimnganhoanbeta.azurewebsites.net/api/StoreInfo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setInfo(data);
                formik.setValues(data);
            })
            .catch(error => console.error("Error fetching store info:", error));
    }, [popup]);

    const fileValidation = {
        avatar: Yup.mixed()
            .test('fileSize', 'Ảnh đại diện phải nhỏ hơn 5MB', (value) => !value || (value && value.size <= 5 * 1024 * 1024))
            .test('fileType', 'Ảnh đại diện phải là định dạng JPG hoặc PNG', (value) => !value || (value && ['image/jpeg', 'image/png'].includes(value.type))),
        logo: Yup.mixed()
            .test('fileSize', 'Ảnh quảng cáo phải nhỏ hơn 5MB', (value) => !value || (value && value.size <= 5 * 1024 * 1024))
            .test('fileType', 'Ảnh quảng cáo phải là định dạng JPG hoặc PNG', (value) => !value || (value && ['image/jpeg', 'image/png'].includes(value.type)))
    };

    const validationSchema = Yup.object().shape({
        avatar: fileValidation.avatar,
        logo: fileValidation.logo,
        slogan: Yup.string()
            .min(10, 'Khẩu hiệu phải có ít nhất 10 ký tự')
            .max(100, 'Khẩu hiệu không được vượt quá 100 ký tự')
            .matches(/^[a-zA-Z0-9\sÀ-ỹ]*$/, 'Khẩu hiệu không được chứa ký tự đặc biệt')
            .required('Khẩu hiệu là bắt buộc'),
        address: Yup.string()
            .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
            .max(200, 'Địa chỉ không được vượt quá 200 ký tự')
            .matches(/^[a-zA-Z0-9\sÀ-ỹ\/,]*$/, 'Địa chỉ không hợp lệ')
            .required('Địa chỉ là bắt buộc'),
        email: Yup.string()
            .email('Email không hợp lệ')
            .max(30, 'Email không được vượt quá 30 ký tự')
            .required('Email là bắt buộc'),
        numberPhone: Yup.string()
            .matches(/^[0-9]{10}$/, 'Số điện thoại phải là 10 số')
            .required('Số điện thoại là bắt buộc'),
        taxNumber: Yup.string()
            .matches(/^[0-9]{10}$/, 'Mã số thuế không hợp lệ')
            .required('Mã số thuế là bắt buộc'),
        footer: Yup.string()
            .min(10, 'Doanh nghiệp phải có ít nhất 10 ký tự')
            .max(100, 'Doanh nghiệp không được vượt quá 100 ký tự')
            .matches(/^[a-zA-Z0-9\sÀ-ỹ]*$/, 'Doanh nghiệp không hợp lệ')
            .required('Doanh nghiệp là bắt buộc'),
    });

    const formik = useFormik({
        initialValues: {
            avatar: null,
            logo: null,
            slogan: "",
            address: "",
            email: "",
            numberPhone: "",
            taxNumber: "",
            footer: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            if (values.logo) {
                formData.append('LogoFile', values.logo);
            }
            formData.append('Slogan', values.slogan);
            formData.append('Address', values.address);
            formData.append('Email', values.email);
            formData.append('NumberPhone', values.numberPhone);
            formData.append('TaxNumber', values.taxNumber);
            formData.append('Footer', values.footer);
            if (values.avatar) {
                formData.append('Avatar', values.avatar);
            }

            fetch("https://kimnganhoanbeta.azurewebsites.net/api/StoreInfo/update", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    setInfo(data);
                    setPopup(false);
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                })
                .catch(error => console.error("Error updating store info:", error));
        }
    });

    const openPopup = () => {
        formik.setValues({ ...info });
        setPopup(true);
    };
    return (
        <div className="config">
            <div className="title title-config">
                <p>Thông Tin Cửa Hàng</p>
            </div>
            {success && (
                <div className="alert alert-success position-fixed end-0 updateConfigSuccess">
                    Bạn đã cập nhật thông tin cửa hàng thành công
                </div>
            )}

            {popup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Chỉnh sửa thông tin</h2>
                        <form onSubmit={formik.handleSubmit} className="info-text-config">
                            <div className="d-flex">
                                <div>
                                    <div className="d-flex">
                                        <label htmlFor="avatar" className="label-img">Ảnh đại diện:</label>
                                        <input type="file" id="avatar" name="avatar" className="asas" onChange={(e) => formik.setFieldValue('avatar', e.target.files[0])} />
                                    </div>
                                    {formik.touched.avatar && formik.errors.avatar ? (
                                        <div className="error error-config">{formik.errors.avatar}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="d-flex">
                                        <label htmlFor="logo " className="label-img">Ảnh quảng cáo:</label>
                                        <input type="file" id="logo" name="logo" className="asas" onChange={(e) => formik.setFieldValue('logo', e.target.files[0])} />
                                    </div>
                                    {formik.touched.logo && formik.errors.logo ? (
                                        <div className="error error-config">{formik.errors.logo}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="d-flex">
                                <label htmlFor="footer">Doanh nghiệp:</label>
                                <input type="text" id="footer" name="footer" value={formik.values.footer} onChange={formik.handleChange} />
                            </div>
                            {formik.touched.footer && formik.errors.footer ? (
                                <div className="error error-config">{formik.errors.footer}</div>
                            ) : null}

                            <div className="d-flex">
                                <label htmlFor="slogan">Khẩu hiệu:</label>
                                <input type="text" id="slogan" name="slogan" value={formik.values.slogan} onChange={formik.handleChange} />
                            </div>
                            {formik.touched.slogan && formik.errors.slogan ? (
                                <div className="error error-config">{formik.errors.slogan}</div>
                            ) : null}

                            <div className="d-flex">
                                <label htmlFor="address">Địa chỉ:</label>
                                <input type="text" id="address" name="address" value={formik.values.address} onChange={formik.handleChange} />
                            </div>
                            {formik.touched.address && formik.errors.address ? (
                                <div className="error error-config">{formik.errors.address}</div>
                            ) : null}

                            <div className="d-flex">
                                <label htmlFor="email">Email:</label>
                                <input type="text" id="email" name="email" value={formik.values.email} onChange={formik.handleChange} />
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="error error-config">{formik.errors.email}</div>
                            ) : null}

                            <div className="d-flex">
                                <label htmlFor="numberPhone">Số điện thoại:</label>
                                <input type="text" id="numberPhone" name="numberPhone" value={formik.values.numberPhone} onChange={formik.handleChange} />
                            </div>
                            {formik.touched.numberPhone && formik.errors.numberPhone ? (
                                <div className="error error-config">{formik.errors.numberPhone}</div>
                            ) : null}

                            <div className="d-flex">
                                <label htmlFor="taxNumber">Mã số thuế:</label>
                                <input type="text" id="taxNumber" name="taxNumber" value={formik.values.taxNumber} onChange={formik.handleChange} />
                            </div>
                            {formik.touched.taxNumber && formik.errors.taxNumber ? (
                                <div className="error error-config" >{formik.errors.taxNumber}</div>
                            ) : null}

                            <div className="d-flex justify-content-around">
                                <button type="button" className="btn btn-secondary btn-config" onClick={() => setPopup(false)}>Hủy</button>
                                <button type="submit" className="btn btn-success btn-config">Cập Nhật</button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }

            <div className="edit-config">
                <i className="fas fa-edit btn btn-primary" onClick={openPopup}>
                    <p>Chỉnh sửa thông tin</p>
                </i>
            </div>

            <table className="config-info justify-content-center align-items-center">
                <tr className="img-logo-config">
                    <td className="header-cell">Ảnh đại diện</td>
                    <td><img src={info.avatar} alt="avatar" /></td>
                </tr>
                <tr className="img-logo-config">
                    <td className="header-cell">Ảnh quảng cáo</td>
                    <td><img src={info.logo} alt="logo" /></td>
                </tr>
                <tr>
                    <td className="header-cell">Doanh nghiệp</td>
                    <td>{info.footer}</td>
                </tr>
                <tr>
                    <td className="header-cell">Địa chỉ</td>
                    <td>{info.address}</td>
                </tr>
                <tr>
                    <td className="header-cell">Email</td>
                    <td>{info.email}</td>
                </tr>
                <tr>
                    <td className="header-cell">Số điện thoại</td>
                    <td>{info.numberPhone}</td>
                </tr>
                <tr>
                    <td className="header-cell">Mã số thuế</td>
                    <td>{info.taxNumber}</td>
                </tr>
                <tr>
                    <td className="header-cell">Khẩu hiệu</td>
                    <td>{info.slogan}</td>
                </tr>
            </table>
        </div >
    );
}
