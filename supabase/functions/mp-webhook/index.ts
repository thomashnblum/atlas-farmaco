// ============================================================================
// Atlas Fármaco — Webhook do Mercado Pago (Supabase Edge Function, Deno)
// ============================================================================
// "Recebedor" de notificações do Mercado Pago. Quando uma assinatura muda de
// estado (autorizada, pausada, cancelada) ou uma cobrança recorrente ocorre, o
// MP chama esta função. Ela consulta a assinatura na API do MP e liga/desliga o
// is_premium do usuário correspondente (casado pelo e-mail do pagador).
//
// Segredos necessários (Supabase → Edge Functions → Secrets):
//   MP_ACCESS_TOKEN            (Access Token do Mercado Pago — teste ou produção)
//   SUPABASE_URL              (injetado automaticamente)
//   SUPABASE_SERVICE_ROLE_KEY (injetado automaticamente; bypassa RLS)
//   MP_WEBHOOK_SECRET         (opcional — "Assinatura secreta" do painel de
//                              Webhooks do MP; se setado, a assinatura é validada)
// ============================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const WEBHOOK_SECRET = Deno.env.get("MP_WEBHOOK_SECRET") ?? "";

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function mpGet(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.mercadopago.com${path}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`MP GET ${path} -> ${res.status}`);
  return res.json();
}

/** Lê o estado atual da assinatura no MP e reflete no profile do usuário. */
async function refreshSubscription(preapprovalId: string): Promise<void> {
  const sub = await mpGet(`/preapproval/${preapprovalId}`);
  const email = String(sub.payer_email ?? "").toLowerCase().trim();
  const status = String(sub.status ?? ""); // authorized | paused | cancelled | pending
  const isPremium = status === "authorized";

  if (!email) {
    console.warn(`[mp-webhook] preapproval ${preapprovalId} sem payer_email`);
    return;
  }

  const { data, error } = await admin
    .from("profiles")
    .update({
      is_premium: isPremium,
      subscription_status: status,
      mp_preapproval_id: preapprovalId,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email)
    .select("id");

  if (error) {
    console.error(`[mp-webhook] erro ao atualizar profile ${email}:`, error.message);
  } else if (!data || data.length === 0) {
    console.warn(`[mp-webhook] nenhum profile com email ${email} (pagou com e-mail diferente da conta?)`);
  } else {
    console.log(`[mp-webhook] ${email} -> premium=${isPremium} (${status})`);
  }
}

/** Valida a assinatura HMAC do webhook (só quando MP_WEBHOOK_SECRET está setado). */
async function isSignatureValid(req: Request, dataId: string): Promise<boolean> {
  if (!WEBHOOK_SECRET) return true; // sem secret configurado: não valida (fase de teste)
  const sigHeader = req.headers.get("x-signature") ?? "";
  const requestId = req.headers.get("x-request-id") ?? "";
  const parts = Object.fromEntries(
    sigHeader.split(",").map((kv) => kv.split("=").map((s) => s.trim())),
  ) as Record<string, string>;
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(manifest));
  const computed = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return computed === v1;
}

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    let type = url.searchParams.get("type") ?? url.searchParams.get("topic") ?? "";
    let id = url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? "";

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({} as Record<string, unknown>));
      type = String((body as { type?: string; topic?: string }).type ?? (body as { topic?: string }).topic ?? type);
      const dataObj = (body as { data?: { id?: string | number } }).data;
      if (dataObj?.id != null) id = String(dataObj.id);
    }

    if (!id) return new Response("ok (sem id)", { status: 200 });

    if (!(await isSignatureValid(req, id))) {
      console.warn("[mp-webhook] assinatura invalida");
      return new Response("assinatura invalida", { status: 401 });
    }

    if (type.includes("preapproval") && !type.includes("payment")) {
      // subscription_preapproval / preapproval: a própria assinatura mudou
      await refreshSubscription(id);
    } else if (type === "subscription_authorized_payment") {
      // uma cobrança recorrente ocorreu — revalida a assinatura pai
      const ap = await mpGet(`/authorized_payments/${id}`);
      const preapprovalId = ap.preapproval_id;
      if (preapprovalId) await refreshSubscription(String(preapprovalId));
    } else {
      console.log(`[mp-webhook] evento ignorado: type=${type} id=${id}`);
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("[mp-webhook] erro:", err);
    // 500 faz o MP tentar reenviar depois (evento transitório).
    return new Response("erro interno", { status: 500 });
  }
});
