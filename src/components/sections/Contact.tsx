import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Check, ChevronDown, CircleAlert, Send } from 'lucide-react';
import { site, whatsappMessages } from '../../config/site';
import { serviceOptions } from '../../data/services';
import { buildQuoteMessage, whatsappUrl, type QuoteRequest } from '../../lib/whatsapp';
import { Button, ButtonLink } from '../ui/Button';
import { InstagramIcon, WhatsAppIcon } from '../ui/BrandIcons';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

type Field = keyof QuoteRequest;
type Errors = Partial<Record<Field, string>>;

const FIELDS: Field[] = ['name', 'whatsapp', 'email', 'service', 'description'];
const MIN_DESCRIPTION = 15;
const MAX_DESCRIPTION = 1000;
const MAX_NAME = 80;
const MAX_EMAIL = 120;

/** Abre o link em nova aba sem dar à página aberta acesso a este site (noopener). */
function openInNewTab(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

const empty: QuoteRequest = { name: '', whatsapp: '', email: '', service: '', description: '' };

/** Formata o telefone como (11) 91234-5678 enquanto a pessoa digita. */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function validate(values: QuoteRequest): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = 'Informe seu nome.';
  const phone = values.whatsapp.replace(/\D/g, '');
  if (phone.length < 10 || phone.length > 11) errors.whatsapp = 'Informe um WhatsApp válido com DDD.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'Informe um e-mail válido.';
  if (!values.service) errors.service = 'Selecione o tipo de serviço.';
  const description = values.description.trim().length;
  if (description < MIN_DESCRIPTION)
    errors.description = `Conte um pouco mais sobre o projeto (mínimo de ${MIN_DESCRIPTION} caracteres).`;
  return errors;
}

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  valid: boolean;
  hint?: ReactNode;
  children: ReactNode;
};

