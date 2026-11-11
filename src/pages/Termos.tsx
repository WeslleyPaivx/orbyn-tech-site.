import { site } from '../config/site';
import { EmailLink, LegalLayout } from '../components/layout/LegalLayout';
import { services } from '../data/services';
import { whatsappUrl } from '../lib/whatsapp';

/** /termos — termos de uso do site e regras gerais de contratação. */
export function Termos() {
  return (
    <LegalLayout
      eyebrow="Regras"
      title="Termos de uso"
      intro={
        <p>
          Estes termos explicam como funciona o site da Zaniva Digital e como é a contratação dos nossos
          serviços: o que entregamos, prazos, cancelamento e reembolso. Ao usar o site, você concorda com
          eles.
        </p>
      }
    >
      <h2>1. Quem somos</h2>
      <p>
        A Zaniva Digital é uma agência digital representada por <strong>{site.legal.responsible}</strong>.
        Contato pelo e-mail <EmailLink /> ou pelo WhatsApp{' '}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          {site.whatsapp.display}
        </a>
        .
      </p>

      <h2>2. O que o site oferece</h2>
      <p>O site apresenta os serviços da agência:</p>
      <ul>
        {services.map((service) => (
          <li key={service.id}>{service.title}</li>
        ))}
      </ul>
      <p>
        Nada é vendido diretamente pelo site. As informações e o portfólio servem para você conhecer o
        nosso trabalho, e o contato para pedir um orçamento é feito pelo WhatsApp.
      </p>

      <h2>3. Como funciona a contratação</h2>
      <ol>
        <li>
          <strong>Contato:</strong> você nos chama pelo WhatsApp e conta o que precisa.
        </li>
        <li>
          <strong>Briefing:</strong> conversamos para entender o seu negócio, os objetivos e o que o
          projeto precisa ter.
        </li>
        <li>
          <strong>Contrato assinado:</strong> enviamos o contrato com o escopo, o valor, a forma de
          pagamento, o prazo de entrega e as regras de ajustes. O trabalho só começa depois da assinatura.
        </li>
      </ol>
      <p>Se alguma regra do contrato for diferente destes termos, vale o que está no contrato.</p>

      <h2>4. Prazo de entrega</h2>
      <p>
        O prazo varia de acordo com cada projeto e fica definido no contrato, a partir do que foi
        combinado no briefing.
      </p>

      <h2>5. Ajustes</h2>
      <p>A quantidade de ajustes e a forma de pedir cada um são alinhadas no contrato.</p>

      <h2>6. Cancelamento e reembolso</h2>
      <p>
        Como a contratação é feita fora de um estabelecimento comercial (pela internet, pelo WhatsApp ou
        por telefone), você tem <strong>7 dias</strong> a partir da assinatura do contrato para desistir,
        sem precisar dar motivo, como garante o Código de Defesa do Consumidor (art. 49). Nesse caso,
        devolvemos todo o valor pago, corrigido.
      </p>
      <p>
        Para desistir, avise pelo e-mail <EmailLink /> ou pelo WhatsApp. Depois desses 7 dias, o
        cancelamento segue as condições do contrato.
      </p>

      <h2>7. Uso do site</h2>
      <ul>
        <li>
          Os textos, a marca, as imagens e o visual do site pertencem à Zaniva Digital. Os projetos do
          portfólio pertencem aos respectivos clientes. Não copie nem reutilize esse conteúdo sem
          autorização.
        </li>
        <li>
          O site tem links para páginas de terceiros (projetos do portfólio, WhatsApp, Instagram). Não
          respondemos pelo conteúdo nem pelas regras dessas páginas.
        </li>
      </ul>

      <h2>8. Privacidade</h2>
      <p>
        Como tratamos os seus dados está explicado na <a href="/privacidade">política de privacidade</a>.
      </p>

      <h2>9. Mudanças nestes termos</h2>
      <p>
        Estes termos podem mudar quando os serviços ou a lei mudarem. A data da última atualização fica no
        topo da página. Contratos já assinados continuam valendo como foram assinados.
      </p>

      <h2>10. Lei e foro</h2>
      <p>
        Estes termos seguem a lei brasileira. Fica eleito o foro da comarca de {site.legal.forum} para
        resolver qualquer questão, sem tirar do consumidor o direito de entrar com uma ação no foro da
        própria cidade, como garante o Código de Defesa do Consumidor.
      </p>
    </LegalLayout>
  );
}
