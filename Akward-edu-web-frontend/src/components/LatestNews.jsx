import React, { useState, useEffect } from 'react';

const GeminiStoryGame = () => {
  const [story, setStory] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const [articles, setArticles] = useState([]);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(null);
  const [fetchingArticles, setFetchingArticles] = useState(false);

  const [savedStories, setSavedStories] = useState([]);
  const [fetchingSavedStories, setFetchingSavedStories] = useState(false);
  const [savingStory, setSavingStory] = useState(false);

  const fetchArticles = async () => {
    setFetchingArticles(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/news");
      if (!response.ok) throw new Error("Failed to fetch articles");

      const data = await response.json();
      setArticles(data.articles || []);

      if (data.articles?.length > 0) {
        setSelectedArticleIndex(0);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to fetch news articles. Please try again.");
    } finally {
      setFetchingArticles(false);
    }
  };

  const fetchSavedStories = async () => {
    setFetchingSavedStories(true);

    try {
      const response = await fetch("http://localhost:5000/api/news-stories");
      if (!response.ok) throw new Error("Failed to fetch saved stories");

      const data = await response.json();
      setSavedStories(data);
    } catch (err) {
      console.error("Error fetching saved stories:", err);
    } finally {
      setFetchingSavedStories(false);
    }
  };

  const saveStoryToBackend = async () => {
    if (!story || !Array.isArray(story.scenes)) {
      console.error("Invalid story data, cannot save.");
      setError("Cannot save story. Story is incomplete or missing scenes.");
      return;
    }

    setSavingStory(true);

    try {
      const selectedArticle = articles[selectedArticleIndex];
      const topic = selectedArticle?.topicId || "6421a2fc5e7b4b5a8d3f9e7d";
      const defaultLevelId = "6421a2fc5e7b4b5a8d3f9e7c";

      console.log("Saving story:", story);
      console.log("story.scenes:", story.scenes);

      const transformedScenes = story.scenes.map((scene) => ({
        title: scene.text?.substring(0, 50) || "Untitled Scene",
        image: scene.imagePrompt || "Image not provided",
        options: Array.isArray(scene.options)
          ? scene.options.map((option) => ({
              text: option.text,
              to: option.nextScene,
            }))
          : [],
      }));

      const storyData = {
        title: story.title,
        description:
          selectedArticle?.description || "Interactive child safety story",
        level: defaultLevelId,
        topic,
        scenes: transformedScenes,
      };

      const response = await fetch("http://localhost:5000/api/news-stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to save story: ${errorData.error || response.statusText}`
        );
      }

      fetchSavedStories();
    } catch (err) {
      console.error("Error saving story:", err);
      setError("Failed to save story. Please try again.");
    } finally {
      setSavingStory(false);
    }
  };

  const loadSavedStory = async (storyId) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/news-stories/${storyId}`
      );
      if (!response.ok) throw new Error("Failed to load saved story");

      const savedStory = await response.json();

      if (!savedStory?.scenes || !Array.isArray(savedStory.scenes)) {
        throw new Error("Loaded story has no scenes");
      }

      const transformedScenes = savedStory.scenes.map((scene, index) => ({
        id: index + 1,
        text: scene.title || "Untitled",
        imagePrompt: scene.image || "A placeholder image for the scene",
        options: Array.isArray(scene.options)
          ? scene.options.map((option) => ({
              text: option.text,
              nextScene: option.to,
            }))
          : [],
      }));

      const formattedStory = {
        title: savedStory.title,
        scenes: transformedScenes,
      };

      setStory(formattedStory);
      setCurrentScene(formattedStory.scenes.find((scene) => scene.id === 1));
    } catch (err) {
      console.error("Error loading saved story:", err);
      setError("Failed to load saved story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateStory = async () => {
    if (selectedArticleIndex === null) {
      setError("Please select an article first");
      return;
    }
    
    if (!GEMINI_API_KEY) {
      setError("Gemini API key not found. Please check your environment configuration.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const selectedArticle = articles[selectedArticleIndex];
      const articleContent = `Title: ${selectedArticle.title}\n\nDescription: ${selectedArticle.description}\n\nContent: ${selectedArticle.content}\n\nSource: ${selectedArticle.source}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create an interactive child safety story based on this news article, formatted as a series of steps with choices. Follow this exact JSON structure:

{
  "title": "Story title based on article",
  "scenes": [
    {
      "id": 1,
      "text": "Scene description",
      "imagePrompt": "description for image generation",
      "options": [
        {"text": "Choice 1", "nextScene": 2},
        {"text": "Choice 2", "nextScene": 3}
      ]
    }
  ]
}

Article Content: ${articleContent}. Give only code, no explanation and game till 10 to 15 id.`
                }
              ]
            }
          ]
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate story');
      
      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const textResponse = data.candidates[0].content.parts[0].text;
        
        let jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/);
        if (!jsonMatch) {
          jsonMatch = textResponse.match(/```\n?([\s\S]*?)\n?```/);
        }
        
        if (jsonMatch && jsonMatch[1]) {
          try {
            const parsedStory = JSON.parse(jsonMatch[1]);
            setStory(parsedStory);
            setCurrentScene(parsedStory.scenes.find(scene => scene.id === 1));
          } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            setError('Failed to parse story JSON. Please try again.');
          }
        } else {
          setError('Could not extract story JSON from the response');
        }
      } else {
        setError('No valid response from Gemini API');
      }
    } catch (err) {
      console.error('Error generating story:', err);
      setError('Failed to generate story. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadSampleStory = () => {
    try {
      const sampleResponse = `{
  "title": "The Secret and the Safe Place",
  "scenes": [
    {
      "id": 1,
      "text": "You're playing in the park when a new neighbor, Mr. Grumbly, offers you a special candy. He tells you it's a secret and you shouldn't tell your parents. He seems nice, but something feels a little strange.",
      "imagePrompt": "A young child in a park, looking hesitantly at a friendly but slightly unsettling adult offering candy.",
      "options": [
        {"text": "Take the candy and keep it a secret.", "nextScene": 2},
        {"text": "Politely say no and go play with your friends.", "nextScene": 3}
      ]
    },
    {
      "id": 2,
      "text": "You take the candy and Mr. Grumbly smiles widely. He then suggests you come to his house to see his collection of toys, another secret he says. He promises you'll have lots of fun.",
      "imagePrompt": "A child accepting candy from an adult, who is smiling in a slightly unsettling way.",
      "options": [
        {"text": "Go to his house to see the toys.", "nextScene": 4},
        {"text": "Say you have to go home now, and leave.", "nextScene": 3}
      ]
    },
    {
      "id": 3,
      "text": "You decide not to take the candy or go with Mr. Grumbly. You run back to your friends and continue playing, feeling relieved. You remember that grownups shouldn't ask you to keep secrets from your parents. Good Job! You are safe.",
      "imagePrompt": "A child running back to play with other children in a park, feeling happy and safe.",
      "options": [
        {"text": "The End - Play Again?", "nextScene": 1}
      ]
    },
    {
      "id": 4,
      "text": "At Mr. Grumbly's house, he shows you some toys. Then, he asks you to sit close to him while he shows you something 'special' on his phone that makes you feel uncomfortable. He tells you not to tell anyone about this.",
      "imagePrompt": "A child looking uncomfortable and worried while sitting near an adult in a house.",
      "options": [
        {"text": "Tell him you don't feel well and want to go home.", "nextScene": 5},
        {"text": "Stay and watch the video, keeping it a secret.", "nextScene": 9}
      ]
    },
    {
      "id": 5,
      "text": "You tell Mr. Grumbly you don't feel well. He looks disappointed but lets you go. You run home feeling scared and confused.",
      "imagePrompt": "A child running away from a house, looking scared and anxious.",
      "options": [
        {"text": "Tell your parents or a trusted adult what happened.", "nextScene": 6},
        {"text": "Keep it a secret because you're afraid.", "nextScene": 8}
      ]
    },
    {
      "id": 6,
      "text": "You bravely tell your parents everything that happened. They are supportive and reassure you that you did the right thing. They promise to keep you safe and report the incident to the authorities.",
      "imagePrompt": "A child being comforted by their parents after telling them something upsetting.",
      "options": [
        {"text": "You feel safe and happy knowing you did the right thing! The End - Play Again?", "nextScene": 1}
      ]
    },
    {
      "id": 7,
      "text": "Your parents are proud of you for telling them about Mr. Grumbly. Together, you and your family work with the police to keep other children safe. You are a hero!",
      "imagePrompt": "A child smiling with their parents, surrounded by supportive police officers.",
      "options": [
        {"text": "The End - Play Again?", "nextScene": 1}
      ]
    },
    {
      "id": 8,
      "text": "You keep the secret because you're afraid of what might happen. But the feeling of unease stays with you. It's important to remember that secrets that make you feel uncomfortable should always be shared with a trusted adult.",
      "imagePrompt": "A child looking sad and alone, holding a secret.",
      "options": [
        {"text": "Talk to a trusted adult now about how you're feeling.", "nextScene": 6},
        {"text": "The End - Play Again?", "nextScene": 1}
      ]
    },
    {
      "id": 9,
      "text": "You watch the video, and it makes you feel really confused and uncomfortable. Mr. Grumbly makes you promise not to tell anyone. He says it's a special secret between the two of you.",
      "imagePrompt": "A child looking confused and upset while watching something on a phone with an adult.",
      "options": [
        {"text": "Keep the secret and try to forget about it.", "nextScene": 8},
        {"text": "Even though you promised, tell your parents immediately.", "nextScene": 6}
      ]
    },
    {
      "id": 10,
      "text": "After talking to your parents and the police, Mr. Grumbly is no longer allowed near the park or near any children. You helped protect others. You did the right thing by speaking up.",
      "imagePrompt": "A park with children playing safely, police officers in the background ensuring their safety.",
      "options": [
        {"text": "The End - Play Again?", "nextScene": 1}
      ]
    }
  ]
}`;
      const parsedStory = JSON.parse(sampleResponse);
      setStory(parsedStory);
      setCurrentScene(parsedStory.scenes.find(scene => scene.id === 1));
    } catch (err) {
      console.error('Error loading sample story:', err);
      setError('Failed to load sample story');
    }
  };
  
  const handleOptionClick = (nextSceneId) => {
    if (!story) return;
    
    const nextScene = story.scenes.find(scene => scene.id === nextSceneId);
    if (nextScene) {
      setCurrentScene(nextScene);
      window.scrollTo(0, 0);
    }
  };
  
  const resetGame = () => {
    if (story) {
      setCurrentScene(story.scenes.find(scene => scene.id === 1));
      window.scrollTo(0, 0);
    }
  };
  
  useEffect(() => {
    fetchArticles();
    fetchSavedStories();
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">Safety Adventures</h1>
        <p className="text-gray-600">Interactive stories to help children learn about staying safe</p>
      </div>
      
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🔍</span>
          <h2 className="text-xl font-semibold text-blue-700">Create a New Adventure</h2>
        </div>
        
        <div className="mb-4">
          <label htmlFor="articleSelect" className="block text-sm font-medium mb-2 text-blue-800">
            Choose a topic for your adventure:
          </label>
          {fetchingArticles ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-blue-500">Loading topics...</span>
            </div>
          ) : (
            <>
              <select
                id="articleSelect"
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={selectedArticleIndex !== null ? selectedArticleIndex : ''}
                onChange={(e) => setSelectedArticleIndex(parseInt(e.target.value))}
              >
                {articles.map((article, index) => (
                  <option key={index} value={index}>
                    {article.topic || "Uncategorized"}: {article.title.substring(0, 60)}{article.title.length > 60 ? '...' : ''}
                  </option>
                ))}
              </select>
              
              {selectedArticleIndex !== null && (
                <div className="mt-4 p-4 bg-white border-2 border-blue-100 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-1 text-blue-800">{articles[selectedArticleIndex].title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{articles[selectedArticleIndex].source} | {new Date(articles[selectedArticleIndex].publishedAt).toLocaleString()}</p>
                  <p className="text-sm mb-2">{articles[selectedArticleIndex].description}</p>
                  <div className="text-xs text-gray-500">
                    {articles[selectedArticleIndex].topic !== "Uncategorized" && (
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {articles[selectedArticleIndex].topic}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          <button
            onClick={fetchArticles}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span className="mr-1">🔄</span> Refresh Topics
          </button>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={generateStory}
            disabled={loading || selectedArticleIndex === null}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center transition-all duration-200 transform hover:scale-105"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Creating Adventure...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span> Create Adventure
              </>
            )}
          </button>
          <button
            onClick={loadSampleStory}
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-5 py-3 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105"
          >
            <span className="mr-2">🎮</span> Try Demo Story
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex">
              <span className="mr-2">⚠️</span>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📚</span>
            <h2 className="text-xl font-semibold text-green-700">My Adventure Library</h2>
          </div>
          <button 
            onClick={fetchSavedStories} 
            className="text-green-600 hover:text-green-800 flex items-center"
          >
            <span className="mr-1">🔄</span> Refresh
          </button>
        </div>
        
        {fetchingSavedStories ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-2 text-green-500">Loading your adventures...</span>
          </div>
        ) : savedStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedStories.map((savedStory) => (
              <div 
                key={savedStory._id} 
                className="bg-white p-4 rounded-lg border-2 border-green-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-green-800 mb-1">{savedStory.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {savedStory.topic && typeof savedStory.topic === 'object' ? savedStory.topic.name : savedStory.topic}
                    </p>
                  </div>
                  <button
                    onClick={() => loadSavedStory(savedStory._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center transition-all duration-200"
                  >
                    <span className="mr-1">▶️</span> Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg border-2 border-green-100 text-center">
            <p className="text-gray-500 mb-2">Your adventure library is empty!</p>
            <p className="text-sm text-gray-400">Create your first adventure above</p>
          </div>
        )}
      </div>
      
      {story && currentScene && (
        <div className="bg-white border-2 border-yellow-200 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-yellow-700 flex items-center">
                <span className="text-3xl mr-3">🌟</span> {story.title}
              </h2>
              
              <button
                onClick={saveStoryToBackend}
                disabled={savingStory || !selectedArticleIndex}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {savingStory ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span> Save Adventure
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-gradient-to-b from-blue-100 to-purple-100 h-72 mb-6 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden">
              <img 
                src={`/api/placeholder/600/300`} 
                alt="Story scene" 
                className="max-w-full max-h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                <p className="text-xs text-white font-medium">
                  {currentScene.imagePrompt}
                </p>
              </div>
            </div>
            
            <div className="mb-8 p-5 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <p className="text-lg leading-relaxed">{currentScene.text}</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-center mb-4 flex items-center justify-center">
                <span className="text-2xl mr-2">🤔</span> What will you do?
              </h3>
              {currentScene.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option.nextScene)}
                  className="w-full text-left p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center transform hover:scale-102 shadow-sm hover:shadow"
                >
                  <span className="text-2xl mr-3">
                    {index === 0 ? "🟢" : index === 1 ? "🔵" : "🟡"}
                  </span>
                  <span className="font-medium">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl mr-2">📊</span>
              <p className="text-sm text-yellow-800">
                Adventure progress: Scene {currentScene.id} of {story.scenes.length}
              </p>
            </div>
            <button
              onClick={resetGame}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm flex items-center transition-all duration-200"
            >
              <span className="mr-1">🔄</span> Restart Adventure
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiStoryGame;