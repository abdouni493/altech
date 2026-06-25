export type CommandStatus = "pending" | "accepted" | "cancelled";
export type OrderType = "online" | "offline";

export interface Category {
  id: string;
  name: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  image: string;
  priceOnline: number;
  priceOffline: number;
  demoUrlEnabled: boolean;
  demoUrl: string;
  categoryId: string;
}

export interface Promotion {
  id: string;
  baseProgramId?: string;
  name: string;
  description: string;
  image: string;
  categoryId: string;
  priceOnline: number;
  priceOffline: number;
  newPriceOnline: number;
  newPriceOffline: number;
  endDate: string; // ISO
  demoUrlEnabled: boolean;
  demoUrl: string;
  active: boolean;
}

export interface Command {
  id: string;
  clientName: string;
  phone: string;
  wilaya: string;
  programId: string;
  type: OrderType;
  price: number;
  status: CommandStatus;
  createdAt: string; // ISO
  image: string;
  programName: string;
}

export interface CustomOrder {
  id: string;
  clientName: string;
  phone: string;
  wilaya: string;
  description: string;
  createdAt: string;
}

export interface ShowroomInfo {
  logo: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

export interface ContactsInfo {
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  mapsUrl: string;
  whatsappNumber: string;
}

export interface AdminAccount {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface MoosingData {
  categories: Category[];
  programs: Program[];
  promotions: Promotion[];
  commands: Command[];
  customOrders: CustomOrder[];
  showroom: ShowroomInfo;
  contacts: ContactsInfo;
  account: AdminAccount;
}
