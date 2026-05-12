const { generateAgriculturalAdvice } = require('../utils/geminiService');

exports.getAgriculturalAdvice = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required"
      });
    }

    const responseText = await generateAgriculturalAdvice(query);

    return res.status(200).json({
      success: true,
      advice: responseText
    });

  } catch (error) {
    // ✅ Extract readable Gemini error message
    let errorMessage = error.message || 'Gemini request failed';
    
    if (error?.response?.status) {
      errorMessage = `Gemini API ${error.response.status}: ${error?.response?.data?.error?.message || error.message}`;
    } else if (error?.errorDetails) {
      errorMessage = `Gemini Error: ${JSON.stringify(error.errorDetails)}`;
    }
    
    console.error('Gemini Error:', errorMessage);

    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};
