import { supabase, BUCKETS, type BucketName } from "./supabase";
import { uid } from "./utils";
import { SEED_DATA } from "@/data/mockData";
import type {
  MoosingData,
  Program,
  Promotion,
  Category,
  Command,
  CustomOrder,
  ShowroomInfo,
  ContactsInfo,
  AdminAccount,
} from "@/data/types";
import type {
  ProgramRow,
  PromotionRow,
  CategoryRow,
  CommandRow,
  CustomOrderRow,
  ShowroomRow,
  ContactsRow,
  AdminAccountRow,
} from "./database.types";

/* ------------------------------------------------------------------ */
/* Row <-> app mappers                                                 */
/* ------------------------------------------------------------------ */

const fromCategory = (r: CategoryRow): Category => ({ id: r.id, name: r.name });
const toCategory = (c: Category): CategoryRow => ({
  id: c.id,
  name: c.name,
  created_at: new Date().toISOString(),
});

const fromProgram = (r: ProgramRow): Program => ({
  id: r.id,
  name: r.name,
  description: r.description,
  image: r.image,
  priceOnline: r.price_online,
  priceOffline: r.price_offline,
  demoUrlEnabled: r.demo_url_enabled,
  demoUrl: r.demo_url,
  categoryId: r.category_id ?? "",
});
const toProgram = (p: Program) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  image: p.image,
  price_online: p.priceOnline,
  price_offline: p.priceOffline,
  demo_url_enabled: p.demoUrlEnabled,
  demo_url: p.demoUrl,
  category_id: p.categoryId || null,
});

const fromPromotion = (r: PromotionRow): Promotion => ({
  id: r.id,
  baseProgramId: r.base_program_id ?? undefined,
  name: r.name,
  description: r.description,
  image: r.image,
  categoryId: r.category_id ?? "",
  priceOnline: r.price_online,
  priceOffline: r.price_offline,
  newPriceOnline: r.new_price_online,
  newPriceOffline: r.new_price_offline,
  endDate: r.end_date ?? "",
  demoUrlEnabled: r.demo_url_enabled,
  demoUrl: r.demo_url,
  active: r.active,
});
const toPromotion = (p: Promotion) => ({
  id: p.id,
  base_program_id: p.baseProgramId || null,
  name: p.name,
  description: p.description,
  image: p.image,
  category_id: p.categoryId || null,
  price_online: p.priceOnline,
  price_offline: p.priceOffline,
  new_price_online: p.newPriceOnline,
  new_price_offline: p.newPriceOffline,
  end_date: p.endDate || null,
  demo_url_enabled: p.demoUrlEnabled,
  demo_url: p.demoUrl,
  active: p.active,
});

const fromCommand = (r: CommandRow): Command => ({
  id: r.id,
  clientName: r.client_name,
  phone: r.phone,
  wilaya: r.wilaya,
  programId: r.program_id ?? "",
  type: r.type,
  price: r.price,
  status: r.status,
  createdAt: r.created_at,
  image: r.image,
  programName: r.program_name,
});
const toCommand = (c: Command) => ({
  id: c.id,
  client_name: c.clientName,
  phone: c.phone,
  wilaya: c.wilaya,
  program_id: c.programId || null,
  type: c.type,
  price: c.price,
  status: c.status,
  image: c.image,
  program_name: c.programName,
  created_at: c.createdAt,
});

const fromCustomOrder = (r: CustomOrderRow): CustomOrder => ({
  id: r.id,
  clientName: r.client_name,
  phone: r.phone,
  wilaya: r.wilaya,
  description: r.description,
  createdAt: r.created_at,
});
const toCustomOrder = (c: CustomOrder) => ({
  id: c.id,
  client_name: c.clientName,
  phone: c.phone,
  wilaya: c.wilaya,
  description: c.description,
  created_at: c.createdAt,
});

const fromShowroom = (r: ShowroomRow): ShowroomInfo => ({
  logo: r.logo,
  name: r.name,
  description: r.description,
  email: r.email,
  phone: r.phone,
  address: r.address,
});
const fromContacts = (r: ContactsRow): ContactsInfo => ({
  facebookUrl: r.facebook_url,
  instagramUrl: r.instagram_url,
  tiktokUrl: r.tiktok_url,
  mapsUrl: r.maps_url,
  whatsappNumber: r.whatsapp_number,
});
const fromAccount = (r: AdminAccountRow): AdminAccount => ({
  name: r.name,
  username: r.username,
  email: r.email,
  password: r.password,
});

/* ------------------------------------------------------------------ */
/* Reads — one batched fetch for the whole app (fast first paint)      */
/* ------------------------------------------------------------------ */

