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

/** Mensagem organizada enviada pelo formulário de contato. */
export function buildQuoteMessage(data: QuoteRequest): string {
  return [
    'Olá, ORBYN TECH! Gostaria de solicitar um orçamento.',
    '',
    `*Nome:* ${data.name.trim()}`,
    `*WhatsApp:* ${data.whatsapp.trim()}`,
    `*E-mail:* ${data.email.trim()}`,
    `*Serviço:* ${data.service}`,
    '',
    '*Sobre o projeto:*',
    data.description.trim(),
  ].join('\n');
}
