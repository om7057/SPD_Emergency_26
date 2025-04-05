from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.news_fetcher import fetch_news_articles
from app.news_categorizer import categorize_article

app = FastAPI(title="Child Safety News API")

# 👇 Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In dev, you can allow all. In prod, specify allowed origins.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/news")
async def get_categorized_news():
    articles = await fetch_news_articles()
    for article in articles:
        article["topic"] = categorize_article(article)
    return {"articles": articles}
