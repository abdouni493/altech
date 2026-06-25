import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store/StoreContext";

import LoginPage from "./pages/LoginPage";
import { AdminLayout } from "./layouts/AdminLayout";
import { PublicLayout } from "./layouts/PublicLayout";

import Dashboard from "./pages/admin/Dashboard";
import WebsiteSettings from "./pages/admin/WebsiteSettings";
import Programs from "./pages/admin/Programs";
import PromotionPage from "./pages/admin/PromotionPage";
import Commands from "./pages/admin/Commands";
import SettingsPage from "./pages/admin/SettingsPage";

import Landing from "./pages/site/Landing";
import SitePrograms from "./pages/site/SitePrograms";
import SitePromotions from "./pages/site/SitePromotions";
import SiteContacts from "./pages/site/SiteContacts";
import OrderPage from "./pages/site/OrderPage";
import CustomOrderPage from "./pages/site/CustomOrderPage";
import ThankYou from "./pages/site/ThankYou";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthed, authReady } = useStore();
  // Wait for the persisted Supabase session to be restored before deciding —
  // otherwise a page refresh would briefly bounce the user back to /login.
  if (!authReady) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-moo-bg">
        <div className="h-12 w-12 rounded-full btn-gradient glow-violet animate-pulse" />
      </div>
    );
  }
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { data } = useStore();

  // Browser tab reflects the store name (set in Admin ▸ Settings).
  useEffect(() => {
    if (data.showroom.name) document.title = data.showroom.name;
  }, [data.showroom.name]);

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin (protected) */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="website-settings" element={<WebsiteSettings />} />
          <Route path="programs" element={<Programs />} />
          <Route path="promotion" element={<PromotionPage />} />
          <Route path="commands" element={<Commands />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Public website */}
        <Route path="/site" element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="programs" element={<SitePrograms />} />
          <Route path="promotions" element={<SitePromotions />} />
          <Route path="contacts" element={<SiteContacts />} />
          <Route path="order/:programId" element={<OrderPage />} />
          <Route path="custom-order" element={<CustomOrderPage />} />
          <Route path="thank-you" element={<ThankYou />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );
}