function FieldShell({ id, label, error, valid, hint, children }: FieldShellProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-white/90">
          {label}
        </label>
        {hint}
      </div>
      <div className="relative">
        {children}
        {valid && !error && (
          <Check
            className="pointer-events-none absolute top-[0.95rem] right-4 h-4 w-4 text-white/70"
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
      </div>
      {error && (
        <p id={`${id}-erro`} className="mt-2 flex items-center gap-1.5 text-sm text-[#f0a3a3]" role="alert">
          <CircleAlert className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  'w-full rounded-xl border bg-ink px-4 text-[1rem] text-white placeholder:text-white/30 ' +
  'transition-[border-color,box-shadow,background-color] duration-300 outline-none ' +
  'focus:border-white/70 focus:bg-[#0a0a0a] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.06)]';

export function Contact() {
  const uid = useId();
  const id = (field: Field) => `${uid}-${field}`;
  const [values, setValues] = useState<QuoteRequest>(empty);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = validate(values);
  const showError = (field: Field) => (touched[field] || submitted ? errors[field] : undefined);
  const isValid = (field: Field) => Boolean(touched[field]) && !errors[field];

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = event.target.name as Field;
    let value = event.target.value;
    if (field === 'whatsapp') value = formatPhone(value);
    if (field === 'name') value = value.slice(0, MAX_NAME);
    if (field === 'email') value = value.slice(0, MAX_EMAIL);
    if (field === 'description') value = value.slice(0, MAX_DESCRIPTION);
    setValues((current) => ({ ...current, [field]: value }));
    setSentUrl(null);
  };

  const onBlur = (field: Field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const firstInvalid = FIELDS.find((field) => errors[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const url = whatsappUrl(buildQuoteMessage(values));
    setSentUrl(url);
    openInNewTab(url);
  };

  const describedBy = (field: Field) => (showError(field) ? `${id(field)}-erro` : undefined);
  const stateBorder = (field: Field) => (showError(field) ? 'border-[#f0a3a3]/70' : 'border-line hover:border-white/30');

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="border-t border-line/60 py-24 sm:py-32"
    >

      <Container className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <SectionHeading
            id="contato-title"
            title="Vamos transformar sua ideia em realidade?"
            subtitle="Conte sobre seu projeto e descubra como a ORBYN TECH pode ajudar."
          />

          <Reveal delay={120} className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <ButtonLink href={whatsappUrl(whatsappMessages.quote)} external size="lg" className="sm:flex-1 lg:flex-none xl:flex-1">
              <WhatsAppIcon className="h-5 w-5" />
              {site.whatsapp.display}
            </ButtonLink>
            <ButtonLink href={site.instagram.url} external size="lg" variant="outline" className="sm:flex-1 lg:flex-none xl:flex-1">
              <InstagramIcon className="h-5 w-5" />
              {site.instagram.handle}
            </ButtonLink>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/45">
              Ao enviar, o WhatsApp abre com a sua mensagem pronta para revisão. Nenhum dado é armazenado neste site.
            </p>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            aria-label="Solicitar orçamento"
            className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FieldShell id={id('name')} label="Nome" error={showError('name')} valid={isValid('name')}>
                <input
                  id={id('name')}
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={MAX_NAME}
                  placeholder="Seu nome"
                  value={values.name}
                  onChange={onChange}
                  onBlur={onBlur('name')}
                  aria-invalid={Boolean(showError('name'))}
                  aria-describedby={describedBy('name')}
                  className={`${inputBase} h-12 pr-10 ${stateBorder('name')}`}
                />
              </FieldShell>

              <FieldShell id={id('whatsapp')} label="WhatsApp" error={showError('whatsapp')} valid={isValid('whatsapp')}>
                <input
                  id={id('whatsapp')}
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  maxLength={16}
                  placeholder="(11) 91234-5678"
                  value={values.whatsapp}
                  onChange={onChange}
                  onBlur={onBlur('whatsapp')}
                  aria-invalid={Boolean(showError('whatsapp'))}
                  aria-describedby={describedBy('whatsapp')}
                  className={`${inputBase} h-12 pr-10 ${stateBorder('whatsapp')}`}
                />
              </FieldShell>

              <FieldShell id={id('email')} label="E-mail" error={showError('email')} valid={isValid('email')}>
                <input
                  id={id('email')}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={MAX_EMAIL}
                  placeholder="voce@empresa.com.br"
                  value={values.email}
                  onChange={onChange}
                  onBlur={onBlur('email')}
                  aria-invalid={Boolean(showError('email'))}
                  aria-describedby={describedBy('email')}
                  className={`${inputBase} h-12 pr-10 ${stateBorder('email')}`}
                />
              </FieldShell>

              <FieldShell id={id('service')} label="Tipo de serviço" error={showError('service')} valid={false}>
                <select
                  id={id('service')}
                  name="service"
                  value={values.service}
                  onChange={onChange}
                  onBlur={onBlur('service')}
                  aria-invalid={Boolean(showError('service'))}
                  aria-describedby={describedBy('service')}
                  className={`${inputBase} h-12 cursor-pointer appearance-none pr-11 ${
                    values.service ? 'text-white' : 'text-white/40'
                  } ${stateBorder('service')}`}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option} value={option} className="bg-ink-2 text-white">
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-mute"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </FieldShell>

              <div className="sm:col-span-2">
                <FieldShell
                  id={id('description')}
                  label="Descrição do projeto"
                  error={showError('description')}
                  valid={false}
                  hint={
                    <span className="text-xs text-white/40 tabular-nums" aria-hidden="true">
                      {values.description.length}/{MAX_DESCRIPTION}
                    </span>
                  }
                >
                  <textarea
                    id={id('description')}
                    name="description"
                    rows={5}
                    maxLength={MAX_DESCRIPTION}
                    placeholder="Conte o que você precisa, seus objetivos e, se tiver, referências ou prazos desejados."
                    value={values.description}
                    onChange={onChange}
                    onBlur={onBlur('description')}
                    aria-invalid={Boolean(showError('description'))}
                    aria-describedby={describedBy('description')}
                    className={`${inputBase} min-h-36 resize-y py-3.5 leading-relaxed ${stateBorder('description')}`}
                  />
                </FieldShell>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Enviar solicitação
                <Send
                  className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </Button>
              <p className="text-center text-sm text-white/45 sm:text-right" aria-live="polite">
                {sentUrl ? (
                  <span className="text-white/85">
                    WhatsApp aberto com a sua mensagem.{' '}
                    <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
                      Não abriu? Toque aqui
                    </a>
                  </span>
                ) : submitted && Object.keys(errors).length > 0 ? (
                  <span className="text-[#f0a3a3]">Revise os campos destacados.</span>
                ) : (
                  'Todos os campos são obrigatórios.'
                )}
              </p>
            </div>
          </form>
        </Reveal>
      </Container>
    </section>
  );
}
