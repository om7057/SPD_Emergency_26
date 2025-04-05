# app/news_fetcher.py

import httpx

API_KEY = "9f8fbde4ff9c4f3dbb6284e70a8d1f8b"
NEWSAPI_URL = "https://newsapi.org/v2/everything"

QUERY_TERMS = [
    "child safety", "child abuse", "child exploitation", "child protection",
    "child trafficking", "child marriage", "education", "child mental health"
]

async def fetch_news_articles():
    query = " OR ".join(QUERY_TERMS)
    params = {
        "q": query,
        "language": "en",
        "pageSize": 20,
        "sortBy": "publishedAt",
        "apiKey": API_KEY
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(NEWSAPI_URL, params=params)
        data = response.json()

        articles = data.get("articles", [])
        formatted = []
        for article in articles:
            formatted.append({
                "title": article.get("title"),
                "description": article.get("description"),
                "content": article.get("content"),
                "url": article.get("url"),
                "source": article.get("source", {}).get("name"),
                "publishedAt": article.get("publishedAt"),
                "topic": "Uncategorized",  # placeholder, will be updated
            })
        return formatted
