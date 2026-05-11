import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { parseWhatsAppMessage, isLinkCommand } from '@/lib/whatsapp/parser';
import { format } from 'date-fns';
import { toMonthKey } from '@/lib/utils/date';

function validateTwilioRequest(
  signature: string,
  url: string,
  params: Record<string, any>,
  authToken: string
): boolean {
  const parsedUrl = new URL(url);
  const path = parsedUrl.pathname + parsedUrl.search;
  const data = path + new URLSearchParams(params).toString();
  const hash = createHmac('sha1', authToken).update(data).digest('base64');
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const signature = request.headers.get('x-twilio-signature') || '';
    const urlString = request.url;

    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!authToken) {
      console.error('TWILIO_AUTH_TOKEN not configured');
      return createTwiMLResponse('Erro na configuração do servidor');
    }

    const isValidRequest = validateTwilioRequest(
      signature,
      urlString,
      Object.fromEntries(formData),
      authToken
    );

    if (!isValidRequest) {
      console.warn('Invalid Twilio request signature');
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;

    if (!from || !body) {
      return createTwiMLResponse('Requisição inválida');
    }

    const phoneNumber = from.replace('whatsapp:', '');
    const messageText = body.trim();

    const admin = createAdminClient();

    const emailFromCommand = isLinkCommand(messageText);
    if (emailFromCommand) {
      const { data: users, error: userError } = await admin
        .from('auth.users')
        .select('id')
        .eq('email', emailFromCommand);

      if (userError || !users || users.length === 0) {
        return createTwiMLResponse(
          `❌ Email ${emailFromCommand} não encontrado no app. Verifique o email e tente novamente.`
        );
      }

      const userId = users[0].id;

      const { error: linkError } = await admin
        .from('whatsapp_users')
        .upsert(
          {
            user_id: userId,
            phone_number: phoneNumber,
          },
          {
            onConflict: 'phone_number',
          }
        );

      if (linkError) {
        return createTwiMLResponse(
          `❌ Erro ao vincular conta: ${linkError.message}`
        );
      }

      return createTwiMLResponse(
        `✅ Conta vinculada com sucesso! Agora você pode enviar mensagens para adicionar despesas.\n\nExemplos:\n• gastei 50 de gasolina\n• paguei 150 no mercado\n• aluguel 1200`
      );
    }

    const { data: whatsappUser, error: lookupError } = await admin
      .from('whatsapp_users')
      .select('user_id')
      .eq('phone_number', phoneNumber)
      .single();

    if (lookupError || !whatsappUser) {
      return createTwiMLResponse(
        `❌ Seu WhatsApp não está vinculado a uma conta.\n\nPara vincular, envie:\nvincular seu-email@email.com\n\nExemplo: vincular m.danilo.oliveira@hotmail.com`
      );
    }

    const parsed = parseWhatsAppMessage(messageText);
    if (!parsed) {
      return createTwiMLResponse(
        `❌ Não entendi a mensagem.\n\nExemplos válidos:\n• gastei 50 de gasolina\n• paguei 150 no mercado\n• 50 gasolina\n• aluguel 1200\n• gastei 35,50 de café`
      );
    }

    const { amount, description } = parsed;
    const today = new Date();
    const month = toMonthKey(format(today, 'yyyy-MM-dd'));

    const { error: insertError } = await admin
      .from('expenses')
      .insert({
        user_id: whatsappUser.user_id,
        description,
        amount,
        due_date: format(today, 'yyyy-MM-dd'),
        status: 'pendente',
        month,
        category_id: null,
        paid_date: null,
        notes: 'Adicionado via WhatsApp Bot',
      });

    if (insertError) {
      console.error('Error inserting expense:', insertError);
      return createTwiMLResponse(
        `❌ Erro ao adicionar despesa: ${insertError.message}`
      );
    }

    const formattedAmount = amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const capitalizedDescription = description.charAt(0).toUpperCase() + description.slice(1);

    return createTwiMLResponse(
      `✅ Despesa de R$ ${formattedAmount} (${capitalizedDescription}) adicionada para ${format(today, 'MMMM/yyyy', { locale: { ...require('date-fns/locale/pt-BR').default } })}`
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return createTwiMLResponse('❌ Erro no servidor');
  }
}

function createTwiMLResponse(message: string) {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(message)}</Message>
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
