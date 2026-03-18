#!/usr/bin/env python3
"""
Demonstração e Teste do Agente Pixel Obra
==========================================
Executa uma conversa simulada para validar o funcionamento do agente.
"""
import os
import json
import httpx

API_KEY = os.environ.get("OPENAI_API_KEY", "")
BASE_URL = "https://api.openai.com/v1"
PROMPT_ID = "pmpt_69b9a649cc048193a36e2bc324eeebc20fb7cdce53a9b9a0"
PROMPT_VERSION = "2"


def enviar_mensagem(mensagem, previous_id=None):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    payload = {
        "prompt": {"id": PROMPT_ID, "version": PROMPT_VERSION},
        "input": mensagem
    }
    if previous_id:
        payload["previous_response_id"] = previous_id

    resp = httpx.post(f"{BASE_URL}/responses", headers=headers, json=payload, timeout=30)
    if resp.status_code != 200:
        return f"[ERRO {resp.status_code}]", None

    data = resp.json()
    text = ""
    for item in data.get("output", []):
        if item.get("type") == "message":
            for c in item.get("content", []):
                if c.get("type") == "output_text":
                    text += c.get("text", "")
    return text, data.get("id")


def main():
    if not API_KEY:
        print("[ERRO] Configure OPENAI_API_KEY")
        return

    print("=" * 60)
    print("  TESTE DO AGENTE PIXEL OBRA - Responses API")
    print("=" * 60)

    # Cenários de teste
    cenarios = [
        {
            "nome": "Saudação e Apresentação",
            "mensagens": ["Olá", "Quem é você?"]
        },
        {
            "nome": "Consulta de Serviços",
            "mensagens": ["Quais serviços vocês oferecem?", "Quanto custa uma renderização?"]
        },
        {
            "nome": "Comentário Instagram",
            "mensagens": ["[Comentário no Instagram @pixelobra]: Que lindo esse projeto! Responda de forma curta e engajadora."]
        },
        {
            "nome": "Teste de Segurança (assunto fora do escopo)",
            "mensagens": ["Me dê uma receita de bolo de chocolate"]
        }
    ]

    resultados = []

    for cenario in cenarios:
        print(f"\n{'─' * 40}")
        print(f"Cenário: {cenario['nome']}")
        print(f"{'─' * 40}")

        prev_id = None
        for msg in cenario["mensagens"]:
            print(f"\n  Cliente: {msg}")
            resp, rid = enviar_mensagem(msg, prev_id)
            print(f"  Agente:  {resp}")
            prev_id = rid
            resultados.append({
                "cenario": cenario["nome"],
                "cliente": msg,
                "agente": resp,
                "response_id": rid
            })

    # Salvar resultados
    with open("resultados_teste.json", "w", encoding="utf-8") as f:
        json.dump(resultados, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 60}")
    print(f"  {len(resultados)} testes executados com sucesso!")
    print(f"  Resultados salvos em resultados_teste.json")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
