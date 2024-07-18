import "./ResetPassword.css";
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import config from "../config/config";
import { useFormik } from 'formik';
import * as Yup from 'yup';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
    const navigate = useNavigate();
    const query = useQuery();
    const token = query.get('token');
    const [error, setError] = useState('');
    const [info, setInfo] = useState({});

    const fetchInfo = () => {
        fetch("https://kimnganhoanbeta.azurewebsites.net/api/StoreInfo", {
        })
            .then(response => response.json())
            .then(data => {
                setInfo(data);
            })
            .catch(error => console.error("Error fetching store info:", error));
    }

    useEffect(() => {
        fetchInfo();
    }, []);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirm: '',
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(3, 'Mật khẩu phải dài ít nhất 3 ký tự')
                .max(20, 'Mật khẩu không được dài quá 20 ký tự')
                .required('Mật khẩu là bắt buộc'),
            confirm: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
                .required('Mật khẩu xác nhận là bắt buộc')
        }),
        onSubmit: (values) => {
            resetRequest(values);
        },
    });

    const resetRequest = async (values) => {
        try {
            const response = await axios.post(`${config.API_ROOT}/api/PasswordReset/reset-password`, {
                token: token,
                newPassword: values.newPassword,
                confirmPassword: values.confirm
            });

            if (response.status === 200) {
                formik.resetForm();
                localStorage.setItem("reset-password", "Bạn đã thay đổi mật khẩu thành công. Vui lòng đăng nhập tại đây");
                navigate("/");
            }
        } catch (error) {
            console.error('There was an error when resetting the password!', error);
            setError("Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại.");
        }
    }

    return (
        <div className="out-background">
            <div className="container my-4 bg">
                <div className="d-flex login-form">
                    <div className="mb-5 d-flex justify-content-center align-items-center">
                        <div className="d-flex flex-column justify-content-center align-items-center gradient-custom-2 mb-4 img-logo">
                            <img src={info.avatar} alt="logo" />
                        </div>
                    </div>
                    <div className="mb-5 login">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="reset-container">
                                <div className="input-container">
                                    <h6>Vui lòng nhập mật khẩu mới:</h6>
                                    <input className="mt-1" type="password" name="newPassword"
                                        value={formik.values.newPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    {formik.touched.newPassword && formik.errors.newPassword ? (
                                        <span className="error-reset">{formik.errors.newPassword}</span>
                                    ) : null}
                                    <br />
                                    <h6 className="mt-4">Vui lòng xác nhận lại mật khẩu:</h6>
                                    <input className="mt-1" type="password" name="confirm"
                                        value={formik.values.confirm}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                    <br />
                                    {formik.touched.confirm && formik.errors.confirm ? (
                                        <span className="error-reset">{formik.errors.confirm}</span>
                                    ) : null}
                                </div>
                                <button className="reset-button" type="submit">Đổi mật khẩu</button>
                                <div className="mt-2 d-flex justify-content-end">
                                    <Link to={"/"}>Nhấn vào đây để quay lại trang login</Link >
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div >
    )
}
