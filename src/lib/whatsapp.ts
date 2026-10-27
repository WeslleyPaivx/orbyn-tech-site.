import { site } from '../config/site';

/** Monta o link oficial do WhatsApp (wa.me) com a mensagem codificada. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type QuoteRequest = {
  name: string;
  whatsapp: string;
  email: string;
  service: string;
  description: string;
};

// Caracteres de controle (exceto quebra de linha) não têm uso em uma mensagem de texto
const CONTROL_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g;

/** Limpa um campo digitado pelo visitante: remove caracteres invisíveis e limita o tamanho. */
export function cleanField(value: string, max: number, multiline = false): string {
  let text = value.replace(/\r\n?/g, '\n').replace(CONTROL_CHARS, '');
  text = multiline ? text.replace(/\n{3,}/g, '\n\n') : text.replace(/\s+/g, ' ');
  return text.trim().slice(0, max);
}

/** Mensagem organizada enviada pelo formulário de contato. */
export function buildQuoteMessage(data: QuoteRequest): string {
  return [
    'Olá, Zaniva! Gostaria de solicitar um orçamento.',
    '',
    `*Nome:* ${cleanField(data.name, 80)}`,
    `*WhatsApp:* ${cleanField(data.whatsapp, 20)}`,
    `*E-mail:* ${cleanField(data.email, 120)}`,
    `*Serviço:* ${cleanField(data.service, 60)}`,
    '',
    '*Sobre o projeto:*',
    cleanField(data.description, 1000, true),
  ].join('\n');
}
