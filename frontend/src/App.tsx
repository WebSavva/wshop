import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import store from "./store/store";
import { Provider } from "react-redux";
import AuthKeeper from "./store/AuthKeeper";
import { Redirect } from "react-router";

import Layout from "./Components/Layout";
import HomeScreen from "./Pages/HomeScreen";
import ProductPage from "./Pages/ProductPage";
import CartPage from "./Pages/CartPage";
import AuthPage from "./Pages/AuthPage";
import OrderProcessingPage from "./Pages/OrderProcessingPage";
import ProtectedPage from "./Components/UI/ProtectedPage";
import UserProfilePage from "./Pages/UserProfilePage";
import OrderPage from "./Pages/OrderPage";
import AdminUsersPage from "./Pages/AdminUsersPage";
import AdminEditUserPage from "./Pages/AdminEditUserPage";
import AdminCreateUserPage from "./Pages/AdminCreateUserPage";
import AdminOrdersPage from "./Pages/AdminOrdersPage";
import AdminProductsPage from "./Pages/AdminProductsPage";
import AdminEditProductPage from "./Pages/AdminEditProduct";
import AdminCreateProductPage from "./Pages/AdminCreateProductPage";

const App = () => {
  return (
    <Provider store={store}>
      <AuthKeeper>
        <BrowserRouter>
          <Layout>
            <Switch>
              <Route path="/" exact>
                <Redirect to="/products" />
              </Route>

              <Route path="/products" exact>
                <HomeScreen />
              </Route>

              <Route path="/products/:id" exact>
                <ProductPage />
              </Route>

              <Route path="/cart">
                <CartPage />
              </Route>

              <Route path="/login">
                <AuthPage />
              </Route>

              <Route path="/user/profile">
                <ProtectedPage>
                  <UserProfilePage />
                </ProtectedPage>
              </Route>

              <Route path="/buy">
                <OrderProcessingPage />
              </Route>

              <Route path="/orders/:id">
                <ProtectedPage>
                  <OrderPage />
                </ProtectedPage>
              </Route>

              <Route path="/admin/users" exact>
                <ProtectedPage onlyAdmin>
                  <AdminUsersPage />
                </ProtectedPage>
              </Route>

              <Route path="/admin/users/:id/edit" exact>
                <ProtectedPage onlyAdmin>
                  <AdminEditUserPage />
                </ProtectedPage>
              </Route>

              <Route path="/admin/users/create" exact>
                <ProtectedPage onlyAdmin>
                  <AdminCreateUserPage />
                </ProtectedPage>
              </Route>

              <Route path="/admin/orders" exact>
                <ProtectedPage onlyAdmin>
                  <AdminOrdersPage />
                </ProtectedPage>
              </Route>

              <Route path="/admin/products" exact>
                <ProtectedPage onlyAdmin>
                  <AdminProductsPage />
                </ProtectedPage>
              </Route>

              <Route path="/admin/products/:id/edit" exact>
                <ProtectedPage onlyAdmin>
                  <AdminEditProductPage />
                </ProtectedPage>
              </Route>
              <Route path="/admin/products/create" exact>
                <ProtectedPage onlyAdmin>
                  <AdminCreateProductPage />
                </ProtectedPage>
              </Route>
              
              <Route path="*">
                <Redirect to="/products" />
              </Route>
            </Switch>
          </Layout>
        </BrowserRouter>
      </AuthKeeper>
    </Provider>
  );
};

export default App;
