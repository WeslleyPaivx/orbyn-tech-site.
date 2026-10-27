import { useState } from 'react';
import { Plus } from '../ui/Icons';
import { faqItems } from '../../data/content';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-title" className="legible relative py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="faq-title"
            label="Dúvidas"
            title="Perguntas frequentes."
            size="md"
            subtitle="Não encontrou o que procurava? Fale com a gente pelo WhatsApp."
          />
        </div>

        <Reveal as="ul" className="border-b border-white/[0.12]">
          {faqItems.map((item, index) => {
            const isOpen = open === index;
            const buttonId = `faq-btn-${index}`;
            const panelId = `faq-panel-${index}`;
            return (
              <li key={item.question} className="border-t border-white/[0.12]">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium text-white sm:py-7 sm:text-xl"
                  >
                    <span className="transition-colors group-hover:text-white/80">{item.question}</span>
                    <Plus
                      className={`h-5 w-5 shrink-0 transition-transform duration-500 ease-[var(--ease-soft)] ${
                        isOpen ? 'rotate-45 text-white' : 'text-mute group-hover:text-white'
                      }`}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-soft)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pr-12 pb-7 leading-relaxed text-mute">{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
