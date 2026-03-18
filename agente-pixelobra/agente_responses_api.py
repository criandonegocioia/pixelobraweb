#!/usr/bin/env python3
"""
Agente Virtual Pixel Obra - Responses API (OpenAI)
===================================================
Utiliza o prompt publicado na OpenAI Platform:
  Prompt ID: pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0
  Versão: 2

Endpoint: POST /v1/responses
Mantém contexto conversacional via previous_response_id.

Uso:
  python agente_responses_api.py

Requisitos:
  - pip install httpx
  - Variável de ambiente OPENAI_API_KEY configurada
"""
import os
import json
import httpx

# ─────────────────────────────────────────────
# Configuração
# ─────────────────────────────────────────────
API_KEY = os.environ.get("OPENAI_API_KEY", "")
BASE_URL = "https://api.openai.com/v1"
PROMPT_ID = "pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0"
PROMPT_VERSION = "2"


# ─────────────────────────────────────────────
# Funções do Agente
# ─────────────────────────────────────────────
def enviar_mensagem(mensagem_cliente: str, previous_response_id: str = None) -> tuple:
    """
    Envia uma mensagem do cliente para o agente Pixel Obra usando a Responses API.
    Mantém o contexto da conversa usando previous_response_id.

    Args:
        mensagem_cliente: Texto da mensagem do cliente
        previous_response_id: ID da resposta anterior para manter contexto

    Returns:
        tuple: (texto_resposta, response_id)
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    payload = {
        "prompt": {
            "id": PROMPT_ID,
            "version": PROMPT_VERSION
        },
        "input": mensagem_cliente
    }

    # Manter contexto da conversa
    if previous_response_id:
        payload["previous_response_id"] = previous_response_id

    response = httpx.post(
        f"{BASE_URL}/responses",
        headers=headers,
        json=payload,
        timeout=30
    )

    if response.status_code != 200:
        print(f"[ERRO] Status {response.status_code}: {response.text[:300]}")
        return None, None

    data = response.json()
    response_id = data.get("id")

    # Extrair o texto da resposta
    output_text = ""
    for item in data.get("output", []):
        if item.get("type") == "message":
            for content in item.get("content", []):
                if content.get("type") == "output_text":
                    output_text += content.get("text", "")

    return output_text, response_id


def conversa_interativa():
    """
    Inicia uma conversa interativa no terminal com o agente Pixel Obra.
    Digite 'sair' para encerrar.
    """
    print("=" * 60)
    print("  AGENTE VIRTUAL PIXEL OBRA")
    print(f"  Prompt: {PROMPT_ID} (v{PROMPT_VERSION})")
    print("  Responses API - OpenAI")
    print("  Digite 'sair' para encerrar")
    print("=" * 60)
    print()

    previous_id = None
    historico = []

    while True:
        try:
            msg = input("Você: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n\nConversa encerrada.")
            break

        if not msg:
            continue
        if msg.lower() in ("sair", "exit", "quit"):
            print("\nObrigado por conversar com a Pixel Obra! Até logo.")
            break

        resposta, response_id = enviar_mensagem(msg, previous_id)

        if resposta:
            print(f"\nPixel Obra: {resposta}\n")
            historico.append({
                "cliente": msg,
                "resposta": resposta,
                "response_id": response_id
            })
            previous_id = response_id
        else:
            print("\n[ERRO] Não foi possível gerar resposta. Tente novamente.\n")

    # Salvar histórico
    if historico:
        with open("historico_conversa.json", "w", encoding="utf-8") as f:
            json.dump(historico, f, ensure_ascii=False, indent=2)
        print(f"\nHistórico salvo em historico_conversa.json ({len(historico)} mensagens)")


def responder_mensagens(mensagens: list) -> list:
    """
    Responde a uma lista de mensagens mantendo o contexto conversacional.
    Útil para integração com WhatsApp, Instagram, etc.

    Args:
        mensagens: Lista de strings com as mensagens do cliente

    Returns:
        Lista de dicts com mensagem, resposta e response_id
    """
    previous_id = None
    respostas = []

    for msg in mensagens:
        resposta, response_id = enviar_mensagem(msg, previous_id)
        respostas.append({
            "mensagem_cliente": msg,
            "resposta_agente": resposta,
            "response_id": response_id
        })
        if response_id:
            previous_id = response_id

    return respostas


# ─────────────────────────────────────────────
# Execução
# ─────────────────────────────────────────────
if __name__ == "__main__":
    if not API_KEY:
        print("[ERRO] Configure a variável de ambiente OPENAI_API_KEY")
        print("  export OPENAI_API_KEY='sua-chave-aqui'")
        exit(1)

    conversa_interativa()
