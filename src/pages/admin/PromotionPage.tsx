import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Link2,
  Search,
  ExternalLink,
  Percent,
  CalendarClock,
  Check,
} from "lucide-react";

import { useStore } from "@/store/StoreContext";
import { useToast } from "@/components/ui/toast";
import type { Promotion } from "@/data/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea, Select, Label } from "@/components/ui/Field";
import { Toggle } from "@/components/ui/Toggle";
import { ImageInput } from "@/components/ui/ImageInput";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Countdown } from "@/components/ui/Countdown";
import { formatPrice } from "@/lib/utils";

const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const empty = (categoryId: string): Omit<Promotion, "id"> => ({
  name: "",
  description: "",
  image: "",
  categoryId,
  priceOnline: 0,
  priceOffline: 0,
  newPriceOnline: 0,
  newPriceOffline: 0,
  endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
  demoUrlEnabled: false,
  demoUrl: "",
  active: true,
});

export default function PromotionPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const toast = useToast();
  const {
    data,
    addPromotion,
    updatePromotion,
    deletePromotion,
    addCategory,
    categoryName,
  } = useStore();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState<Omit<Promotion, "id">>(
    empty(data.categories[0]?.id ?? "")
  );
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [newCat, setNewCat] = useState("");

  const matches = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return data.programs.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5);
  }, [search, data.programs]);

  const openCreate = () => {
    setEditing(null);
    setForm(empty(data.categories[0]?.id ?? ""));
    setSearch("");
    setOpen(true);
  };
  const openEdit = (p: Promotion) => {
    setEditing(p);
    const { id, ...rest } = p;
    void id;
    setForm(rest);
    setSearch("");
    setOpen(true);
  };

  const pickProgram = (programId: string) => {
    const p = data.programs.find((x) => x.id === programId);
    if (!p) return;
    setForm((f) => ({
      ...f,
      baseProgramId: p.id,
      name: p.name,
      description: p.description,
      image: p.image,
      categoryId: p.categoryId,
      priceOnline: p.priceOnline,
      priceOffline: p.priceOffline,
      newPriceOnline: Math.round(p.priceOnline * 0.8),
      newPriceOffline: Math.round(p.priceOffline * 0.8),
      demoUrlEnabled: p.demoUrlEnabled,
      demoUrl: p.demoUrl,
    }));
    setSearch("");
    toast(p.name, "info");
  };

  const addNewCategory = () => {
    if (!newCat.trim()) return;
    const cat = addCategory(newCat.trim());
    setForm((f) => ({ ...f, categoryId: cat.id }));
    setNewCat("");
    toast(cat.name, "success");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updatePromotion(editing.id, form);
      toast(t("promotion.updated"), "success");
    } else {
      addPromotion(form);
      toast(t("promotion.created"), "success");
    }
    setOpen(false);
  };

  const copyLink = (p: Promotion) => {
    const target = p.baseProgramId ?? p.id;
    const url = `${window.location.origin}/site/order/${target}`;
    navigator.clipboard?.writeText(url);
    toast(t("common.copied"), "info");
  };

  return (
    <div>
      <PageHeader
        title={t("promotion.title")}
        subtitle={t("promotion.subtitle")}
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {t("promotion.createTitle")}
          </Button>
        }
      />

      {data.promotions.length === 0 ? (
        <GlassCard className="grid place-items-center py-20 text-center">
          <div>
            <Percent className="h-12 w-12 mx-auto text-moo-muted mb-3" />
            <p className="text-moo-muted">{t("promotion.empty")}</p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {data.promotions.map((p, i) => (
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
                    <Badge tone="promo" className="absolute top-2 start-2">
                      -{Math.round((1 - p.newPriceOnline / (p.priceOnline || 1)) * 100)}%
                    </Badge>
                    <Badge
                      tone={p.active ? "accepted" : "neutral"}
                      className="absolute top-2 end-2"
                    >
                      {p.active ? t("promotion.active") : t("promotion.inactive")}
                    </Badge>
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

                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-lg font-bold gradient-text-secondary">
                        {formatPrice(p.newPriceOnline, lang)}
                      </span>
                      <span className="text-xs text-moo-muted line-through mb-0.5">
                        {formatPrice(p.priceOnline, lang)}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-moo-muted">
                      <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                      <Countdown endDate={p.endDate} compact />
                    </div>

                    <div className="flex items-center gap-1.5 mt-4">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                        {t("common.edit")}
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => copyLink(p)} title={t("common.copyLink")}>
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
        title={editing ? t("promotion.editTitle") : t("promotion.createTitle")}
        size="lg"
        position="top"
      >
        <form onSubmit={submit} className="space-y-4">
          {/* search existing program */}
          {!editing && (
            <div className="rounded-xl bg-white/5 p-4">
              <Label>{t("promotion.searchProgram")}</Label>
              <div className="relative">
                <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-moo-muted" />
                <Input
                  className="ps-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("promotion.searchProgram")}
                />
              </div>
              <AnimatePresence>
                {matches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-2 space-y-1"
                  >
                    {matches.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => pickProgram(m.id)}
                        className="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 transition text-start"
                      >
                        <img src={m.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                        <span className="text-sm text-moo-ink flex-1 truncate">{m.name}</span>
                        <span className="text-xs text-moo-cyan">{formatPrice(m.priceOnline, lang)}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-xs text-moo-muted/80 mt-2">{t("promotion.searchHint")}</p>
            </div>
          )}

          <div>
            <Label>{t("common.image")}</Label>
            <ImageInput value={form.image} onChange={(v) => setForm({ ...form, image: v })} folder="promotions" />
          </div>

          <Field label={t("common.name")} required>
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

          {/* category + inline new category */}
          <div>
            <Label>{t("common.category")}</Label>
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
            <div className="flex gap-2 mt-2">
              <Input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder={t("promotion.newCategoryPlaceholder")}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="md" onClick={addNewCategory}>
                <Plus className="h-4 w-4" />
                {t("promotion.addCategory")}
              </Button>
            </div>
          </div>

          {/* prices */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("programs.priceOnline")} required>
              <Input
                type="number"
                min={0}
                required
                value={form.priceOnline || ""}
                onChange={(e) => setForm({ ...form, priceOnline: Number(e.target.value) })}
              />
            </Field>
            <Field label={t("programs.priceOffline")} required>
              <Input
                type="number"
                min={0}
                required
                value={form.priceOffline || ""}
                onChange={(e) => setForm({ ...form, priceOffline: Number(e.target.value) })}
              />
            </Field>
            <Field label={t("promotion.newPriceOnline")} required>
              <Input
                type="number"
                min={0}
                required
                value={form.newPriceOnline || ""}
                onChange={(e) => setForm({ ...form, newPriceOnline: Number(e.target.value) })}
              />
            </Field>
            <Field label={t("promotion.newPriceOffline")} required>
              <Input
                type="number"
                min={0}
                required
                value={form.newPriceOffline || ""}
                onChange={(e) => setForm({ ...form, newPriceOffline: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field label={t("promotion.endDate")} required>
            <Input
              type="datetime-local"
              required
              value={toLocalInput(form.endDate)}
              onChange={(e) =>
                setForm({ ...form, endDate: new Date(e.target.value).toISOString() })
              }
            />
          </Field>

          <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
            <Toggle
              checked={form.active}
              onChange={(v) => setForm({ ...form, active: v })}
              label={t("promotion.active")}
            />
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
                      onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
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
              <Check className="h-4 w-4" />
              {editing ? t("common.save") : t("common.create")}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        message={t("promotion.deleteConfirm")}
        onConfirm={() => {
          if (confirmId) {
            deletePromotion(confirmId);
            toast(t("promotion.deleted"), "success");
          }
        }}
      />
    </div>
  );
}
