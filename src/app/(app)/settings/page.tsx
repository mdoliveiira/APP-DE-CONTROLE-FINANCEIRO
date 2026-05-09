'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { linkWhatsApp, unlinkWhatsApp, getLinkedPhone } from '@/lib/actions/whatsapp';

export default function SettingsPage() {
  const router = useRouter();
  const [linkedPhone, setLinkedPhone] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadLinkedPhone = async () => {
      try {
        const phone = await getLinkedPhone();
        setLinkedPhone(phone);
      } catch (err) {
        console.error('Erro ao carregar número:', err);
      } finally {
        setLoadingPhone(false);
      }
    };

    loadLinkedPhone();
  }, []);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await linkWhatsApp(phoneInput);
      if (result.success) {
        setSuccess('Número vinculado com sucesso!');
        setPhoneInput('');
        const phone = await getLinkedPhone();
        setLinkedPhone(phone);
      } else {
        setError(result.error || 'Erro ao vincular número');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await unlinkWhatsApp();
      if (result.success) {
        setSuccess('Número desvinculado com sucesso!');
        setLinkedPhone(null);
      } else {
        setError(result.error || 'Erro ao desvincular número');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sora)' }}
          >
            Configurações
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Gerencie suas preferências e integrações
          </p>
        </div>

        {/* WhatsApp Bot Section */}
        <Card className="p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                🤖 Bot do WhatsApp
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Adicione despesas enviando mensagens no WhatsApp
              </p>
            </div>

            {loadingPhone ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--muted-foreground)' }} />
              </div>
            ) : (
              <>
                {linkedPhone ? (
                  <div
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: '#22D3A8',
                    }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: 'var(--foreground)' }}
                    >
                      ✅ Número vinculado: <strong>{linkedPhone}</strong>
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleUnlink}
                      disabled={loading}
                      className="mt-3"
                    >
                      {loading ? 'Desvinculando...' : 'Desvincular'}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleLink} className="space-y-3">
                    <div>
                      <label
                        className="text-sm font-medium block mb-1"
                        style={{ color: 'var(--foreground)' }}
                      >
                        Seu número WhatsApp
                      </label>
                      <Input
                        type="tel"
                        placeholder="+55 11 99999-9999"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        disabled={loading}
                      />
                      <p
                        className="text-xs mt-1"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        Use o formato: +55 DDD 9XXXX-XXXX
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || !phoneInput.trim()}
                    >
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {loading ? 'Vinculando...' : 'Vincular WhatsApp'}
                    </Button>
                  </form>
                )}

                {error && (
                  <div
                    className="p-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#EF4444',
                      borderLeft: '4px solid #EF4444',
                    }}
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    className="p-3 rounded-lg text-sm"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: '#22C55E',
                      borderLeft: '4px solid #22C55E',
                    }}
                  >
                    {success}
                  </div>
                )}
              </>
            )}

            {/* Instructions */}
            <div
              className="p-4 rounded-lg space-y-3 mt-6"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
              }}
            >
              <h3 className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>
                📖 Como usar:
              </h3>
              <ol
                className="text-xs space-y-2 list-decimal list-inside"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <li>Abra o WhatsApp e envie uma mensagem para o número do bot</li>
                <li>Para vincular sua conta, envie: <strong>vincular seu-email@email.com</strong></li>
                <li>Depois, envie suas despesas:</li>
              </ol>
              <div
                className="ml-4 text-xs space-y-1"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <p>• <strong>gastei 50 de gasolina</strong></p>
                <p>• <strong>paguei 150 no mercado</strong></p>
                <p>• <strong>aluguel 1200</strong></p>
                <p>• <strong>gastei 35,50 de café</strong></p>
              </div>
              <p className="text-xs pt-2" style={{ color: 'var(--muted-foreground)' }}>
                O bot responderá confirmando a despesa adicionada!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
