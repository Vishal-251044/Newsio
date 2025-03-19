import Sentiment from "sentiment";

const sentiment = new Sentiment();

export const analyzeSentiment = async (req, res) => {
  try {
    const { text } = req.body;
    const result = sentiment.analyze(text);

    let sentimentLabel = "Neutral";
    if (result.score > 0) {
      sentimentLabel = "Positive";
    } else if (result.score < 0) {
      sentimentLabel = "Negative";
    }

    res.json({ sentiment: sentimentLabel });
  } catch (error) {
    res.status(500).json({ message: "Error analyzing sentiment", error });
  }
};
