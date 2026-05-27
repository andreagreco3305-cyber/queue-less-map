export type CartLine = {
  barId: string;
  barName: string;
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
};

export type PickupSelection = {
  iso: string;
  label: string;
};

export type CartState = {
  lines: CartLine[];
  pickup: PickupSelection | null;
};
