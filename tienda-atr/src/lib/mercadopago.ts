import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

function getClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no está configurado");
  }
  return new MercadoPagoConfig({ accessToken });
}

export function getPreferenceClient() {
  return new Preference(getClient());
}

export function getPaymentClient() {
  return new Payment(getClient());
}
