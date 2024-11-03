// src/App.tsx
import { useState, useEffect } from 'react';
import '../styles/App.css';
import '../styles/media.css';
import { FaExclamationCircle, FaFrown, FaMeh, FaSmile, FaSpinner } from 'react-icons/fa';
import { requestSentimentScore } from '../api/RequestSentimentValue';

export const App = () => {
  const [text, setText] = useState<string>('');
  const [tone, setTone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const localValidation = (text: string): string | null => {
    if (text.trim() === '') {
      return 'Text field cannot be empty :( Please enter some text.';
    } else if (text.trim().length < 3) {
      return 'Text is too short :( Please enter more text.';
    } else return null
  }

  const receiveEmotionalInfo = (sentimentScore: number): string => {
    if (sentimentScore > 0.25) {
      return 'Positive';
    } else if (sentimentScore < -0.25) {
      return 'Negative';
    } else {
      return 'Neutral';
    }
  }

  const analyzeTone = async () => {
    let validationResult = localValidation(text)
    if (validationResult) {
      setError(validationResult);
      setTone(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sentimentScore = await requestSentimentScore(text)
      setTone(receiveEmotionalInfo(sentimentScore));
      setError(null);
    } catch (err: any) {
      let error = err.response?.data?.error?.message;
      setError(error ? error : "Failed to analyze tone");
      setTone(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(null)
  }, [text]);

  const getToneIcon = () => {
    switch (tone) {
      case 'Positive':
        return <FaSmile className="icon positive" />;
      case 'Negative':
        return <FaFrown className="icon negative" />;
      default:
        return <FaMeh className="icon neutral" />;
    }
  };

  return (

    <div className="container">
      <div className="reset app">
        <div className='reset app__upperblock'>
          <h1 className="reset app__heading">Emotional Tone Analyzer</h1>
          <p className="reset app__description">Enter some text to analyze its emotional tone.</p>
        </div>
        <div className='reset app__lowerblock'>
          <textarea id='textarea'
            placeholder="Enter text to analyze..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                analyzeTone()
              }
            }}
          />
          <button
            className={"reset app__button " + (loading ? 'loading' : '')}
            onClick={analyzeTone}
            disabled={loading}
          >
            {loading ? <FaSpinner className="spinner" /> : "Check Tone"}
          </button>
        </div>
        <div className="info-container">
          {error && (
            <div className="error fade-in">
              <FaExclamationCircle className="error-icon" />
              <p>{error}</p>
            </div>
          )}
          <div className="result fade-in">
            {tone && !loading && (
              <p className="result-text">Detected Tone: <strong>{tone}</strong> {getToneIcon()}</p>)}
          </div>
        </div>

      </div>
    </div>

  );
};
