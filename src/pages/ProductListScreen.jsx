import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  createProduct,
  deleteProduct,
  resetProductCreate,
  resetProductDelete,
} from "../redux/slices/productSlice";
import { useNavigate } from "react-router-dom";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    products,
    loading,
    error,
    successCreate,
    successDelete,
    createdProduct,
  } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetProductDelete()); // Reset delete status on component mount
    if (userInfo && userInfo.isAdmin) {
      if (successCreate) {
        navigate(`/admin/product/${createdProduct._id}/edit`);
        dispatch(resetProductCreate()); // Reset create status after navigation
      } else {
        dispatch(listProducts());
      }
    } else {
      navigate("/login"); // Redirect if not admin
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successCreate,
    createdProduct,
    successDelete,
  ]);

  const createProductHandler = () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      dispatch(createProduct());
    }
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          <i className="fas fa-plus mr-2"></i>Create Product
        </button>
      </div>

      {loading ? (
        <div className="text-center text-blue-500">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">NAME</th>
                <th className="py-2 px-4 border-b">PRICE</th>
                <th className="py-2 px-4 border-b">CATEGORY</th>
                <th className="py-2 px-4 border-b">BRAND</th>
                <th className="py-2 px-4 border-b">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{product._id}</td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">{product.category}</td>
                  <td className="py-2 px-4 border-b">{product.brand}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/product/${product._id}/edit`)
                      }
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
