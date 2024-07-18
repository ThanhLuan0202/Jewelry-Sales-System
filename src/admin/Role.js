import React, { useState, useEffect } from "react";
import axios from "axios";

import "./Role.css";
import config from "../config/config";

function Role() {
  const [showModal, setShowModal] = useState(false);
  const [tenVaiTro, setTenVaiTro] = useState("")
  const [rolesCount, setRolesCount] = useState(0)

  const [roles, setRoles] = useState([]);

  const [showModalUpdate, setShowModalUpdate] = useState(false);


  const [idVaiTroSearch, setIdVaiTroSearch] = useState("")

  const [roleToIdUpdate, setRoleToIdUpdate] = useState("");
  const [tenVaiTroUpdate, setTenVaiTroUpdate] = useState("");
  const [trangThaiVaiTroUpdate, setTrangThaiVaiTroUpdate] = useState("");
  const token = localStorage.getItem("token");

  //-------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [nameVaiTro, setNameVaiTro] = useState("");

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

  // const handleSearch = async () => {
  //   try {
  //     const response = await axios.get(`${config.API_ROOT}/api/Roles/${idVaiTroSearch}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );
  //     setRoles([response.data]);
  //     setRolesCount(1);
  //   } catch (error) {
  //     console.error("Có lỗi khi tìm kiếm khách hàng!", error);
  //   }
  // };

  const handleDelete = async (roleId) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/Roles/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Cập nhật lại danh sách các vai trò sau khi xóa thành công
      
      setDeleteSuccess(true);
    } catch (error) {
      console.error('Xảy ra lỗi khi xóa vai trò!', error);
    }
  };
  //------------------------------------------------
  //update role

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Roles/${roleToIdUpdate}`,
        {
          roleName: tenVaiTroUpdate,

          status: "active",
        }
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUpdateSuccess(true);
    } catch (error) {
      console.error("There was an error updating the role!", error);
    }
    closeModalUpdate();

  };
  const handleEditClick = (role) => {
    showUpdateForm();
    setNameVaiTro(role.roleName)
    setRoleToIdUpdate(role.roleId);

  };



  //------------------------------------------------

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
        setRolesCount(roles.length);

      });
  }, [addSuccess || updateSuccess || deleteSuccess]);
  const showAddForm = () => {
    setShowModal(true);
  }
  const showUpdateForm = () => {
    setShowModalUpdate(true);
  }
  const handleCreate = async () => {

    try {
      const response = await axios.post(`${config.API_ROOT}/api/Roles`, {
        roleName: tenVaiTro
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      closeModal();
      setTenVaiTro("");


      console.log('Role created successfully:', response.data);
      setAddSuccess(true);
    } catch (error) {
      console.error('There was an error adding role!', error);
    }
  };
  const closeModal = () => {
    setShowModal(false);

  }
  const closeModalUpdate = () => {
    setShowModalUpdate(false);

  }
  
  return (
    <div className="col-10">
      <div className="role">
        <div className={`alert alert-success position-fixed  notify-item-add-success ${addSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Add role success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-delete-success ${deleteSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Delete role success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-update-success ${updateSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Update role success
        </div>
        <div className="title" id="titleRole">
          <p>Quản Lý Vai Trò</p>
        </div>

        <div className="tagResult">
          <div className="tagResultRole">
            <div className="tagChild">
            <i className="fas fa-user-tag"></i>
            </div>
            <h3>Số Vai Trò</h3>
            <p>{rolesCount} Vai Trò</p>
          </div>
        </div>
        <div className="roleDetail">
          <p>Danh sách vai trò</p>
          {/* <div className="search">
            <input type="text"
              name="idVaiTroSearch"
              value={idVaiTroSearch}
              onChange={(e) => setIdVaiTroSearch(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
          </div> */}
          {/* <button className="addRole" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p>Tạo Mới Vai Trò</p>
          </button> */}
          <table className="table mb40">
            <thead>
              <tr>
       
                <th>Mã Vai Trò</th>
                <th>Tên Vai Trò</th>
                {/* <th>Thao Tác</th> */}

              </tr>
            </thead>
            <tbody>

              {roles.map((role, index) => (
                <tr key={index}>
             
                  <td>{role.roleId}</td>
                  <td>{role.roleName}</td>
                  {/* <td>
                   <i className="btn btn-danger fas fa-trash-alt delete" onClick={() => handleDelete(role.roleId)}></i> 
                  <i className="btn btn-primary fas fa-edit update ms-2" onClick={() => handleEditClick(role)}></i> 
                  </td> */}
                </tr>
              ))}


            </tbody>
          </table>
        </div>
      </div>

      <div className={`modal-role ${showModal ? 'open' : ''}`}>
        <div className="modal-child-role">
          <div className="modal-role-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-role-headerr">
            <p>Tạo Vai Trò Mới</p>
          </header>
          <div className="modal-role-body">
            <label htmlFor="name-role" className="model-role-label">
              Tên Vai Trò
            </label>
            <input id="name-role" type="text" className="modal-role-input" name="tenVaiTroc" value={tenVaiTro} onChange={(e) => setTenVaiTro(e.target.value)} />
            <button id="create-role" onClick={handleCreate}>Tạo</button>
          </div>
        </div>
      </div>

      /**-------------------------------------------------------- */

      <div className={`modal-role-update ${showModalUpdate ? 'open' : ''}`}>
        <div className="modal-child-role-update">
          <div className="modal-role-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-role-headerr-update">
            <p>Thay Đổi Thông Tin Vai Trò</p>
          </header>
          <div className="modal-role-body-update">
            <label htmlFor="name-role-update" className="model-role-label-update">
              Tên Vai Trò
            </label>
            <input 
            id="name-role-update" 
            type="text" 
            className="modal-role-input-update" 
            name="tenVaiTroUpdate" 
            value={tenVaiTroUpdate || nameVaiTro} onChange={(e) => setTenVaiTroUpdate(e.target.value)} />
           
            <button id="create-role-update" onClick={handleUpdate}>Cập Nhật</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Role;
