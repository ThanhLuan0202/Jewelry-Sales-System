<form onSubmit={handleSubmit}>
    <header className="modal-product-headerr">
        <p>Tạo Sản Phẩm Mới</p>
    </header>
    <div>
        <div className="modal-product-body ">
            <div className="modal-product-body-left">
                <label htmlFor="product-name" className="modal-product-label">
                    Code Sản Phẩm
                </label>
                <input
                    type="text"
                    id="productCode"
                    className="modal-product-input"
                    name="productCode"
                    value={formData.productCode}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="product-name" className="modal-product-label">
                    Tên Sản Phẩm
                </label>
                <input
                    type="text"
                    id="productName"
                    className="modal-product-input"
                    name="productName"
                    value={formData.productName || updatedProduct.productName}
                    onChange={handleChange}
                    required
                />
                <label
                    htmlFor="product-labor-des"
                    className="modal-product-label xxx "
                >
                    Mô Tả
                </label>
                <input
                    type="text"
                    id="des"
                    className="modal-product-input"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}

                />
                <label htmlFor="product-size" className="modal-product-label">
                    Kích Cỡ
                </label>
                <input
                    type="number"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="modal-product-input"
                    step="0.5"
                />
                <label htmlFor="product-image" className="modal-product-label">
                    Ảnh
                </label>
                <div className="modal-product-image-upload">
                    <input
                        type="file"
                        className="modal-product-image-input"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                    />
                </div>
                <label
                    htmlFor="product-quantity"
                    className="modal-product-label y"
                >
                    Số Lượng
                </label>
                <input
                    type="number"
                    id="quantity"
                    className="modal-product-input"
                    name="quantity"
                    value={formData.quantity || updatedProduct.quantiy}
                    onChange={handleChange}
                />
            </div>
            <div className="modal-product-body-right">
                <label
                    htmlFor="product-category"
                    className="modal-product-label xyy"
                >
                    Danh Mục
                </label>
                <div className="combobox create-combobox-cagetory xs">
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId || updatedProduct.categoryId}
                        onChange={handleChange}
                        className="ms-2"
                    >
                        <option value="" defaultValue disabled>
                            Danh Mục
                        </option>
                        {categories.map((cagetory, index) => (
                            <option key={index} value={cagetory.categoryId}>{cagetory.name}</option>
                        ))}
                    </select>
                </div>
                <label
                    htmlFor="product-gold-type"
                    className="modal-product-label loaiVang"
                >
                    Loại Vàng
                </label>

                <div className="combobox create-combobox-product cbLoaiVang">
                    <select
                        id="goldId"
                        name="goldId"
                        value={formData.goldId}
                        onChange={handleChange}
                        className="ms-2"
                    >
                        <option value="" defaultValue disabled>
                            Loại Vàng
                        </option>
                        {golds.map((gold, index) => (
                            <option key={index} value={gold.goldId}>{gold.goldName}</option>

                        ))}
                    </select>
                </div>

                <label
                    htmlFor="product-gold-weight"
                    className="modal-product-label xx"
                >
                    Khối Lượng Vàng
                </label>
                <input
                    type="number"
                    id="goldWeight"
                    name="goldWeight"
                    value={formData.goldWeight || updatedProduct.goldWeight}
                    onChange={handleChange}
                    className="modal-product-input"
                    step="0.1"
                />

            </div>
        </div>
        <div className="modal-product-body">
            <div className="modal-product-body-left">


            </div>
            <div className="modal-product-body-right">

                <label
                    htmlFor="product-labor-cost"
                    className="modal-product-label x"
                >
                    Tiền Công
                </label>
                <input
                    type="number"
                    id="wage"
                    className="modal-product-input"
                    name="wage"
                    value={formData.wage || updatedProduct.wage}
                    onChange={handleChange} step="10000"
                />
                <label
                    htmlFor="product-labor-cost"
                    className="modal-product-label priceSp"
                >
                    Giá Sản Phẩm
                </label>
                <input
                    type="number"
                    id="price"
                    className="modal-product-input"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="10000"
                />
                <label
                    htmlFor="product-labor-des"
                    className="modal-product-label "
                >
                    Thời Hạn Bảo Hành
                </label>
                <input
                    type="number"
                    id="des"
                    className="modal-product-input"
                    name="warrantyPeriod"
                    value={formData.warrantyPeriod || updatedProduct.warrantyPeriod}
                    onChange={handleChange}

                />
            </div>
        </div>
        <button
            id="create-pro"
            className="modal-product-button"
            type="submit"
            onClick={closeModal}
        >
            Tạo
        </button>
    </div>
</form>