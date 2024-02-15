import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import PrivateRoute from "./core/components/PrivateRoute";
// import AuthGuard from "auth/AuthGuard";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import ItemInfo from "views/info/ItemInfo";
import ConfigLayout from "layouts/config";
// import ConfigLayout from "layouts/common";

import DetailLayout from "layouts/detail";

import { NotFound } from "views/notfound";

const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route
        path="admin/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      />
      <Route
        path="info/*"
        element={
          <PrivateRoute>
            <ItemInfo />
          </PrivateRoute>
        }
      />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route
        path="nodes/:id/config/*"
        element={
          <PrivateRoute>
            <ConfigLayout />
          </PrivateRoute>
        }
      />

      <Route
        path="nodes/:id/details"
        element={
          <PrivateRoute>
            <DetailLayout />
          </PrivateRoute>
        }
      />

      {/* <Route path="nodes/:id/config/*" element={<ConfigLayout />} /> */}
      {/* <Route path="nodes/*" element={<ConfigLayout />} /> */}

      {/* <Route path="nodes/:id/*" element={<MerchantLayout />} /> */}
      <Route path="*" element={<NotFound />} />

      <Route path="/" element={<Navigate to="admin/" replace />} />
    </Routes>
  );
};

export default App;
