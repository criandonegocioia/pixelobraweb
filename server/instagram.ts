import { ENV } from "./_core/env";

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type?: string;
  timestamp?: string;
  permalink?: string;
  like_count?: number;
  comments_count?: number;
}

export interface PublishResult {
  success: boolean;
  postId?: string;
  error?: string;
}

export interface AccountInfo {
  success: boolean;
  id?: string;
  username?: string;
  name?: string;
  biography?: string;
  followers_count?: number;
  media_count?: number;
  profile_picture_url?: string;
  error?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getToken(): string {
  return ENV.facebookAccessToken;
}

function getAccountId(): string {
  return ENV.instagramAccountId;
}

// ─────────────────────────────────────────────
// Informações da Conta
// ─────────────────────────────────────────────

/**
 * Busca informações da conta do Instagram Business conectada ao token.
 */
export async function getAccountInfo(): Promise<AccountInfo> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: "Token do Facebook não configurado" };
    }

    // Primeiro, busca as contas do Instagram conectadas à página do Facebook
    const pagesUrl = `${GRAPH_API_BASE}/me/accounts?access_token=${token}`;
    const pagesResponse = await fetch(pagesUrl);

    if (!pagesResponse.ok) {
      const errorText = await pagesResponse.text();
      return { success: false, error: `Erro ao buscar páginas: ${errorText}` };
    }

    const pagesData = (await pagesResponse.json()) as {
      data: Array<{ id: string; name: string; access_token: string }>;
    };

    if (!pagesData.data || pagesData.data.length === 0) {
      return { success: false, error: "Nenhuma página do Facebook encontrada" };
    }

    // Usa a primeira página para buscar a conta do Instagram
    const pageId = pagesData.data[0].id;
    const igUrl = `${GRAPH_API_BASE}/${pageId}?fields=instagram_business_account&access_token=${token}`;
    const igResponse = await fetch(igUrl);

    if (!igResponse.ok) {
      const errorText = await igResponse.text();
      return { success: false, error: `Erro ao buscar conta Instagram: ${errorText}` };
    }

    const igData = (await igResponse.json()) as {
      instagram_business_account?: { id: string };
    };

    if (!igData.instagram_business_account) {
      return { success: false, error: "Conta do Instagram Business não encontrada" };
    }

    const igAccountId = igData.instagram_business_account.id;

    // Busca detalhes da conta do Instagram
    const detailsUrl = `${GRAPH_API_BASE}/${igAccountId}?fields=id,username,name,biography,followers_count,media_count,profile_picture_url&access_token=${token}`;
    const detailsResponse = await fetch(detailsUrl);

    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();
      return { success: false, error: `Erro ao buscar detalhes: ${errorText}` };
    }

    const details = (await detailsResponse.json()) as AccountInfo & { id: string };

    return {
      success: true,
      id: details.id,
      username: details.username,
      name: details.name,
      biography: details.biography,
      followers_count: details.followers_count,
      media_count: details.media_count,
      profile_picture_url: details.profile_picture_url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// ─────────────────────────────────────────────
// Publicar Post no Instagram
// ─────────────────────────────────────────────

/**
 * Publica uma imagem no Instagram Business com legenda.
 * Requer que a URL da imagem seja publicamente acessível.
 */
export async function publishInstagramPost(
  imageUrl: string,
  caption: string,
  accountId?: string
): Promise<PublishResult> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: "Token do Facebook não configurado" };
    }

    const igAccountId = accountId || getAccountId();
    if (!igAccountId) {
      return { success: false, error: "ID da conta do Instagram não configurado" };
    }

    // Passo 1: Criar container de mídia
    const containerUrl = `${GRAPH_API_BASE}/${igAccountId}/media`;
    const containerResponse = await fetch(containerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: token,
      }),
    });

    if (!containerResponse.ok) {
      const errorText = await containerResponse.text();
      return { success: false, error: `Erro ao criar container: ${errorText}` };
    }

    const containerData = (await containerResponse.json()) as { id: string };
    const containerId = containerData.id;

    // Passo 2: Publicar o container
    const publishUrl = `${GRAPH_API_BASE}/${igAccountId}/media_publish`;
    const publishResponse = await fetch(publishUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: token,
      }),
    });

    if (!publishResponse.ok) {
      const errorText = await publishResponse.text();
      return { success: false, error: `Erro ao publicar: ${errorText}` };
    }

    const publishData = (await publishResponse.json()) as { id: string };

    return { success: true, postId: publishData.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// ─────────────────────────────────────────────
// Listar Posts Recentes
// ─────────────────────────────────────────────

export interface PostsResult {
  success: boolean;
  posts?: InstagramPost[];
  error?: string;
}

/**
 * Lista os posts mais recentes do Instagram Business.
 */
export async function getRecentPosts(
  accountId?: string,
  limit = 10
): Promise<PostsResult> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: "Token do Facebook não configurado" };
    }

    const igAccountId = accountId || getAccountId();
    if (!igAccountId) {
      return { success: false, error: "ID da conta do Instagram não configurado" };
    }

    const url = `${GRAPH_API_BASE}/${igAccountId}/media?fields=id,caption,media_type,timestamp,permalink,like_count,comments_count&limit=${limit}&access_token=${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Erro ao buscar posts: ${errorText}` };
    }

    const data = (await response.json()) as { data: InstagramPost[] };

    return { success: true, posts: data.data ?? [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// ─────────────────────────────────────────────
// Verificar Token
// ─────────────────────────────────────────────

export interface TokenVerifyResult {
  success: boolean;
  valid?: boolean;
  expiresAt?: string;
  scopes?: string[];
  error?: string;
}

/**
 * Verifica se o token do Facebook está válido e retorna informações sobre ele.
 */
export async function verifyToken(): Promise<TokenVerifyResult> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: "Token do Facebook não configurado" };
    }

    const url = `${GRAPH_API_BASE}/debug_token?input_token=${token}&access_token=${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Erro ao verificar token: ${errorText}` };
    }

    const data = (await response.json()) as {
      data: {
        is_valid: boolean;
        expires_at?: number;
        scopes?: string[];
      };
    };

    const expiresAt = data.data.expires_at
      ? new Date(data.data.expires_at * 1000).toISOString()
      : undefined;

    return {
      success: true,
      valid: data.data.is_valid,
      expiresAt,
      scopes: data.data.scopes,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
// ─────────────────────────────────────────────
// Reply to Instagram Comment
// ─────────────────────────────────────────────

export interface ReplyResult {
  success: boolean;
  replyId?: string;
  error?: string;
}

/**
 * Replies to an Instagram comment with a given message.
 * Uses the Instagram Graph API `/{comment_id}/replies` endpoint.
 */
export async function replyToComment(
  commentId: string,
  message: string
): Promise<ReplyResult> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: "Token do Facebook não configurado" };
    }

    const url = `${GRAPH_API_BASE}/${commentId}/replies`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        access_token: token,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Erro ao responder comentário: ${errorText}` };
    }

    const data = (await response.json()) as { id: string };
    return { success: true, replyId: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// ─────────────────────────────────────────────
// Send Direct Message (Instagram Messaging API)
// ─────────────────────────────────────────────

export interface DMResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a direct message to an Instagram user.
 * Requires the instagram_manage_messages permission.
 */
export async function sendDM(
  recipientId: string,
  message: string
): Promise<DMResult> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: "Token do Facebook não configurado" };
    }

    const igAccountId = getAccountId();
    if (!igAccountId) {
      return { success: false, error: "ID da conta do Instagram não configurado" };
    }

    const url = `${GRAPH_API_BASE}/${igAccountId}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        access_token: token,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Erro ao enviar DM: ${errorText}` };
    }

    const data = (await response.json()) as { message_id?: string; id?: string };
    return { success: true, messageId: data.message_id || data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
