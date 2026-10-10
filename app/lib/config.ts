export const DELIVERY_FEE = 200;
export const FREE_DELIVERY_ABOVE = 5000;
export const DELIVERY_DAYS = "3-5 working days";
export const PROCESSING_DAYS = "1-2 working days";

export const CONTACT_WHATSAPP = "0319 0493923";
export const CONTACT_INSTAGRAM = "@littlemeadow_a.h";

export const calcDelivery = (subtotal: number): number =>
  subtotal <= 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
