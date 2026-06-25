import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Link2,
  ExternalLink,
  Package,
  Wifi,
  Store,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { useToast } from "@/components/ui/toast";
import type { Program } from "@/data/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Toggle } from "@/components/ui/Toggle";
import { ImageInput } from "@/components/ui/ImageInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatPrice } from "@/lib/utils";

const empty = (categoryId: string): Omit<Program, "id"> => ({
  name: "",
  description: "",
  image: "",
  priceOnline: 0,
  priceOffline: 0,
  demoUrlEnabled: false,
  demoUrl: "",
  categoryId,
});

export default function Programs() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const toast = useToast();
  const {
    data,
    addProgram,
    updateProgram,
    deleteProgram,
    addCategory,
    categoryName,
  } = useStore();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState<Omit<Program, "id">>(
    empty(data.categories[0]?.id ?? "")
  );
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState("");

  const openCreate = () => {
    setEditing(null);
    setForm(empty(data.categories[0]?.id ?? ""));
    setOpen(true);
  };
  const openEdit = (p: Program) => {
    setEditing(p);
    const { id, ...rest } = p;
    void id;
    setForm(rest);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateProgram(editing.id, form);
      toast(t("programs.updated"), "success");
    } else {
      addProgram(form);
      toast(t("programs.created"), "success");
    }
    setOpen(false);
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/site/order/${id}`;
    navigator.clipboard?.writeText(url);
    toast(t("common.copied"), "info");
  };

  const addNewCategory = () => {
    if (!newCat.trim()) return;
    const cat = addCategory(newCat.trim());
    setForm((f) => ({ ...f, categoryId: cat.id }));
    setNewCat("");
    toast(cat.name, "success");
  };

  return (
    <div>
      <PageHeader
        title={t("programs.title")}
        subtitle={t("programs.subtitle")}
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {t("programs.createTitle")}
          </Button>
        }
      />

      {data.programs.length === 0 ? (
        <EmptyState text={t("programs.empty")} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {data.programs.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 260, damping: 24 }}
              >
                <GlassCard hover className="p-0 overflow-hidden h-full flex flex-col">
                  <div className="aspect-video overflow-hidden relative group">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {p.demoUrlEnabled && (
                      <Badge tone="cyan" className="absolute top-2 end-2">
                        Demo
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <Badge tone="violet" className="self-start mb-2">
                      {categoryName(p.categoryId)}
                    </Badge>
                    <h3 className="font-display font-semibold text-moo-ink line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-moo-muted mt-1 line-clamp-2 flex-1">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs">
                      <span className="flex items-center gap-1 text-moo-cyan">
                        <Wifi className="h-3.5 w-3.5" />
                        {formatPrice(p.priceOnline, lang)}
                      </span>
                      <span className="flex items-center gap-1 text-moo-violet">
                        <Store className="h-3.5 w-3.5" />
                        {formatPrice(p.priceOffline, lang)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                        {t("common.edit")}
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => copyLink(p.id)} title={t("common.copyLink")}>
                        <Link2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="danger" onClick={() => setConfirmId(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / edit modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? t("programs.editTitle") : t("programs.createTitle")}
        position="top"
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-moo-muted mb-1.5">
              {t("common.image")}
            </label>
            <ImageInput
              value={form.image}
              onChange={(v) => setForm({ ...form, image: v })}
              folder="programs"
            />
          </div>
          <Field label={t("programs.nameLabel")} required>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label={t("common.description")}>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Field label={t("common.category")}>
            <Select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            {/* Inline create-category (no need to leave this form) */}
            <div className="flex gap-2 mt-2">
              <Input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNewCategory();
                  }
                }}
                placeholder={t("programs.newCategoryPlaceholder")}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="md" onClick={addNewCategory}>
                <Plus className="h-4 w-4" />
                {t("programs.addCategory")}
              </Button>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("programs.priceOnline")} required>
              <Input
                type="number"
                min={0}
                required
                value={form.priceOnline || ""}
                onChange={(e) =>
                  setForm({ ...form, priceOnline: Number(e.target.value) })
                }
              />
            </Field>
            <Field label={t("programs.priceOffline")} required>
              <Input
                type="number"
                min={0}
                required
                value={form.priceOffline || ""}
                onChange={(e) =>
                  setForm({ ...form, priceOffline: Number(e.target.value) })
                }
              />
            </Field>
          </div>

          <div className="rounded-xl bg-white/5 p-4 space-y-3">
            <Toggle
              checked={form.demoUrlEnabled}
              onChange={(v) => setForm({ ...form, demoUrlEnabled: v })}
              label={t("programs.demoToggle")}
            />
            <AnimatePresence>
              {form.demoUrlEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative pt-1">
                    <ExternalLink className="absolute start-3.5 top-1/2 h-4 w-4 text-moo-muted" />
                    <Input
                      type="url"
                      className="ps-10"
                      placeholder={t("programs.demoUrlPlaceholder")}
                      value={form.demoUrl}
                      onChange={(e) =>
                        setForm({ ...form, demoUrl: e.target.value })
                      }
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">
              {editing ? t("common.save") : t("common.create")}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        message={t("programs.deleteConfirm")}
        onConfirm={() => {
          if (confirmId) {
            deleteProgram(confirmId);
            toast(t("programs.deleted"), "success");
          }
        }}
      />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <GlassCard className="grid place-items-center py-20 text-center">
      <div>
        <Package className="h-12 w-12 mx-auto text-moo-muted mb-3" />
        <p className="text-moo-muted">{text}</p>
      </div>
    </GlassCard>
  );
}
