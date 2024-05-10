const AttributeTokens = require('../models/attribute_tokens');

exports.getToken = async (req, res) => {
    try {
        // Parse the type from the query parameters
        const { type } = req.query;
        const typeEnumValues = AttributeTokens.rawAttributes.type.values;

        // Validate the type parameter
        if (!type || !typeEnumValues.includes(type)) {
            return res.status(400).json({ message: 'Invalid or missing type parameter' });
        }

        // Find the attribute based on the type
        const attribute = await AttributeTokens.findOne({ where: { type } });

        // Check if the attribute exists
        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }

        // Return the list of tokens for the attribute
        res.status(200).json({ tokens: attribute.tokens });
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).json({ message: 'Failed to get tokens', error: error.message });
    }
  };