export async function fetchAll(): Promise<MoosingData> {
  const [
    categories,
    programs,
    promotions,
    commands,
    customOrders,
    showroom,
    contacts,
    account,
  ] = await Promise.all([
    supabase.from("categories").select("*").order("created_at", { ascending: true }),
    supabase.from("programs").select("*").order("created_at", { ascending: false }),
    supabase.from("promotions").select("*").order("created_at", { ascending: false }),
    supabase.from("commands").select("*").order("created_at", { ascending: false }),
    supabase.from("custom_orders").select("*").order("created_at", { ascending: false }),
    supabase.from("showroom").select("*").eq("id", 1).maybeSingle(),
    supabase.from("contacts").select("*").eq("id", 1).maybeSingle(),
    supabase.from("admin_account").select("*").eq("id", 1).maybeSingle(),
  ]);

  const firstError =
    categories.error ||
    programs.error ||
    promotions.error ||
    commands.error ||
    customOrders.error ||
    showroom.error ||
    contacts.error ||
    account.error;
  if (firstError) throw firstError;

  return {
    categories: (categories.data ?? []).map(fromCategory),
    programs: (programs.data ?? []).map(fromProgram),
    promotions: (promotions.data ?? []).map(fromPromotion),
    commands: (commands.data ?? []).map(fromCommand),
    customOrders: (customOrders.data ?? []).map(fromCustomOrder),
    showroom: showroom.data ? fromShowroom(showroom.data) : SEED_DATA.showroom,
    contacts: contacts.data ? fromContacts(contacts.data) : SEED_DATA.contacts,
    account: account.data ? fromAccount(account.data) : SEED_DATA.account,
  };
}

/* ------------------------------------------------------------------ */
/* Writes — full-row upserts (id is client-generated) + deletes        */
/* Each returns a promise the store fires in the background.           */
/* ------------------------------------------------------------------ */

const throwOn = (error: { message: string } | null) => {
  if (error) throw error;
};

export const api = {
  // categories
  async upsertCategory(c: Category) {
    throwOn((await supabase.from("categories").upsert(toCategory(c))).error);
  },
  // programs
  async upsertProgram(p: Program) {
    throwOn((await supabase.from("programs").upsert(toProgram(p))).error);
  },
  async deleteProgram(id: string) {
    throwOn((await supabase.from("programs").delete().eq("id", id)).error);
  },
  // promotions
  async upsertPromotion(p: Promotion) {
    throwOn((await supabase.from("promotions").upsert(toPromotion(p))).error);
  },
  async deletePromotion(id: string) {
    throwOn((await supabase.from("promotions").delete().eq("id", id)).error);
  },
  // commands
  async upsertCommand(c: Command) {
    throwOn((await supabase.from("commands").upsert(toCommand(c))).error);
  },
  async deleteCommand(id: string) {
    throwOn((await supabase.from("commands").delete().eq("id", id)).error);
  },
  // custom orders
  async upsertCustomOrder(c: CustomOrder) {
    throwOn((await supabase.from("custom_orders").upsert(toCustomOrder(c))).error);
  },
  async deleteCustomOrder(id: string) {
    throwOn((await supabase.from("custom_orders").delete().eq("id", id)).error);
  },
  // singletons
  async saveShowroom(s: ShowroomInfo) {
    throwOn(
      (
        await supabase.from("showroom").upsert({
          id: 1,
          logo: s.logo,
          name: s.name,
          description: s.description,
          email: s.email,
          phone: s.phone,
          address: s.address,
        })
      ).error
    );
  },
  async saveContacts(c: ContactsInfo) {
    throwOn(
      (
        await supabase.from("contacts").upsert({
          id: 1,
          facebook_url: c.facebookUrl,
          instagram_url: c.instagramUrl,
          tiktok_url: c.tiktokUrl,
          maps_url: c.mapsUrl,
          whatsapp_number: c.whatsappNumber,
        })
      ).error
    );
  },
  async saveAccount(a: AdminAccount) {
    throwOn(
      (
        await supabase.from("admin_account").upsert({
          id: 1,
          name: a.name,
          username: a.username,
          email: a.email,
          password: a.password,
        })
      ).error
    );
  },
};

/**
 * Push an entire dataset to Supabase (used by Restore / Reset).
 * Upsert-merge: it inserts/updates rows; it does not delete rows absent here.
 */
export async function bulkReplace(d: MoosingData) {
  const ops: PromiseLike<unknown>[] = [];
  if (d.categories.length)
    ops.push(supabase.from("categories").upsert(d.categories.map(toCategory)));
  if (d.programs.length)
    ops.push(supabase.from("programs").upsert(d.programs.map(toProgram)));
  if (d.promotions.length)
    ops.push(supabase.from("promotions").upsert(d.promotions.map(toPromotion)));
  if (d.commands.length)
    ops.push(supabase.from("commands").upsert(d.commands.map(toCommand)));
  if (d.customOrders.length)
    ops.push(supabase.from("custom_orders").upsert(d.customOrders.map(toCustomOrder)));
  ops.push(api.saveShowroom(d.showroom));
  ops.push(api.saveContacts(d.contacts));
  ops.push(api.saveAccount(d.account));
  await Promise.all(ops);
}

/* ------------------------------------------------------------------ */
/* Storage — upload an image, return its public URL                    */
/* ------------------------------------------------------------------ */

const extOf = (file: File) => {
  const fromName = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "";
  if (fromName) return fromName;
  const fromType = file.type.split("/")[1];
  return fromType || "png";
};

/**
 * Upload a file to a public bucket and return its CDN URL.
 * @param bucket  BUCKETS.media (images) or BUCKETS.logos (logo)
 * @param folder  optional sub-folder, e.g. "programs"
 */
export async function uploadImage(
  file: File,
  bucket: BucketName = BUCKETS.media,
  folder = ""
): Promise<string> {
  const path = `${folder ? folder.replace(/\/+$/, "") + "/" : ""}${uid("img")}.${extOf(file)}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
