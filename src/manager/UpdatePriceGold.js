import React, { useState, useEffect } from "react";
import "./UpdatePriceGold.css";

function UpdatePriceGold() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://localhost:7184/api/GoldTypes",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPosts(posts);
      });
  });

  return (
    <div className="col-10">
      <div className="updatePriceGold">
        <div className="title tl">
          <p>Cập Nhật Giá Vàng</p>
        </div>

        <div className="updateDetail">
          <p>Cập nhật giá vàng</p>
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Loại Vàng</th>
                <th>Giá Mua</th>
                <th>Giá Bán</th>
                <th>Thao Tác</th>

              </tr>
            </thead>
            <tbody>

              {posts.map((post, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{post.goldName}</td>
                  <td>{post.buyPrice}</td>
                  <td>{post.sellPrice}</td>
                  <td>
                    <i className="btn btn-danger fas fa-trash-alt delete"></i>
                    <i className="btn btn-primary fas fa-edit update"></i>
                  </td>

                </tr>
              ))}



            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
export default UpdatePriceGold;
