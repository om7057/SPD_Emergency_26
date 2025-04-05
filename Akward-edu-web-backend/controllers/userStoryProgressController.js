import { User } from '../models/User.js';
import { Story } from '../models/Story.js';
import { StoryLevel } from '../models/StoryLevel.js';



export const completeStory = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { storyId, starsEarned = 1 } = req.body;

    const user = await User.findOne({ clerkId });
    const story = await Story.findById(storyId).populate('level');

    if (!user || !story) return res.status(404).json({ error: 'User or Story not found' });

    if (!user.completedStories.includes(storyId)) {
      user.completedStories.push(storyId);
      user.currentStars += starsEarned;

      const levelStories = await Story.find({ level: story.level._id });
      const completedForThisLevel = levelStories.every(s => user.completedStories.includes(s._id.toString()));

      if (completedForThisLevel && !user.completedLevels.includes(story.level._id)) {
        user.completedLevels.push(story.level._id);
      }

      const nextLevel = await StoryLevel.findOne({
        topic: story.level.topic,
        levelNumber: story.level.levelNumber + 1
      });

      if (nextLevel && !user.unlockedLevels.includes(nextLevel._id)) {
        if (user.currentStars >= nextLevel.starsRequiredToUnlock) {
          user.unlockedLevels.push(nextLevel._id);
        }
      }

      await user.save();
    }

    res.json({ message: 'Story completed and progress updated', user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
