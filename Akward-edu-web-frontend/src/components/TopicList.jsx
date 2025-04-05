import { useEffect, useState } from "react";

const TopicList = ({ topics, onSelect }) => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Select a Topic</h2>
      <div className="grid grid-cols-2 gap-4">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <button
              key={topic._id}
              onClick={() => onSelect(topic._id)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {topic.name}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No topics available.</p>
        )}
      </div>
    </div>
  );
};

export default TopicList;
