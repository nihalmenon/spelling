import pandas as pd
import gensim
from gensim.models import Word2Vec

# Read JSON data from file into a pandas DataFrame
df = pd.read_json("data/words.json")

# Filter out rows with missing values in essential columns
df = df.dropna(subset=["word"])

# Preprocess data
preprocessed_data = [word.lower() for word in df["word"]]

# Train Word2Vec model
model = Word2Vec([preprocessed_data], vector_size=100, window=5, min_count=1, sg=0)

# Function to find similar words
def find_similar_words(target_word, top_n=5):
    similar_words = model.wv.most_similar(target_word, topn=top_n)
    return similar_words

# Example usage
target_word = "airless"
similar_words = find_similar_words(target_word)
for word, similarity in similar_words:
    print(word, similarity)
