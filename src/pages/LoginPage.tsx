import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  LogIn,
  Globe,
  UserPlus,
  User,
  AtSign,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { useToast } from "@/components/ui/toast";
import { Aurora } from "@/components/ui/Aurora";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Field";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { PageTransition } from "@/components/PageTransition";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, login, signUp } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // create-admin fields
  const [cName, setCName] = useState("");
  const [cUser, setCUser] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPass, setCPass] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) {
      toast(t("auth.loggedIn"), "success");
      navigate("/admin/dashboard");
    } else {
      toast(t("auth.invalidCredentials"), "error");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await signUp({
      name: cName,
      username: cUser,
      email: cEmail,
      password: cPass,
    });
    setSubmitting(false);
    if (!res.ok) {
      toast(res.error || t("auth.authError"), "error");
      return;
    }
    setCreateOpen(false);
    setEmail(cEmail);
    setPassword(cPass);
    if (res.needsConfirmation) {
      toast(t("auth.confirmEmail"), "info");
    } else {
      toast(t("auth.accountCreated"), "success");
      navigate("/admin/dashboard");
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-dvh w-full mesh-bg overflow-hidden grid place-items-center px-4 py-10">
        <Aurora dense />

        {/* language toggle */}
        <div className="absolute top-5 end-5 z-30">
          <LanguageToggle />
        </div>

        {/* card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="relative z-20 w-full max-w-md"
        >
          <div className="gradient-border rounded-3xl p-8 glow-violet">
            <div className="relative z-10">
              <div className="flex flex-col items-center text-center mb-8">
                <Logo size="lg" className="mb-4" />
                <p className="text-moo-muted text-sm">
                  {t("auth.welcome")}{" "}
                  <span className="gradient-text font-semibold">{data.showroom.name}</span>
                </p>
                <p className="text-xs text-moo-muted/70 mt-1">
                  {t("brand.tagline")}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Field label={t("auth.email")}>
                  <div className="relative">
                    <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("auth.emailPlaceholder")}
                      className="ps-10"
                      autoComplete="email"
                    />
                  </div>
                </Field>

                <Field label={t("auth.password")}>
                  <div className="relative">
                    <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("auth.passwordPlaceholder")}
                      className="ps-10"
                      autoComplete="current-password"
                    />
                  </div>
                </Field>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  <LogIn className="h-4 w-4" />
                  {t("auth.login")}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-moo-muted">— —</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCreateOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  {t("auth.createAccount")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/site")}
                >
                  <Globe className="h-4 w-4" />
                  {t("auth.seeWebsite")}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create admin account modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("auth.createAccountTitle")}
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label={t("auth.fullName")} required>
            <div className="relative">
              <User className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
              <Input
                required
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                className="ps-10"
              />
            </div>
          </Field>
          <Field label={t("auth.username")} required>
            <div className="relative">
              <AtSign className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
              <Input
                required
                value={cUser}
                onChange={(e) => setCUser(e.target.value)}
                className="ps-10"
              />
            </div>
          </Field>
          <Field label={t("auth.email")} required>
            <div className="relative">
              <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
              <Input
                type="email"
                required
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
                className="ps-10"
              />
            </div>
          </Field>
          <Field label={t("auth.password")} required>
            <div className="relative">
              <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
              <Input
                type="password"
                required
                value={cPass}
                onChange={(e) => setCPass(e.target.value)}
                className="ps-10"
              />
            </div>
          </Field>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            <UserPlus className="h-4 w-4" />
            {t("common.create")}
          </Button>
        </form>
      </Modal>
    </PageTransition>
  );
}
