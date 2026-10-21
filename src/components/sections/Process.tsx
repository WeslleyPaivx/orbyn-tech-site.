import { useRef, useState, type KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { processSteps } from '../../data/content';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const pad = (n: number) => String(n).padStart(2, '0');

export function Process() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const last = processSteps.length - 1;
  const step = processSteps[active];

  // Navegação por teclado entre as etapas (padrão de abas)
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: Math.min(active + 1, last),
      ArrowLeft: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section aria-labelledby="processo-title" className="border-t border-line/60 py-24 sm:py-32">
      <Container>
        <SectionHeading id="processo-title" title="Da sua ideia à solução digital." />

        {/* Desktop: linha do tempo horizontal com abas */}
        <Reveal className="mt-20 hidden lg:block">
          <div className="relative">
            <div className="absolute top-[1.375rem] right-[10%] left-[10%] h-px bg-line" aria-hidden="true" />
            <div
              className="absolute top-[1.375rem] left-[10%] h-px bg-white transition-[width] duration-700 ease-[var(--ease-soft)]"
              style={{ width: `${(active / last) * 80}%` }}
              aria-hidden="true"
            />
            <div role="tablist" aria-label="Etapas do processo" className="relative grid grid-cols-5">
              {processSteps.map((item, index) => {
                const selected = index === active;
                const done = index < active;
                return (
                  <button
                    key={item.title}
                    ref={(el: HTMLButtonElement | null) => {
                      tabsRef.current[index] = el;
                    }}
                    role="tab"
                    id={`etapa-tab-${index}`}
                    aria-selected={selected}
                    aria-controls="etapa-painel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onKeyDown={onKeyDown}
                    className="group flex flex-col items-center gap-5 rounded-2xl px-2 pb-2 text-center"
                  >
                    <span
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full border text-sm font-medium tabular-nums transition-all duration-500 ease-[var(--ease-soft)] ${
                        selected
                          ? 'border-white bg-white text-ink'
                          : done
                            ? 'border-white/70 bg-ink text-white'
                            : 'border-line bg-ink text-mute group-hover:border-white/50 group-hover:text-white'
                      }`}
                    >
                      {pad(index + 1)}
                    </span>
                    <span
                      className={`text-[1.05rem] font-medium transition-colors duration-300 ${
                        selected ? 'text-white' : 'text-mute group-hover:text-white'
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="etapa-painel"
            role="tabpanel"
            aria-labelledby={`etapa-tab-${active}`}
            className="mt-14 grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-start gap-12 border-t border-line pt-10"
          >
            <div key={`t-${active}`} className="step-in">
              <p className="text-sm text-mute tabular-nums">
                Etapa {active + 1} de {processSteps.length}
              </p>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-white">{step.title}</h3>
              <p className="mt-2 text-lg text-white/80">{step.summary}</p>
            </div>
            <p key={`d-${active}`} className="step-in max-w-[52ch] text-lg leading-relaxed text-mute">
              {step.detail}
            </p>
          </div>
        </Reveal>

        {/* Celular e tablet: linha do tempo vertical expansível */}
        <ol className="relative mt-14 lg:hidden">
          <span className="absolute top-3 bottom-3 left-[1.375rem] w-px bg-line" aria-hidden="true" />
          {processSteps.map((item, index) => {
            const open = index === active;
            return (
              <Reveal as="li" key={item.title} delay={index * 60} className="relative">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-expanded={open}
                  aria-controls={`etapa-m-${index}`}
                  className="flex w-full items-center gap-5 py-4 text-left"
                >
                  <span
                    className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-medium tabular-nums transition-all duration-500 ${
                      open ? 'border-white bg-white text-ink' : 'border-line bg-ink text-mute'
                    }`}
                  >
                    {pad(index + 1)}
                  </span>
                  <span className="flex-1">
                    <span className={`block text-lg font-semibold ${open ? 'text-white' : 'text-white/85'}`}>
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[0.95rem] text-mute">{item.summary}</span>
                  </span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-mute transition-transform duration-500 ${open ? 'rotate-45 text-white' : ''}`}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`etapa-m-${index}`}
                  className={`grid pl-16 transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-soft)] ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <p className="overflow-hidden leading-relaxed text-mute">
                    <span className="block pb-5">{item.detail}</span>
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
