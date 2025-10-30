import Homepage from '../models/Homepage.js';

// @desc    Get homepage content
// @route   GET /api/homepage
// @access  Public
export const getHomepageContent = async (req, res) => {
  try {
    const { section } = req.query;

    let query = { isActive: true };

    if (section) {
      query.section = section;
    }

    const content = await Homepage.find(query);

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get homepage section
// @route   GET /api/homepage/:section
// @access  Public
export const getHomepageSection = async (req, res) => {
  try {
    const section = await Homepage.findOne({ section: req.params.section });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update homepage section
// @route   POST /api/homepage/:section
// @access  Private/Admin
export const upsertHomepageSection = async (req, res) => {
  try {
    const { content, isActive } = req.body;

    const section = await Homepage.findOneAndUpdate(
      { section: req.params.section },
      {
        section: req.params.section,
        content,
        isActive: typeof isActive !== 'undefined' ? isActive : true,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete homepage section
// @route   DELETE /api/homepage/:section
// @access  Private/Admin
export const deleteHomepageSection = async (req, res) => {
  try {
    const section = await Homepage.findOneAndDelete({
      section: req.params.section,
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
