"use client";

import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";

function CheckEmailContent() {
  const params = useSearchParams();
  const { resendConfirmation } = useAuth();
  const email = params.get("email") ?? "";
  const error = params.get("error");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const resend = async () => {
    if (!email) return;
    setResending(true);
    setResendError(null);
    const result = await resendConfirmation(email);
    setResending(false);
    if (result.error) setResendError(result.error);
    else setResent(true);
  };

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-8 flex justify-center">
        <Logo href="/" size="xl" markOnly />
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
          <Mail className="h-8 w-8 text-indigo-600" />
        </div>

        {error === "invalid" ? (
          <>
            <h1 className="text-center text-2xl font-bold">Link non valido</h1>
            <p className="mt-3 text-center text-sm text-stone-500">
              Il link è scaduto o già usato. Registrati di nuovo o richiedi
              un nuovo invio.
            </p>
            <Link
              href="/"
              className="mt-6 block rounded-2xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white"
            >
              Torna alla registrazione
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-center text-2xl font-bold">
              Conferma la tua email
            </h1>
            <p className="mt-3 text-center text-sm leading-relaxed text-stone-500">
              Abbiamo inviato un link a{" "}
              <strong className="text-stone-800">{email || "la tua email"}</strong>.
              Cliccalo per attivare l&apos;account e usare Queue Less.
            </p>

            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Controlla anche la cartella spam. Dopo il click verrai reindirizzato
              automaticamente all&apos;app.
            </p>

            {email && (
              <button
                type="button"
                onClick={resend}
                disabled={resending || resent}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 py-3 text-sm font-medium text-stone-700 disabled:opacity-50"
              >
                {resending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {resent ? "Email reinviata!" : "Reinvia email di conferma"}
              </button>
            )}

            {resendError && (
              <p className="mt-2 text-center text-xs text-red-600">
                {resendError}
              </p>
            )}

            <Link
              href="/"
              className="mt-6 block text-center text-sm text-stone-500 hover:text-indigo-600"
            >
              ← Torna al login
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[100dvh] items-center justify-center">
          <p className="text-stone-500">…</p>
        </main>
      }
    >
      <CheckEmailContent />
    </Suspense>
  );
}
