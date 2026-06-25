import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { SEED_DATA } from "@/data/mockData";
import type {
  MoosingData,
  Program,
  Promotion,
  Category,
  Command,
  CustomOrder,
  CommandStatus,
  ShowroomInfo,
  ContactsInfo,
  AdminAccount,
} from "@/data/types";
import { uid } from "@/lib/utils";
import { fetchAll, api, bulkReplace } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface SignUpParams {
  name: string;
  username: string;
  email: string;
  password: string;
}
interface SignUpResult {
  ok: boolean;
  needsConfirmation?: boolean;
  error?: string;
}

interface StoreContextValue {
  data: MoosingData;
  /** True until the first Supabase hydration completes. */
  loading: boolean;
  // auth (Supabase Auth)
  isAuthed: boolean;
  /** False until the persisted Supabase session has been restored on load. */
  authReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (params: SignUpParams) => Promise<SignUpResult>;
  demoLogin: () => void;
  logout: () => void;
  // programs
  addProgram: (p: Omit<Program, "id">) => Program;
  updateProgram: (id: string, p: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  getProgram: (id: string) => Program | undefined;
  // promotions
  addPromotion: (p: Omit<Promotion, "id">) => Promotion;
  updatePromotion: (id: string, p: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  // categories
  addCategory: (name: string) => Category;
  // commands
  addCommand: (c: Omit<Command, "id" | "createdAt" | "status">) => Command;
  setCommandStatus: (id: string, status: CommandStatus) => void;
  deleteCommand: (id: string) => void;
  // custom orders
  addCustomOrder: (c: Omit<CustomOrder, "id" | "createdAt">) => CustomOrder;
  deleteCustomOrder: (id: string) => void;
  // settings
  updateShowroom: (s: Partial<ShowroomInfo>) => void;
  updateContacts: (c: Partial<ContactsInfo>) => void;
  updateAccount: (a: Partial<AdminAccount>) => void;
  // database
  backup: () => void;
  restore: (json: MoosingData) => void;
  resetData: () => void;
  categoryName: (id: string) => string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const clone = (d: MoosingData): MoosingData =>
  JSON.parse(JSON.stringify(d)) as MoosingData;

/** Fire a write-through to Supabase without blocking the UI. */
const sync = (p: Promise<unknown>) =>
  p.catch((e) => console.error("[supabase] write failed:", e));

export function StoreProvider({ children }: { children: ReactNode }) {
  // Seed first for an instant first paint, then replace with live DB data.
  const [data, setData] = useState<MoosingData>(() => clone(SEED_DATA));
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const isAuthed = !!session || demoMode;

  // Always-current snapshot so write-through can read the latest row to merge.
  const dataRef = useRef(data);
  dataRef.current = data;

  // Track the Supabase Auth session (persists across reloads).
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: s }) => setSession(s.session))
      .finally(() => setAuthReady(true));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Hydrate from Supabase. Runs once the auth state is known, and again whenever
  // the signed-in user changes (login / logout). Re-fetching on login is what
  // makes fresh data appear without a manual page refresh.
  useEffect(() => {
    if (!authReady) return;
    let alive = true;
    setLoading(true);
    fetchAll()
      .then((fresh) => {
        if (alive) setData(fresh);
      })
      .catch((e) => console.error("[supabase] load failed:", e))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [authReady, session?.user?.id]);

  const login = useCallback(async (email: string, password: string) => {
    const { data: res, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return false;
    setSession(res.session);
    return true;
  }, []);

  const signUp = useCallback(async (p: SignUpParams): Promise<SignUpResult> => {
    const { data: res, error } = await supabase.auth.signUp({
      email: p.email.trim(),
      password: p.password,
      options: { data: { name: p.name, username: p.username } },
    });
    if (error) return { ok: false, error: error.message };
    if (res.session) {
      // E-mail confirmation disabled -> signed in immediately.
      setSession(res.session);
      return { ok: true };
    }
    // No session -> the project requires e-mail confirmation.
    return { ok: true, needsConfirmation: true };
  }, []);

  const demoLogin = useCallback(() => setDemoMode(true), []);
  const logout = useCallback(() => {
    setDemoMode(false);
    void supabase.auth.signOut();
  }, []);

  // ---- programs ----
  const addProgram = useCallback((p: Omit<Program, "id">) => {
    const program: Program = { ...p, id: uid("prog") };
    setData((d) => ({ ...d, programs: [program, ...d.programs] }));
    sync(api.upsertProgram(program));
    return program;
  }, []);
  const updateProgram = useCallback((id: string, patch: Partial<Program>) => {
    const current = dataRef.current.programs.find((p) => p.id === id);
    setData((d) => ({
      ...d,
      programs: d.programs.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
    if (current) sync(api.upsertProgram({ ...current, ...patch }));
  }, []);
  const deleteProgram = useCallback((id: string) => {
    setData((d) => ({ ...d, programs: d.programs.filter((p) => p.id !== id) }));
    sync(api.deleteProgram(id));
  }, []);
  const getProgram = useCallback(
    (id: string) => data.programs.find((p) => p.id === id),
    [data.programs]
  );

  // ---- promotions ----
  const addPromotion = useCallback((p: Omit<Promotion, "id">) => {
    const promo: Promotion = { ...p, id: uid("promo") };
    setData((d) => ({ ...d, promotions: [promo, ...d.promotions] }));
    sync(api.upsertPromotion(promo));
    return promo;
  }, []);
  const updatePromotion = useCallback((id: string, patch: Partial<Promotion>) => {
    const current = dataRef.current.promotions.find((p) => p.id === id);
    setData((d) => ({
      ...d,
      promotions: d.promotions.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      ),
    }));
    if (current) sync(api.upsertPromotion({ ...current, ...patch }));
  }, []);
  const deletePromotion = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      promotions: d.promotions.filter((p) => p.id !== id),
    }));
    sync(api.deletePromotion(id));
  }, []);

  // ---- categories ----
  const addCategory = useCallback((name: string) => {
    const cat: Category = { id: uid("cat"), name };
    setData((d) => ({ ...d, categories: [...d.categories, cat] }));
    sync(api.upsertCategory(cat));
    return cat;
  }, []);

  // ---- commands ----
  const addCommand = useCallback(
    (c: Omit<Command, "id" | "createdAt" | "status">) => {
      const command: Command = {
        ...c,
        id: uid("cmd"),
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      setData((d) => ({ ...d, commands: [command, ...d.commands] }));
      sync(api.upsertCommand(command));
      return command;
    },
    []
  );
  const setCommandStatus = useCallback((id: string, status: CommandStatus) => {
    const current = dataRef.current.commands.find((c) => c.id === id);
    setData((d) => ({
      ...d,
      commands: d.commands.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
    if (current) sync(api.upsertCommand({ ...current, status }));
  }, []);
  const deleteCommand = useCallback((id: string) => {
    setData((d) => ({ ...d, commands: d.commands.filter((c) => c.id !== id) }));
    sync(api.deleteCommand(id));
  }, []);

  // ---- custom orders ----
  const addCustomOrder = useCallback(
    (c: Omit<CustomOrder, "id" | "createdAt">) => {
      const order: CustomOrder = {
        ...c,
        id: uid("custom"),
        createdAt: new Date().toISOString(),
      };
      setData((d) => ({ ...d, customOrders: [order, ...d.customOrders] }));
      sync(api.upsertCustomOrder(order));
      return order;
    },
    []
  );
  const deleteCustomOrder = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      customOrders: d.customOrders.filter((c) => c.id !== id),
    }));
    sync(api.deleteCustomOrder(id));
  }, []);

  // ---- settings ----
  const updateShowroom = useCallback((s: Partial<ShowroomInfo>) => {
    const nextShowroom = { ...dataRef.current.showroom, ...s };
    // keep whatsapp/phone in sync as a single source of truth
    const nextContacts =
      s.phone !== undefined
        ? { ...dataRef.current.contacts, whatsappNumber: s.phone }
        : dataRef.current.contacts;
    setData((d) => ({ ...d, showroom: nextShowroom, contacts: nextContacts }));
    sync(api.saveShowroom(nextShowroom));
    if (s.phone !== undefined) sync(api.saveContacts(nextContacts));
  }, []);
  const updateContacts = useCallback((c: Partial<ContactsInfo>) => {
    const next = { ...dataRef.current.contacts, ...c };
    setData((d) => ({ ...d, contacts: next }));
    sync(api.saveContacts(next));
  }, []);
  const updateAccount = useCallback((a: Partial<AdminAccount>) => {
    const next = { ...dataRef.current.account, ...a };
    setData((d) => ({ ...d, account: next }));
    sync(api.saveAccount(next));
  }, []);

  // ---- database (backup / restore / reset) ----
  const backup = useCallback(() => {
    const blob = new Blob([JSON.stringify(dataRef.current, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moosing-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);
  const restore = useCallback((json: MoosingData) => {
    setData(clone(json));
    sync(bulkReplace(json));
  }, []);
  const resetData = useCallback(() => {
    const seed = clone(SEED_DATA);
    setData(seed);
    sync(bulkReplace(seed));
  }, []);

  const categoryName = useCallback(
    (id: string) => data.categories.find((c) => c.id === id)?.name ?? "—",
    [data.categories]
  );

  const value: StoreContextValue = {
    data,
    loading,
    isAuthed,
    authReady,
    login,
    signUp,
    demoLogin,
    logout,
    addProgram,
    updateProgram,
    deleteProgram,
    getProgram,
    addPromotion,
    updatePromotion,
    deletePromotion,
    addCategory,
    addCommand,
    setCommandStatus,
    deleteCommand,
    addCustomOrder,
    deleteCustomOrder,
    updateShowroom,
    updateContacts,
    updateAccount,
    backup,
    restore,
    resetData,
    categoryName,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
