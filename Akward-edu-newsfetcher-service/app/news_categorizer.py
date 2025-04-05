# app/news_categorizer.py

import re

CATEGORY_KEYWORDS = {
    "Child Abuse": ["child abuse", "abused", "molested", "mistreated", "beaten", "csam", "child sexual"],
    "Sexual Exploitation": ["sexual exploitation", "grooming", "pedophile", "sextortion", "kidflix"],
    "Online Exploitation": ["online exploitation", "cyber predator", "child predator", "online grooming"],
    "Cyberbullying": ["cyberbullying", "online bullying", "harassment"],
    "Child Labour": ["child labour", "child labor", "forced to work"],
    "Child Marriage": ["child marriage", "underage marriage", "married off"],
    "Mental Health": ["mental health", "depression", "anxiety", "suicide", "trauma"],
    "Education": ["education", "school", "learning", "dropout", "curriculum", "exam"],
    "Safety / Protection": ["roblox", "safety", "security", "parental controls", "online safety"],
    "Trafficking": ["child trafficking", "human trafficking", "kidnapped"],
}

def categorize_article(article):
    combined_text = f"{article.get('title', '')} {article.get('description', '')} {article.get('content', '')}".lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for keyword in keywords:
            if re.search(rf"\b{re.escape(keyword)}\b", combined_text):
                return category
    return "Uncategorized"
