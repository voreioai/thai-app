import os
import json
import time
from dotenv import load_dotenv
from supabase import create_client, Client
import requests

# 1. Загружаем конфигурацию
load_dotenv(dotenv_path=".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, OPENROUTER_KEY]):
    print("❌ Ошибка: Проверьте, что в .env.local заполнены ВСЕ ключи!")
    exit(1)

# 2. Инициализируем клиента Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("🔄 Выгружаем фразы из Supabase...")
response = supabase.table("phrases").select("id, th, tr, ru").execute()
phrases = response.data

if not phrases:
    print("ℹ️ Таблица phrases пуста.")
    exit(0)

print(f"📦 Всего найдено фраз для анализа: {len(phrases)}")

# 3. Настройки
BATCH_SIZE = 30
corrected_count = 0

system_instruction = (
    "Ты — профессиональный лингвист, эксперт по тайскому языку.\n"
    "Изучи список фраз. Поле 'th' — это тайский текст, 'tr' — латинская транскрипция с тонами, 'ru' — русский перевод.\n"
    "Найди ошибки, где транскрипция ('tr') содержит опечатки или не соответствует тайскому тексту ('th').\n"
    "В ответе верни СТРОГО валидный JSON-объект, где ключ 'phrases' содержит список ТОЛЬКО ИСПРАВЛЕННЫХ элементов:\n"
    "{\"phrases\": [{\"id\": \"id_строки\", \"tr\": \"исправленная_транскрипция\", \"ru\": \"исправленный_перевод\"}]}.\n"
    "Если ошибок в строке нет, не включай её в список. Если вообще нет ошибок, верни: {\"phrases\": []}.\n"
    "Не пиши никакого лишнего текста, кроме этого JSON."
)

# МАСКИРУЕМ СКРИПТ ПОД ОБЫЧНЫЙ БРАУЗЕР MACBOOK
headers = {
    "Authorization": f"Bearer {OPENROUTER_KEY}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "HTTP-Referer": "https://github.com",
    "X-Title": "Thai App Auditor"
}

print("🤖 Начинаем пошаговый аудит базы данных...")

for i in range(0, len(phrases), BATCH_SIZE):
    batch = phrases[i:i + BATCH_SIZE]
    print(f"\n🧠 Анализируем строки с {i+1} по {min(i + BATCH_SIZE, len(phrases))}...")
    
    payload = {
        "model": "meta-llama/llama-3.3-70b-instruct",
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": json.dumps(batch, ensure_ascii=False)}
        ],
        "response_format": {"type": "json_object"}
    }
    
    try:
        res = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        
        # Если сервер вернул ошибку, выводим её сразу
        if res.status_code != 200:
            print(f"⚠️ Ошибка сервера (Код {res.status_code}): {res.text[:200]}")
            continue
            
        res_data = res.json()
        
        if 'error' in res_data:
            print(f"⚠️ Ошибка от OpenRouter API: {res_data['error']}")
            continue

        content_text = res_data['choices'][0]['message']['content'].strip()
        
        corrected_data = json.loads(content_text)
        corrected_list = corrected_data.get("phrases", [])
        
        if not corrected_list:
            print("   ✅ В этой пачке ошибок не обнаружено.")
            continue
            
        print(f"   🛠️ Найдено исправлений: {len(corrected_list)}. Записываем в базу...")
        for item in corrected_list:
            phrase_id = item.get("id")
            update_fields = {}
            if "tr" in item: update_fields["tr"] = item["tr"]
            if "ru" in item: update_fields["ru"] = item["ru"]
            
            if update_fields and phrase_id:
                supabase.table("phrases").update(update_fields).eq("id", phrase_id).execute()
                print(f"      ➔ ID {phrase_id} обновлен: {update_fields}")
                corrected_count += 1
                
        time.sleep(1)

    except Exception as e:
        print(f"❌ Произошла ошибка при обработке: {e}")
        if 'res' in locals():
            print(f"   Ответ сервера: {res.text[:200]}")

print(f"\n🎉 Все этапы проверки завершены! Всего исправлено строк: {corrected_count}")
