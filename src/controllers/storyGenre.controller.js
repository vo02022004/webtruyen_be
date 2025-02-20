const { StoryGenre } = require('../models')

exports.addStoryGenre = async (req, res) => {
    try {
        const { story_id, genre_id } = req.body
        console.log(story_id, genre_id);

        if (!story_id || !genre_id) {
            return res.status(400).json({
                success: false,
                message: 'Both story_id and genre_id are required',
            })
        }

        const newStoryGenre = await StoryGenre.create({ story_id, genre_id })

        res.status(201).json({
            success: true,
            data: newStoryGenre,
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}
