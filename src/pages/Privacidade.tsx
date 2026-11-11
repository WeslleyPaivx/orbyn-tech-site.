import { site } from '../config/site';
import { EmailLink, LegalLayout } from '../components/layout/LegalLayout';
import { whatsappUrl } from '../lib/whatsapp';

/** /privacidade — política de privacidade, conforme a LGPD (Lei nº 13.709/2018). */
export function Privacidade() {
  return (
    <LegalLayout
      eyebrow="LGPD"
      title="Política de privacidade"
      intro={
        <p>
          Este texto explica, sem juridiquês, quais dados o site da Zaniva Digital coleta, para que
          eles servem, com quem são compartilhados e como você pode pedir acesso, correção ou exclusão.
          Ele segue a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).
        </p>
      }
    >
      <h2>1. Quem é o responsável pelos seus dados</h2>
      <p>
        A Zaniva Digital é uma agência digital representada por <strong>{site.legal.responsible}</strong>,
        responsável pelo tratamento dos dados coletados neste site (o “controlador”, nos termos da LGPD).
      </p>
      <ul>
        <li>
          E-mail para assuntos de privacidade: <EmailLink />
        </li>
        <li>
          WhatsApp:{' '}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            {site.whatsapp.display}
          </a>
        </li>
      </ul>

      <h2>2. Que dados o site coleta</h2>
      <p>
        O site não tem formulário nem cadastro, e não pede CPF, endereço ou dados de pagamento. Os dados
        coletados são estes:
      </p>
      <ul>
        <li>
          <strong>Clique no botão do WhatsApp.</strong> O site registra que o clique aconteceu, em qual
          botão e em que parte da página. Ele não registra o seu número nem o que você escreve. A conversa
          acontece no próprio WhatsApp: quando você fala com a gente, recebemos o seu nome de perfil, o
          seu número e as mensagens que você enviar.
        </li>
        <li>
          <strong>Dados de navegação</strong>, coletados pelo Google Analytics e pelo Pixel da Meta:
          páginas visitadas, tempo no site, de onde você veio (uma busca no Google, o Instagram, um
          anúncio), tipo de aparelho e de navegador, cidade aproximada (estimada pelo endereço IP) e
          identificadores guardados em cookies.
        </li>
        <li>
          <strong>Registros técnicos do servidor</strong>, como endereço IP, data e hora do acesso,
          gravados pela empresa que hospeda o site para mantê-lo no ar e protegido.
        </li>
      </ul>

      <h2>3. Para que usamos esses dados</h2>
      <ul>
        <li>Responder quem nos chama no WhatsApp e preparar orçamentos.</li>
        <li>Entender quais páginas e botões funcionam melhor e melhorar o site.</li>
        <li>
          Medir o resultado dos nossos anúncios no Instagram e no Facebook e mostrar anúncios a pessoas
          com interesses parecidos.
        </li>
        <li>Manter o site seguro e funcionando.</li>
      </ul>
      <p>
        Usamos esses dados com base no nosso legítimo interesse em medir e melhorar o site e os
        anúncios, e, quando você pede um orçamento, para tomar as providências que vêm antes de um
        contrato (LGPD, art. 7º, incisos IX e V). Você pode se opor a esse uso a qualquer momento (veja os
        itens 5 e 7).
      </p>

      <h2>4. Com quem compartilhamos</h2>
      <p>Não vendemos dados. Eles passam apenas pelas empresas que fazem o site funcionar:</p>
      <ul>
        <li>
          <strong>Google</strong>, pelo Google Analytics, que mede as visitas (
          <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">
            política do Google
          </a>
          ).
        </li>
        <li>
          <strong>Meta</strong>, pelo Pixel da Meta, pelo Instagram, pelo Facebook e pelo WhatsApp, que
          medem os anúncios e levam as conversas (
          <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
            política da Meta
          </a>
          ).
        </li>
        <li>
          <strong>Vercel</strong>, a empresa que hospeda o site (
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            política da Vercel
          </a>
          ).
        </li>
      </ul>
      <p>
        Essas empresas podem guardar dados em servidores fora do Brasil, seguindo as próprias políticas
        de privacidade.
      </p>

      <h2>5. Cookies e como bloquear</h2>
      <p>
        Cookies são pequenos arquivos que o navegador guarda para reconhecer uma visita. O Google
        Analytics e o Pixel da Meta usam cookies para medir as visitas e os anúncios. Para bloquear:
      </p>
      <ul>
        <li>Nas configurações do seu navegador, bloqueie os cookies de terceiros ou apague os cookies.</li>
        <li>
          Instale o{' '}
          <a href="https://tools.google.com/dlpage/gaoptout?hl=pt-BR" target="_blank" rel="noopener noreferrer">
            complemento de desativação do Google Analytics
          </a>
          .
        </li>
        <li>
          Ajuste os anúncios que vê nas{' '}
          <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer">
            preferências de anúncios da Meta
          </a>
          .
        </li>
      </ul>
      <p>O site continua funcionando normalmente com os cookies bloqueados.</p>

      <h2>6. Por quanto tempo guardamos</h2>
      <ul>
        <li>
          <strong>Dados de navegação no Google Analytics:</strong> pelo prazo de retenção configurado na
          conta, de no máximo 14 meses. Depois disso, ficam só números somados, que não identificam
          ninguém.
        </li>
        <li>
          <strong>Dados do Pixel da Meta:</strong> pelo prazo definido na política da Meta.
        </li>
        <li>
          <strong>Conversas no WhatsApp:</strong> enquanto forem necessárias para o atendimento. Se você
          virar cliente, durante o contrato e pelo prazo que a lei exige depois dele. Se pedir, apagamos
          antes, a menos que a lei nos obrigue a guardar.
        </li>
      </ul>

      <h2>7. Seus direitos e como pedir</h2>
      <p>Pela LGPD (art. 18), você pode, a qualquer momento:</p>
      <ul>
        <li>confirmar se tratamos dados seus e ter acesso a eles;</li>
        <li>corrigir dados incompletos, errados ou desatualizados;</li>
        <li>pedir a exclusão, o bloqueio ou a anonimização de dados;</li>
        <li>pedir a portabilidade dos dados para outra empresa;</li>
        <li>saber com quem compartilhamos os seus dados;</li>
        <li>se opor a um uso que não queira e revogar um consentimento que tenha dado.</li>
      </ul>
      <p>
        Para pedir, mande um e-mail para <EmailLink /> com o assunto “Privacidade”, dizendo o que você
        quer. Respondemos em até 15 dias. Se não ficar satisfeito, você também pode reclamar à{' '}
        <a href="https://www.gov.br/anpd/pt-br" target="_blank" rel="noopener noreferrer">
          Autoridade Nacional de Proteção de Dados (ANPD)
        </a>
        .
      </p>

      <h2>8. Segurança</h2>
      <p>
        O site funciona só com conexão protegida (HTTPS) e tem regras que bloqueiam scripts não
        autorizados. Nenhum sistema é 100% seguro, mas, se acontecer um incidente que possa trazer risco a
        você, avisamos as pessoas afetadas e a ANPD, como manda a lei.
      </p>

      <h2>9. Mudanças nesta política</h2>
      <p>
        Esta política pode mudar quando o site ou a lei mudarem. A data da última atualização fica no topo
        da página.
      </p>
    </LegalLayout>
  );
}
